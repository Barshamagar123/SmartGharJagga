// src/pages/Home/components/FeaturedCarousel.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { propertyApi } from '../../services/api/property';
import type { Property } from '../../types/property';

// ✅ Image helper - Same as HomePage
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';
const BASE_URL = API_URL.replace('/api/v1', '');

const getImageUrl = (path: string | undefined | null): string => {
  if (!path) return '/placeholder-property.jpg';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('//')) return `http:${path}`;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_URL}${cleanPath}`;
};

const formatPrice = (price: number) => {
  if (price >= 10000000) {
    return `Rs ${(price / 10000000).toFixed(1)} Cr`;
  }
  return `Rs ${price.toLocaleString()}`;
};

// ✅ Format area with unit
const formatArea = (area: number | null | undefined, unit: string | null | undefined): string => {
  if (!area) return 'N/A';
  if (unit === 'sqft') return `${area} sqft`;
  if (unit === 'aana') return `${area} aana`;
  if (unit === 'roapani') return `${area} roapani`;
  return `${area} ${unit || ''}`;
};

// ✅ Format property type
const formatPropertyType = (type: string | undefined): string => {
  if (!type) return 'Property';
  return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const FeaturedCarousel: React.FC = () => {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [currentPropertyIndex, setCurrentPropertyIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch featured properties
  const fetchFeaturedProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await propertyApi.getAll({
        isFeatured: true,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });

      console.log('📦 Featured properties:', result);

      // ✅ Process images
      const processedProperties = (result.properties || result).map((property: Property) => {
        const processedImages = property.images?.map((img: string) => getImageUrl(img)) || [];
        const processedMainImage = getImageUrl(property.mainImage || property.images?.[0]);
        
        return {
          ...property,
          images: processedImages,
          mainImage: processedMainImage,
        };
      });

      setFeaturedProperties(processedProperties);
      
      // Reset index if we have properties
      if (processedProperties.length > 0) {
        setCurrentPropertyIndex(0);
      }
      
    } catch (err: any) {
      console.error('❌ Error fetching featured properties:', err);
      setError(err.response?.data?.message || 'Failed to load featured properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

  // ✅ Auto-slide
  useEffect(() => {
    if (featuredProperties.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentPropertyIndex((prevIndex) =>
        prevIndex === featuredProperties.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredProperties]);

  // ✅ Loading State
  if (loading) {
    return (
      <section className="py-6 bg-[var(--color-primary)]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-[var(--color-primary-border)] animate-pulse">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-[55%] lg:w-[58%] h-56 md:h-64 lg:h-72 bg-gray-200" />
              <div className="flex-1 p-4 md:p-5 lg:p-6 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-8 bg-gray-200 rounded w-1/3" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ✅ Error State
  if (error) {
    return (
      <section className="py-6 bg-[var(--color-primary)]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-600">⚠️ {error}</p>
            <button 
              onClick={fetchFeaturedProperties}
              className="mt-3 text-red-600 underline hover:text-red-800"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ✅ Empty State
  if (featuredProperties.length === 0) {
    return (
      <section className="py-6 bg-[var(--color-primary)]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-[var(--color-primary-border)] p-12 text-center">
            <p className="text-gray-500">No featured properties available</p>
          </div>
        </div>
      </section>
    );
  }

  const currentProperty = featuredProperties[currentPropertyIndex];

  return (
    <section className="py-6 bg-[var(--color-primary)]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPropertyIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-[var(--color-primary-border)]"
            >
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="md:w-[55%] lg:w-[58%] h-56 md:h-64 lg:h-72 relative flex-shrink-0">
                  <img
                    src={currentProperty.mainImage || '/placeholder-property.jpg'}
                    alt={currentProperty.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-property.jpg';
                    }}
                  />
                  <div className="absolute top-3 left-3 bg-[#2D5A27] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <span>⭐</span> Featured
                  </div>
                  
                  {/* Verification Badge */}
                  {currentProperty.isVerified && (
                    <div className="absolute top-3 left-[85px] bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                      <span>✓</span> Verified
                    </div>
                  )}
                  
                  {/* Dots Indicator */}
                  <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5">
                    {featuredProperties.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPropertyIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentPropertyIndex
                            ? 'bg-white w-6'
                            : 'bg-white/50 hover:bg-white/80'
                        }`}
                      />
                    ))}
                  </div>

                  {/* View Count */}
                  {currentProperty.views && currentProperty.views > 0 && (
                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1">
                      👁️ {currentProperty.views}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-4 md:p-5 lg:p-6 flex flex-col justify-center">
                  <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 leading-tight line-clamp-2">
                    {currentProperty.title}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500 flex items-center gap-1.5 mt-1.5">
                    <span>📍</span> {currentProperty.location}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mt-2 text-xs md:text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      📐 {formatArea(currentProperty.area, currentProperty.areaUnit)}
                    </span>
                    {currentProperty.bedrooms && (
                      <>
                        <span className="w-px h-3 bg-gray-300" />
                        <span className="flex items-center gap-1">
                          🛏️ {currentProperty.bedrooms} beds
                        </span>
                      </>
                    )}
                    {currentProperty.bathrooms && (
                      <>
                        <span className="w-px h-3 bg-gray-300" />
                        <span className="flex items-center gap-1">
                          🛁 {currentProperty.bathrooms} baths
                        </span>
                      </>
                    )}
                    {currentProperty.propertyType && (
                      <>
                        <span className="w-px h-3 bg-gray-300" />
                        <span className="flex items-center gap-1">
                          🏠 {formatPropertyType(currentProperty.propertyType)}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between mt-2 pt-2 border-t border-gray-100">
                    <div>
                      <span className="text-xl md:text-2xl font-bold text-[#2D5A27]">
                        {formatPrice(currentProperty.price)}
                      </span>
                      {currentProperty.area && currentProperty.areaUnit && (
                        <span className="text-xs text-gray-400 ml-1">
                          / {currentProperty.areaUnit}
                        </span>
                      )}
                    </div>
                    <Link
                      to={`/property/${currentProperty.id}`}
                      className="px-4 py-1.5 bg-[#2D5A27] text-white text-xs md:text-sm font-semibold rounded-lg hover:bg-[#23461E] transition-all duration-200 flex items-center gap-1 shadow-md hover:shadow-lg"
                    >
                      Explore
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          {featuredProperties.length > 1 && (
            <>
              <button
                onClick={() =>
                  setCurrentPropertyIndex(
                    currentPropertyIndex === 0 ? featuredProperties.length - 1 : currentPropertyIndex - 1
                  )
                }
                className="absolute left-1.5 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 w-8 h-8 md:w-9 md:h-9 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 border border-gray-100 z-10"
              >
                <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() =>
                  setCurrentPropertyIndex(
                    currentPropertyIndex === featuredProperties.length - 1 ? 0 : currentPropertyIndex + 1
                  )
                }
                className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 w-8 h-8 md:w-9 md:h-9 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 border border-gray-100 z-10"
              >
                <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCarousel;