// src/components/common/Skeleton.tsx

import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  width?: string | number;
  height?: string | number;
  circle?: boolean;
  count?: number;
}

const variantClasses = {
  default: 'bg-[#EDE8E2]',
  primary: 'bg-[#2D5A27]/10',
  secondary: 'bg-[#E8F0E4]',
};

const sizeClasses = {
  sm: 'h-4',
  md: 'h-6',
  lg: 'h-8',
  xl: 'h-12',
};

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'default',
  size = 'md',
  width,
  height,
  circle = false,
  count = 1,
  ...props
}) => {
  const baseClass = 'animate-pulse rounded';
  const variantClass = variantClasses[variant] || variantClasses.default;
  const sizeClass = sizeClasses[size] || sizeClasses.md;

  const renderSkeleton = (key: number) => (
    <div
      key={key}
      className={`${baseClass} ${variantClass} ${sizeClass} ${circle ? 'rounded-full' : ''} ${className}`}
      style={{
        width: width || (circle ? '3rem' : undefined),
        height: height || (circle ? '3rem' : undefined),
      }}
      {...props}
    />
  );

  if (count > 1) {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => renderSkeleton(i))}
      </div>
    );
  }

  return renderSkeleton(0);
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white rounded-2xl p-6 border border-[#EDE8E2] ${className}`}>
    <Skeleton className="w-full h-48 rounded-xl" />
    <div className="mt-4 space-y-3">
      <Skeleton className="w-3/4 h-6" />
      <Skeleton className="w-1/2 h-4" />
      <div className="flex gap-4">
        <Skeleton className="w-16 h-4" />
        <Skeleton className="w-16 h-4" />
        <Skeleton className="w-16 h-4" />
      </div>
      <div className="flex justify-between items-center pt-4">
        <Skeleton className="w-24 h-8" />
        <Skeleton className="w-24 h-10 rounded-xl" />
      </div>
    </div>
  </div>
);

export const SkeletonPropertyCard: React.FC = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-[#EDE8E2]">
    <Skeleton className="w-full h-56" />
    <div className="p-5 space-y-3">
      <Skeleton className="w-3/4 h-6" />
      <Skeleton className="w-1/3 h-6" />
      <Skeleton className="w-1/2 h-4" />
      <div className="flex gap-4">
        <Skeleton className="w-16 h-4" />
        <Skeleton className="w-16 h-4" />
        <Skeleton className="w-16 h-4" />
      </div>
      <Skeleton className="w-full h-10 rounded-xl" />
    </div>
  </div>
);

export default Skeleton;