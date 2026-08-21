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
  X
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
}

interface AnalysisResult {
  locations: Record<string, number>;
  propertyTypes: Record<string, number>;
  purposes: Record<string, number>;
  avgPrice: number;
  avgBedrooms: number;
  avgBathrooms: number;
  minPrice: number;
  maxPrice: number;
  amenities: Record<string, number>;
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
        
        console.log('🔍 Starting recommendation engine...');
        console.log('📊 Favorites count:', favorites.length);
        
        // ✅ STEP 1: Analyze favorites to find patterns
        const analysis = analyzeFavorites(favorites);
        console.log('📊 Analysis results:', analysis);
        
        // ✅ STEP 2: Build search filters based on analysis
        const filters = buildRecommendationFilters(analysis);
        console.log('📊 Search filters:', filters);
        
        // ✅ STEP 3: Fetch properties
        let allProperties: Property[] = [];
        
        try {
          const response = await propertyApi.getAll({
            ...filters,
            limit: 50,
            sortBy: 'createdAt',
            sortOrder: 'desc'
          });
          allProperties = response.properties || [];
          console.log(`✅ Found ${allProperties.length} properties with filters`);
        } catch (err) {
          console.warn('⚠️ Filtered search failed, trying fallback...');
          const response = await propertyApi.getAll({
            limit: 50,
            sortBy: 'createdAt',
            sortOrder: 'desc'
          });
          allProperties = response.properties || [];
          console.log(`✅ Found ${allProperties.length} properties (fallback)`);
        }
        
        if (allProperties.length === 0) {
          setError('No properties found in the database. Please add some properties.');
          setLoading(false);
          return;
        }
        
        // ✅ STEP 4: Exclude favorites
        const favoriteIds = new Set(favorites.map(f => f.id));
        const favoriteTitles = new Set(favorites.map(f => f.title?.toLowerCase().trim()));
        const favoritePropertyIds = new Set(favorites.map(f => f.propertyId));
        
        const availableProperties = allProperties
          .filter(prop => !favoriteIds.has(prop.id))
          .filter(prop => !(prop.propertyId && favoritePropertyIds.has(prop.propertyId)))
          .filter(prop => {
            const title = prop.title?.toLowerCase().trim();
            return !(title && favoriteTitles.has(title));
          })
          .filter(prop => !dismissedIds.includes(prop.id));
        
        console.log(`✅ Available after exclusions: ${availableProperties.length}`);
        
        if (availableProperties.length === 0) {
          setError('No new properties available. You may have favorited everything!');
          setLoading(false);
          return;
        }
        
        // ✅ STEP 5: Calculate match scores
        const scoredProperties = availableProperties.map(prop => ({
          ...prop,
          mainImage: getMainImage(prop.mainImage, prop.images),
          images: processImagePaths(prop.images),
          isFavorited: false,
          matchScore: calculateMatchScore(prop, favorites, analysis)
        }));
        
        // ✅ STEP 6: Sort by score and take top 6
        const sorted = scoredProperties.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
        const topRecommendations = sorted.slice(0, 6);
        
