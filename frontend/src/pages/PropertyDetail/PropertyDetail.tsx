// src/pages/PropertyDetail/PropertyDetail.tsx - Updated Seller Section

import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Heart, Loader2,
  Phone, Mail, MapPin, Star,
  BedDouble, Bath, Maximize2, Car,
  CheckCircle,
  QrCode, Copy, Download, ExternalLink,
  User, ChevronLeft, ChevronRight, X,
  Maximize, Shield, MessageCircle,
  Send, Play, Video, Images, Share2,
  Camera, MessageSquare, Home, FileText,
  Share,  Link2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { propertyApi } from '../../services/api/property';
import { reviewApi } from '../../services/api/review';
import { formatArea } from '../../utils/areaUtils';
import type { Property } from '../../types/property';
import ReviewCard from '../../components/Review/ReviewCard';
import ReviewForm from '../../components/Review/ReviewForm';
import RatingStars from '../../components/Review/RatingStars';
import { useAuth } from '../../hooks/useAuth';

// ============================================
// CONSTANTS & HELPERS
// ============================================

const API_URL = 'http://localhost:5001';

const getImageUrl = (path: string | undefined | null): string => {
  if (!path) return '/placeholder-property.jpg';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('//')) return `http:${path}`;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_URL}${cleanPath}`;
};

const getVideoUrl = (path: string | undefined | null): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('//')) return `http:${path}`;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_URL}${cleanPath}`;
};

const formatPrice = (price: number) => {
  if (price >= 10000000) {
    return `Rs ${(price / 10000000).toFixed(2)} Crore`;
  }
  return `Rs ${price.toLocaleString()}`;
};

const formatPricePerUnit = (price: number, area: number, unit: string) => {
  if (!area) return '';
  const perUnit = price / area;
  if (perUnit >= 100000) {
    return `Rs ${(perUnit / 100000).toFixed(1)} Lakh/${unit}`;
  }
  return `Rs ${perUnit.toLocaleString()}/${unit}`;
};

// ============================================
// TYPES
// ============================================

interface RatingStatsUI {
  average: number;
  total: number;
  distribution: { 1: number; 2: number; 3: number; 4: number; 5: number };
}

const DEFAULT_RATING_STATS: RatingStatsUI = {
  average: 0,
  total: 0,
  distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
};

const normalizeRatingStats = (raw: any): RatingStatsUI => {
  if (!raw) return DEFAULT_RATING_STATS;
  const distribution: RatingStatsUI['distribution'] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  if (Array.isArray(raw.ratingDistribution)) {
    raw.ratingDistribution.forEach((entry: { stars: number; count: number }) => {
      if (entry?.stars >= 1 && entry?.stars <= 5) {
        distribution[entry.stars as 1 | 2 | 3 | 4 | 5] = entry.count ?? 0;
      }
    });
  }
  return {
    average: Number(raw.averageRating ?? raw.average ?? 0) || 0,
    total: Number(raw.totalReviews ?? raw.total ?? 0) || 0,
    distribution,
  };
};

// Helper to get status display
const getStatusDisplay = (status: string | undefined, isVerified: boolean | undefined) => {
  if (isVerified) return { label: '✓ Verified', className: 'bg-[#E8F0E4] text-[#2D5A27] border border-[#2D5A27]' };
  
  switch (status) {
    case 'APPROVED':
      return { label: 'Approved', className: 'bg-[#E8F0E4] text-[#2D5A27] border border-[#2D5A27]' };
    case 'PENDING':
      return { label: '◷ Pending review', className: 'bg-[#F5F0EA] text-[#475569] border border-[#EDE8E2]' };
    case 'REJECTED':
      return { label: '⚠ ✕ Rejected', className: 'bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5]' };
    case 'SOLD':
      return { label: 'Sold', className: 'bg-[#FEF3C7] text-[#B45309] border border-[#F59E0B]' };
    case 'RENTED':
      return { label: 'Rented', className: 'bg-[#FEF3C7] text-[#B45309] border border-[#F59E0B]' };
    default:
      return { label: 'Available', className: 'bg-[#F5F0EA] text-[#475569] border border-[#EDE8E2]' };
  }
};

