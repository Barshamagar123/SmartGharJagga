// src/pages/FindMyMatch/components/MatchCard.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import MatchGauge from './MatchGauge';

interface MatchCardProps {
  id: string;
  title: string;
  price: number;
  location: string;
  image: string;
  matchScore: number;
  matchPercentage: string;
  onLearn?: (id: string) => void;
}

const formatPrice = (price: number) => {
  if (price >= 10000000) {
    return `Rs ${(price / 10000000).toFixed(2)} Crore`;
  }
  return `Rs ${price.toLocaleString()}`;
};

const MatchCard: React.FC<MatchCardProps> = ({
  id,
  title,
  price,
  location,
  image,
  matchScore,
  matchPercentage,
  onLearn,
}) => {
  return (
    <Link
      to={`/property/${id}`}
      className="flex items-center gap-3 p-3 rounded-lg border transition-shadow hover:shadow-sm"
      style={{ background: '#FFFFFF', borderColor: '#D3CFC5' }}
      onClick={() => onLearn && onLearn(id)}
    >
      <MatchGauge score={matchScore} size={44} />
      <img
        src={image || '/placeholder-property.jpg'}
        alt={title}
        className="w-14 h-14 object-cover rounded"
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/placeholder-property.jpg';
        }}
      />
      <div className="flex-1 min-w-0">
        <div className="font-mono text-sm font-semibold" style={{ color: '#14181D' }}>
          {formatPrice(price)}
        </div>
        <div className="truncate text-sm" style={{ fontFamily: 'Khand', fontSize: 14, color: '#14181D' }}>
          {title}
        </div>
        <div className="text-[11px]" style={{ color: '#5C6570' }}>
          {matchPercentage} match · {location}
        </div>
      </div>
    </Link>
  );
};

export default MatchCard;