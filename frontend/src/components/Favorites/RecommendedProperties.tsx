// src/components/Favorites/RecommendedProperties.tsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ChevronRight,
  Loader2,
  Eye,
  Star,
  Zap,
  Heart,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { propertyApi } from '../../services/api/property';
import { getMainImage, processImagePaths } from '../../utils/imageUtils';
import type { Property, PropertyType, PropertyPurpose } from '../../types/property';

interface RecommendedPropertiesProps {
  favorites: Property[];
  onFavoriteToggle?: (id: string, favorited: boolean) => void;
}

const RecommendedProperties: React.FC<RecommendedPropertiesProps> = ({ 
  favorites, 
  onFavoriteToggle 
}) => {
  const [recommendations, setRecommendations] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get user preferences from localStorage
        const userPreferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
        
        // ✅ Build recommendation filters with proper types
        const filters = buildRecommendationFilters(favorites, userPreferences);
        
        // ✅ Fetch properties based on filters
        const response = await propertyApi.getAll({
          ...filters,
          limit: 6,
          sortBy: 'createdAt',
          sortOrder: 'desc'
        });
        
        // Process properties
        const processed = response.properties.map((prop: Property) => ({
          ...prop,
          mainImage: getMainImage(prop.mainImage, prop.images),
          images: processImagePaths(prop.images),
          isFavorited: favorites.some(f => f.id === prop.id)
        }));
        
        // ✅ Sort by match score (AI recommendation)
        const sorted = processed.sort((a, b) => {
          const scoreA = calculateMatchScore(a, favorites, userPreferences);
          const scoreB = calculateMatchScore(b, favorites, userPreferences);
          return scoreB - scoreA;
        });
        
        // ✅ Take top 6 recommendations
        setRecommendations(sorted.slice(0, 6));
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError('Failed to load recommendations');
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    if (favorites.length > 0) {
      fetchRecommendations();
    } else {
      setLoading(false);
      setRecommendations([]);
    }
  }, [favorites]);

  // ✅ Build recommendation filters with proper types
  const buildRecommendationFilters = (favorites: Property[], preferences: any) => {
    if (favorites.length === 0) return {};

    // Analyze favorite properties
    const locations = favorites.map(f => f.location).filter(Boolean);
    const propertyTypes = favorites.map(f => f.propertyType).filter(Boolean);
    const purposes = favorites.map(f => f.purpose).filter(Boolean);
    const avgPrice = favorites.reduce((sum, f) => sum + Number(f.price), 0) / favorites.length;
    const avgBedrooms = favorites.reduce((sum, f) => sum + (f.bedrooms || 0), 0) / favorites.length;
    const avgBathrooms = favorites.reduce((sum, f) => sum + (f.bathrooms || 0), 0) / favorites.length;

    // Get most common location
    const locationCounts: Record<string, number> = {};
    locations.forEach(loc => {
      if (loc) locationCounts[loc] = (locationCounts[loc] || 0) + 1;
    });
    const mostCommonLocation = Object.keys(locationCounts).sort((a, b) => 
      locationCounts[b] - locationCounts[a]
    )[0];

    // ✅ Get most common property type with proper typing
    const typeCounts: Record<string, number> = {};
    propertyTypes.forEach(type => {
      if (type) typeCounts[type] = (typeCounts[type] || 0) + 1;
    });
    const mostCommonType = Object.keys(typeCounts).sort((a, b) => 
      typeCounts[b] - typeCounts[a]
    )[0] as PropertyType | undefined;

    // ✅ Get most common purpose with proper typing
    const purposeCounts: Record<string, number> = {};
    purposes.forEach(purpose => {
      if (purpose) purposeCounts[purpose] = (purposeCounts[purpose] || 0) + 1;
    });
    const mostCommonPurpose = Object.keys(purposeCounts).sort((a, b) => 
      purposeCounts[b] - purposeCounts[a]
    )[0] as PropertyPurpose | undefined;

    // ✅ Return properly typed filters
    const filters: any = {
      limit: 12,
      sortBy: 'createdAt' as const,
      sortOrder: 'desc' as const,
    };

    if (mostCommonLocation) {
      filters.location = mostCommonLocation;
    }

    if (mostCommonType) {
      filters.propertyType = mostCommonType;
    }

    if (mostCommonPurpose) {
      filters.purpose = mostCommonPurpose;
    }

    if (avgPrice > 0) {
      filters.minPrice = Math.max(0, avgPrice * 0.5);
      filters.maxPrice = avgPrice * 1.5;
    }

    if (avgBedrooms > 0) {
      filters.bedrooms = Math.round(avgBedrooms);
    }

    if (avgBathrooms > 0) {
      filters.bathrooms = Math.round(avgBathrooms);
    }

    return filters;
  };

  // ✅ Calculate AI match score
  const calculateMatchScore = (property: Property, favorites: Property[], preferences: any): number => {
    let score = 0;
    let totalWeight = 0;

    // Location match (30% weight)
    if (property.location && favorites.some(f => f.location === property.location)) {
      score += 30;
    }
    totalWeight += 30;

    // Property type match (25% weight)
    if (property.propertyType && favorites.some(f => f.propertyType === property.propertyType)) {
      score += 25;
    }
    totalWeight += 25;

    // Price range match (20% weight)
    if (favorites.length > 0) {
      const avgPrice = favorites.reduce((sum, f) => sum + Number(f.price), 0) / favorites.length;
      const priceRange = avgPrice * 0.3;
      if (Math.abs(Number(property.price) - avgPrice) <= priceRange) {
        score += 20;
      }
    }
    totalWeight += 20;

    // Bedrooms match (15% weight)
    if (favorites.length > 0) {
      const avgBedrooms = favorites.reduce((sum, f) => sum + (f.bedrooms || 0), 0) / favorites.length;
      if (property.bedrooms && Math.abs(property.bedrooms - avgBedrooms) <= 1) {
        score += 15;
      }
    }
    totalWeight += 15;

    // Purpose match (10% weight)
    if (property.purpose && favorites.some(f => f.purpose === property.purpose)) {
      score += 10;
    }
    totalWeight += 10;

    return totalWeight > 0 ? (score / totalWeight) * 100 : 0;
  };

  // ✅ Handle favorite toggle
  const handleFavoriteToggle = (propertyId: string, favorited: boolean) => {
    setRecommendations(prev => 
      prev.map(p => 
        p.id === propertyId 
          ? { ...p, isFavorited: favorited }
          : p
      )
    );
    
    if (onFavoriteToggle) {
      onFavoriteToggle(propertyId, favorited);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#D4AF37]/10 rounded-xl animate-pulse">
              <Sparkles className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <div>
              <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-32 mt-1 animate-pulse" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(n => (
            <div key={n} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-xl" />
              <div className="mt-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-6 h-6 text-[#D4AF37]" />
          <h3 className="text-xl font-serif font-bold text-[#0F172A]">AI Recommendations</h3>
        </div>
        <div className="text-center py-8">
          <p className="text-[#475569]">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 text-sm text-[#2D5A27] hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // Empty State
  if (recommendations.length === 0 || favorites.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-[#D4AF37]/10 rounded-xl">
            <Sparkles className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <div>
            <h3 className="text-xl font-serif font-bold text-[#0F172A]">AI Recommendations</h3>
            <p className="text-sm text-[#475569]">Based on your saved properties</p>
          </div>
        </div>
        <div className="text-center py-8">
          <div className="text-5xl mb-4">🤖</div>
          <p className="text-[#475569]">
            {favorites.length === 0 
              ? 'Save some properties to get personalized recommendations!' 
              : 'No recommendations available yet. Check back soon!'}
          </p>
        </div>
      </div>
    );
  }

  // Success State - Show top 3 recommendations
  const topRecommendations = recommendations.slice(0, 3);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#D4AF37]/10 rounded-xl">
            <Sparkles className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <div>
            <h3 className="text-xl font-serif font-bold text-[#0F172A]">
              AI Recommendations
            </h3>
            <p className="text-sm text-[#475569] flex items-center gap-1">
              <span>Based on your preferences</span>
              <span className="text-xs bg-[#2D5A27]/10 text-[#2D5A27] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ml-2">
                <Zap className="w-3 h-3" />
                Smart Match
              </span>
            </p>
          </div>
        </div>
        
        <Link 
          to="/properties?recommended=true" 
          className="text-sm text-[#2D5A27] hover:underline flex items-center gap-1 font-medium"
        >
          View All
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topRecommendations.map((property, index) => {
          const matchScore = calculateMatchScore(property, favorites, {});
          return (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className="bg-[#F8FAFC] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100">
                <Link to={`/property/${property.id}`} className="block">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={getMainImage(property.mainImage, property.images)}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-property.jpg';
                      }}
                    />
                    
                    {/* Match Score Badge */}
                    <div className="absolute top-3 right-3 bg-[#2D5A27]/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-lg">
                      <Star className="w-3 h-3 fill-white" />
                      {Math.round(matchScore)}% Match
                    </div>

                    {/* Verified Badge */}
                    {property.isVerified && (
                      <div className="absolute top-3 left-3 bg-[#2D5A27] text-white px-2 py-0.5 rounded text-[10px] font-medium">
                        ✓ Verified
                      </div>
                    )}

                    {/* Featured Badge */}
                    {property.isFeatured && (
                      <div className="absolute top-12 left-3 bg-[#D4AF37] text-white px-2 py-0.5 rounded text-[10px] font-medium">
                        ⭐ Featured
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h4 className="font-semibold text-[#0F172A] truncate">
                      {property.title}
                    </h4>
                    <p className="text-sm text-[#475569] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {property.location}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-lg font-bold text-[#2D5A27]">
                        ₹{Number(property.price).toLocaleString()}
                        {Number(property.price) >= 10000000 && ' Cr'}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-[#475569]">
                        <Eye className="w-3 h-3" />
                        {property.views || 0}
                      </div>
                    </div>
                    
                    {/* Property Details */}
                    <div className="flex items-center gap-3 mt-2 text-xs text-[#475569]">
                      {property.bedrooms && (
                        <span>🛏️ {property.bedrooms}</span>
                      )}
                      {property.bathrooms && (
                        <span>🛁 {property.bathrooms}</span>
                      )}
                      {property.area && property.areaUnit && (
                        <span>📐 {property.area} {property.areaUnit}</span>
                      )}
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleFavoriteToggle(property.id, !property.isFavorited);
                      }}
                      className="mt-3 w-full py-1.5 text-sm font-medium border border-[#2D5A27] text-[#2D5A27] rounded-lg hover:bg-[#2D5A27] hover:text-white transition-colors duration-200"
                    >
                      {property.isFavorited ? '❤️ Saved' : '🤍 Save Property'}
                    </button>
                  </div>
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* View More Link */}
      {recommendations.length > 3 && (
        <div className="text-center mt-4">
          <Link
            to="/properties?recommended=true"
            className="inline-flex items-center gap-2 text-sm text-[#2D5A27] font-medium hover:underline"
          >
            View all {recommendations.length} AI recommendations
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default RecommendedProperties;