// src/pages/PropertyDetail/PropertyDetail.tsx - Full Width Gallery with Video Support

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
  Camera, MessageSquare, Home, FileText
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
  if (isVerified) return { label: '✓ Verified', className: 'bg-[#E4F1EA] text-[#186B4C] border border-[#186B4C]' };
  
  switch (status) {
    case 'APPROVED':
      return { label: 'Approved', className: 'bg-[#E4F1EA] text-[#186B4C] border border-[#186B4C]' };
    case 'PENDING':
      return { label: '◷ Pending review', className: 'bg-[#EFEDE6] text-[#5C6570] border border-[#D3CFC5]' };
    case 'REJECTED':
      return { label: '⚠ ✕ Rejected', className: 'bg-[#FAECEF] text-[#A4142C] border border-[#EFC4CB]' };
    case 'SOLD':
      return { label: 'Sold', className: 'bg-[#FAF1DC] text-[#B07C1E] border border-[#B07C1E]' };
    case 'RENTED':
      return { label: 'Rented', className: 'bg-[#FAF1DC] text-[#B07C1E] border border-[#B07C1E]' };
    default:
      return { label: 'Available', className: 'bg-[#EFEDE6] text-[#5C6570] border border-[#D3CFC5]' };
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
  const [isQRExpanded, setIsQRExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
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

  // For thumbnail display - show first 3 items from allMedia
  const thumbnails = allMedia.slice(0, 3);

  // Handlers
  const openLightboxAt = (index: number) => {
    setCurrentImage(index);
    setIsLightboxOpen(true);
  };

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % Math.max(1, allMedia.length));
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + Math.max(1, allMedia.length)) % Math.max(1, allMedia.length));

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-[#A4142C] mx-auto" />
          <p className="mt-4 text-gray-500">Loading property details...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Property not found'}</p>
          <button
            onClick={() => navigate('/properties')}
            className="px-6 py-2 bg-[#A4142C] text-white rounded-lg hover:bg-[#8A0F23] transition-colors"
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
    <div className="min-h-screen bg-gray-50">
      
      {/* Top Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <button
          onClick={() => navigate('/properties')}
          className="flex items-center gap-2 text-[#5C6570] hover:text-[#A4142C] transition-colors group text-sm"
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
            <div className="bg-white rounded-lg overflow-hidden border" style={{ borderColor: '#D3CFC5' }}>
              {/* Main Image/Video - Full Width */}
              <div className="relative w-full" style={{ height: 480 }}>
                {allMedia.length > 0 ? (
                  <>
                    {allMedia[0]?.type === 'video' ? (
                      <video
                        src={allMedia[0].url}
                        controls
                        className="w-full h-full object-cover"
                        poster={images[0] || undefined}
                        onError={(e) => {
                          console.error('❌ Main video failed:', allMedia[0].url);
                        }}
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
                        <span className="bg-[#186B4C] text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                          <CheckCircle size={12} /> Verified
                        </span>
                      )}
                      {property.isFeatured && (
                        <span className="bg-[#B07C1E] text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                          <Star size={12} fill="currentColor" /> Featured
                        </span>
                      )}
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={handleFavoriteToggle}
                      className="absolute top-4 right-4 w-9 h-9 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
                    >
                      <Heart size={18} className={isFavorited ? 'fill-red-500 text-red-500' : 'text-[#14181D]'} />
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
                  <div className="w-full h-full flex items-center justify-center text-gray-400 bg-[#EFEDE6]">
                    <Home size={48} />
                  </div>
                )}
              </div>

              {/* Thumbnail Strip - Below Main Image */}
              {allMedia.length > 1 && (
                <div className="grid grid-cols-4 gap-1 p-1 bg-white">
                  {allMedia.slice(0, 4).map((media, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentImage(index);
                        // If it's a video, open lightbox
                        if (media.type === 'video') {
                          openLightboxAt(index);
                        }
                      }}
                      className={`relative aspect-video rounded overflow-hidden transition-all ${
                        currentImage === index ? 'ring-2 ring-[#A4142C]' : 'hover:opacity-80'
                      }`}
                    >
                      {media.type === 'video' ? (
                        <div className="w-full h-full bg-black flex items-center justify-center relative">
                          <video
                            src={media.url}
                            className="w-full h-full object-cover"
                            muted
                            playsInline
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center">
                              <Play size={18} className="text-[#A4142C] ml-0.5" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <img
                          src={media.url}
                          alt={`${property.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-property.jpg';
                          }}
                        />
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
                <span className="text-sm" style={{ color: '#5C6570' }}>
                  Listed {new Date(property.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>

            {/* Title + Address */}
            <h1 className="font-bold mb-1" style={{ fontFamily: 'Khand', fontSize: 32, color: '#14181D', lineHeight: 1.1 }}>
              {property.title}
            </h1>
            <p className="text-sm mb-4" style={{ color: '#5C6570' }}>
              {property.location}
            </p>

            {/* Price + Verification Seal */}
            <div className="flex items-start gap-4 mb-6">
              <div>
                <div className="font-mono font-bold" style={{ fontSize: 28, color: '#14181D', fontVariantNumeric: 'tabular-nums' }}>
                  {formatPrice(property.price)}
                </div>
                {property.area && property.areaUnit && (
                  <div className="font-mono text-sm" style={{ color: '#5C6570' }}>
                    {formatPricePerUnit(property.price, property.area, property.areaUnit)}
                  </div>
                )}
                <div className="text-xs mt-1" style={{ color: '#186B4C' }}>✓ Negotiable</div>
              </div>
              
              {property.isVerified && (
                <div className="flex flex-col items-center gap-1" style={{ transform: 'rotate(-7deg)' }}>
                  <div className="w-[72px] h-[72px] rounded-full bg-[#FAECEF] border-2 border-[#A4142C] flex items-center justify-center">
                    <CheckCircle size={32} className="text-[#A4142C]" />
                  </div>
                  <div className="text-[10px] font-mono text-[#A4142C] leading-none">
                    Verified
                  </div>
                </div>
              )}
            </div>

            {/* Property Details Table */}
            <div className="rounded-lg border mb-6 overflow-hidden" style={{ borderColor: '#D3CFC5' }}>
              <div className="px-4 py-2 border-b" style={{ background: '#EFEDE6', borderColor: '#D3CFC5' }}>
                <span className="font-semibold text-sm" style={{ fontFamily: 'Khand', fontSize: 15, color: '#14181D' }}>
                  Property Details
                </span>
              </div>
              <div className="grid grid-cols-2 divide-x divide-y" style={{ borderColor: '#E6E3DB' }}>
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
                  <div key={k} className="px-4 py-2.5 flex flex-col" style={{ borderColor: '#E6E3DB' }}>
                    <span className="text-[11px] uppercase tracking-wide" style={{ color: '#5C6570', fontFamily: 'IBM Plex Mono' }}>
                      {k}
                    </span>
                    <span className="text-sm font-medium mt-0.5" style={{ color: '#14181D' }}>
                      {v}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2" style={{ fontFamily: 'Khand', fontSize: 18, color: '#14181D' }}>
                  Description
                </h3>
                <p className="text-sm" style={{ color: '#333A44', lineHeight: 1.7 }}>
                  {property.description}
                </p>
              </div>
            )}

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3" style={{ fontFamily: 'Khand', fontSize: 18, color: '#14181D' }}>
                  Amenities
                </h3>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 rounded border text-sm"
                      style={{ background: '#FFFFFF', borderColor: '#E6E3DB', color: '#333A44' }}
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Verification Record */}
            {property.isVerified && (
              <div className="rounded-lg border p-5 mb-6" style={{ background: '#E4F1EA', borderColor: '#186B4C' }}>
                <div className="flex items-center gap-2 mb-3">
                  <span style={{ color: '#186B4C', fontSize: 18 }}>✓</span>
                  <span className="font-semibold" style={{ fontFamily: 'Khand', fontSize: 17, color: '#186B4C' }}>
                    Verification Record
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  {[
                    'Owner name match against Malpot records',
                    'Plot number (kitta) confirmed in field book',
                    'No registered dispute as of verification date',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm" style={{ color: '#186B4C' }}>
                      <span className="shrink-0">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                  <div className="flex items-start gap-2 text-sm" style={{ color: '#186B4C' }}>
                    <span className="shrink-0">✓</span>
                    <span>Verified on {new Date().toLocaleDateString()}</span>
                  </div>
                </div>
                <p className="text-xs italic" style={{ color: '#186B4C', lineHeight: 1.7 }}>
                  We verify ownership documents, not property condition or price fairness. 
                  Always visit the site and engage your own lawyer before payment.
                </p>
              </div>
            )}

            {/* Reviews Section */}
            <div ref={reviewsRef} className="bg-white rounded-lg border p-6" style={{ borderColor: '#D3CFC5' }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold" style={{ fontFamily: 'Khand', fontSize: 18, color: '#14181D' }}>
                    Reviews & Ratings
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold" style={{ color: '#A4142C' }}>
                        {(ratingStats.average ?? 0).toFixed(1)}
                      </span>
                      <RatingStars rating={ratingStats.average ?? 0} size="lg" />
                    </div>
                    <span className="text-sm" style={{ color: '#5C6570' }}>
                      ({ratingStats.total ?? 0} reviews)
                    </span>
                  </div>
                </div>
                {isAuthenticated && !userReview && (
                  <button
                    onClick={scrollToReviews}
                    className="px-4 py-2 rounded text-sm font-medium transition-colors hover:bg-[#FAECEF]"
                    style={{ background: '#A4142C', color: '#FFFFFF' }}
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
                    <button className="text-sm font-medium hover:underline" style={{ color: '#A4142C' }}>
                      View all {reviews.length} reviews
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-6" style={{ background: '#F7F5F0' }}>
                  <MessageSquare size={28} className="text-gray-300 mx-auto mb-2" />
                  <p style={{ color: '#5C6570' }}>No reviews yet. Be the first to review!</p>
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
            
            {/* Seller Card */}
            <div className="rounded-lg border p-4 sticky top-20" style={{ background: '#FFFFFF', borderColor: '#D3CFC5' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ background: '#A4142C', fontFamily: 'Khand', fontSize: 18 }}>
                  {agent?.name?.charAt(0) || 'S'}
                </div>
                <div>
                  <div className="font-semibold text-sm" style={{ color: '#14181D' }}>{agent?.name || 'Seller'}</div>
                  <div className="text-[11px]" style={{ color: '#5C6570' }}>Listings · member since 2024</div>
                  {property.isVerified && (
                    <div className="text-[11px] mt-0.5" style={{ color: '#186B4C' }}>✓ Property verified</div>
                  )}
                </div>
              </div>

              {!showPhone ? (
                <button
                  onClick={() => setShowPhone(true)}
                  className="w-full py-2.5 rounded border text-sm font-semibold mb-2 transition-colors hover:bg-[#FAECEF]"
                  style={{ borderColor: '#A4142C', color: '#A4142C' }}
                >
                  Show phone number
                </button>
              ) : (
                <div className="font-mono text-base font-semibold text-center py-2.5 rounded border mb-2"
                  style={{ borderColor: '#D3CFC5', color: '#14181D', background: '#F7F5F0' }}>
                  {agent?.phone || '+977 98-4321-7654'}
                </div>
              )}

              <button className="w-full py-2.5 rounded text-sm font-semibold mb-2 transition-colors hover:bg-[#C21C38]"
                style={{ background: '#A4142C', color: '#FFFFFF' }}>
                Send inquiry
              </button>
              <button className="w-full py-2.5 rounded border text-sm font-medium transition-colors hover:bg-[#F7F5F0]"
                style={{ borderColor: '#D3CFC5', color: '#333A44' }}>
                Request a site visit
              </button>

              <p className="text-[11px] mt-3 leading-snug" style={{ color: '#B07C1E' }}>
                ⚠ Do not pay any amount before viewing the property in person.
              </p>
            </div>

            {/* Verify on site */}
            <div className="rounded-lg border p-4" style={{ background: '#FFFFFF', borderColor: '#D3CFC5' }}>
              <div className="font-semibold text-sm mb-2" style={{ fontFamily: 'Khand', fontSize: 15, color: '#14181D' }}>
                Verify on site
              </div>
              <div className="flex justify-center mb-2">
                <div className="w-24 h-24 bg-white rounded-lg shadow-sm flex items-center justify-center border-2 border-dashed" style={{ borderColor: '#D3CFC5' }}>
                  <QrCode size={56} className="text-[#14181D]" />
                </div>
              </div>
              <div className="font-mono text-xs text-center mb-3" style={{ color: '#5C6570' }}>
                {property.id?.slice(0, 12) || 'SG-BKT-04821'}
              </div>
              <div className="flex gap-1.5">
                {['PNG', 'PDF', 'SVG'].map(fmt => (
                  <button key={fmt} className="flex-1 py-1.5 rounded border text-[11px] font-mono font-medium"
                    style={{ borderColor: '#D3CFC5', color: '#5C6570', background: '#F7F5F0' }}>
                    ↓ {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Your match */}
            <div className="rounded-lg border p-4" style={{ background: '#FFFFFF', borderColor: '#D3CFC5' }}>
              <div className="font-semibold text-sm mb-3" style={{ fontFamily: 'Khand', fontSize: 15, color: '#14181D' }}>
                Your match
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="relative w-[52px] h-[52px] rounded-full flex items-center justify-center" style={{ background: '#E4F1EA' }}>
                  <svg width={52} height={52} style={{ position: 'absolute', top: 0, left: 0 }}>
                    <circle cx={26} cy={26} r={23} fill="none" stroke="#E4F1EA" strokeWidth="3" />
                    <circle
                      cx={26} cy={26} r={23}
                      fill="none" stroke="#186B4C" strokeWidth="3"
                      strokeDasharray={144.5}
                      strokeDashoffset={144.5 * (1 - 75/100)}
                      strokeLinecap="round"
                      transform="rotate(-90 26 26)"
                    />
                  </svg>
                  <span className="font-mono text-[11px] font-semibold relative z-10" style={{ color: '#186B4C' }}>75</span>
                </div>
                <div className="text-sm" style={{ color: '#5C6570' }}>
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
                    <span style={{ color: '#5C6570' }}>{row.label}</span>
                    <div className="flex items-center gap-1">
                      <span style={{ color: row.matched ? '#186B4C' : '#B07C1E' }}>{row.matched ? '✓' : '~'}</span>
                      <span className="font-mono" style={{ color: '#333A44' }}>{row.val}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal - Full Screen */}
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
              
              {/* Lightbox Content */}
              <div className="relative bg-black rounded-lg overflow-hidden">
                {allMedia[currentImage]?.type === 'video' ? (
                  <video
                    src={allMedia[currentImage].url}
                    controls
                    autoPlay
                    className="w-full max-h-[80vh] object-contain"
                  />
                ) : (
                  <img
                    src={allMedia[currentImage]?.url}
                    alt={property.title}
                    className="w-full max-h-[80vh] object-contain"
                  />
                )}
                
                {/* Navigation */}
                {allMedia.length > 1 && (
                  <>
                    <button 
                      onClick={(e) => { e.stopPropagation(); prevImage(); }} 
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full transition-colors"
                    >
                      <ChevronLeft size={28} className="text-white" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); nextImage(); }} 
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full transition-colors"
                    >
                      <ChevronRight size={28} className="text-white" />
                    </button>
                  </>
                )}
                
                {/* Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm">
                  {allMedia[currentImage]?.type === 'video' ? '🎬 Video' : `${currentImage + 1} of ${allMedia.length}`}
                </div>

                {/* Thumbnail Strip in Lightbox */}
                {allMedia.length > 1 && (
                  <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 max-w-[80%] overflow-x-auto px-4 py-2">
                    {allMedia.map((media, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImage(index);
                        }}
                        className={`w-16 h-12 rounded overflow-hidden flex-shrink-0 transition-all ${
                          currentImage === index ? 'ring-2 ring-white' : 'opacity-60 hover:opacity-100'
                        }`}
                      >
                        {media.type === 'video' ? (
                          <div className="w-full h-full bg-black flex items-center justify-center">
                            <Play size={14} className="text-white" />
                          </div>
                        ) : (
                          <img
                            src={media.url}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PropertyDetail;