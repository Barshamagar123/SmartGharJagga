// src/components/property/PropertyCard.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Heart, Star, CheckCircle, ArrowRight } from 'lucide-react';
import { formatArea } from '../../utils/areaUtils';

// ✅ Image helper
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const getImageUrl = (path: string | undefined | null): string => {
  if (!path) return '/placeholder-property.jpg';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('//')) return `http:${path}`;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_URL}${cleanPath}`;
};

export interface PropertyCardProps {
  id: string;
  title: string;
  price: number;
  location: string;
  area?: number | null;
  areaUnit?: string | null;
  mainImage?: string | null;
  images?: string[];
  isFeatured?: boolean;
  isVerified?: boolean;
  views?: number;
  favoritesCount?: number;
  propertyType?: string;
  isFavorited?: boolean;
  onFavoriteToggle?: (id: string) => void;
  variant?: 'default' | 'compact' | 'horizontal';
  className?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  title,
  price,
  location,
  area,
  areaUnit,
  mainImage,
  images,
  isFeatured = false,
  isVerified = false,
  views = 0,
  favoritesCount = 0,
  propertyType,
  isFavorited = false,
  onFavoriteToggle,
  variant = 'default',
  className = '',
}) => {
  // ✅ Format price
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `Rs ${(price / 10000000).toFixed(1)} Cr`;
    }
    return `Rs ${price.toLocaleString()}`;
  };

  // ✅ Get image
  const getImage = () => {
    if (mainImage) return getImageUrl(mainImage);
    if (images && images.length > 0) return getImageUrl(images[0]);
    return '/placeholder-property.jpg';
  };

  // ✅ Handle favorite toggle
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onFavoriteToggle) {
      onFavoriteToggle(id);
    }
  };

  // ✅ Compact variant
  if (variant === 'compact') {
    return (
      <Link to={`/property/${id}`} className={`block ${className}`}>
        <div className="flex items-center gap-4 p-3 bg-white hover:shadow-md transition-all duration-200">
          <img
            src={getImage()}
            alt={title}
            className="w-20 h-20 object-cover flex-shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-property.jpg';
            }}
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 truncate">{title}</h4>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {location}
            </p>
            <div className="flex items-center gap-3 mt-1 text-sm">
              <span className="font-bold text-[#2D5A27]">{formatPrice(price)}</span>
              {area && areaUnit && (
                <span className="text-gray-400 text-xs">
                  {formatArea(area, areaUnit)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // ✅ Horizontal variant
  if (variant === 'horizontal') {
    return (
      <Link to={`/property/${id}`} className={`block ${className}`}>
        <div className="flex flex-col md:flex-row bg-white overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
          <div className="md:w-72 h-48 md:h-auto relative flex-shrink-0">
            <img
              src={getImage()}
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-property.jpg';
              }}
            />
            {isFeatured && (
              <span className="absolute top-3 left-3 bg-[#D4AF37] text-white text-xs font-bold px-3 py-1 flex items-center gap-1">
                <Star className="w-3 h-3" /> Featured
              </span>
            )}
          </div>
          <div className="flex-1 p-5">
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4" /> {location}
            </p>
            <div className="flex items-center gap-4 mt-3">
              {area && areaUnit && (
                <span className="text-sm text-gray-600 flex items-center gap-1">
                  📐 {formatArea(area, areaUnit)}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <span className="text-2xl font-bold text-[#2D5A27]">
                {formatPrice(price)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // ✅ Default variant - REDUCED HEIGHT
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`bg-white overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ${className}`}
    >
      <Link to={`/property/${id}`} className="block">
        {/* ✅ Image - REDUCED HEIGHT from h-80 to h-56 */}
        <div className="relative h-56 overflow-hidden bg-gray-100">
          <img
            src={getImage()}
            alt={title}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-property.jpg';
            }}
          />
          
          {/* Badges - Smaller */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isFeatured && (
              <span className="bg-[#D4AF37] text-white text-[9px] font-bold px-2 py-0.5 flex items-center gap-1 shadow-md">
                <Star className="w-2.5 h-2.5 fill-white" /> Featured
              </span>
            )}
            {isVerified && (
              <span className="bg-[#2D5A27] text-white text-[9px] font-bold px-2 py-0.5 flex items-center gap-1 shadow-md">
                <CheckCircle className="w-2.5 h-2.5" /> Verified
              </span>
            )}
          </div>

          {/* Favorite Button - Smaller */}
          {onFavoriteToggle && (
            <button
              onClick={handleFavoriteClick}
              className={`absolute top-2 right-2 w-7 h-7 flex items-center justify-center shadow-md transition-all duration-200 ${
                isFavorited 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/90 backdrop-blur-sm text-gray-500 hover:bg-white'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-white' : ''}`} />
            </button>
          )}

          {/* View count - Smaller */}
          <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm text-white text-[9px] px-1.5 py-0.5 flex items-center gap-1">
            👁️ {views}
          </div>
        </div>

        {/* ✅ Content - TIGHT PADDING */}
        <div className="p-3">
          {/* ✅ Price & Area - Compact */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#2D5A27]">
              {formatPrice(price)}
            </span>
            {area && areaUnit && (
              <span className="text-[10px] text-gray-500">
                {formatArea(area, areaUnit)}
              </span>
            )}
          </div>

          {/* ✅ Location - Compact */}
          <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-1">
            <MapPin className="w-2.5 h-2.5" />
            {location}
          </p>

          {/* ✅ Explore Button - Compact */}
          <div className="mt-2 pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-gray-400">{propertyType?.replace('_', ' ') || 'Property'}</span>
              <span className="text-[10px] font-medium text-[#2D5A27] flex items-center gap-1 hover:gap-1.5 transition-all duration-200 group">
                Explore
                <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PropertyCard;