// src/components/property/PropertyCardSkeleton.tsx

import React from 'react';

interface PropertyCardSkeletonProps {
  variant?: 'default' | 'compact' | 'horizontal' | 'featured'; // ✅ Added 'featured'
  count?: number;
}

const PropertyCardSkeleton: React.FC<PropertyCardSkeletonProps> = ({ 
  variant = 'default',
  count = 1 
}) => {
  if (variant === 'compact') {
    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-3 bg-white rounded-xl animate-pulse">
            <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="flex items-center gap-3">
                <div className="h-4 bg-gray-200 rounded w-20" />
                <div className="h-3 bg-gray-200 rounded w-16" />
              </div>
            </div>
          </div>
        ))}
      </>
    );
  }

  if (variant === 'horizontal' || variant === 'featured') {
    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex flex-col md:flex-row bg-white rounded-xl overflow-hidden shadow-md animate-pulse">
            <div className="md:w-72 h-48 md:h-auto bg-gray-200" />
            <div className="flex-1 p-5 space-y-3">
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="flex gap-4">
                <div className="h-4 bg-gray-200 rounded w-16" />
                <div className="h-4 bg-gray-200 rounded w-16" />
                <div className="h-4 bg-gray-200 rounded w-16" />
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="h-8 bg-gray-200 rounded w-32" />
                <div className="h-4 bg-gray-200 rounded w-16" />
              </div>
            </div>
          </div>
        ))}
      </>
    );
  }

  // Default grid skeleton
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md animate-pulse">
          <div className="h-52 bg-gray-200" />
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
};

export default PropertyCardSkeleton;