// src/components/Matching/MatchCard.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Star, Eye, CheckCircle, Trophy } from 'lucide-react';
import MatchGauge from './MatchGauge';

interface MatchCardProps {
  id: string;
  title: string;
  price: number;
  location: string;
  image: string;
  matchScore: number;
  matchPercentage: string;
  isVerified?: boolean;
  isFeatured?: boolean;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  areaUnit?: string;
  propertyType?: string;
  views?: number;
  rank?: number;
  onLearn?: (id: string) => void;
  onFavorite?: (id: string) => void;
}

const formatPrice = (price: number) => {
  if (price >= 10000000) {
    return `Rs ${(price / 10000000).toFixed(2)} Crore`;
  }
  return `Rs ${price.toLocaleString()}`;
};

const formatArea = (area: number | undefined, unit: string | undefined): string => {
  if (!area) return '';
  if (unit === 'sqft') return `${area} sqft`;
  if (unit === 'aana') return `${area} aana`;
  if (unit === 'roapani') return `${area} roapani`;
  return `${area} ${unit || ''}`;
};

const getRankColor = (rank: number) => {
  switch (rank) {
    case 1: return 'text-yellow-500';
    case 2: return 'text-gray-400';
    case 3: return 'text-amber-600';
    default: return 'text-gray-400';
  }
};

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1: return '🥇';
    case 2: return '🥈';
    case 3: return '🥉';
    default: return `#${rank}`;
  }
};

const MatchCard: React.FC<MatchCardProps> = ({
  id,
  title,
  price,
  location,
  image,
  matchScore,
  matchPercentage,
  isVerified = false,
  isFeatured = false,
  bedrooms,
  bathrooms,
  area,
  areaUnit,
  propertyType,
  views = 0,
  rank,
  onLearn,
  onFavorite,
}) => {
  const [favorited, setFavorited] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorited(!favorited);
    if (onFavorite) {
      onFavorite(id);
    }
  };

  const handleLearn = () => {
    if (onLearn) {
      onLearn(id);
    }
  };

  return (
    <Link
      to={`/property/${id}`}
      className="flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 hover:shadow-md hover:border-[#2D5A27] group"
      style={{ background: '#FFFFFF', borderColor: '#D3CFC5' }}
      onClick={handleLearn}
    >
      {/* Rank Badge */}
      {rank && (
        <div className="flex-shrink-0 w-8 text-center">
          <span className={`text-xl font-bold ${getRankColor(rank)}`}>
            {getRankIcon(rank)}
          </span>
        </div>
      )}

      {/* Match Score Gauge */}
      <div className="flex-shrink-0">
        <MatchGauge score={Math.round(matchScore)} size={48} />
      </div>

      {/* Property Image */}
      <div className="relative flex-shrink-0">
        <img
          src={image || '/placeholder-property.jpg'}
          alt={title}
          className="w-16 h-16 object-cover rounded-lg"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-property.jpg';
          }}
        />
        {isVerified && (
          <div className="absolute -top-1 -right-1 bg-[#2D5A27] rounded-full p-0.5">
            <CheckCircle className="w-3 h-3 text-white" />
          </div>
        )}
        {isFeatured && (
          <div className="absolute -bottom-1 -right-1 bg-[#D4AF37] rounded-full p-0.5">
            <Star className="w-3 h-3 text-white fill-white" />
          </div>
        )}
      </div>

      {/* Property Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div>
            <div className="font-mono text-sm font-semibold" style={{ color: '#14181D' }}>
              {formatPrice(price)}
            </div>
            <div className="truncate text-sm" style={{ fontFamily: 'Khand', fontSize: 14, color: '#14181D' }}>
              {title}
            </div>
          </div>
          <button
            onClick={handleFavoriteClick}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            <Heart
              className={`w-4 h-4 ${favorited ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
            />
          </button>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-xs" style={{ color: '#5C6570' }}>
          <MapPin className="w-3 h-3" />
          <span className="truncate">{location}</span>
        </div>

        {/* Details Row */}
        <div className="flex items-center gap-2 mt-1 text-xs flex-wrap">
          <span style={{ color: '#2D5A27', fontWeight: 600 }}>
            {matchPercentage} match
          </span>
          {area && areaUnit && (
            <>
              <span className="w-px h-3 bg-gray-300" />
              <span style={{ color: '#5C6570' }}>{formatArea(area, areaUnit)}</span>
            </>
          )}
          {bedrooms && (
            <>
              <span className="w-px h-3 bg-gray-300" />
              <span style={{ color: '#5C6570' }}>{bedrooms} 🛏️</span>
            </>
          )}
          {bathrooms && (
            <>
              <span className="w-px h-3 bg-gray-300" />
              <span style={{ color: '#5C6570' }}>{bathrooms} 🛁</span>
            </>
          )}
          {views > 0 && (
            <>
              <span className="w-px h-3 bg-gray-300" />
              <span style={{ color: '#5C6570' }}>
                <Eye className="w-3 h-3 inline" /> {views}
              </span>
            </>
          )}
        </div>

        {/* Property Type Badge */}
        {propertyType && (
          <div className="mt-1">
            <span
              className="text-[10px] px-2 py-0.5 rounded-full"
              style={{
                background: '#E8F0E4',
                color: '#2D5A27',
                fontFamily: 'Mukta',
              }}
            >
              {propertyType.replace('_', ' ').toUpperCase()}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default MatchCard;