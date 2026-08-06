// src/components/properties/PropertyGrid.tsx

import React from 'react';
import { motion } from 'framer-motion';

import type { Property } from '../../types/property';
import PropertyCard from './PropertyCard';

interface PropertyGridProps {
  properties: Property[];
  loading?: boolean;
  onFavoriteToggle?: (id: string) => void;
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

const PropertyGrid: React.FC<PropertyGridProps> = ({ 
  properties, 
  loading = false,
  onFavoriteToggle 
}) => {
  // ✅ Loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md animate-pulse">
            <div className="h-48 bg-gray-200" />
            <div className="p-4 space-y-3">
              <div className="h-6 bg-gray-200 rounded w-24" />
              <div className="h-4 bg-gray-200 rounded w-20" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ✅ Empty state
  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🏠</div>
        <h3 className="text-xl font-semibold text-gray-900">No Properties Found</h3>
        <p className="text-gray-500 mt-2">Try adjusting your filters or search criteria.</p>
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
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
            onFavoriteToggle={onFavoriteToggle}
            variant="default"
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default PropertyGrid;