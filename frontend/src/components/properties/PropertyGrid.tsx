// src/components/properties/PropertyGrid.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, BedDouble, Bath, Maximize2 } from 'lucide-react';
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
  CardBadge,
  CardDivider,
} from '../common/Card/Card';
import type { Property } from '../../types/property';
interface PropertyGridProps {
  properties: Property[];
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

const PropertyGrid: React.FC<PropertyGridProps> = ({ properties }) => {
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
            {/* Fixed height image container */}
            <div className="relative h-48 flex-shrink-0 overflow-hidden">
              <img
                src={property.image}
                alt={`${property.title} in ${property.location}`}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {property.featured && (
                <CardBadge
                  variant="success"
                  className="absolute top-3 left-3"
                >
                  FEATURED
                </CardBadge>
              )}
              <CardBadge
                variant="default"
                className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm"
              >
                {property.type}
              </CardBadge>
            </div>

            {/* Content with flex-1 to fill remaining space */}
            <CardContent className="flex-1 flex flex-col p-4">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base group-hover:text-[#2D5A27] transition-colors line-clamp-1">
                  {property.title}
                </CardTitle>
                <span className="font-serif text-base font-bold text-[#2D5A27] whitespace-nowrap">
                  {property.price}
                </span>
              </div>

              <CardDescription className="flex items-center gap-1 mt-1.5">
                <MapPin size={12} className="flex-shrink-0" aria-hidden="true" />
                <span className="truncate">{property.location}</span>
              </CardDescription>

              <CardDivider className="my-3" />

              <div className="flex items-center gap-3 text-xs text-[var(--color-text-secondary)]">
                {property.beds > 0 && (
                  <span className="flex items-center gap-1">
                    <BedDouble size={14} aria-hidden="true" /> {property.beds} Beds
                  </span>
                )}
                {property.baths > 0 && (
                  <span className="flex items-center gap-1">
                    <Bath size={14} aria-hidden="true" /> {property.baths} Baths
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Maximize2 size={12} aria-hidden="true" /> {property.sqft} sqft
                </span>
              </div>

              {/* Spacer to push button to bottom */}
              <div className="flex-1" />

              {/* Button at bottom */}
              <Link
                to={`/property/${property.slug}`}
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