// src/components/properties/PropertyGrid.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, Square, Eye, Heart } from 'lucide-react';
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
  CardBadge,
  CardDivider,
} from '../common/Card/Card';
import type { Property } from '../../types/property';
import { formatArea } from '../../utils/areaUtils';

interface PropertyGridProps {
  properties: Property[];
  loading?: boolean; // ✅ Add loading prop
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
              <div className="h-5 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="flex gap-3">
                <div className="h-4 bg-gray-200 rounded w-16" />
                <div className="h-4 bg-gray-200 rounded w-16" />
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="h-6 bg-gray-200 rounded w-24" />
                <div className="h-4 bg-gray-200 rounded w-20" />
              </div>
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
        <p className="text-gray-500">No properties found</p>
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
          <Card
            variant="hover"
            padding="none"
            radius="lg"
            className="overflow-hidden h-full flex flex-col"
            interactive
          >
            {/* Image */}
            <div className="relative h-48 flex-shrink-0 overflow-hidden">
              <img
                src={property.mainImage || property.images?.[0] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80'}
                alt={property.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              {property.isFeatured && (
                <CardBadge variant="success" className="absolute top-3 left-3">
                  ⭐ FEATURED
                </CardBadge>
              )}
              
              {property.isVerified && (
                <CardBadge variant="default" className="absolute top-3 left-3 ml-20 bg-[#2D5A27] text-white">
                  ✅ VERIFIED
                </CardBadge>
              )}
              
              <CardBadge
                variant="default"
                className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm"
              >
                {property.propertyType || 'Property'}
              </CardBadge>
            </div>

            {/* Content */}
            <CardContent className="flex-1 flex flex-col p-4">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base group-hover:text-[#2D5A27] transition-colors line-clamp-1">
                  {property.title}
                </CardTitle>
                <span className="font-serif text-base font-bold text-[#2D5A27] whitespace-nowrap">
                  Rs {property.price.toLocaleString()}
                </span>
              </div>

              <CardDescription className="flex items-center gap-1 mt-1.5">
                <MapPin size={12} className="flex-shrink-0" aria-hidden="true" />
                <span className="truncate">{property.location}</span>
              </CardDescription>

              <CardDivider className="my-3" />

              <div className="flex items-center gap-3 text-xs text-[var(--color-text-secondary)]">
                {property.bedrooms && property.bedrooms > 0 && (
                  <span className="flex items-center gap-1">
                    <Bed size={14} aria-hidden="true" /> {property.bedrooms} Beds
                  </span>
                )}
                {property.bathrooms && property.bathrooms > 0 && (
                  <span className="flex items-center gap-1">
                    <Bath size={14} aria-hidden="true" /> {property.bathrooms} Baths
                  </span>
                )}
                {property.area && property.areaUnit && (
                  <span className="flex items-center gap-1">
                    <Square size={12} aria-hidden="true" /> 
                    {formatArea(property.area, property.areaUnit)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Eye size={12} /> {property.views || 0} views
                </span>
                {property.favoritesCount !== undefined && (
                  <span className="flex items-center gap-1">
                    <Heart size={12} /> {property.favoritesCount || 0}
                  </span>
                )}
              </div>

              <div className="flex-1" />

              <Link
                to={`/property/${property.id}`}
                className="w-full text-center px-4 py-2 text-xs font-semibold text-[#2D5A27] border-2 border-[#2D5A27] rounded-full hover:bg-[#2D5A27] hover:text-white transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2D5A27] focus-visible:ring-offset-2 mt-3"
              >
                View Details
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default PropertyGrid;