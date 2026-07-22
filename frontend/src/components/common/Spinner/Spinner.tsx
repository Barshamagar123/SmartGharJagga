// src/components/common/Spinner.tsx

import React from 'react';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'white' | 'gold';
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

const colorClasses = {
  primary: 'text-[#2D5A27]',
  white: 'text-white',
  gold: 'text-[#D4AF37]',
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className = '',
}) => {
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  const colorClass = colorClasses[color] || colorClasses.primary;

  return (
    <svg
      className={`animate-spin ${sizeClass} ${colorClass} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

export const LoadingOverlay: React.FC<{ isLoading: boolean; children: React.ReactNode }> = ({
  isLoading,
  children,
}) => {
  if (!isLoading) return <>{children}</>;

  return (
    <div className="relative">
      <div className="opacity-50 pointer-events-none">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    </div>
  );
};

export default Spinner;