// src/components/common/Badge.tsx

import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'gold'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'pending'
    | 'approved'
    | 'rejected'
    | 'sold'
    | 'rented'
    | 'featured'
    | 'verified';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  removable?: boolean;
  onRemove?: () => void;
}

const variantClasses = {
  default: 'bg-[#EDE8E2] text-[#475569]',
  primary: 'bg-[#2D5A27] text-white',
  secondary: 'bg-[#E8F0E4] text-[#2D5A27]',
  gold: 'bg-[#D4AF37] text-white',
  success: 'bg-green-500 text-white',
  warning: 'bg-yellow-500 text-white',
  danger: 'bg-red-500 text-white',
  info: 'bg-blue-500 text-white',
  pending: 'bg-yellow-500 text-white',
  approved: 'bg-green-500 text-white',
  rejected: 'bg-red-500 text-white',
  sold: 'bg-gray-500 text-white',
  rented: 'bg-blue-500 text-white',
  featured: 'bg-[#D4AF37] text-white',
  verified: 'bg-[#2D5A27] text-white',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-3 py-1 text-xs',
  lg: 'px-4 py-1.5 text-sm',
};

export const Badge: React.FC<BadgeProps> = ({
  className = '',
  variant = 'default',
  size = 'md',
  dot = false,
  removable = false,
  onRemove,
  children,
  ...props
}) => {
  const baseClass =
    'inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200';
  const variantClass = variantClasses[variant] || variantClasses.default;
  const sizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <span
      className={`${baseClass} ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
            variant === 'success' || variant === 'approved' ? 'bg-white' : 'bg-current'
          }`}
        />
      )}
      {children}
      {removable && (
        <button
          onClick={onRemove}
          className="ml-1.5 hover:opacity-70 transition-opacity"
          type="button"
        >
          ×
        </button>
      )}
    </span>
  );
};

export default Badge;