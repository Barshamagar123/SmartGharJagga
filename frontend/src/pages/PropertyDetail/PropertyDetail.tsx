// src/pages/PropertyDetail/PropertyDetail.tsx

import React, { useEffect, useState } from 'react';
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
} from 'lucide-react';
import { propertyApi } from '../../services/api/property';
import { reviewApi } from '../../services/api/review';
import { formatArea } from '../../utils/areaUtils';
import type { Property } from '../../types/property';

// ✅ Import Review Components
import ReviewCard from '../../components/Review/ReviewCard';
import ReviewForm from '../../components/Review/ReviewForm';
import RatingStars from '../../components/Review/RatingStars';
import { useAuth } from '../../hooks/useAuth';

// ✅ FIXED: Hardcode API URL for now
const API_URL = 'http://localhost:5001';

// ✅ FIXED: Image Helper - Simple and clean
const getImageUrl = (path: string | undefined | null): string => {
  if (!path) return '/placeholder-property.jpg';
  
  // If already has http, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // If path starts with //, add http:
  if (path.startsWith('//')) {
    return `http:${path}`;
  }
  
  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // Full URL
  const fullUrl = `${API_URL}${cleanPath}`;
  
  console.log('🖼️ Generated Image URL:', fullUrl); // Debug
  return fullUrl;
};

// ✅ FIXED: Video Helper
const getVideoUrl = (path: string | undefined | null): string => {
  if (!path) return '';
  
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  if (path.startsWith('//')) {
    return `http:${path}`;
  }
  
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const fullUrl = `${API_URL}${cleanPath}`;
  
  console.log('🎬 Generated Video URL:', fullUrl); // Debug
  return fullUrl;
};

const formatPrice = (price: number) => `Rs ${price.toLocaleString()}`;

// ✅ Shape this component's UI actually renders (distribution keyed 1-5)
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

