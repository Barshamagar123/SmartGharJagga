// src/pages/Favorites/Favorites.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Loader2, ArrowLeft, Home } from 'lucide-react';
import { propertyApi } from '../../services/api/property';
import type { Property } from '../../types/property';
import PropertyCard from '../../components/properties/PropertyCard';

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch favorites
  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertyApi.getFavorites();
      setFavorites(data);
    } catch (err: any) {
      console.error('Error fetching favorites:', err);
      setError(err.response?.data?.message || 'Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  // ✅ Handle favorite toggle from PropertyCard
  const handleFavoriteToggle = async (propertyId: string) => {
    // Optimistically remove from list
    setFavorites(prev => prev.filter(p => p.id !== propertyId));
    
    try {
      await propertyApi.toggleFavorite(propertyId);
      // Refetch to sync with server
      await fetchFavorites();
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revert on error
      await fetchFavorites();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-primary)] pt-20">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-[#2D5A27] mx-auto" />
          <p className="mt-4 text-gray-500">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--color-primary)] pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
            <p>{error}</p>
            <button 
              onClick={fetchFavorites}
              className="mt-3 text-red-700 underline hover:text-red-900"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-primary)] pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-red-500 fill-red-500" />
              <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
            </div>
            <p className="text-gray-500 mt-1">
              {favorites.length} {favorites.length === 1 ? 'property' : 'properties'} saved
            </p>
          </div>
          <Link
            to="/properties"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#2D5A27] border-2 border-[#2D5A27] rounded-xl hover:bg-[#2D5A27] hover:text-white transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse Properties
          </Link>
        </div>

        {/* Favorites Grid */}
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <div className="text-6xl mb-4">❤️</div>
            <h3 className="text-xl font-semibold text-gray-900">No Favorites Yet</h3>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              Start exploring properties and click the heart icon to save your favorites.
            </p>
            <Link
              to="/properties"
              className="inline-block mt-4 px-6 py-2 bg-[#2D5A27] text-white rounded-lg hover:bg-[#23461E] transition-colors"
            >
              Browse Properties
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;