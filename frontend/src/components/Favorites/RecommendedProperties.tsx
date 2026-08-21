// src/components/Favorites/RecommendedProperties.tsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ChevronRight,
  Eye,
  Star,
  Zap,
  Heart,
  MapPin,
  RefreshCw,
  X,
  TrendingUp,
  CheckCircle
} from 'lucide-react';
import { propertyApi } from '../../services/api/property';
import { getMainImage, processImagePaths } from '../../utils/imageUtils';
import type { Property, PropertyType, PropertyPurpose } from '../../types/property';

interface RecommendedPropertiesProps {
  favorites: Property[];
  onFavoriteToggle?: (id: string, favorited: boolean) => void;
}

interface RecommendedProperty extends Property {
  matchScore?: number;
  matchDetails?: {
    location: number;
    price: number;
    type: number;
    bedrooms: number;
    bathrooms: number;
    parking: number;
    amenities: number;
    purpose: number;
  };
}

const RecommendedProperties: React.FC<RecommendedPropertiesProps> = ({ 
  favorites, 
  onFavoriteToggle 
}) => {
  const [recommendations, setRecommendations] = useState<RecommendedProperty[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  useEffect(() => {
    if (favorites.length === 0) {
      setRecommendations([]);
      setError(null);
      return;
    }

    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 Starting AI Recommendation Engine...');
        console.log('📊 Analyzing', favorites.length, 'favorites...');
        
        // ✅ STEP 1: Extract user preferences from favorites
        const preferences = extractUserPreferences(favorites);
        console.log('📊 User Preferences:', preferences);
        
        // ✅ STEP 2: Build search filters based on preferences
        const filters = buildSearchFilters(preferences);
        console.log('📊 Search Filters:', filters);
        
        // ✅ STEP 3: Fetch properties matching preferences
        let allProperties: Property[] = [];
        
        try {
          const response = await propertyApi.getAll({
            ...filters,
            limit: 50,
            sortBy: 'createdAt',
            sortOrder: 'desc'
          });
          allProperties = response.properties || [];
          console.log(`✅ Found ${allProperties.length} properties matching preferences`);
        } catch (err) {
          console.warn('⚠️ Filtered search failed, trying all properties...');
          const response = await propertyApi.getAll({
            limit: 50,
            sortBy: 'createdAt',
            sortOrder: 'desc'
          });
          allProperties = response.properties || [];
          console.log(`✅ Found ${allProperties.length} total properties`);
        }
        
        if (allProperties.length === 0) {
          setError('No properties found in the database. Please add some properties.');
          setLoading(false);
          return;
        }
        
        // ✅ STEP 4: Exclude already favorited properties
        const favoriteIds = new Set(favorites.map(f => f.id));
        const favoriteTitles = new Set(favorites.map(f => f.title?.toLowerCase().trim()));
        
        const availableProperties = allProperties
          .filter(prop => !favoriteIds.has(prop.id))
          .filter(prop => {
            const title = prop.title?.toLowerCase().trim();
            return !(title && favoriteTitles.has(title));
          })
          .filter(prop => !dismissedIds.includes(prop.id));
        
        console.log(`✅ Available after excluding favorites: ${availableProperties.length}`);
        
        if (availableProperties.length === 0) {
          setError('No new properties available. You may have favorited everything!');
          setLoading(false);
          return;
        }
        
        // ✅ STEP 5: Calculate detailed match scores
        const scoredProperties = availableProperties.map(prop => {
          const matchDetails = calculateMatchDetails(prop, favorites, preferences);
          const overallScore = calculateOverallScore(matchDetails);
          
          return {
            ...prop,
            mainImage: getMainImage(prop.mainImage, prop.images),
            images: processImagePaths(prop.images),
            isFavorited: false,
            matchScore: overallScore,
            matchDetails: matchDetails
          };
        });
        
        // ✅ STEP 6: Sort by match score (highest first)
        const sorted = scoredProperties.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
        
        // ✅ STEP 7: Take top 6 recommendations
        const topRecommendations = sorted.slice(0, 6);
        
        console.log('🏆 Top Recommendations:', topRecommendations.map(p => ({
          title: p.title,
          location: p.location,
          price: p.price,
          match: p.matchScore,
          details: p.matchDetails
        })));
        
        setRecommendations(topRecommendations);
      } catch (err) {
        console.error('❌ Error in recommendation engine:', err);
        setError('Failed to load recommendations. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [favorites, dismissedIds]);

  // ✅ Extract user preferences from favorites
  const extractUserPreferences = (favorites: Property[]) => {
    const preferences = {
      locations: {} as Record<string, number>,
      types: {} as Record<string, number>,
      purposes: {} as Record<string, number>,
      parking: { yes: 0, no: 0 },
      avgPrice: 0,
      avgBedrooms: 0,
      avgBathrooms: 0,
      minPrice: Infinity,
      maxPrice: 0,
      amenities: {} as Record<string, number>,
      commonAmenities: [] as string[],
    };
    
    let totalPrice = 0;
    let totalBedrooms = 0;
    let totalBathrooms = 0;
    
    favorites.forEach(fav => {
      // Location
      if (fav.location) {
        preferences.locations[fav.location] = (preferences.locations[fav.location] || 0) + 1;
      }
      
      // Property Type
      if (fav.propertyType) {
        preferences.types[fav.propertyType] = (preferences.types[fav.propertyType] || 0) + 1;
      }
      
      // Purpose
      if (fav.purpose) {
        preferences.purposes[fav.purpose] = (preferences.purposes[fav.purpose] || 0) + 1;
      }
      
      // Parking
      if (fav.parking !== undefined) {
        preferences.parking[fav.parking ? 'yes' : 'no'] = (preferences.parking[fav.parking ? 'yes' : 'no'] || 0) + 1;
      }
      
      // Price
      const price = Number(fav.price);
      totalPrice += price;
      if (price < preferences.minPrice) preferences.minPrice = price;
      if (price > preferences.maxPrice) preferences.maxPrice = price;
      
      // Bedrooms
      if (fav.bedrooms) totalBedrooms += fav.bedrooms;
      
      // Bathrooms
      if (fav.bathrooms) totalBathrooms += fav.bathrooms;
      
      // Amenities
      if (fav.amenities && fav.amenities.length > 0) {
        fav.amenities.forEach(amenity => {
          preferences.amenities[amenity] = (preferences.amenities[amenity] || 0) + 1;
        });
      }
    });
    
    // Calculate averages
    preferences.avgPrice = totalPrice / favorites.length;
    preferences.avgBedrooms = totalBedrooms / favorites.length;
    preferences.avgBathrooms = totalBathrooms / favorites.length;
    
    // Find common amenities (appearing in at least 50% of favorites)
    const minAmenityCount = favorites.length * 0.5;
    preferences.commonAmenities = Object.keys(preferences.amenities)
      .filter(key => preferences.amenities[key] >= minAmenityCount);
    
    return preferences;
  };

  // ✅ Build search filters from preferences
  const buildSearchFilters = (preferences: any) => {
    const filters: any = {
      limit: 50,
      sortBy: 'createdAt' as const,
      sortOrder: 'desc' as const,
    };
    
    // Most common location
    const topLocation = Object.keys(preferences.locations).sort(
      (a, b) => preferences.locations[b] - preferences.locations[a]
    )[0];
    if (topLocation) filters.location = topLocation;
    
    // Most common property type
    const topType = Object.keys(preferences.types).sort(
      (a, b) => preferences.types[b] - preferences.types[a]
    )[0];
    if (topType) filters.propertyType = topType;
    
    // Most common purpose
    const topPurpose = Object.keys(preferences.purposes).sort(
      (a, b) => preferences.purposes[b] - preferences.purposes[a]
    )[0];
    if (topPurpose) filters.purpose = topPurpose;
    
    // Price range: 60% to 160% of average
    if (preferences.avgPrice > 0) {
      filters.minPrice = Math.max(0, Math.round(preferences.avgPrice * 0.6));
      filters.maxPrice = Math.round(preferences.avgPrice * 1.6);
    }
    
    // Bedrooms
    if (preferences.avgBedrooms > 0) {
      filters.bedrooms = Math.round(preferences.avgBedrooms);
    }
    
    // Bathrooms
    if (preferences.avgBathrooms > 0) {
      filters.bathrooms = Math.round(preferences.avgBathrooms);
    }
    
    // Parking preference
    const parkingPreference = preferences.parking.yes > preferences.parking.no;
    if (parkingPreference) {
      filters.parking = true;
    }
    
    return filters;
  };

  // ✅ Calculate detailed match scores
  const calculateMatchDetails = (
    property: Property, 
    favorites: Property[], 
    preferences: any
  ) => {
    const details = {
      location: 0,
      price: 0,
      type: 0,
      bedrooms: 0,
      bathrooms: 0,
      parking: 0,
      amenities: 0,
      purpose: 0,
    };
    
    // 1. Location Match (25%)
    if (property.location) {
      const locationCount = preferences.locations[property.location] || 0;
      const maxLocationCount = Math.max(...Object.values(preferences.locations) as number[], 1);
      details.location = (locationCount / maxLocationCount) * 25;
    }
    
    // 2. Price Match (20%)
    if (preferences.avgPrice > 0) {
      const priceDiff = Math.abs(Number(property.price) - preferences.avgPrice);
      const priceRange = preferences.avgPrice * 0.4;
      if (priceDiff <= priceRange) {
        details.price = 20;
      } else if (priceDiff <= priceRange * 2) {
        details.price = 12;
      } else {
        details.price = Math.max(0, 20 - (priceDiff / priceRange) * 4);
      }
    }
    
    // 3. Property Type Match (15%)
    if (property.propertyType) {
      const typeCount = preferences.types[property.propertyType] || 0;
      const maxTypeCount = Math.max(...Object.values(preferences.types) as number[], 1);
      details.type = (typeCount / maxTypeCount) * 15;
    }
    
    // 4. Bedrooms Match (12%)
    if (property.bedrooms && preferences.avgBedrooms > 0) {
      const diff = Math.abs(property.bedrooms - preferences.avgBedrooms);
      if (diff <= 0.5) details.bedrooms = 12;
      else if (diff <= 1) details.bedrooms = 8;
      else if (diff <= 2) details.bedrooms = 4;
    }
    
    // 5. Bathrooms Match (10%)
    if (property.bathrooms && preferences.avgBathrooms > 0) {
      const diff = Math.abs(property.bathrooms - preferences.avgBathrooms);
      if (diff <= 0.5) details.bathrooms = 10;
      else if (diff <= 1) details.bathrooms = 6;
      else if (diff <= 2) details.bathrooms = 3;
    }
    
    // 6. Parking Match (8%)
    if (property.parking !== undefined) {
      const parkingPreference = preferences.parking.yes > preferences.parking.no;
      if (property.parking === parkingPreference) {
        details.parking = 8;
      } else {
        details.parking = 3;
      }
    }
    
    // 7. Amenities Match (5%)
    if (property.amenities && property.amenities.length > 0 && preferences.commonAmenities.length > 0) {
      const matchedAmenities = property.amenities.filter(a => 
        preferences.commonAmenities.includes(a)
      );
      const matchRatio = matchedAmenities.length / preferences.commonAmenities.length;
      details.amenities = matchRatio * 5;
    }
    
    // 8. Purpose Match (5%)
    if (property.purpose) {
      const purposeCount = preferences.purposes[property.purpose] || 0;
      const maxPurposeCount = Math.max(...Object.values(preferences.purposes) as number[], 1);
      details.purpose = (purposeCount / maxPurposeCount) * 5;
    }
    
    return details;
  };

  // ✅ Calculate overall score
  const calculateOverallScore = (details: any): number => {
    const total = 
      details.location +
      details.price +
      details.type +
      details.bedrooms +
      details.bathrooms +
      details.parking +
      details.amenities +
      details.purpose;
    
    return Math.round(total);
  };

  // ✅ Get match level
  const getMatchLevel = (score: number) => {
    if (score >= 80) return { label: 'Excellent Match', color: 'text-emerald-600', bg: 'bg-emerald-100' };
    if (score >= 60) return { label: 'Great Match', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (score >= 40) return { label: 'Good Match', color: 'text-amber-600', bg: 'bg-amber-100' };
    return { label: 'Fair Match', color: 'text-gray-600', bg: 'bg-gray-100' };
  };

  // ✅ Handle dismiss
  const handleDismiss = (propertyId: string) => {
    setDismissedIds(prev => [...prev, propertyId]);
    setRecommendations(prev => prev.filter(p => p.id !== propertyId));
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
          <div className="text-5xl mb-4">🔮</div>
          <p className="text-[#475569]">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-3 text-sm text-[#2D5A27] hover:underline flex items-center gap-1 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty State (No favorites yet)
  if (favorites.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-[#D4AF37]/10 rounded-xl">
            <Sparkles className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <div>
            <h3 className="text-xl font-serif font-bold text-[#0F172A]">AI Recommendations</h3>
            <p className="text-sm text-[#475569]">Personalized for you</p>
          </div>
        </div>
        <div className="text-center py-8">
          <div className="text-5xl mb-4">❤️</div>
          <p className="text-[#475569]">Save properties to get AI-powered recommendations!</p>
          <Link
            to="/properties"
            className="mt-4 inline-block px-6 py-2 bg-[#2D5A27] text-white rounded-lg hover:bg-[#23461E] transition-colors"
          >
            Explore Properties
          </Link>
        </div>
      </div>
    );
  }

  // Empty State (No recommendations)
  if (recommendations.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-[#D4AF37]/10 rounded-xl">
            <Sparkles className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <div>
            <h3 className="text-xl font-serif font-bold text-[#0F172A]">AI Recommendations</h3>
            <p className="text-sm text-[#475569]">Personalized for you</p>
          </div>
        </div>
        <div className="text-center py-8">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-[#475569]">No matching properties found right now.</p>
          <p className="text-sm text-[#475569] mt-1">Try saving more properties or check back later!</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 text-sm text-[#2D5A27] hover:underline flex items-center gap-1 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>
    );
  }

  // Success State
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
              <span>Based on your {favorites.length} saved {favorites.length === 1 ? 'property' : 'properties'}</span>
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
        {recommendations.slice(0, 3).map((property, index) => {
          const matchLevel = getMatchLevel(property.matchScore || 0);
          return (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className="bg-[#F8FAFC] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100">
                {/* Dismiss Button */}
                <button
                  onClick={() => handleDismiss(property.id)}
                  className="absolute top-2 right-2 z-10 p-1 bg-black/50 hover:bg-black/70 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  aria-label="Dismiss recommendation"
                >
                  <X className="w-4 h-4" />
                </button>

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
                      {property.matchScore || 0}% Match
                    </div>

                    {/* Match Level Badge */}
                    <div className={`absolute top-3 left-3 ${matchLevel.bg} px-2 py-0.5 rounded text-[10px] font-medium ${matchLevel.color}`}>
                      {matchLevel.label}
                    </div>

                    {/* Verified Badge */}
                    {property.isVerified && (
                      <div className="absolute top-12 left-3 bg-[#2D5A27] text-white px-2 py-0.5 rounded text-[10px] font-medium">
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
                      {property.parking && (
                        <span>🅿️ Parking</span>
                      )}
                    </div>

                    {/* Match Details */}
                    {property.matchDetails && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-[10px] text-[#475569]">
                          <span className="flex items-center gap-0.5">
                            <CheckCircle className="w-3 h-3 text-emerald-500" />
                            {Math.round(property.matchDetails.location)}% Loc
                          </span>
                          <span className="flex items-center gap-0.5">
                            <TrendingUp className="w-3 h-3 text-blue-500" />
                            {Math.round(property.matchDetails.price)}% Price
                          </span>
                          <span className="flex items-center gap-0.5">
                            <Star className="w-3 h-3 text-amber-500" />
                            {Math.round(property.matchDetails.type)}% Type
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Save Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleFavoriteToggle(property.id, true);
                      }}
                      className="mt-3 w-full py-1.5 text-sm font-medium border border-[#2D5A27] text-[#2D5A27] rounded-lg hover:bg-[#2D5A27] hover:text-white transition-colors duration-200 flex items-center justify-center gap-1"
                    >
                      <Heart className="w-4 h-4" />
                      Save to Favorites
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
            View all {recommendations.length} recommendations
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-[#475569]">
          <span>✨ Powered by AI</span>
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
            Smart Matching
          </span>
        </div>
      </div>
    </div>
  );
};

export default RecommendedProperties;