// ============================================
// MAIN COMPONENT
// ============================================

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const reviewsRef = useRef<HTMLDivElement>(null);

  // State
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    message: '',
  });

  // Review States
  const [reviews, setReviews] = useState([]);
  const [ratingStats, setRatingStats] = useState<RatingStatsUI>(DEFAULT_RATING_STATS);
  const [userReview, setUserReview] = useState(null);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // QR Code ref
  const qrRef = useRef<HTMLDivElement>(null);

  // Fetch property data
  useEffect(() => {
    if (!id) return;
    fetchPropertyData();
  }, [id]);

  const fetchPropertyData = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await propertyApi.getById(id!);
      setProperty(data);
      setFavoritesCount(data.favoritesCount || 0);

      try {
        const [reviewsData, statsData] = await Promise.all([
          reviewApi.getByProperty(id!),
          reviewApi.getStats(id!),
        ]);
        setReviews(reviewsData || []);
        setRatingStats(normalizeRatingStats(statsData));
        if (isAuthenticated && reviewsData && reviewsData.length > 0) {
          const userReviewData = reviewsData.find((r: any) => r.reviewer?.id === user?.id);
          setUserReview(userReviewData);
        }
      } catch (reviewError) {
        console.warn('⚠️ Reviews not available:', reviewError);
        setReviews([]);
        setRatingStats(DEFAULT_RATING_STATS);
      }

      setFormData((prev) => ({
        ...prev,
        message: `Hi, I am interested in this ${data.propertyType?.replace('_', ' ') || 'property'} at ${data.location}`,
      }));

      setLoadingReviews(false);
    } catch (err: any) {
      console.error('❌ Error fetching property:', err);
      setError(err.response?.data?.message || 'Failed to load property');
    } finally {
      setLoading(false);
    }
  };

  // Media - Combine images and videos
  const images = React.useMemo(() => {
    if (property?.images && property.images.length > 0) {
      return property.images.map(img => getImageUrl(img));
    }
    if (property?.mainImage) {
      return [getImageUrl(property.mainImage)];
    }
    return ['/placeholder-property.jpg'];
  }, [property]);

  const videos = React.useMemo(() => {
    if (property?.videos && property.videos.length > 0) {
      return property.videos.map(vid => getVideoUrl(vid));
    }
    return [];
  }, [property]);

  // Combine all media for display (images first, then videos)
  const allMedia = React.useMemo(() => {
    const media = [
      ...images.map((img) => ({ type: 'image' as const, url: img })),
      ...videos.map((vid) => ({ type: 'video' as const, url: vid })),
    ];
    return media;
  }, [images, videos]);

  // Generate QR code URL
  const getQRCodeUrl = () => {
    const propertyUrl = `${window.location.origin}/property/${property?.id}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(propertyUrl)}`;
  };

  // Share handlers
  const shareOnWhatsApp = () => {
    const message = `Check out this property: ${property?.title}\nPrice: ${formatPrice(property?.price || 0)}\nLocation: ${property?.location}\n\nView details: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const shareOnTwitter = () => {
    const text = `Check out this property: ${property?.title}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const shareOnInstagram = () => {
    handleCopyLink();
    alert('Link copied! You can paste it on Instagram.');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQRCode = async (format: 'png' | 'pdf' | 'svg') => {
    const propertyUrl = `${window.location.origin}/property/${property?.id}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(propertyUrl)}&format=${format}`;
    
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `qr-property-${property?.id}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading QR code:', error);
    }
  };

  // Handlers
  const openLightboxAt = (index: number) => {
    setCurrentImage(index);
    setIsLightboxOpen(true);
  };

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % Math.max(1, allMedia.length));
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + Math.max(1, allMedia.length)) % Math.max(1, allMedia.length));

  const handleFavoriteToggle = async () => {
    if (!id) return;
    try {
      const result = await propertyApi.toggleFavorite(id);
      setIsFavorited(result.favorited);
      setFavoritesCount((prev) => (result.favorited ? prev + 1 : Math.max(0, prev - 1)));
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const scrollToReviews = () => {
    reviewsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFCFA]">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-[#2D5A27] mx-auto" />
          <p className="mt-4 text-[#475569]">Loading property details...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFCFA]">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Property not found'}</p>
          <button
            onClick={() => navigate('/properties')}
            className="px-6 py-2 bg-[#2D5A27] text-white rounded-lg hover:bg-[#23461E] transition-colors"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  const agent = property.user;
  const statusDisplay = getStatusDisplay(property.status, property.isVerified);

  return (
    <div className="min-h-screen bg-[#FFFCFA]">
      
      {/* Top Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <button
          onClick={() => navigate('/properties')}
          className="flex items-center gap-2 text-[#475569] hover:text-[#2D5A27] transition-colors group text-sm"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Properties</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          
          {/* LEFT COLUMN - Main Content */}
          <div className="space-y-6">
            
            {/* Photo Gallery - Full Width with Thumbnails */}
            <div className="bg-white rounded-lg overflow-hidden border" style={{ borderColor: '#EDE8E2' }}>
              <div className="relative w-full" style={{ height: 480 }}>
                {allMedia.length > 0 ? (
                  <>
                    {allMedia[0]?.type === 'video' ? (
                      <video
                        src={allMedia[0].url}
                        controls
                        className="w-full h-full object-cover"
                        poster={images[0] || undefined}
                      />
                    ) : (
                      <img
                        src={allMedia[0]?.url}
                        alt={property.title}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => openLightboxAt(0)}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-property.jpg';
                        }}
                      />
                    )}
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {property.isVerified && (
                        <span className="bg-[#2D5A27] text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                          <CheckCircle size={12} /> Verified
                        </span>
                      )}
                      {property.isFeatured && (
                        <span className="bg-[#D4AF37] text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                          <Star size={12} fill="currentColor" /> Featured
                        </span>
                      )}
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={handleFavoriteToggle}
                      className="absolute top-4 right-4 w-9 h-9 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
                    >
                      <Heart size={18} className={isFavorited ? 'fill-red-500 text-red-500' : 'text-[#0F172A]'} />
                    </button>

                    {/* Image Counter */}
                    {allMedia.length > 1 && (
                      <button
                        onClick={() => openLightboxAt(0)}
                        className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 hover:bg-black/80 transition-colors"
                      >
                        <Images size={14} />
                        {allMedia.length} photos
                      </button>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 bg-[#F5F0EA]">
                    <Home size={48} />
                  </div>
                )}
              </div>

              {/* Thumbnail Strip */}
              {allMedia.length > 1 && (
                <div className="grid grid-cols-4 gap-1 p-1 bg-white">
                  {allMedia.slice(0, 4).map((media, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentImage(index);
                        if (media.type === 'video') {
                          openLightboxAt(index);
                        }
                      }}
                      className={`relative aspect-video rounded overflow-hidden transition-all ${
                        currentImage === index ? 'ring-2 ring-[#2D5A27]' : 'hover:opacity-80'
                      }`}
                    >
                      {media.type === 'video' ? (
                        <div className="w-full h-full bg-black flex items-center justify-center relative">
                          <video src={media.url} className="w-full h-full object-cover" muted playsInline />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center">
                              <Play size={18} className="text-[#2D5A27] ml-0.5" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <img src={media.url} alt={`${property.title} ${index + 1}`} className="w-full h-full object-cover" />
                      )}
                      {index === 3 && allMedia.length > 4 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm font-medium">
                          +{allMedia.length - 4}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Status Badge + Listed Date */}
            <div className="flex flex-wrap items-center gap-3">
              <span className={`inline-flex items-center gap-1 rounded px-3 py-1 text-xs font-semibold ${statusDisplay.className}`}>
                {statusDisplay.label}
              </span>
              {property.createdAt && (
                <span className="text-sm" style={{ color: '#475569' }}>
                  Listed {new Date(property.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>

            {/* Title + Address */}
            <h1 className="font-bold mb-1" style={{ fontFamily: 'var(--font-serif)', fontSize: 32, color: '#0F172A', lineHeight: 1.1 }}>
              {property.title}
            </h1>
            <p className="text-sm mb-4" style={{ color: '#475569' }}>
              {property.location}
            </p>

            {/* Price + Verification Seal */}
            <div className="flex items-start gap-4 mb-6">
              <div>
                <div className="font-mono font-bold" style={{ fontSize: 28, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>
                  {formatPrice(property.price)}
                </div>
                {property.area && property.areaUnit && (
                  <div className="font-mono text-sm" style={{ color: '#475569' }}>
                    {formatPricePerUnit(property.price, property.area, property.areaUnit)}
                  </div>
                )}
                <div className="text-xs mt-1" style={{ color: '#2D5A27' }}>✓ Negotiable</div>
              </div>
              
              {property.isVerified && (
                <div className="flex flex-col items-center gap-1" style={{ transform: 'rotate(-7deg)' }}>
                  <div className="w-[72px] h-[72px] rounded-full bg-[#E8F0E4] border-2 border-[#2D5A27] flex items-center justify-center">
                    <CheckCircle size={32} className="text-[#2D5A27]" />
                  </div>
                  <div className="text-[10px] font-mono text-[#2D5A27] leading-none">Verified</div>
                </div>
              )}
            </div>

            {/* Property Details Table */}
            <div className="rounded-lg border mb-6 overflow-hidden" style={{ borderColor: '#EDE8E2' }}>
              <div className="px-4 py-2 border-b" style={{ background: '#F5F0EA', borderColor: '#EDE8E2' }}>
                <span className="font-semibold text-sm" style={{ fontFamily: 'var(--font-serif)', fontSize: 15, color: '#0F172A' }}>
                  Property Details
                </span>
              </div>
              <div className="grid grid-cols-2 divide-x divide-y" style={{ borderColor: '#EDE8E2' }}>
                {[
                  ['Serial', property.id?.slice(0, 12) || 'N/A'],
                  ['Land Area', property.area && property.areaUnit ? formatArea(property.area, property.areaUnit) : 'N/A'],
                  ['Price', formatPrice(property.price)],
                  ['Type', property.propertyType?.replace('_', ' ') || 'N/A'],
                  ['Purpose', property.purpose || 'For Sale'],
                  ['Bedrooms', property.bedrooms ?? 'N/A'],
                  ['Bathrooms', property.bathrooms ?? 'N/A'],
                  ['Parking', property.parking ? 'Available' : 'Not Available'],
                ].map(([k, v]) => (
                  <div key={k} className="px-4 py-2.5 flex flex-col" style={{ borderColor: '#EDE8E2' }}>
                    <span className="text-[11px] uppercase tracking-wide" style={{ color: '#475569', fontFamily: 'monospace' }}>
                      {k}
                    </span>
                    <span className="text-sm font-medium mt-0.5" style={{ color: '#0F172A' }}>
                      {v}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2" style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: '#0F172A' }}>
                  Description
                </h3>
                <p className="text-sm" style={{ color: '#475569', lineHeight: 1.7 }}>
                  {property.description}
                </p>
              </div>
            )}

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3" style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: '#0F172A' }}>
                  Amenities
                </h3>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 rounded border text-sm"
                      style={{ background: '#FFFFFF', borderColor: '#EDE8E2', color: '#475569' }}
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Verification Record */}
            {property.isVerified && (
              <div className="rounded-lg border p-5 mb-6" style={{ background: '#E8F0E4', borderColor: '#2D5A27' }}>
                <div className="flex items-center gap-2 mb-3">
                  <span style={{ color: '#2D5A27', fontSize: 18 }}>✓</span>
                  <span className="font-semibold" style={{ fontFamily: 'var(--font-serif)', fontSize: 17, color: '#2D5A27' }}>
                    Verification Record
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  {[
                    'Owner name match against Malpot records',
                    'Plot number (kitta) confirmed in field book',
                    'No registered dispute as of verification date',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm" style={{ color: '#2D5A27' }}>
                      <span className="shrink-0">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                  <div className="flex items-start gap-2 text-sm" style={{ color: '#2D5A27' }}>
                    <span className="shrink-0">✓</span>
                    <span>Verified on {new Date().toLocaleDateString()}</span>
                  </div>
                </div>
                <p className="text-xs italic" style={{ color: '#2D5A27', lineHeight: 1.7 }}>
                  We verify ownership documents, not property condition or price fairness. 
                  Always visit the site and engage your own lawyer before payment.
                </p>
              </div>
            )}

            {/* Reviews Section */}
            <div ref={reviewsRef} className="bg-white rounded-lg border p-6" style={{ borderColor: '#EDE8E2' }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold" style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: '#0F172A' }}>
                    Reviews & Ratings
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold" style={{ color: '#2D5A27' }}>
                        {(ratingStats.average ?? 0).toFixed(1)}
                      </span>
                      <RatingStars rating={ratingStats.average ?? 0} size="lg" />
                    </div>
                    <span className="text-sm" style={{ color: '#475569' }}>
                      ({ratingStats.total ?? 0} reviews)
                    </span>
                  </div>
                </div>
                {isAuthenticated && !userReview && (
                  <button
                    onClick={scrollToReviews}
                    className="px-4 py-2 rounded text-sm font-medium transition-colors hover:bg-[#23461E]"
                    style={{ background: '#2D5A27', color: '#FFFFFF' }}
                  >
                    Write Review
                  </button>
                )}
              </div>

              {loadingReviews ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-32" />
                          <div className="h-3 bg-gray-200 rounded w-24" />
                          <div className="h-12 bg-gray-200 rounded w-full" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.slice(0, 3).map((review: any) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                  {reviews.length > 3 && (
                    <button className="text-sm font-medium hover:underline" style={{ color: '#2D5A27' }}>
                      View all {reviews.length} reviews
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-6" style={{ background: '#F5F0EA' }}>
                  <MessageSquare size={28} className="text-gray-300 mx-auto mb-2" />
                  <p style={{ color: '#475569' }}>No reviews yet. Be the first to review!</p>
                </div>
              )}

              {isAuthenticated && !userReview && (
                <div id="review-form" className="mt-6">
                  <ReviewForm propertyId={id!} onSuccess={fetchPropertyData} />
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN - Sidebar */}
          <div className="space-y-4">
            
            {/* Seller Card - Updated with Profile Image at Top and Name Below */}
            <div className="rounded-lg border p-4 sticky top-20" style={{ background: '#FFFFFF', borderColor: '#EDE8E2' }}>
              {/* Profile Image - Centered at Top */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-3"
                  style={{ background: '#2D5A27', fontFamily: 'var(--font-serif)' }}>
                  {agent?.name?.charAt(0) || 'S'}
                </div>
                
                {/* Seller Name - Below Profile Image */}
                <div className="text-center">
                  <div className="font-semibold text-base" style={{ color: '#0F172A' }}>{agent?.name || 'Seller'}</div>
                  <div className="text-xs mt-1" style={{ color: '#475569' }}>12 listings · member since 2024</div>
                  {property.isVerified && (
                    <div className="text-xs mt-0.5 flex items-center justify-center gap-1" style={{ color: '#2D5A27' }}>
                      <CheckCircle size={12} /> Verified seller
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4">
                {!showPhone ? (
                  <button
                    onClick={() => setShowPhone(true)}
                    className="w-full py-2.5 rounded border text-sm font-semibold mb-2 transition-colors hover:bg-[#E8F0E4]"
                    style={{ borderColor: '#2D5A27', color: '#2D5A27' }}
                  >
                    Show phone number
                  </button>
                ) : (
                  <div className="font-mono text-base font-semibold text-center py-2.5 rounded border mb-2"
                    style={{ borderColor: '#EDE8E2', color: '#0F172A', background: '#F5F0EA' }}>
                    {agent?.phone || '+977 98-4321-7654'}
                  </div>
                )}

                <button className="w-full py-2.5 rounded text-sm font-semibold mb-2 transition-colors hover:bg-[#23461E]"
                  style={{ background: '#2D5A27', color: '#FFFFFF' }}>
                  Send inquiry
                </button>
                
                {/* Request a site visit button removed */}
              </div>
            </div>

            {/* QR Code & Share Card - Updated */}
            <div className="rounded-lg border p-4" style={{ background: '#FFFFFF', borderColor: '#EDE8E2' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold text-sm" style={{ fontFamily: 'var(--font-serif)', fontSize: 15, color: '#0F172A' }}>
                  <QrCode size={16} className="inline mr-2 text-[#2D5A27]" />
                  QR Code
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="p-2 rounded-lg hover:bg-[#F5F0EA] transition-colors flex items-center gap-1.5 text-sm"
                    style={{ color: '#475569' }}
                  >
                    <Share2 size={16} />
                    Share
                  </button>
                  
                  {/* Share Dropdown Menu */}
                  {showShareMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg border shadow-lg p-2 z-50" style={{ borderColor: '#EDE8E2' }}>
                      <button
                        onClick={() => { shareOnWhatsApp(); setShowShareMenu(false); }}
                        className="w-full text-left px-3 py-2 rounded hover:bg-[#F5F0EA] transition-colors flex items-center gap-2 text-sm"
                        style={{ color: '#0F172A' }}
                      >
                        <span className="text-[#25D366]">📱</span> WhatsApp
                      </button>
                      <button
                        onClick={() => { shareOnFacebook(); setShowShareMenu(false); }}
                        className="w-full text-left px-3 py-2 rounded hover:bg-[#F5F0EA] transition-colors flex items-center gap-2 text-sm"
                        style={{ color: '#0F172A' }}
                      >
                        <span className="text-[#1877F2]">📘</span> Facebook
                      </button>
                      <button
                        onClick={() => { shareOnTwitter(); setShowShareMenu(false); }}
                        className="w-full text-left px-3 py-2 rounded hover:bg-[#F5F0EA] transition-colors flex items-center gap-2 text-sm"
                        style={{ color: '#0F172A' }}
                      >
                        <span className="text-[#1DA1F2]">🐦</span> Twitter
                      </button>
                      <button
                        onClick={() => { shareOnInstagram(); setShowShareMenu(false); }}
                        className="w-full text-left px-3 py-2 rounded hover:bg-[#F5F0EA] transition-colors flex items-center gap-2 text-sm"
                        style={{ color: '#0F172A' }}
                      >
                        <span className="text-[#E4405F]">📸</span> Instagram
                      </button>
                      <button
                        onClick={() => { handleCopyLink(); setShowShareMenu(false); }}
                        className="w-full text-left px-3 py-2 rounded hover:bg-[#F5F0EA] transition-colors flex items-center gap-2 text-sm"
                        style={{ color: '#0F172A' }}
                      >
                        <Link2 size={14} /> Copy Link
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* QR Code Image */}
              <div className="flex justify-center mb-3">
                <div className="bg-white rounded-lg shadow-sm border p-2" style={{ borderColor: '#EDE8E2' }}>
                  <img
                    src={getQRCodeUrl()}
                    alt="Property QR Code"
                    className="w-32 h-32"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = `<div class="flex items-center justify-center w-32 h-32 text-center text-xs text-[#475569]">
                          <div>
                            <QrCode size={48} className="mx-auto text-[#2D5A27] mb-2" />
                            <span>Scan to view property</span>
                          </div>
                        </div>`;
                      }
                    }}
                  />
                </div>
              </div>

              {/* Property Serial */}
              <div className="font-mono text-xs text-center mb-3" style={{ color: '#475569' }}>
                {property.id?.slice(0, 12) || 'SG-BKT-04821'}
              </div>

              {/* Download Buttons */}
              <div className="flex gap-1.5">
                {['png', 'pdf', 'svg'].map((format) => (
                  <button
                    key={format}
                    onClick={() => downloadQRCode(format as 'png' | 'pdf' | 'svg')}
                    className="flex-1 py-1.5 rounded border text-[11px] font-mono font-medium transition-colors hover:bg-[#E8F0E4]"
                    style={{ borderColor: '#EDE8E2', color: '#475569', background: '#F5F0EA' }}
                  >
                    ↓ {format.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Share Button */}
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="w-full mt-3 py-2 rounded text-sm font-medium transition-colors flex items-center justify-center gap-2"
                style={{ background: '#2D5A27', color: '#FFFFFF' }}
              >
                <Share2 size={16} />
                Share Property
              </button>
            </div>

            {/* Your match */}
            <div className="rounded-lg border p-4" style={{ background: '#FFFFFF', borderColor: '#EDE8E2' }}>
              <div className="font-semibold text-sm mb-3" style={{ fontFamily: 'var(--font-serif)', fontSize: 15, color: '#0F172A' }}>
                Your match
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="relative w-[52px] h-[52px] rounded-full flex items-center justify-center" style={{ background: '#E8F0E4' }}>
                  <svg width={52} height={52} style={{ position: 'absolute', top: 0, left: 0 }}>
                    <circle cx={26} cy={26} r={23} fill="none" stroke="#E8F0E4" strokeWidth="3" />
                    <circle
                      cx={26} cy={26} r={23}
                      fill="none" stroke="#2D5A27" strokeWidth="3"
                      strokeDasharray={144.5}
                      strokeDashoffset={144.5 * (1 - 75/100)}
                      strokeLinecap="round"
                      transform="rotate(-90 26 26)"
                    />
                  </svg>
                  <span className="font-mono text-[11px] font-semibold relative z-10" style={{ color: '#2D5A27' }}>75</span>
                </div>
                <div className="text-sm" style={{ color: '#475569' }}>
                  Based on your stated preferences
                </div>
              </div>
              <div className="space-y-1.5">
                {[
                  { label: 'Budget', val: formatPrice(property.price), matched: true },
                  { label: 'Location', val: property.location, matched: true },
                  { label: 'Size', val: property.area && property.areaUnit ? formatArea(property.area, property.areaUnit) : 'N/A', matched: true },
                  { label: 'Status', val: property.status || 'Available', matched: true },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between text-xs">
                    <span style={{ color: '#475569' }}>{row.label}</span>
                    <div className="flex items-center gap-1">
                      <span style={{ color: row.matched ? '#2D5A27' : '#B45309' }}>{row.matched ? '✓' : '~'}</span>
                      <span className="font-mono" style={{ color: '#0F172A' }}>{row.val}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && allMedia.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setIsLightboxOpen(false)}
          >
            <div className="relative max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <X size={28} />
              </button>
              <div className="relative bg-black rounded-lg overflow-hidden">
                {allMedia[currentImage]?.type === 'video' ? (
                  <video src={allMedia[currentImage].url} controls autoPlay className="w-full max-h-[80vh] object-contain" />
                ) : (
                  <img src={allMedia[currentImage]?.url} alt={property.title} className="w-full max-h-[80vh] object-contain" />
                )}
                {allMedia.length > 1 && (
                  <>
                    <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full transition-colors">
                      <ChevronLeft size={28} className="text-white" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full transition-colors">
                      <ChevronRight size={28} className="text-white" />
                    </button>
                  </>
                )}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm">
                  {allMedia[currentImage]?.type === 'video' ? '🎬 Video' : `${currentImage + 1} of ${allMedia.length}`}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PropertyDetail;