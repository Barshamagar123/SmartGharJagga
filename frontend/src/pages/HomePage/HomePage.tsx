// src/pages/Home/HomePage.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import HeroSection from '../../components/Home/HeroSection';
import FeaturedCarousel from '../../components/Home/FeaturedCarousel';
import PropertyCategories from '../../components/Home/ProperetyCategories';
import CTASection from '../../components/Home/CTASection';
import PropertyGrid from '../../components/properties/PropertyGrid';
import FindMyMatchPromo from '../../components/Home/FindMyMatchPromo';
import ReviewsSection from '../../components/Home/ReviewsSection'; // ✅ Import ReviewsSection

import { propertyApi } from '../../services/api/property';
import type { Property } from '../../types/property';

// ✅ Image helper
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';
const BASE_URL = API_URL.replace('/api/v1', '');

const getImageUrl = (path: string | undefined | null): string => {
  if (!path) return '/placeholder-property.jpg';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('//')) return `http:${path}`;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_URL}${cleanPath}`;
};

const HomePage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all properties (limit to 6)
      const allResult = await propertyApi.getAll({
        limit: 6,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });

      // Process images
      const processedProperties = allResult.properties.map((property: Property) => {
        const processedImages = property.images?.map((img: string) => getImageUrl(img)) || [];
        const processedMainImage = getImageUrl(property.mainImage || property.images?.[0]);
        
        return {
          ...property,
          images: processedImages,
          mainImage: processedMainImage,
          isFavorited: false,
        };
      });
      setProperties(processedProperties);

    } catch (err: any) {
      console.error('❌ Error fetching properties:', err);
      setError(err.response?.data?.message || 'Failed to load properties. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleFavoriteToggle = async (propertyId: string) => {
    try {
      setProperties(prev =>
        prev.map(p =>
          p.id === propertyId
            ? { ...p, isFavorited: !p.isFavorited }
            : p
        )
      );

      await propertyApi.toggleFavorite(propertyId);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      fetchProperties();
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-primary)]">
        <HeroSection />
        <FeaturedCarousel />
        <PropertyCategories />
        
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Loading Properties...</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-xl overflow-hidden shadow-md animate-pulse">
                <div className="h-56 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-24" />
                  <div className="h-4 bg-gray-200 rounded w-20" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <CTASection />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-primary)]">
      <HeroSection />
      
      {/* ✅ Featured Carousel - Shows featured properties */}
      <FeaturedCarousel />
      
      <PropertyCategories />
      
      {/* ✅ Latest Properties Section */}
      {!loading && properties.length > 0 && (
        <section className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Latest Properties</h2>
            <Link to="/properties" className="text-[#2D5A27] font-semibold hover:underline">
              View All →
            </Link>
          </div>
          <PropertyGrid
            properties={properties}
            loading={loading}
            onFavoriteToggle={handleFavoriteToggle}
          />
        </section>
      )}

     
      
      {/* ✅ Find My Match Promo Section */}
      <FindMyMatchPromo />
       {/* ✅ Reviews Section */}
      <ReviewsSection limit={6} title="What Our Users Say" />

      {/* ✅ Error State */}
      {error && (
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="font-medium">{error}</p>
            </div>
            <button 
              onClick={fetchProperties}
              className="mt-3 text-red-700 underline hover:text-red-900 font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
      {/* ✅ CTA Section */}
      <CTASection />
    </div>
  );
};

export default HomePage;