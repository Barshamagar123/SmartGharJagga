// src/pages/Favorites/Favorites.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Loader2, ArrowLeft, AlertCircle } from 'lucide-react';
import { propertyApi } from '../../services/api/property';
import type { Property } from '../../types/property';
import PropertyCard from '../../components/properties/PropertyCard';

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      setDebugInfo('Fetching favorites...');
      
      console.log('🔍 Fetching favorites from API...');
      const data = await propertyApi.getFavorites();
      
      console.log('✅ Favorites API Response:', data);
      setDebugInfo(`Received ${data?.length || 0} favorites`);
      
      if (Array.isArray(data)) {
        // ✅ Ensure all properties have isFavorited = true
        const favoritesWithFlag = data.map(prop => ({
          ...prop,
          isFavorited: true
        }));
        setFavorites(favoritesWithFlag);
      } else {
        console.error('❌ API did not return an array:', data);
        setError('Invalid response format from server');
        setFavorites([]);
      }
    } catch (err: any) {
      console.error('❌ Error fetching favorites:', err);
      
      if (err.response) {
        console.error('Server response:', err.response.data);
        console.error('Status code:', err.response.status);
        
        if (err.response.status === 401) {
          setError('Please login to view your favorites');
        } else if (err.response.status === 403) {
          setError('You need to be a buyer to save favorites');
        } else {
          setError(err.response.data?.message || 'Failed to load favorites');
        }
      } else if (err.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError(err.message || 'An unexpected error occurred');
      }
      
      setFavorites([]);
    } finally {
      setLoading(false);
      setDebugInfo('');
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  // ✅ Handle favorite toggle - removes from list when unfavorited
  const handleFavoriteToggle = (propertyId: string, favorited: boolean) => {
    console.log(`📝 handleFavoriteToggle called for ${propertyId}, favorited: ${favorited}`);
    
    if (!favorited) {
      // Remove from list if unfavorited
      setFavorites((prev) => {
        const updated = prev.filter((p) => p.id !== propertyId);
        console.log(`🗑️ Removed property ${propertyId}, remaining: ${updated.length}`);
        return updated;
      });
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-[#2D5A27] mx-auto" />
          <p className="mt-4 text-gray-500">Loading your favorites...</p>
          {debugInfo && <p className="mt-2 text-sm text-gray-400">{debugInfo}</p>}
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-800">Error Loading Favorites</h3>
                <p className="text-red-700 mt-1">{error}</p>
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={fetchFavorites}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
                  <Link
                    to="/properties"
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Browse Properties
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty State
  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3">
                <Heart className="w-8 h-8 text-gray-300" />
                <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
              </div>
              <p className="text-gray-500 mt-1">No properties saved yet</p>
            </div>
            <Link
              to="/properties"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#2D5A27] border-2 border-[#2D5A27] rounded-xl hover:bg-[#2D5A27] hover:text-white transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Browse Properties
            </Link>
          </div>

          <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
            <div className="text-7xl mb-6">🏠</div>
            <h3 className="text-2xl font-semibold text-gray-900">No Favorites Yet</h3>
            <p className="text-gray-500 mt-3 max-w-md mx-auto text-lg">
              Start exploring properties and click the ❤️ icon to save your favorites.
            </p>
            <Link
              to="/properties"
              className="inline-block mt-6 px-8 py-3 bg-[#2D5A27] text-white rounded-lg hover:bg-[#23461E] transition-colors text-lg"
            >
              Explore Properties
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success State with Favorites
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-red-500 fill-red-500" />
              <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
              <span className="bg-[#2D5A27] text-white text-sm px-3 py-1 rounded-full">
                {favorites.length}
              </span>
            </div>
            <p className="text-gray-500 mt-1">
              {favorites.length} {favorites.length === 1 ? 'property' : 'properties'} saved
            </p>
          </div>
          
          <div className="flex gap-3">
            <Link
              to="/properties"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#2D5A27] border-2 border-[#2D5A27] rounded-xl hover:bg-[#2D5A27] hover:text-white transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Browse Properties
            </Link>
          </div>
        </div>

        {/* Favorites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((property) => (
            <PropertyCard
              key={property.id}
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
          ))}
        </div>

        {/* Debug Info (only in development) */}
        {import.meta.env.DEV && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs text-gray-600">
            <p>🔍 Debug: {favorites.length} favorites loaded</p>
            <p>📦 First property: {JSON.stringify(favorites[0]?.title || 'None', null, 2)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;