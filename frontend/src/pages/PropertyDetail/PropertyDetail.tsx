// src/pages/PropertyDetail/PropertyDetail.tsx - Complete File

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
  Camera, MessageSquare, Home
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

const formatPrice = (price: number) => `Rs ${price.toLocaleString()}`;

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
  const [activeTab, setActiveTab] = useState<'details' | 'features' | 'location'>('details');
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

  // Media
  const images = React.useMemo(() => {
    if (property?.images && property.images.length > 0) {
      return property.images.map(img => getImageUrl(img));
    }
    if (property?.mainImage) {
      return [getImageUrl(property.mainImage)];
    }
    return ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&q=80'];
  }, [property]);

  const videos = React.useMemo(() => {
    if (property?.videos && property.videos.length > 0) {
      return property.videos.map(vid => getVideoUrl(vid));
    }
    return [];
  }, [property]);

  const allMedia = React.useMemo(() => {
    const media = [
      ...images.map((img) => ({ type: 'image' as const, url: img })),
      ...videos.map((vid) => ({ type: 'video' as const, url: vid })),
    ];
    return media;
  }, [images, videos]);

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
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-[#2D5A27] mx-auto" />
          <p className="mt-4 text-gray-500">Loading property details...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Property not found'}</p>
          <button
            onClick={() => navigate('/properties')}
            className="px-6 py-2 bg-[#2D5A27] text-white rounded-lg hover:bg-[#23461E]"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  const agent = property.user;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-8 py-4">
        <button
          onClick={() => navigate('/properties')}
          className="flex items-center gap-2 text-[#475569] hover:text-[#2D5A27] transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Properties</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* LEFT COLUMN - Images & Videos (3/4 ≈ 75%) */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Main Image/Video */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="relative aspect-[35/18] bg-gray-100">
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
                          console.error('❌ Main image failed:', allMedia[0]?.url);
                          (e.target as HTMLImageElement).src = '/placeholder-property.jpg';
                        }}
                      />
                    )}
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      {property.isFeatured && (
                        <span className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                          <Star size={12} fill="currentColor" /> Featured
                        </span>
                      )}
                      {property.isVerified && (
                        <span className="bg-[#2D5A27] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                          <Shield size={12} /> Verified
                        </span>
                      )}
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={handleFavoriteToggle}
                      className="absolute top-3 right-3 flex items-center justify-center w-9 h-9 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110"
                    >
                      <Heart size={18} className={isFavorited ? 'fill-red-500 text-red-500' : 'text-[#0F172A]'} />
                    </button>

                    {/* Image Counter */}
                    {allMedia.length > 1 && (
                      <button
                        onClick={() => openLightboxAt(0)}
                        className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 hover:bg-black/70 transition-colors"
                      >
                        <Images size={14} />
                        {allMedia.length} photos
                      </button>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Home size={48} />
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                  <Camera size={14} /> Images ({images.length})
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {images.slice(0, 6).map((img, index) => (
                    <button
                      key={index}
                      onClick={() => openLightboxAt(index)}
                      className="aspect-square rounded-lg overflow-hidden bg-gray-100 hover:opacity-80 transition-opacity border-2 border-transparent hover:border-[#2D5A27]"
                    >
                      <img
                        src={img}
                        alt={`${property.title} - ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-property.jpg';
                        }}
                      />
                    </button>
                  ))}
                  {images.length === 0 && (
                    <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs col-span-3">
                      No images available
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                  <Video size={14} /> Videos ({videos.length})
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {videos.length > 0 ? (
                    videos.map((video, index) => (
                      <div
                        key={index}
                        className="aspect-square rounded-lg overflow-hidden bg-black relative cursor-pointer hover:opacity-80 transition-opacity border-2 border-transparent hover:border-[#2D5A27]"
                        onClick={() => {
                          const videoIndex = images.length + index;
                          setCurrentImage(videoIndex);
                          setIsLightboxOpen(true);
                        }}
                      >
                        <video
                          src={video}
                          className="w-full h-full object-cover"
                          muted
                          playsInline
                          onError={(e) => {
                            console.error('❌ Video thumbnail failed:', video);
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center">
                            <Play size={14} className="text-[#2D5A27] ml-0.5" />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs col-span-2">
                      No videos available
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Property Info Cards */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-[#0F172A]">{property.title}</h1>
                <p className="text-[#475569] flex items-center gap-1.5 mt-1">
                  <MapPin size={16} className="text-[#2D5A27]" />
                  {property.location}
                </p>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <span className="text-xs text-[#475569]">Price</span>
                  <p className="font-serif text-2xl font-bold text-[#2D5A27]">
                    {formatPrice(property.price)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    property.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                    property.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                    property.status === 'SOLD' ? 'bg-blue-100 text-blue-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {property.status}
                  </span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-gray-100">
                <div className="bg-[#F8FAFC] rounded-xl p-3 text-center">
                  <BedDouble size={18} className="text-[#2D5A27] mx-auto" />
                  <div className="font-bold text-[#0F172A] mt-0.5">
                    {property.bedrooms ?? 'N/A'}
                  </div>
                  <div className="text-xs text-[#475569]">Beds</div>
                </div>
                <div className="bg-[#F8FAFC] rounded-xl p-3 text-center">
                  <Bath size={18} className="text-[#2D5A27] mx-auto" />
                  <div className="font-bold text-[#0F172A] mt-0.5">
                    {property.bathrooms ?? 'N/A'}
                  </div>
                  <div className="text-xs text-[#475569]">Baths</div>
                </div>
                <div className="bg-[#F8FAFC] rounded-xl p-3 text-center">
                  <Maximize2 size={18} className="text-[#2D5A27] mx-auto" />
                  <div className="font-bold text-[#0F172A] mt-0.5">
                    {property.area && property.areaUnit ? formatArea(property.area, property.areaUnit) : 'N/A'}
                  </div>
                  <div className="text-xs text-[#475569]">Area</div>
                </div>
                <div className="bg-[#F8FAFC] rounded-xl p-3 text-center">
                  <Car size={18} className="text-[#2D5A27] mx-auto" />
                  <div className="font-bold text-[#0F172A] mt-0.5">
                    {property.parking ? '✅' : '❌'}
                  </div>
                  <div className="text-xs text-[#475569]">Parking</div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-t border-gray-100 pt-4">
                <div className="flex gap-2">
                  {['Details', 'Features', 'Location'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab.toLowerCase() as any)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                        activeTab === tab.toLowerCase()
                          ? 'bg-[#2D5A27] text-white'
                          : 'text-[#475569] hover:bg-[#F8FAFC]'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="mt-4">
                  {activeTab === 'details' && (
                    <div className="space-y-4">
                      {property.description && (
                        <div>
                          <h3 className="font-semibold text-[#0F172A] mb-2">Description</h3>
                          <p className="text-[#475569] leading-relaxed whitespace-pre-line">
                            {property.description}
                          </p>
                        </div>
                      )}
                      {property.amenities && property.amenities.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-[#0F172A] mb-2">Amenities</h3>
                          <div className="flex flex-wrap gap-2">
                            {property.amenities.map((amenity, i) => (
                              <span
                                key={i}
                                className="text-sm bg-[#F8FAFC] px-3 py-1.5 rounded-full border border-gray-100"
                              >
                                {amenity}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'features' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-[#F8FAFC] rounded-lg p-3">
                        <span className="text-xs text-[#475569]">Property Type</span>
                        <p className="font-medium">{property.propertyType?.replace('_', ' ') || 'N/A'}</p>
                      </div>
                      <div className="bg-[#F8FAFC] rounded-lg p-3">
                        <span className="text-xs text-[#475569]">Purpose</span>
                        <p className="font-medium">{property.purpose || 'For Sale'}</p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'location' && (
                    <div className="space-y-3">
                      {property.latitude != null && property.longitude != null ? (
                        <div className="w-full h-[300px] rounded-xl overflow-hidden bg-[#EDF5EC]">
                          <iframe
                            src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}&q=${property.latitude},${property.longitude}&zoom=15&maptype=roadmap`}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Property Location Map"
                            className="rounded-xl"
                          />
                        </div>
                      ) : (
                        <div className="bg-[#F8FAFC] rounded-xl p-8 text-center text-gray-400">
                          <MapPin size={32} className="mx-auto mb-2" />
                          <p>Location coordinates not available</p>
                          <p className="text-xs mt-1">{property.location}</p>
                        </div>
                      )}
                      <p className="text-sm text-[#475569] flex items-center gap-1.5">
                        <MapPin size={14} className="text-[#2D5A27]" />
                        {property.location}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div ref={reviewsRef} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
                    <MessageSquare size={20} className="text-[#2D5A27]" />
                    Reviews & Ratings
                  </h2>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-[#2D5A27]">
                        {(ratingStats.average ?? 0).toFixed(1)}
                      </span>
                      <RatingStars rating={ratingStats.average ?? 0} size="lg" />
                    </div>
                    <span className="text-sm text-[#475569]">
                      ({ratingStats.total ?? 0} reviews)
                    </span>
                  </div>
                </div>
                {isAuthenticated && !userReview && (
                  <button
                    onClick={scrollToReviews}
                    className="px-4 py-2 bg-[#2D5A27] text-white rounded-lg hover:bg-[#23461E] transition-colors text-sm font-medium"
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
                    <button className="text-[#2D5A27] text-sm font-medium hover:underline">
                      View all {reviews.length} reviews
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 bg-[#F8FAFC] rounded-xl">
                  <MessageSquare size={28} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-[#475569]">No reviews yet. Be the first to review!</p>
                </div>
              )}

              {isAuthenticated && !userReview && (
                <div id="review-form" className="mt-4">
                  <ReviewForm propertyId={id!} onSuccess={fetchPropertyData} />
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN - Seller & QR (1/4 ≈ 25%) */}
          <div className="lg:col-span-1 space-y-4">
            
            {/* Seller Card - Balanced size */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 sticky top-24">
              <div className="text-center">
                <div className="w-22 h-22 mx-auto bg-gradient-to-br from-[#2D5A27] to-[#0F3D2E] rounded-full flex items-center justify-center overflow-hidden text-white text-2xl font-bold shadow-lg">
                  {agent?.avatarUrl ? (
                    <img src={getImageUrl(agent.avatarUrl)} alt={agent.name} className="w-full h-full object-cover" />
                  ) : (
                    agent?.name?.charAt(0) || 'S'
                  )}
                </div>
                <h4 className="font-bold text-[#0F172A] mt-2.5 text-lg">{agent?.name || 'Seller'}</h4>
                <div className="flex items-center justify-center gap-2 mt-0.5">
                  <span className="text-[#2D5A27] font-medium text-sm">⭐ 4.9</span>
                  <span className="text-[#475569] text-xs">· 28 reviews</span>
                </div>
                {property.isVerified && (
                  <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full mt-1">
                    <Shield size={11} /> Verified
                  </span>
                )}
              </div>

              <div className="mt-3.5 space-y-2">
                {agent?.phone && (
                  <div className="flex items-center gap-2 text-sm text-[#475569] bg-[#F8FAFC] rounded-lg p-2.5">
                    <Phone size={14} className="text-[#2D5A27] flex-shrink-0" />
                    <span className="text-sm">{agent.phone}</span>
                  </div>
                )}
                {agent?.email && (
                  <div className="flex items-center gap-2 text-sm text-[#475569] bg-[#F8FAFC] rounded-lg p-2.5">
                    <Mail size={14} className="text-[#2D5A27] flex-shrink-0" />
                    <span className="truncate text-sm">{agent.email}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                {agent?.phone && (
                  <a
                    href={`tel:${agent.phone}`}
                    className="py-2.5 bg-[#2D5A27] text-white rounded-xl hover:bg-[#23461E] transition-colors font-medium text-sm text-center flex items-center justify-center gap-2"
                  >
                    <Phone size={15} />
                    Call
                  </a>
                )}
                <button className="py-2.5 border-2 border-[#2D5A27] text-[#2D5A27] rounded-xl hover:bg-[#2D5A27] hover:text-white transition-colors font-medium text-sm flex items-center justify-center gap-2">
                  <MessageCircle size={15} />
                  Message
                </button>
              </div>
            </div>

            {/* QR Code Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <button
                onClick={() => setIsQRExpanded(!isQRExpanded)}
                className="flex items-center justify-between w-full"
              >
                <span className="font-semibold text-[#0F172A] flex items-center gap-2 text-sm">
                  <QrCode size={17} className="text-[#2D5A27]" />
                  QR Share
                </span>
                <span className="text-xs text-[#94A3B8]">{isQRExpanded ? 'Hide' : 'Show'}</span>
              </button>

              {isQRExpanded && (
                <div className="mt-3.5">
                  <div className="bg-[#F8FAFC] rounded-xl p-4 text-center">
                    <div className="w-32 h-32 mx-auto bg-white rounded-lg shadow-sm flex items-center justify-center border-2 border-dashed border-gray-200">
                      <QrCode size={60} className="text-[#2D5A27]" />
                    </div>
                    <p className="text-xs text-[#475569] mt-2">Scan to view</p>
                    <button
                      onClick={handleCopyLink}
                      className="mt-3 w-full py-2 border border-gray-200 rounded-lg hover:bg-[#F8FAFC] transition-colors text-sm flex items-center justify-center gap-2"
                    >
                      {copied ? <CheckCircle size={14} className="text-green-500" /> : <Copy size={14} />}
                      {copied ? 'Copied!' : 'Copy Link'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Share Options */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <p className="text-sm font-medium text-[#0F172A] mb-3">Share</p>
              <div className="flex gap-2">
                <button
                  onClick={handleCopyLink}
                  className="flex-1 py-2 bg-[#F8FAFC] hover:bg-[#EDF5EC] rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
                >
                  {copied ? <CheckCircle size={14} className="text-green-500" /> : <Share2 size={14} />}
                  {copied ? 'Copied' : 'Share'}
                </button>
                <button className="flex-1 py-2 bg-[#F8FAFC] hover:bg-[#EDF5EC] rounded-lg transition-colors text-sm flex items-center justify-center gap-2">
                  <Download size={14} />
                  Brochure
                </button>
              </div>
            </div>

            {/* Enquiry Form */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h4 className="font-semibold text-[#0F172A] mb-3 flex items-center gap-2 text-sm">
                <MessageCircle size={17} className="text-[#2D5A27]" />
                Quick Enquiry
              </h4>
              {isSubmitted ? (
                <div className="bg-[#EDF5EC] rounded-xl p-4 text-center">
                  <CheckCircle size={30} className="text-[#2D5A27] mx-auto mb-1.5" />
                  <p className="text-sm font-medium text-[#2D5A27]">Sent!</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-2.5">
                  <input
                    type="text"
                    placeholder="Name *"
                    className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D5A27] text-sm"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone *"
                    className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D5A27] text-sm"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    required
                  />
                  <textarea
                    rows={2}
                    placeholder="Message *"
                    className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D5A27] text-sm resize-none"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#2D5A27] text-white rounded-xl hover:bg-[#23461E] transition-colors font-medium text-sm flex items-center justify-center gap-2"
                  >
                    <Send size={15} />
                    Send
                  </button>
                </form>
              )}
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
            <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <X size={28} />
              </button>
              <div className="relative">
                {allMedia[currentImage]?.type === 'video' ? (
                  <video
                    src={allMedia[currentImage].url}
                    controls
                    autoPlay
                    className="w-full max-h-[80vh] rounded-lg bg-black"
                  />
                ) : (
                  <img
                    src={allMedia[currentImage]?.url}
                    alt={property.title}
                    className="w-full max-h-[80vh] object-contain rounded-lg"
                  />
                )}
                {allMedia.length > 1 && (
                  <>
                    <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full">
                      <ChevronLeft size={28} className="text-white" />
                    </button>
                    <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full">
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