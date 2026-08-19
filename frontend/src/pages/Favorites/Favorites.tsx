// src/pages/Favorites/Favorites.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, ArrowLeft, AlertCircle } from 'lucide-react';
import { propertyApi } from '../../services/api/property';
import { getMainImage, processImagePaths } from '../../utils/imageUtils';
import type { Property } from '../../types/property';
import PropertyCard from '../../components/properties/PropertyCard';
import FavoritesHeader from '../../components/Favorites/FavoritesHeader';

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching favorites from API...');
      const data = await propertyApi.getFavorites();
      
      console.log('✅ Favorites API Response:', data);
      
      if (Array.isArray(data)) {
        const processedFavorites = data.map(prop => {
          const mainImage = getMainImage(prop.mainImage, prop.images);
          const images = processImagePaths(prop.images);
          
          return {
            ...prop,
            mainImage: mainImage,
            images: images.length > 0 ? images : [mainImage],
            isFavorited: true
          };
        });
        
        setFavorites(processedFavorites);
        console.log('✅ Processed favorites:', processedFavorites);
      } else {
        console.error('❌ API did not return an array:', data);
        setError('Invalid response format from server');
        setFavorites([]);
      }
    } catch (err: any) {
      console.error('❌ Error fetching favorites:', err);
      
      if (err.response?.status === 401) {
        setError('Please login to view your favorites');
      } else if (err.response?.status === 403) {
        setError('You need to be a buyer to save favorites');
      } else {
        setError(err.response?.data?.message || 'Failed to load favorites');
      }
      
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleFavoriteToggle = (propertyId: string, favorited: boolean) => {
    if (!favorited) {
      setFavorites((prev) => prev.filter((p) => p.id !== propertyId));
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <FavoritesHeader totalFavorites={0} />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 size={48} className="animate-spin text-[#2D5A27] mx-auto" />
            <p className="mt-4 text-gray-500">Loading your favorites...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <FavoritesHeader totalFavorites={0} />
        <div className="max-w-7xl mx-auto px-8 py-8">
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
      <div className="min-h-screen bg-gray-50">
        <FavoritesHeader totalFavorites={0} />
        <div className="max-w-7xl mx-auto px-8 py-8">
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
    <div className="min-h-screen bg-gray-50">
      <FavoritesHeader totalFavorites={favorites.length} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
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
      </div>
    </div>
  );
};

export default Favorites;