// ✅ Converts the backend's actual PropertyRatingResponse shape
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

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Image states
  const [currentImage, setCurrentImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [isQRExpanded, setIsQRExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    message: '',
  });

  // ✅ Review States
  const [reviews, setReviews] = useState([]);
  const [ratingStats, setRatingStats] = useState<RatingStatsUI>(DEFAULT_RATING_STATS);
  const [userReview, setUserReview] = useState(null);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // ✅ Fetch property data
  useEffect(() => {
    if (!id) return;
    fetchPropertyData();
  }, [id]);

  const fetchPropertyData = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await propertyApi.getById(id!);

      console.log('📊 Full Property Data:', data);
      console.log('📸 Images raw:', data.images);
      console.log('🎬 Videos raw:', data.videos);
      console.log('🖼️ Main Image raw:', data.mainImage);

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

  // ✅ FIXED: Build gallery from real images with full URLs
  const images: string[] = React.useMemo(() => {
    if (property?.images && property.images.length > 0) {
      return property.images.map(img => getImageUrl(img));
    }
    if (property?.mainImage) {
      return [getImageUrl(property.mainImage)];
    }
    return ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&q=80'];
  }, [property]);

  // ✅ FIXED: Videos with full URLs
  const videos: string[] = React.useMemo(() => {
    if (property?.videos && property.videos.length > 0) {
      return property.videos.map(vid => getVideoUrl(vid));
    }
    return [];
  }, [property]);

  // ✅ Combined media items (images + videos)
  const allMedia = React.useMemo(() => {
    const media = [
      ...images.map((img) => ({ type: 'image' as const, url: img })),
      ...videos.map((vid) => ({ type: 'video' as const, url: vid })),
    ];
    console.log('📺 All Media:', media);
    return media;
  }, [images, videos]);

  const openLightboxAt = (index: number) => {
    setCurrentImage(index);
    setIsLightboxOpen(true);
  };

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % allMedia.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + allMedia.length) % allMedia.length);

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
    console.log('Enquiry submitted:', formData);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  // ✅ If still loading, show loader
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Loader2 size={48} className="animate-spin text-[#2D5A27]" />
      </div>
    );
  }

  // ✅ If error or no property
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

  // ✅ Hero grid layout: 1 large tile + up to 4 small tiles
  const heroTiles = allMedia.slice(0, 5);
  const remainingCount = allMedia.length - heroTiles.length;

  return (
    <div className="pt-16 md:pt-20 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/properties')}
          className="flex items-center gap-2 text-[#475569] hover:text-[#2D5A27] transition-colors mb-6 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Properties</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN - 8 Columns */}
          <div className="lg:col-span-8 space-y-6">

            {/* ============================================ */}
            {/* HERO MEDIA GRID */}
            {/* ============================================ */}
            <div className="relative">
              <div className="grid grid-cols-4 grid-rows-2 gap-2 rounded-2xl overflow-hidden h-[280px] sm:h-[380px] md:h-[460px] shadow-sm">
                {heroTiles.length > 0 ? (
                  heroTiles.map((media, index) => {
                    const isLarge = index === 0;
                    const isLastVisible = index === heroTiles.length - 1 && remainingCount > 0;

                    return (
                      <button
                        key={index}
                        onClick={() => openLightboxAt(index)}
                        className={`relative group overflow-hidden bg-gray-100 focus:outline-none ${
                          isLarge ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'
                        } ${heroTiles.length === 1 ? 'col-span-4 row-span-2' : ''}`}
                      >
                        {media.type === 'video' ? (
                          <>
                            <video
                              src={media.url}
                              className="w-full h-full object-cover"
                              muted
                              playsInline
                              preload="metadata"
                              onError={(e) => {
                                console.error('❌ Video failed:', media.url);
                              }}
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                              <div className="w-11 h-11 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                                <Play size={18} className="text-[#2D5A27] ml-0.5" />
                              </div>
                            </div>
                          </>
                        ) : (
                          <img
                            src={media.url}
                            alt={property.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              console.error('❌ Image failed:', media.url);
                              (e.target as HTMLImageElement).src = '/placeholder-property.jpg';
                            }}
                          />
                        )}

                        {isLastVisible && (
                          <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">
                              +{remainingCount} more
                            </span>
                          </div>
                        )}
                      </button>
                    );
                  })
                ) : (
                  // ✅ Fallback if no images
                  <div className="col-span-4 row-span-2 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No images available</span>
                  </div>
                )}
              </div>

              {/* Floating badges */}
              {property.isFeatured && (
                <div className="absolute top-4 left-4 bg-[#D4AF37] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                  <Star size={12} /> Featured
                </div>
              )}

              {/* Floating action buttons */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 bg-white/95 hover:bg-white text-[#0F172A] text-xs font-medium px-3 py-2 rounded-full shadow-md transition-colors"
                >
                  {copied ? <CheckCircle size={14} className="text-green-600" /> : <Share2 size={14} />}
                  {copied ? 'Copied' : 'Share'}
                </button>
                <button
                  onClick={handleFavoriteToggle}
                  className="flex items-center justify-center w-9 h-9 bg-white/95 hover:bg-white rounded-full shadow-md transition-colors"
                >
                  <Heart size={16} className={isFavorited ? 'fill-red-500 text-red-500' : 'text-[#0F172A]'} />
                </button>
              </div>

              {/* Show all photos button */}
              {allMedia.length > 0 && (
                <button
                  onClick={() => openLightboxAt(0)}
                  className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-white/95 hover:bg-white text-[#0F172A] text-xs font-semibold px-3.5 py-2 rounded-lg shadow-md transition-colors"
                >
                  <Images size={14} />
                  Show all {allMedia.length} {allMedia.length === 1 ? 'photo' : 'photos'}
                </button>
              )}
            </div>

            {/* Lightbox Modal */}
            {isLightboxOpen && allMedia.length > 0 && (
              <div
                className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
                onClick={() => setIsLightboxOpen(false)}
              >
                <div className="relative max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setIsLightboxOpen(false)}
                    className="absolute -top-14 right-0 text-white hover:text-gray-300 transition-colors"
                  >
                    <X size={32} />
                  </button>

                  {allMedia[currentImage]?.type === 'video' ? (
                    <video
                      key={allMedia[currentImage].url}
                      src={allMedia[currentImage].url}
                      controls
                      autoPlay
                      className="w-full max-h-[80vh] rounded-lg bg-black"
                      onError={(e) => {
                        console.error('❌ Video failed in lightbox:', allMedia[currentImage].url);
                      }}
                    />
                  ) : (
                    <img
                      src={allMedia[currentImage]?.url}
                      alt={property.title}
                      className="w-full max-h-[80vh] object-contain rounded-lg"
                      onError={(e) => {
                        console.error('❌ Image failed in lightbox:', allMedia[currentImage]?.url);
                        (e.target as HTMLImageElement).src = '/placeholder-property.jpg';
                      }}
                    />
                  )}

                  {allMedia.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full transition-all duration-200"
                      >
                        <ChevronLeft size={28} className="text-white" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full transition-all duration-200"
                      >
                        <ChevronRight size={28} className="text-white" />
                      </button>
                    </>
                  )}

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm">
                    {allMedia[currentImage]?.type === 'video' ? '🎬 Video' : `${currentImage + 1} of ${allMedia.length}`}
                  </div>

                  {/* Thumbnail strip */}
                  <div className="flex gap-2 mt-4 overflow-x-auto pb-1 justify-center">
                    {allMedia.map((media, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImage(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImage ? 'border-white' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        {media.type === 'video' ? (
                          <div className="w-full h-full bg-gray-800 flex items-center justify-center relative">
                            <video src={media.url} className="w-full h-full object-cover" muted />
                            <Play size={16} className="absolute text-white" />
                          </div>
                        ) : (
                          <img 
                            src={media.url} 
                            alt="" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder-property.jpg';
                            }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Rest of the component remains same */}
            {/* Property Description */}
            {property.description && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-[#0F172A] mb-3">Property Description</h2>
                <p className="text-[#475569] leading-relaxed whitespace-pre-line">{property.description}</p>
              </div>
            )}

            {/* Property Specs */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-sm font-semibold text-[#0F172A] mb-4">Property Specifications</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-[#F8FAFC] rounded-xl">
                  <BedDouble size={20} className="text-[#2D5A27] mx-auto" />
                  <div className="font-semibold text-[#0F172A] mt-1">
                    {property.bedrooms ?? 'N/A'} {property.bedrooms ? 'Beds' : ''}
                  </div>
                </div>
                <div className="text-center p-3 bg-[#F8FAFC] rounded-xl">
                  <Bath size={20} className="text-[#2D5A27] mx-auto" />
                  <div className="font-semibold text-[#0F172A] mt-1">
                    {property.bathrooms ?? 'N/A'} {property.bathrooms ? 'Baths' : ''}
                  </div>
                </div>
                <div className="text-center p-3 bg-[#F8FAFC] rounded-xl">
                  <Maximize2 size={20} className="text-[#2D5A27] mx-auto" />
                  <div className="font-semibold text-[#0F172A] mt-1">
                    {property.area && property.areaUnit ? formatArea(property.area, property.areaUnit) : 'N/A'}
                  </div>
                </div>
                <div className="text-center p-3 bg-[#F8FAFC] rounded-xl">
                  <Car size={20} className="text-[#2D5A27] mx-auto" />
                  <div className="font-semibold text-[#0F172A] mt-1">
                    {property.parking ? 'Parking' : 'No Parking'}
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-sm font-semibold text-[#0F172A] mb-4">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity, i) => (
                    <span
                      key={i}
                      className="text-xs bg-[#F8FAFC] px-3 py-1.5 rounded-full text-[#475569] border border-gray-200"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Location Map */}
            {property.latitude != null && property.longitude != null && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[#0F172A] flex items-center gap-2">
                    <MapPin size={20} className="text-[#2D5A27]" />
                    Location Map
                  </h3>
                  <span className="text-sm text-[#475569]">{property.location}</span>
                </div>

                <div className="w-full h-[300px] rounded-xl overflow-hidden bg-[#EDF5EC] relative">
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
              </div>
            )}

            {/* Reviews Section */}
            <div id="reviews-section" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-[#0F172A]">Reviews & Ratings</h2>
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
                    onClick={() => document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-4 py-2 bg-[#2D5A27] text-white rounded-lg hover:bg-[#23461E] transition-colors text-sm"
                  >
                    Write a Review
                  </button>
                )}
              </div>

              {/* Rating Distribution */}
              {ratingStats.total > 0 && (
                <div className="bg-[#F8FAFC] rounded-xl p-6 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold text-[#0F172A] mb-3">Rating Distribution</h4>
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center gap-3 mb-2">
                          <span className="text-sm w-6">{star} ⭐</span>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#D4AF37] rounded-full transition-all duration-500"
                              style={{
                                width: ratingStats.total > 0
                                  ? `${((ratingStats.distribution[star as 1 | 2 | 3 | 4 | 5] ?? 0) / ratingStats.total) * 100}%`
                                  : '0%'
                              }}
                            />
                          </div>
                          <span className="text-sm text-[#475569] w-12">
                            {ratingStats.distribution[star as 1 | 2 | 3 | 4 | 5] ?? 0}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-center bg-white rounded-lg p-6">
                      <div className="text-center">
                        <div className="text-5xl font-bold text-[#2D5A27]">
                          {(ratingStats.average ?? 0).toFixed(1)}
                        </div>
                        <RatingStars rating={ratingStats.average ?? 0} size="lg" className="mt-2" />
                        <p className="text-sm text-[#475569] mt-2">
                          Based on {ratingStats.total ?? 0} reviews
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews List */}
              {loadingReviews ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-200" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-32" />
                          <div className="h-3 bg-gray-200 rounded w-24" />
                          <div className="h-16 bg-gray-200 rounded w-full" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review: any) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-[#F8FAFC] rounded-xl">
                  <p className="text-[#475569]">No reviews yet. Be the first to review!</p>
                </div>
              )}

              {/* Review Form */}
              {isAuthenticated && !userReview && (
                <div id="review-form" className="mt-6">
                  <ReviewForm propertyId={id!} onSuccess={fetchPropertyData} />
                </div>
              )}

              {userReview && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700 flex items-center gap-2">
                    <CheckCircle size={16} />
                    You have already reviewed this property. Thank you for your feedback!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN - 4 Columns */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 sticky top-24">
              {/* Property title */}
              <div className="mb-4 pb-4 border-b border-gray-100">
                <h1 className="text-lg font-bold text-[#0F172A] leading-snug">{property.title}</h1>
                <p className="text-sm text-[#475569] flex items-center gap-1 mt-1">
                  <MapPin size={14} className="text-[#2D5A27]" />
                  {property.location}
                </p>
              </div>

              {/* Seller details */}
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-[#EDF5EC] rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {agent?.avatarUrl ? (
                      <img src={getImageUrl(agent.avatarUrl)} alt={agent.name} className="w-full h-full object-cover" />
                    ) : (
                      <User size={24} className="text-[#2D5A27]" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#0F172A]">{agent?.name || 'Seller'}</h4>
                    {property.isVerified && (
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        <Shield size={12} /> Verified listing
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-[#F8FAFC] rounded-xl p-3 space-y-1.5">
                  {agent?.phone && (
                    <div className="flex items-center gap-2 text-sm text-[#475569]">
                      <Phone size={14} className="text-[#2D5A27] flex-shrink-0" />
                      <span>{agent.phone}</span>
                    </div>
                  )}
                  {agent?.email && (
                    <div className="flex items-center gap-2 text-sm text-[#475569]">
                      <Mail size={14} className="text-[#2D5A27] flex-shrink-0" />
                      <span className="truncate">{agent.email}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-[#475569]">Price</div>
                    <div className="font-serif text-2xl font-bold text-[#2D5A27]">
                      {formatPrice(property.price)}
                    </div>
                  </div>
                  <div className="text-right">
                    <button
                      onClick={handleFavoriteToggle}
                      className="flex items-center gap-1 text-sm text-[#475569] hover:text-red-500 transition-colors"
                    >
                      <Heart size={16} className={isFavorited ? 'fill-red-500 text-red-500' : ''} />
                      {favoritesCount}
                    </button>
                    <div className="text-xs text-[#94A3B8] mt-1">{property.status}</div>
                  </div>
                </div>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                <div className="flex items-center gap-2 text-[#475569]">
                  <BedDouble size={14} className="text-[#2D5A27]" />
                  {property.bedrooms ?? 'N/A'} Beds
                </div>
                <div className="flex items-center gap-2 text-[#475569]">
                  <Bath size={14} className="text-[#2D5A27]" />
                  {property.bathrooms ?? 'N/A'} Baths
                </div>
                <div className="flex items-center gap-2 text-[#475569]">
                  <Maximize2 size={14} className="text-[#2D5A27]" />
                  {property.area && property.areaUnit ? formatArea(property.area, property.areaUnit) : 'N/A'}
                </div>
                <div className="flex items-center gap-2 text-[#475569]">
                  <Car size={14} className="text-[#2D5A27]" />
                  {property.parking ? 'Parking available' : 'No parking'}
                </div>
              </div>

              {agent?.phone && (
                <a
                  href={`tel:${agent.phone}`}
                  className="w-full py-3 bg-[#2D5A27] text-white rounded-xl hover:bg-[#23461E] transition-colors font-medium mb-4 flex items-center justify-center gap-2"
                >
                  <Phone size={18} />
                  Contact Agent
                </a>
              )}

              {/* QR / Share */}
              <div className="border-t border-gray-200 pt-4 mb-4">
                <button
                  onClick={() => setIsQRExpanded(!isQRExpanded)}
                  className="flex items-center justify-between w-full"
                >
                  <div className="flex items-center gap-2">
                    <QrCode size={18} className="text-[#2D5A27]" />
                    <span className="text-sm font-medium text-[#0F172A]">Share this listing</span>
                  </div>
                  <span className="text-xs text-[#94A3B8]">{isQRExpanded ? 'Hide' : 'Show'}</span>
                </button>

                {isQRExpanded && (
                  <div className="mt-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopyLink}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#F8FAFC] hover:bg-[#EDF5EC] rounded-lg transition-colors text-sm text-[#475569]"
                      >
                        {copied ? <CheckCircle size={16} className="text-green-500" /> : <Copy size={16} />}
                        {copied ? 'Copied!' : 'Copy Link'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Enquiry Form */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-semibold text-[#0F172A] mb-3 flex items-center gap-2">
                  <MessageCircle size={18} className="text-[#2D5A27]" />
                  Enquiry Form
                </h4>
                {isSubmitted ? (
                  <div className="bg-[#EDF5EC] rounded-xl p-4 text-center">
                    <CheckCircle size={32} className="text-[#2D5A27] mx-auto mb-2" />
                    <p className="text-sm font-medium text-[#2D5A27]">Enquiry Sent!</p>
                    <p className="text-xs text-[#475569]">Agent will contact you shortly</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                      type="text"
                      placeholder="Full Name *"
                      className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D5A27] transition-all text-sm"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number *"
                      className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D5A27] transition-all text-sm"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email (Optional)"
                      className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D5A27] transition-all text-sm"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <textarea
                      rows={3}
                      placeholder="Message *"
                      className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D5A27] transition-all text-sm resize-none"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                    <button
                      type="submit"
                      className="w-full py-3 bg-[#2D5A27] text-white rounded-xl hover:bg-[#23461E] transition-colors font-medium text-sm flex items-center justify-center gap-2"
                    >
                      <Send size={16} />
                      Send Enquiry
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;