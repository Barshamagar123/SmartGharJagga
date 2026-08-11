// src/pages/Home/components/FeaturedCarousel.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const featuredProperties = [
  {
    id: '1',
    title: 'Land For Sale At Chyasal, Balkumari, Lalitpur',
    location: 'Balkumari, Chyasal, Lalitpur Metropolitan City - 09, Lalitpur',
    price: 'Rs 65,00,000',
    pricePerUnit: '/aana',
    landSize: '15.0',
    landSizeUnit: 'aana',
    direction: 'South',
    contact: '9747899705',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80',
  },
  {
    id: '2',
    title: 'Modern Villa with Garden',
    location: 'Lalitpur, Bhaisepati Metropolitan City - 5, Lalitpur',
    price: 'Rs 4.8 Cr',
    pricePerUnit: '',
    landSize: '4.5',
    landSizeUnit: 'aana',
    direction: 'East',
    contact: '9810342784',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80',
  },
  {
    id: '3',
    title: 'Luxury Apartment with Mountain View',
    location: 'Pokhara, Lakeside - 6, Kaski',
    price: 'Rs 3.2 Cr',
    pricePerUnit: '',
    landSize: '1800',
    landSizeUnit: 'sqft',
    direction: 'North',
    contact: '9851234567',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80',
  },
  {
    id: '4',
    title: 'Commercial Complex For Sale',
    location: 'Kathmandu, New Road - 22, Kathmandu',
    price: 'Rs 12.5 Cr',
    pricePerUnit: '',
    landSize: '2500',
    landSizeUnit: 'sqft',
    direction: 'West',
    contact: '9801234567',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80',
  },
];

const FeaturedCarousel: React.FC = () => {
  const [currentPropertyIndex, setCurrentPropertyIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPropertyIndex((prevIndex) =>
        prevIndex === featuredProperties.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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
                    src={featuredProperties[currentPropertyIndex].image}
                    alt={featuredProperties[currentPropertyIndex].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-[#2D5A27] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
                    ⭐ विशेष
                  </div>
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
                </div>

                {/* Content */}
                <div className="flex-1 p-4 md:p-5 lg:p-6 flex flex-col justify-center">
                  <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 leading-tight line-clamp-2">
                    {featuredProperties[currentPropertyIndex].title}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500 flex items-center gap-1.5 mt-1.5">
                    <span>📍</span> {featuredProperties[currentPropertyIndex].location}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mt-2 text-xs md:text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      📐 {featuredProperties[currentPropertyIndex].landSize} {featuredProperties[currentPropertyIndex].landSizeUnit}
                    </span>
                    <span className="w-px h-3 bg-gray-300" />
                    <span className="flex items-center gap-1">
                      🧭 {featuredProperties[currentPropertyIndex].direction}
                    </span>
                    <span className="w-px h-3 bg-gray-300" />
                    <span className="flex items-center gap-1">
                      📞 {featuredProperties[currentPropertyIndex].contact}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between mt-2 pt-2 border-t border-gray-100">
                    <div>
                      <span className="text-xl md:text-2xl font-bold text-[#2D5A27]">
                        {featuredProperties[currentPropertyIndex].price}
                      </span>
                      {featuredProperties[currentPropertyIndex].pricePerUnit && (
                        <span className="text-xs text-gray-400 ml-1">
                          {featuredProperties[currentPropertyIndex].pricePerUnit}
                        </span>
                      )}
                    </div>
                    <Link
                      to={`/property/${featuredProperties[currentPropertyIndex].id}`}
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
          <button
            onClick={() =>
              setCurrentPropertyIndex(
                currentPropertyIndex === 0 ? featuredProperties.length - 1 : currentPropertyIndex - 1
              )
            }
            className="absolute left-1.5 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 w-8 h-8 md:w-9 md:h-9 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 border border-gray-100"
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
            className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 w-8 h-8 md:w-9 md:h-9 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 border border-gray-100"
          >
            <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCarousel;