// src/components/property/PropertyCardList.tsx

import React from 'react';
import PropertyCard from './PropertyCard';
import PropertyCardSkeleton from './PropertyCardSkeleton';
import type { PropertyCardProps } from './PropertyCard';

interface PropertyCardListProps {
  properties: PropertyCardProps[];
  loading?: boolean;
  variant?: 'default' | 'compact' | 'horizontal'; // ✅ Removed 'featured'
  columns?: 1 | 2 | 3 | 4;
  onFavoriteToggle?: (id: string) => void;
  emptyMessage?: string;
  className?: string;
}

const PropertyCardList: React.FC<PropertyCardListProps> = ({
  properties,
  loading = false,
  variant = 'default',
  columns = 3,
  onFavoriteToggle,
  emptyMessage = 'No properties found',
  className = '',
}) => {
  // ✅ Loading state
  if (loading) {
    return <PropertyCardSkeleton variant={variant} count={6} />;
  }

  // ✅ Empty state
  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  // ✅ Column classes
  const getColumnClasses = () => {
    if (variant === 'horizontal' || variant === 'compact') {
      return 'space-y-4';
    }
    switch (columns) {
      case 1:
        return 'grid grid-cols-1 gap-6';
      case 2:
        return 'grid grid-cols-1 md:grid-cols-2 gap-6';
      case 4:
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6';
      case 3:
      default:
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6';
    }
  };

  return (
    <div className={`${getColumnClasses()} ${className}`}>
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          {...property}
          variant={variant}
          onFavoriteToggle={onFavoriteToggle}
        />
      ))}
    </div>
  );
};

export default PropertyCardList;