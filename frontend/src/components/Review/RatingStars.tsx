// src/components/review/RatingStars.tsx

import React from 'react';
import { Star, StarHalf } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  size = 'md',
  className = ''
}) => {
  const sizeMap = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} className={`${sizeMap[size]} fill-[#D4AF37] text-[#D4AF37]`} />
      ))}
      {hasHalfStar && (
        <StarHalf className={`${sizeMap[size]} fill-[#D4AF37] text-[#D4AF37]`} />
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} className={`${sizeMap[size]} text-gray-300`} />
      ))}
    </div>
  );
};

export default RatingStars;