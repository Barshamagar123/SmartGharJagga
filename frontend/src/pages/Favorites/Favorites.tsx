// src/pages/Favorites/Favorites.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Loader2, 
  ArrowLeft, 
  Share2, 
  Grid3X3, 
  List, 
  ChevronDown,
  Eye,
  TrendingUp,
  Calendar,
  Trash2,
  AlertCircle,
  Search,
  Sparkles,
  Bell,
  X,
  Zap,
  Star,
  MapPin
} from 'lucide-react';
import { propertyApi } from '../../services/api/property';
import { getMainImage, processImagePaths } from '../../utils/imageUtils';
import type { Property, PropertyType, PropertyPurpose } from '../../types/property';
import PropertyCard from '../../components/properties/PropertyCard';

// ============================================
// EXTENDED PROPERTY TYPE WITH MATCH SCORE
// ============================================

interface RecommendedProperty extends Property {
  matchScore?: number;
}

// ============================================
// MAIN COMPONENT
// ============================================

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'recent' | 'price_low' | 'price_high' | 'views'>('recent');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showRemoveAll, setShowRemoveAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [recommendations, setRecommendations] = useState<RecommendedProperty[]>([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    totalValue: 0,
    totalViews: 0,
    newThisWeek: 0
  });

  // Load notification count
  useEffect(() => {
    const savedCount = parseInt(localStorage.getItem('favoriteNotifications') || '0');
    setNotificationCount(savedCount);
  }, []);

  // Listen for favorite toggle events
  useEffect(() => {
    const handleFavoriteToggle = (event: CustomEvent) => {
      const { count, propertyId, action } = event.detail;
      setNotificationCount(count);
      
      if (action === 'added') {
        showNotificationToast(`❤️ Property added to favorites! (${count} total)`);
      }
    };

    window.addEventListener('favoriteToggled', handleFavoriteToggle as EventListener);
    
    return () => {
      window.removeEventListener('favoriteToggled', handleFavoriteToggle as EventListener);
    };
  }, []);

  const showNotificationToast = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const resetNotifications = () => {
    setNotificationCount(0);
    localStorage.setItem('favoriteNotifications', '0');
  };

  // ✅ Build comprehensive exclusion list
  const buildExclusionList = (favoritesList: Property[]) => {
    const exclude = {
      ids: new Set<string>(),
      propertyIds: new Set<string>(),
      titles: new Set<string>(),
      locationPrice: new Map<string, number>(),
    };

    favoritesList.forEach(fav => {
      if (fav.id) exclude.ids.add(fav.id);
      if (fav.propertyId) exclude.propertyIds.add(fav.propertyId);
      if (fav.title) {
        exclude.titles.add(fav.title.toLowerCase().trim());
      }
      if (fav.location && fav.price) {
        const key = fav.location.toLowerCase().trim();
        exclude.locationPrice.set(key, Number(fav.price));
      }
    });

    return exclude;
  };

  // ✅ Check if property should be excluded
  const shouldExcludeProperty = (property: Property, exclude: any, favoritesList: Property[]) => {
    // 1. Check by ID
    if (exclude.ids.has(property.id)) {
      return true;
    }

    // 2. Check by propertyId
    if (property.propertyId && exclude.propertyIds.has(property.propertyId)) {
      return true;
    }

    // 3. Check by title
    if (property.title) {
      const normalizedTitle = property.title.toLowerCase().trim();
      if (exclude.titles.has(normalizedTitle)) {
        return true;
      }
    }

    // 4. Check by location + price
    if (property.location && property.price) {
      const key = property.location.toLowerCase().trim();
      const favPrice = exclude.locationPrice.get(key);
      if (favPrice) {
        const priceDiff = Math.abs(Number(property.price) - favPrice);
        const threshold = favPrice * 0.1;
        if (priceDiff <= threshold) {
          return true;
        }
      }
    }

    // 5. Check by similarity
    const hasSimilar = favoritesList.some(fav => {
      const sameLocation = fav.location?.toLowerCase().trim() === property.location?.toLowerCase().trim();
      const priceDiff = Math.abs(Number(fav.price) - Number(property.price));
      const threshold = Number(fav.price) * 0.1;
      const similarPrice = priceDiff <= threshold;
      const sameType = fav.propertyType === property.propertyType;
      const sameBedrooms = fav.bedrooms === property.bedrooms;
      
      return sameLocation && similarPrice && sameType && sameBedrooms;
    });

    if (hasSimilar) {
      return true;
    }

    return false;
  };

  // Fetch favorites
  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await propertyApi.getFavorites();
      
      if (Array.isArray(data)) {
        const processed = data.map(prop => ({
          ...prop,
          mainImage: getMainImage(prop.mainImage, prop.images),
          images: processImagePaths(prop.images),
          isFavorited: true
        }));
        
        setFavorites(processed);
        
        const totalValue = processed.reduce((sum, p) => sum + Number(p.price), 0);
        const totalViews = processed.reduce((sum, p) => sum + (p.views || 0), 0);
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const newThisWeek = processed.filter(p => 
          p.createdAt && new Date(p.createdAt) > weekAgo
        ).length;
        
        setStats({
          total: processed.length,
          totalValue,
          totalViews,
          newThisWeek
        });
        
        resetNotifications();
        
        if (processed.length > 0) {
          fetchRecommendations(processed);
        }
      } else {
        setError('Invalid response format');
        setFavorites([]);
      }
    } catch (err: any) {
      console.error('Error fetching favorites:', err);
      setError(err.response?.data?.message || 'Failed to load favorites');
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Fetch AI Recommendations with proper exclusion
  const fetchRecommendations = async (favoritesList: Property[]) => {
    try {
      setRecommendationsLoading(true);
      
      // Build exclusion list
      const exclude = buildExclusionList(favoritesList);
      
      // Build filters
      const filters = buildRecommendationFilters(favoritesList);
      
      // Fetch properties
      const response = await propertyApi.getAll({
        ...filters,
        limit: 30,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      
      // Process and filter properties
      const processed = response.properties
        .map((prop: Property) => ({
          ...prop,
          mainImage: getMainImage(prop.mainImage, prop.images),
          images: processImagePaths(prop.images),
          isFavorited: false
        }))
        // ✅ Apply multi-level exclusion
        .filter(prop => !shouldExcludeProperty(prop, exclude, favoritesList))
        .filter(prop => !dismissedIds.includes(prop.id));
      
      // If not enough properties, try broader search
      let finalProperties = processed;
      
      if (finalProperties.length < 3) {
        const broaderFilters = buildBroaderFilters(favoritesList);
        const broaderResponse = await propertyApi.getAll({
          ...broaderFilters,
          limit: 30,
          sortBy: 'createdAt',
          sortOrder: 'desc'
        });
        
        finalProperties = broaderResponse.properties
          .map((prop: Property) => ({
            ...prop,
            mainImage: getMainImage(prop.mainImage, prop.images),
            images: processImagePaths(prop.images),
            isFavorited: false
          }))
          .filter(prop => !shouldExcludeProperty(prop, exclude, favoritesList))
          .filter(prop => !dismissedIds.includes(prop.id));
      }
      
      // ✅ Calculate match scores and add to properties
      const sorted = finalProperties.map(prop => ({
        ...prop,
        matchScore: calculateMatchScore(prop, favoritesList)
      })).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
      
      // Take top 4
      setRecommendations(sorted.slice(0, 4));
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    } finally {
      setRecommendationsLoading(false);
    }
  };

  // ✅ Build recommendation filters
  const buildRecommendationFilters = (favoritesList: Property[]) => {
    if (favoritesList.length === 0) return {};

    const locationCounts: Record<string, number> = {};
    const typeCounts: Record<string, number> = {};
    const purposeCounts: Record<string, number> = {};
    
    let totalPrice = 0;
    let totalBedrooms = 0;
    let totalBathrooms = 0;
    
    favoritesList.forEach(f => {
      if (f.location) locationCounts[f.location] = (locationCounts[f.location] || 0) + 1;
      if (f.propertyType) typeCounts[f.propertyType] = (typeCounts[f.propertyType] || 0) + 1;
      if (f.purpose) purposeCounts[f.purpose] = (purposeCounts[f.purpose] || 0) + 1;
      totalPrice += Number(f.price);
      totalBedrooms += (f.bedrooms || 0);
      totalBathrooms += (f.bathrooms || 0);
    });
    
    const avgPrice = totalPrice / favoritesList.length;
    const avgBedrooms = Math.round(totalBedrooms / favoritesList.length);
    const avgBathrooms = Math.round(totalBathrooms / favoritesList.length);
    
    const mostCommonLocation = Object.keys(locationCounts).sort((a, b) => 
      locationCounts[b] - locationCounts[a]
    )[0];
    
    const mostCommonType = Object.keys(typeCounts).sort((a, b) => 
      typeCounts[b] - typeCounts[a]
    )[0] as PropertyType | undefined;
    
    const mostCommonPurpose = Object.keys(purposeCounts).sort((a, b) => 
      purposeCounts[b] - purposeCounts[a]
    )[0] as PropertyPurpose | undefined;

    const filters: any = {
      limit: 30,
      sortBy: 'createdAt' as const,
      sortOrder: 'desc' as const,
    };

    if (mostCommonLocation) filters.location = mostCommonLocation;
    if (mostCommonType) filters.propertyType = mostCommonType;
    if (mostCommonPurpose) filters.purpose = mostCommonPurpose;
    
    if (avgPrice > 0) {
      filters.minPrice = Math.max(0, avgPrice * 0.5);
      filters.maxPrice = avgPrice * 1.5;
    }
    
    if (avgBedrooms > 0) filters.bedrooms = avgBedrooms;
    if (avgBathrooms > 0) filters.bathrooms = avgBathrooms;

    return filters;
  };

  // ✅ Build broader filters
  const buildBroaderFilters = (favoritesList: Property[]) => {
    const filters = buildRecommendationFilters(favoritesList);
    
    if (filters.minPrice) filters.minPrice = Math.max(0, filters.minPrice * 0.5);
    if (filters.maxPrice) filters.maxPrice = filters.maxPrice * 2;
    delete filters.bedrooms;
    delete filters.bathrooms;
    
    return filters;
  };

  // ✅ Calculate AI match score
  const calculateMatchScore = (property: Property, favoritesList: Property[]): number => {
    if (favoritesList.length === 0) return 0;
    
    let score = 0;
    let totalWeight = 0;

    // Location match (25%)
    if (property.location && favoritesList.some(f => f.location === property.location)) {
      score += 25;
    } else if (property.location && favoritesList.some(f => f.location?.includes(property.location?.split(' ')[0] || ''))) {
      score += 12;
    }
    totalWeight += 25;

    // Property type match (20%)
    if (property.propertyType && favoritesList.some(f => f.propertyType === property.propertyType)) {
      score += 20;
    }
    totalWeight += 20;

    // Price range match (25%)
    const avgPrice = favoritesList.reduce((sum, f) => sum + Number(f.price), 0) / favoritesList.length;
    const priceRange = avgPrice * 0.4;
    if (Math.abs(Number(property.price) - avgPrice) <= priceRange) {
      score += 25;
    } else if (Math.abs(Number(property.price) - avgPrice) <= priceRange * 2) {
      score += 12;
    }
    totalWeight += 25;

    // Bedrooms match (15%)
    const avgBedrooms = favoritesList.reduce((sum, f) => sum + (f.bedrooms || 0), 0) / favoritesList.length;
    if (property.bedrooms && Math.abs(property.bedrooms - avgBedrooms) <= 1) {
      score += 15;
    } else if (property.bedrooms && Math.abs(property.bedrooms - avgBedrooms) <= 2) {
      score += 8;
    }
    totalWeight += 15;

    // Purpose match (15%)
    if (property.purpose && favoritesList.some(f => f.purpose === property.purpose)) {
      score += 15;
    }
    totalWeight += 15;

    return totalWeight > 0 ? Math.round((score / totalWeight) * 100) : 0;
  };

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // Sort and filter favorites
  const getFilteredAndSortedFavorites = () => {
    let filtered = [...favorites];
    
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(term) ||
        p.location.toLowerCase().includes(term) ||
        p.propertyType?.toLowerCase().includes(term)
      );
    }
    
    switch (sortBy) {
      case 'price_low':
        return filtered.sort((a, b) => Number(a.price) - Number(b.price));
      case 'price_high':
        return filtered.sort((a, b) => Number(b.price) - Number(a.price));
      case 'views':
        return filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
      case 'recent':
      default:
        return filtered.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  };

  const handleFavoriteToggle = (propertyId: string, favorited: boolean) => {
    if (!favorited) {
      setFavorites(prev => prev.filter(p => p.id !== propertyId));
      setSelectedIds(prev => prev.filter(id => id !== propertyId));
      
      const currentCount = parseInt(localStorage.getItem('favoriteNotifications') || '0');
      const newCount = Math.max(0, currentCount - 1);
      setNotificationCount(newCount);
      localStorage.setItem('favoriteNotifications', String(newCount));
    }
  };

  // ✅ Handle dismiss recommendation
  const handleDismissRecommendation = (propertyId: string) => {
    setDismissedIds(prev => [...prev, propertyId]);
    setRecommendations(prev => prev.filter(p => p.id !== propertyId));
  };

  const handleRemoveAll = async () => {
    try {
      setLoading(true);
      for (const property of favorites) {
        await propertyApi.toggleFavorite(property.id);
      }
      setFavorites([]);
      setSelectedIds([]);
      setShowRemoveAll(false);
      setNotificationCount(0);
      localStorage.setItem('favoriteNotifications', '0');
    } catch (error) {
      console.error('Error removing all:', error);
      alert('Failed to remove all favorites. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSelected = async () => {
    try {
      setLoading(true);
      for (const id of selectedIds) {
        await propertyApi.toggleFavorite(id);
      }
      setFavorites(prev => prev.filter(p => !selectedIds.includes(p.id)));
      setSelectedIds([]);
      
      const currentCount = parseInt(localStorage.getItem('favoriteNotifications') || '0');
      const newCount = Math.max(0, currentCount - selectedIds.length);
      setNotificationCount(newCount);
      localStorage.setItem('favoriteNotifications', String(newCount));
    } catch (error) {
      console.error('Error removing selected:', error);
      alert('Failed to remove selected favorites. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === favorites.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(favorites.map(p => p.id));
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    }
    return `₹${price.toLocaleString()}`;
  };

  const sortedFavorites = getFilteredAndSortedFavorites();

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <FavoritesHeaderSkeleton />
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <div key={n} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                    <div className="h-48 bg-gray-200" />
                    <div className="p-4 space-y-3">
                      <div className="h-5 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                      <div className="h-6 bg-gray-200 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
                {[1, 2, 3, 4].map(n => (
                  <div key={n} className="flex gap-3 mb-3">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-8 pt-20 md:pt-24 pb-8">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-2xl mx-auto">
            <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h3 className="text-2xl font-serif font-bold text-red-800">Oops! Something went wrong</h3>
            <p className="text-red-600 mt-2">{error}</p>
            <button
              onClick={fetchFavorites}
              className="mt-6 px-8 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty State
  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <FavoritesHeader 
          totalFavorites={0} 
          notificationCount={notificationCount}
          onShare={() => {
            navigator.clipboard?.writeText(window.location.href);
            showNotificationToast('✨ Wishlist link copied to clipboard!');
          }}
        />
        <div className="max-w-7xl mx-auto px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, -5, 5, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-8xl mb-6"
            >
              🏠
            </motion.div>
            <h2 className="text-4xl font-serif font-bold text-[#0F172A]">
              Your wishlist is waiting...
            </h2>
            <p className="text-[#475569] text-lg mt-3 max-w-md mx-auto">
              Start exploring properties and save your favorites to find your dream home.
            </p>
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 mt-8 px-8 py-3 bg-[#2D5A27] text-white rounded-xl hover:bg-[#23461E] transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Search className="w-5 h-5" />
              Explore Properties
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  // Success State
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Notification Toast */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 right-4 z-50 bg-[#2D5A27] text-white px-6 py-4 rounded-xl shadow-2xl max-w-sm flex items-center gap-3"
          >
            <Heart className="w-5 h-5 fill-red-500 text-red-500" />
            <span className="font-medium">{notificationMessage}</span>
            <button
              onClick={() => setShowNotification(false)}
              className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <FavoritesHeader 
        totalFavorites={favorites.length}
        notificationCount={notificationCount}
        onShare={() => {
          navigator.clipboard?.writeText(window.location.href);
          showNotificationToast('✨ Wishlist link copied to clipboard!');
        }}
        onResetNotifications={resetNotifications}
      />

      {/* Stats Bar */}
      <FavoritesStats stats={stats} formatPrice={formatPrice} />

      {/* Main Content - Two Column Layout */}
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* LEFT COLUMN - Favorites (3/4 width) */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <FavoritesToolbar
              viewMode={viewMode}
              setViewMode={setViewMode}
              sortBy={sortBy}
              setSortBy={setSortBy}
              selectedCount={selectedIds.length}
              onRemoveSelected={handleRemoveSelected}
              onRemoveAll={() => setShowRemoveAll(true)}
              totalCount={favorites.length}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onToggleSelectAll={toggleSelectAll}
              isAllSelected={selectedIds.length === favorites.length && favorites.length > 0}
              notificationCount={notificationCount}
            />

            {/* Results Count */}
            <div className="pb-2">
              <p className="text-sm text-[#475569]">
                Showing {sortedFavorites.length} of {favorites.length} saved properties
                {searchTerm && ` matching "${searchTerm}"`}
                {notificationCount > 0 && (
                  <span className="ml-3 text-[#2D5A27] font-medium">
                    🎯 {notificationCount} new {notificationCount === 1 ? 'property' : 'properties'} added!
                  </span>
                )}
              </p>
            </div>

            {/* Favorites Grid */}
            <AnimatePresence mode="wait">
              {sortedFavorites.length === 0 ? (
                <motion.div
                  key="no-results"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center py-16"
                >
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-[#0F172A]">No matching favorites</h3>
                  <p className="text-[#475569]">Try adjusting your search or filters</p>
                </motion.div>
              ) : viewMode === 'grid' ? (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
                >
                  {sortedFavorites.map((property, index) => (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04 }}
                    >
                      <PropertyCard
                        id={property.id}
                        title={property.title}
                        price={property.price}
                        location={property.location}
                        area={property.area}
                        areaUnit={property.areaUnit}
                        mainImage={property.mainImage}
                        images={property.images}
                        isFeatured={property.isFeatured}
                        isVerified={property.isVerified}
                        views={property.views}
                        favoritesCount={property.favoritesCount}
                        propertyType={property.propertyType}
                        isFavorited={true}
                        onFavoriteToggle={handleFavoriteToggle}
                        variant="default"
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  {sortedFavorites.map((property, index) => (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04 }}
                    >
                      <PropertyCard
                        id={property.id}
                        title={property.title}
                        price={property.price}
                        location={property.location}
                        area={property.area}
                        areaUnit={property.areaUnit}
                        mainImage={property.mainImage}
                        images={property.images}
                        isFeatured={property.isFeatured}
                        isVerified={property.isVerified}
                        views={property.views}
                        favoritesCount={property.favoritesCount}
                        propertyType={property.propertyType}
                        isFavorited={true}
                        onFavoriteToggle={handleFavoriteToggle}
                        variant="horizontal"
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT COLUMN - AI Recommendations (1/4 width) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <AIRecommendationsSidebar
                recommendations={recommendations}
                loading={recommendationsLoading}
                favorites={favorites}
                onFavoriteToggle={handleFavoriteToggle}
                onDismiss={handleDismissRecommendation}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Remove All Confirmation Modal */}
      <AnimatePresence>
        {showRemoveAll && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5 }}
                  className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Trash2 className="w-8 h-8 text-red-600" />
                </motion.div>
                <h3 className="text-2xl font-serif font-bold text-[#0F172A]">Remove All Favorites?</h3>
                <p className="text-[#475569] mt-2">
                  This will remove all {favorites.length} properties from your wishlist. 
                  This action cannot be undone.
                </p>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowRemoveAll(false)}
                    className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRemoveAll}
                    className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium shadow-lg hover:shadow-xl"
                  >
                    Remove All
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Favorites;

// ============================================
// FAVORITES HEADER COMPONENT
// ============================================

interface FavoritesHeaderProps {
  totalFavorites: number;
  notificationCount?: number;
  onShare?: () => void;
  onResetNotifications?: () => void;
}

const FavoritesHeader: React.FC<FavoritesHeaderProps> = ({ 
  totalFavorites,
  notificationCount = 0,
  onShare,
  onResetNotifications
}) => {
  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-8 pt-10 md:pt-14 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#0F172A] tracking-tight">
              My <span className="text-[#2D5A27]">Favorites</span>
            </h1>
            
            {notificationCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1.5 rounded-full"
              >
                <Bell className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {notificationCount} new
                </span>
                {onResetNotifications && (
                  <button
                    onClick={onResetNotifications}
                    className="ml-1 hover:bg-red-100 rounded-full p-0.5 transition-colors"
                  >
                    <span className="text-xs">✕</span>
                  </button>
                )}
              </motion.div>
            )}
          </motion.div>
          
          <div className="flex flex-wrap gap-3 mt-2 md:mt-0">
            <Link
              to="/properties"
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#2D5A27] border-2 border-[#2D5A27] rounded-xl hover:bg-[#2D5A27] hover:text-white transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Browse Properties
            </Link>
            {onShare && (
              <button
                onClick={onShare}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#2D5A27] rounded-xl hover:bg-[#23461E] transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Share2 className="w-4 h-4" />
                Share Wishlist
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// FAVORITES STATS COMPONENT
// ============================================

interface FavoritesStatsProps {
  stats: {
    total: number;
    totalValue: number;
    totalViews: number;
    newThisWeek: number;
  };
  formatPrice: (price: number) => string;
}

const FavoritesStats: React.FC<FavoritesStatsProps> = ({ stats, formatPrice }) => {
  const statItems = [
    { 
      icon: Heart, 
      label: 'Saved', 
      value: stats.total, 
      suffix: 'Properties',
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    { 
      icon: TrendingUp, 
      label: 'Total Value', 
      value: formatPrice(stats.totalValue), 
      suffix: '',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    { 
      icon: Eye, 
      label: 'Total Views', 
      value: stats.totalViews.toLocaleString(), 
      suffix: 'Views',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      icon: Calendar, 
      label: 'New This Week', 
      value: stats.newThisWeek, 
      suffix: 'Added',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-8 py-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2.5 ${item.bgColor} rounded-xl`}>
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <div>
                <p className="text-xs font-medium text-[#475569] uppercase tracking-wider">
                  {item.label}
                </p>
                <div className="flex items-baseline gap-1">
                  <p className="text-xl font-bold text-[#0F172A]">
                    {item.value}
                  </p>
                  {item.suffix && (
                    <p className="text-xs text-[#475569]">
                      {item.suffix}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// FAVORITES TOOLBAR COMPONENT
// ============================================

interface FavoritesToolbarProps {
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  sortBy: 'recent' | 'price_low' | 'price_high' | 'views';
  setSortBy: (sort: 'recent' | 'price_low' | 'price_high' | 'views') => void;
  selectedCount: number;
  onRemoveSelected: () => void;
  onRemoveAll: () => void;
  totalCount: number;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onToggleSelectAll: () => void;
  isAllSelected: boolean;
  notificationCount: number;
}

const FavoritesToolbar: React.FC<FavoritesToolbarProps> = ({ 
  viewMode, 
  setViewMode, 
  sortBy, 
  setSortBy, 
  selectedCount, 
  onRemoveSelected, 
  onRemoveAll,
  totalCount,
  searchTerm,
  setSearchTerm,
  onToggleSelectAll,
  isAllSelected,
  notificationCount
}) => {
  const sortOptions = [
    { value: 'recent', label: 'Recently Added', icon: '🕐' },
    { value: 'price_low', label: 'Price: Low to High', icon: '💰' },
    { value: 'price_high', label: 'Price: High to Low', icon: '💎' },
    { value: 'views', label: 'Most Viewed', icon: '👁️' },
  ];

  return (
    <div className="py-4">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-center gap-3">
          {notificationCount > 0 && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1.5 rounded-full animate-pulse">
              <Bell className="w-4 h-4" />
              <span className="text-sm font-medium">
                {notificationCount} new {notificationCount === 1 ? 'favorite' : 'favorites'}
              </span>
            </div>
          )}

          {totalCount > 0 && (
            <button
              onClick={onToggleSelectAll}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                isAllSelected 
                  ? 'bg-[#2D5A27] border-[#2D5A27] text-white' 
                  : 'border-gray-300 hover:border-[#2D5A27]'
              }`}
              aria-label={isAllSelected ? 'Deselect all' : 'Select all'}
            >
              {isAllSelected && <span className="text-xs">✓</span>}
            </button>
          )}

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none bg-transparent pr-8 py-1.5 text-sm text-[#0F172A] font-medium cursor-pointer focus:outline-none"
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.icon} {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569] pointer-events-none" />
          </div>
          
          <div className="h-6 w-px bg-gray-200 hidden sm:block" />
          
          <div className="flex gap-1 bg-[#F8FAFC] rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-all duration-200 ${
                viewMode === 'grid' 
                  ? 'bg-white shadow-sm text-[#2D5A27]' 
                  : 'text-[#475569] hover:text-[#0F172A]'
              }`}
              title="Grid View"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-all duration-200 ${
                viewMode === 'list' 
                  ? 'bg-white shadow-sm text-[#2D5A27]' 
                  : 'text-[#475569] hover:text-[#0F172A]'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search favorites..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-4 py-1.5 text-sm bg-[#F8FAFC] border border-gray-200 rounded-lg focus:outline-none focus:border-[#2D5A27] focus:ring-1 focus:ring-[#2D5A27] transition-all w-40 md:w-48"
            />
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
          </div>

          {selectedCount > 0 && (
            <button
              onClick={onRemoveSelected}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
            >
              <Trash2 className="w-4 h-4" />
              Remove ({selectedCount})
            </button>
          )}
          
          {totalCount > 0 && (
            <button
              onClick={onRemoveAll}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#475569] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Remove All
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// AI RECOMMENDATIONS SIDEBAR COMPONENT
// ============================================

interface AIRecommendationsSidebarProps {
  recommendations: RecommendedProperty[];
  loading: boolean;
  favorites: Property[];
  onFavoriteToggle: (id: string, favorited: boolean) => void;
  onDismiss: (id: string) => void;
}

const AIRecommendationsSidebar: React.FC<AIRecommendationsSidebarProps> = ({
  recommendations,
  loading,
  favorites,
  onFavoriteToggle,
  onDismiss
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-[#D4AF37]" />
          <h3 className="font-serif font-bold text-[#0F172A]">AI Picks</h3>
          <span className="text-xs bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Smart
          </span>
        </div>
        {[1, 2, 3, 4].map(n => (
          <div key={n} className="flex gap-3 mb-3 animate-pulse">
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-1" />
              <div className="h-3 bg-gray-200 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-[#D4AF37]" />
          <h3 className="font-serif font-bold text-[#0F172A]">AI Picks</h3>
        </div>
        <div className="text-center py-6">
          <div className="text-3xl mb-2">🔮</div>
          <p className="text-sm text-[#475569]">Save more properties to get personalized recommendations</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#D4AF37]" />
          <h3 className="font-serif font-bold text-[#0F172A]">AI Picks</h3>
          <span className="text-xs bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Smart
          </span>
        </div>
        <Link 
          to="/properties?recommended=true" 
          className="text-xs text-[#2D5A27] hover:underline font-medium"
        >
          View All
        </Link>
      </div>

      <div className="space-y-3">
        {recommendations.map((property, index) => {
          const isFavorited = favorites.some(f => f.id === property.id);
          const matchScore = property.matchScore || 0;
          
          return (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              className="group relative"
            >
              {/* Dismiss Button */}
              <button
                onClick={() => onDismiss(property.id)}
                className="absolute -top-1 -right-1 z-10 p-0.5 bg-gray-200 hover:bg-red-500 rounded-full text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                aria-label="Dismiss recommendation"
              >
                <X className="w-3 h-3" />
              </button>

              <Link to={`/property/${property.id}`} className="block">
                <div className="flex gap-3 p-2 rounded-lg hover:bg-[#F8FAFC] transition-colors duration-200">
                  <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={getMainImage(property.mainImage, property.images)}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-property.jpg';
                      }}
                    />
                    <div className="absolute bottom-0 right-0 bg-[#2D5A27]/80 text-white text-[8px] px-1.5 py-0.5 font-bold">
                      {matchScore}%
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-[#0F172A] truncate">
                      {property.title}
                    </h4>
                    <p className="text-xs text-[#475569] flex items-center gap-0.5 truncate">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      {property.location}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm font-bold text-[#2D5A27]">
                        ₹{Number(property.price).toLocaleString()}
                        {Number(property.price) >= 10000000 && ' Cr'}
                      </span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onFavoriteToggle(property.id, !isFavorited);
                        }}
                        className="p-1 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <Heart className={`w-4 h-4 ${isFavorited ? 'text-red-500 fill-red-500' : 'text-gray-300'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-[#475569]">
          <span>✨ Personalized for you</span>
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
            AI Powered
          </span>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SKELETON COMPONENT
// ============================================

const FavoritesHeaderSkeleton: React.FC = () => (
  <div className="bg-white border-b border-gray-100 animate-pulse">
    <div className="max-w-7xl mx-auto px-8 pt-10 md:pt-14 pb-6">
      <div className="flex items-center justify-between">
        <div className="h-10 bg-gray-200 rounded w-48" />
        <div className="flex gap-3">
          <div className="h-10 bg-gray-200 rounded w-32" />
          <div className="h-10 bg-gray-200 rounded w-32" />
        </div>
      </div>
    </div>
  </div>
);