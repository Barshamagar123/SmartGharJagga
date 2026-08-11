// src/components/Home/HomePropertyGrid.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import type { Property } from '../../types/property';
import PropertyCard from '../properties/PropertyCard';

interface HomePropertyGridProps {
  title: string;
  properties: Property[];
  viewAllLink?: string;
  loading?: boolean;
  onFavoriteToggle?: (id: string) => void;
  columns?: 2 | 3 | 4;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const HomePropertyGrid: React.FC<HomePropertyGridProps> = ({
  title,
  properties,
  viewAllLink = '/properties',
  loading = false,
  onFavoriteToggle,
  columns = 3,
}) => {
  // ✅ Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </div>
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns} gap-5`}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md animate-pulse">
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
    );
  }

  // ✅ Empty state
  if (!properties || properties.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {viewAllLink && (
            <Link to={viewAllLink} className="text-[#2D5A27] font-semibold hover:underline">
              View All →
            </Link>
          )}
        </div>
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <div className="text-6xl mb-4">🏠</div>
          <h3 className="text-xl font-semibold text-gray-900">No Properties Found</h3>
          <p className="text-gray-500 mt-2">Check back later for new listings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {viewAllLink && (
          <Link to={viewAllLink} className="text-[#2D5A27] font-semibold hover:underline">
            View All →
          </Link>
        )}
      </div>
      
      <motion.div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns} gap-5`}
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {properties.map((property) => (
          <motion.div
            key={property.id}
            variants={fadeInUp}
            className="h-full"
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
              isFavorited={property.isFavorited}
              onFavoriteToggle={onFavoriteToggle}
              variant="default"
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default HomePropertyGrid;