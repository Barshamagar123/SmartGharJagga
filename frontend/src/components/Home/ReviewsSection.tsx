// src/components/Home/ReviewsSection.tsx

import React, { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';
import { reviewApi } from '../../services/api/review';

interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt?: string;
  reviewer?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  property?: {
    id: string;
    title: string;
    location?: string;
  };
}

interface ReviewsSectionProps {
  limit?: number;
  title?: string;
  propertyId?: string;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ 
  limit = 6, 
  title = "What Our Users Say",
  propertyId 
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState<any[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let reviewsData: Review[] = [];
        let statsData: any = null;
        
        if (propertyId) {
          // ✅ Fetch reviews for a specific property
          statsData = await reviewApi.getStats(propertyId);
          if (statsData) {
            reviewsData = statsData.reviews || [];
            setTotalReviews(statsData.totalReviews || 0);
            setAverageRating(statsData.averageRating || 0);
            setRatingDistribution(statsData.ratingDistribution || []);
          }
        } else {
          // ✅ Fetch public reviews for homepage
          // First try to get from API
          try {
            // If you have a public endpoint
            // const response = await reviewApi.getPublic(limit);
            // reviewsData = response || [];
            
            // Since you don't have a public endpoint yet, 
            // we need to fetch from multiple properties
            // This is a workaround until you add a public endpoint
            
            // Fetch reviews from featured or recent properties
            const propertyIds = await getPropertyIds(limit);
            if (propertyIds.length > 0) {
              const allReviews: Review[] = [];
              for (const id of propertyIds) {
                try {
                  const propertyReviews = await reviewApi.getByProperty(id);
                  if (propertyReviews && propertyReviews.length > 0) {
                    allReviews.push(...propertyReviews);
                  }
                } catch (err) {
                  console.warn(`No reviews for property ${id}`);
                }
              }
              reviewsData = allReviews.slice(0, limit);
            }
          } catch (err) {
            console.error('Error fetching public reviews:', err);
            setError('Failed to load reviews');
          }
        }
        
        // ✅ Set reviews state
        setReviews(reviewsData);
        
        // ✅ Calculate average if not already calculated
        if (reviewsData.length > 0 && !propertyId) {
          const avg = reviewsData.reduce((acc, r) => acc + r.rating, 0) / reviewsData.length;
          setAverageRating(Math.round(avg * 10) / 10);
          setTotalReviews(reviewsData.length);
        }
        
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [limit, propertyId]);

  // ✅ Helper: Get property IDs for fetching reviews
  const getPropertyIds = async (count: number): Promise<string[]> => {
    try {
      // Fetch featured or recent properties to get their reviews
      const response = await fetch(`${import.meta.env.VITE_API_URL}/properties?featured=true&limit=${count}`);
      const data = await response.json();
      const properties = data.data?.properties || [];
      return properties.map((p: any) => p.id);
    } catch (err) {
      console.error('Error fetching property IDs:', err);
      return [];
    }
  };

  // Rating Stars Component
  const RatingStars = ({ rating }: { rating: number }) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${
              star <= Math.floor(rating)
                ? 'fill-[#D4AF37] text-[#D4AF37]'
                : star - rating < 1 && star > rating
                ? 'fill-[#D4AF37] text-[#D4AF37] opacity-50'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  // Loading State
  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-200" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-24" />
                  <div className="h-3 bg-gray-200 rounded w-16 mt-1" />
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error && reviews.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 text-[#2D5A27] hover:underline"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center py-8">
          <div className="text-4xl mb-3">💬</div>
          <h3 className="text-lg font-semibold text-gray-900">No Reviews Yet</h3>
          <p className="text-sm text-gray-500 mt-1">Be the first to share your experience!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      {/* Section Header */}
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
        <p className="text-gray-500 mt-2">
          Real reviews from real users who found their dream property
        </p>
        {totalReviews > 0 && (
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-2xl font-bold text-[#2D5A27]">{averageRating.toFixed(1)}</span>
            <RatingStars rating={averageRating} />
            <span className="text-sm text-gray-500">({totalReviews} reviews)</span>
          </div>
        )}
        
        {/* Rating Distribution */}
        {ratingDistribution && ratingDistribution.length > 0 && (
          <div className="mt-4 max-w-md mx-auto">
            {ratingDistribution.map((item) => (
              <div key={item.stars} className="flex items-center gap-2 text-sm">
                <span className="w-12 text-gray-600">{item.stars} ★</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#D4AF37] rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="w-12 text-gray-500 text-xs">{item.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.slice(0, limit).map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
          >
            {/* User Info */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#E8F0E4] flex items-center justify-center text-[#2D5A27] font-bold text-sm">
                {review.reviewer?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">
                  {review.reviewer?.name || 'Anonymous User'}
                </h4>
                <div className="flex items-center gap-2">
                  <RatingStars rating={review.rating} />
                  <span className="text-[10px] text-gray-400">
                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Review Content */}
            <div className="relative">
              <Quote className="w-4 h-4 text-gray-300 absolute -top-1 -left-1" />
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 pl-4">
                {review.comment || 'No comment provided.'}
              </p>
            </div>

            {/* Property Info */}
            {review.property && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 truncate">
                    📍 {review.property.title}
                  </span>
                  <span className="text-[10px] text-[#2D5A27] font-medium">
                    ✓ Verified
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* View All Button */}
      {totalReviews > limit && (
        <div className="text-center mt-8">
          <button 
            onClick={() => window.location.href = '/reviews'}
            className="px-6 py-2.5 bg-[#2D5A27] text-white rounded-lg hover:bg-[#23461E] transition-colors text-sm font-medium"
          >
            View All {totalReviews} Reviews
          </button>
        </div>
      )}
    </section>
  );
};

export default ReviewsSection;