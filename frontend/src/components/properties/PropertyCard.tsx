// src/components/property/PropertyCard.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Heart, 
  Eye, 
  Star,
  TrendingUp,
  CheckCircle,
  Home,
  Building,
  Landmark
} from 'lucide-react';
import { formatArea } from '../../utils/areaUtils';

// ✅ Image helper
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const getImageUrl = (path: string | undefined | null): string => {
  if (!path) return '/placeholder-property.jpg';
  if (path.startsWith('http')) return path;
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
  bedrooms?: number | null;
  bathrooms?: number | null;
  mainImage?: string | null;
  images?: string[];
  isFeatured?: boolean;
  isVerified?: boolean;
  views?: number;
  favoritesCount?: number;
  propertyType?: string;
  purpose?: string;
  createdAt?: string;
  user?: {
    name?: string;
    phone?: string;
    email?: string;
    avatarUrl?: string;
  };
  isFavorited?: boolean;
  onFavoriteToggle?: (id: string) => void;
  variant?: 'default' | 'compact' | 'featured' | 'horizontal';
  className?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  title,
  price,
  location,
  area,
  areaUnit,
  bedrooms,
  bathrooms,
  mainImage,
  images,
  isFeatured = false,
  isVerified = false,
  views = 0,
  favoritesCount = 0,
  propertyType,
  purpose,
  createdAt,
  user,
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

  // ✅ Get property type icon
  const getPropertyIcon = (type?: string) => {
    switch (type) {
      case 'HOUSE':
        return <Home className="w-4 h-4" />;
      case 'APARTMENT':
        return <Building className="w-4 h-4" />;
      case 'RESIDENTIAL_LAND':
      case 'COMMERCIAL_LAND':
      case 'AGRICULTURAL_LAND':
      case 'INDUSTRIAL_LAND':
        return <Landmark className="w-4 h-4" />;
      default:
        return <Home className="w-4 h-4" />;
    }
  };

  // ✅ Get image - FIXED: Use getImageUrl helper
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
        <div className="flex items-center gap-4 p-3 bg-white rounded-xl hover:shadow-md transition-all duration-200">
          <img
            src={getImage()}
            alt={title}
            className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
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
        <div className="flex flex-col md:flex-row bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
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
              <span className="absolute top-3 left-3 bg-[#D4AF37] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Star className="w-3 h-3" /> Featured
              </span>
            )}
          </div>
          <div className="flex-1 p-5">
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-bold text-gray-900">{title}</h3>
              {isVerified && (
                <span className="text-green-600 text-sm flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> Verified
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4" /> {location}
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
              {area && areaUnit && (
                <span className="flex items-center gap-1">
                  📐 {formatArea(area, areaUnit)}
                </span>
              )}
              {bedrooms !== null && bedrooms !== undefined && (
                <>
                  <span className="w-px h-4 bg-gray-300" />
                  <span className="flex items-center gap-1">
                    <Bed className="w-4 h-4" /> {bedrooms}
                  </span>
                </>
              )}
              {bathrooms !== null && bathrooms !== undefined && (
                <>
                  <span className="w-px h-4 bg-gray-300" />
                  <span className="flex items-center gap-1">
                    <Bath className="w-4 h-4" /> {bathrooms}
                  </span>
                </>
              )}
              {propertyType && (
                <>
                  <span className="w-px h-4 bg-gray-300" />
                  <span className="flex items-center gap-1">
                    {getPropertyIcon(propertyType)} {propertyType.replace('_', ' ')}
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <span className="text-2xl font-bold text-[#2D5A27]">
                {formatPrice(price)}
              </span>
              <span className="text-sm text-gray-400">
                {views} views
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // ✅ Default variant (Grid card)
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ${className}`}
    >
      <Link to={`/property/${id}`} className="block">
        {/* Image */}
        <div className="relative h-52 overflow-hidden bg-gray-100">
          <img
            src={getImage()}
            alt={title}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              console.error('❌ Image failed to load:', getImage());
              (e.target as HTMLImageElement).src = '/placeholder-property.jpg';
            }}
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {isFeatured && (
              <span className="bg-[#D4AF37] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                <Star className="w-3 h-3" /> Featured
              </span>
            )}
            {isVerified && (
              <span className="bg-[#2D5A27] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                <CheckCircle className="w-3 h-3" /> Verified
              </span>
            )}
          </div>

          {/* Favorite Button */}
          {onFavoriteToggle && (
            <button
              onClick={handleFavoriteClick}
              className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${
                isFavorited 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/90 backdrop-blur-sm text-gray-500 hover:bg-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-white' : ''}`} />
            </button>
          )}

          {/* View count */}
          <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Eye className="w-3 h-3" /> {views}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-gray-900 text-base line-clamp-1">
            {title}
          </h3>
          
          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
            <MapPin className="w-4 h-4" /> {location}
          </p>

          {/* Details */}
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-600">
            {area && areaUnit && (
              <span className="flex items-center gap-1">
                📐 {formatArea(area, areaUnit)}
              </span>
            )}
            {bedrooms !== null && bedrooms !== undefined && bedrooms > 0 && (
              <>
                <span className="w-px h-3 bg-gray-300" />
                <span className="flex items-center gap-1">
                  <Bed className="w-3 h-3" /> {bedrooms}
                </span>
              </>
            )}
            {bathrooms !== null && bathrooms !== undefined && bathrooms > 0 && (
              <>
                <span className="w-px h-3 bg-gray-300" />
                <span className="flex items-center gap-1">
                  <Bath className="w-3 h-3" /> {bathrooms}
                </span>
              </>
            )}
          </div>

          {/* Agent name */}
          {user?.name && (
            <p className="text-xs text-gray-400 mt-1">
              📞 {user.name}
            </p>
          )}

          {/* Price & Action */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <div>
              <span className="text-xl font-bold text-[#2D5A27]">
                {formatPrice(price)}
              </span>
              {area && areaUnit && areaUnit === 'AANA' && (
                <span className="text-xs text-gray-400 ml-0.5">/aana</span>
              )}
              {area && areaUnit && areaUnit === 'DHUR' && (
                <span className="text-xs text-gray-400 ml-0.5">/dhur</span>
              )}
            </div>
            <span className="text-sm text-[#2D5A27] font-medium flex items-center gap-1">
              View Details
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PropertyCard;