        console.log('🏆 Top recommendations:', topRecommendations.map(p => ({
          title: p.title,
          match: p.matchScore
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

  // ✅ Analyze favorites to find patterns
  const analyzeFavorites = (favorites: Property[]): AnalysisResult | null => {
    if (favorites.length === 0) return null;
    
    const analysis: AnalysisResult = {
      locations: {},
      propertyTypes: {},
      purposes: {},
      avgPrice: 0,
      avgBedrooms: 0,
      avgBathrooms: 0,
      minPrice: Infinity,
      maxPrice: 0,
      amenities: {},
    };
    
    let totalPrice = 0;
    let totalBedrooms = 0;
    let totalBathrooms = 0;
    
    favorites.forEach(fav => {
      // Location patterns
      if (fav.location) {
        analysis.locations[fav.location] = (analysis.locations[fav.location] || 0) + 1;
      }
      
      // Property type patterns
      if (fav.propertyType) {
        analysis.propertyTypes[fav.propertyType] = (analysis.propertyTypes[fav.propertyType] || 0) + 1;
      }
      
      // Purpose patterns
      if (fav.purpose) {
        analysis.purposes[fav.purpose] = (analysis.purposes[fav.purpose] || 0) + 1;
      }
      
      // Price ranges
      const price = Number(fav.price);
      totalPrice += price;
      if (price < analysis.minPrice) analysis.minPrice = price;
      if (price > analysis.maxPrice) analysis.maxPrice = price;
      
      // Bedrooms
      if (fav.bedrooms) {
        totalBedrooms += fav.bedrooms;
      }
      
      // Bathrooms
      if (fav.bathrooms) {
        totalBathrooms += fav.bathrooms;
      }
      
      // Amenities
      if (fav.amenities && fav.amenities.length > 0) {
        fav.amenities.forEach(amenity => {
          analysis.amenities[amenity] = (analysis.amenities[amenity] || 0) + 1;
        });
      }
    });
    
    analysis.avgPrice = totalPrice / favorites.length;
    analysis.avgBedrooms = favorites.length > 0 ? totalBedrooms / favorites.length : 0;
    analysis.avgBathrooms = favorites.length > 0 ? totalBathrooms / favorites.length : 0;
    
    return analysis;
  };

  // ✅ Build search filters from analysis
  const buildRecommendationFilters = (analysis: AnalysisResult | null) => {
    const filters: any = {
      limit: 50,
      sortBy: 'createdAt' as const,
      sortOrder: 'desc' as const,
    };
    
    if (!analysis) return filters;
    
    // Find most common location
    const locationEntries = Object.entries(analysis.locations) as [string, number][];
    if (locationEntries.length > 0) {
      const topLocation = locationEntries.reduce((a, b) => a[1] > b[1] ? a : b);
      if (topLocation) filters.location = topLocation[0];
    }
    
    // Find most common property type
    const typeEntries = Object.entries(analysis.propertyTypes) as [string, number][];
    if (typeEntries.length > 0) {
      const topType = typeEntries.reduce((a, b) => a[1] > b[1] ? a : b);
      if (topType) filters.propertyType = topType[0];
    }
    
    // Find most common purpose
    const purposeEntries = Object.entries(analysis.purposes) as [string, number][];
    if (purposeEntries.length > 0) {
      const topPurpose = purposeEntries.reduce((a, b) => a[1] > b[1] ? a : b);
      if (topPurpose) filters.purpose = topPurpose[0];
    }
    
    // Price range (60% to 160% of average)
    if (analysis.avgPrice > 0) {
      filters.minPrice = Math.max(0, analysis.avgPrice * 0.6);
      filters.maxPrice = analysis.avgPrice * 1.6;
    }
    
    // Bedrooms (round to nearest)
    if (analysis.avgBedrooms > 0) {
      filters.bedrooms = Math.round(analysis.avgBedrooms);
    }
    
    return filters;
  };

  // ✅ Calculate match score
  const calculateMatchScore = (
    property: Property, 
    favorites: Property[], 
    analysis: AnalysisResult | null
  ): number => {
    if (!analysis || favorites.length === 0) return 50;
    
    let score = 0;
    let totalWeight = 0;
    
    // 1. Location match (25%)
    if (property.location) {
      const locationCount = analysis.locations[property.location] || 0;
      const locationValues = Object.values(analysis.locations) as number[];
      const maxLocationCount = locationValues.length > 0 ? Math.max(...locationValues) : 1;
      const locationMatch = (locationCount / maxLocationCount) * 25;
      score += locationMatch;
      totalWeight += 25;
    }
    
    // 2. Property type match (20%)
    if (property.propertyType) {
      const typeCount = analysis.propertyTypes[property.propertyType] || 0;
      const typeValues = Object.values(analysis.propertyTypes) as number[];
      const maxTypeCount = typeValues.length > 0 ? Math.max(...typeValues) : 1;
      const typeMatch = (typeCount / maxTypeCount) * 20;
      score += typeMatch;
      totalWeight += 20;
    }
    
    // 3. Price match (25%)
    if (analysis.avgPrice > 0) {
      const priceDiff = Math.abs(Number(property.price) - analysis.avgPrice);
      const priceRange = analysis.avgPrice * 0.4;
      if (priceDiff <= priceRange) {
        score += 25;
      } else if (priceDiff <= priceRange * 2) {
        score += 12;
      } else {
        score += Math.max(0, 25 - (priceDiff / priceRange) * 5);
      }
      totalWeight += 25;
    }
    
    // 4. Bedrooms match (15%)
    if (property.bedrooms && analysis.avgBedrooms > 0) {
      const diff = Math.abs(property.bedrooms - analysis.avgBedrooms);
      if (diff <= 0.5) score += 15;
      else if (diff <= 1) score += 10;
      else if (diff <= 2) score += 5;
      totalWeight += 15;
    }
    
    // 5. Purpose match (15%)
    if (property.purpose) {
      const purposeCount = analysis.purposes[property.purpose] || 0;
      const purposeValues = Object.values(analysis.purposes) as number[];
      const maxPurposeCount = purposeValues.length > 0 ? Math.max(...purposeValues) : 1;
      const purposeMatch = (purposeCount / maxPurposeCount) * 15;
      score += purposeMatch;
      totalWeight += 15;
    }
    
    return totalWeight > 0 ? Math.round((score / totalWeight) * 100) : 50;
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
          <h3 className="text-xl font-serif font-bold text-[#0F172A]">You May Also Like</h3>
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
            <h3 className="text-xl font-serif font-bold text-[#0F172A]">You May Also Like</h3>
            <p className="text-sm text-[#475569]">Based on your saved properties</p>
          </div>
        </div>
        <div className="text-center py-8">
          <div className="text-5xl mb-4">❤️</div>
          <p className="text-[#475569]">Save some properties to get personalized recommendations!</p>
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
            <h3 className="text-xl font-serif font-bold text-[#0F172A]">You May Also Like</h3>
            <p className="text-sm text-[#475569]">Based on your saved properties</p>
          </div>
        </div>
        <div className="text-center py-8">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-[#475569]">No new recommendations available right now.</p>
          <p className="text-sm text-[#475569] mt-1">Try saving more properties or check back later!</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 text-sm text-[#2D5A27] hover:underline flex items-center gap-1 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Recommendations
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
              You May Also Like
            </h3>
            <p className="text-sm text-[#475569] flex items-center gap-1">
              <span>Based on your {favorites.length} saved {favorites.length === 1 ? 'property' : 'properties'}</span>
              <span className="text-xs bg-[#2D5A27]/10 text-[#2D5A27] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ml-2">
                <Zap className="w-3 h-3" />
                AI Smart Match
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
        {recommendations.slice(0, 3).map((property, index) => (
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
                  <div className="absolute bottom-3 right-3 bg-[#2D5A27]/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-lg">
                    <Star className="w-3 h-3 fill-white" />
                    {property.matchScore || 0}% Match
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
        ))}
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
    </div>
  );
};

export default RecommendedProperties;