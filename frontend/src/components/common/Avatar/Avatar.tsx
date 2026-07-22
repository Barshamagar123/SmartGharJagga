// src/components/common/Avatar.tsx

import React from 'react';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'default' | 'primary' | 'secondary' | 'gold';
  status?: 'online' | 'offline' | 'away' | 'busy';
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
  '2xl': 'w-20 h-20 text-2xl',
};

const variantClasses = {
  default: 'bg-[#EDE8E2] text-[#475569]',
  primary: 'bg-[#2D5A27] text-white',
  secondary: 'bg-[#E8F0E4] text-[#2D5A27]',
  gold: 'bg-[#D4AF37] text-white',
};

const statusColors = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  away: 'bg-yellow-500',
  busy: 'bg-red-500',
};

export const Avatar: React.FC<AvatarProps> = ({
  className = '',
  src,
  alt,
  name,
  size = 'md',
  variant = 'default',
  status,
  children,
  ...props
}) => {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '';

  const sizeClass = sizeClasses[size] || sizeClasses.md;
  const variantClass = variantClasses[variant] || variantClasses.default;
  const statusColor = status ? statusColors[status] : '';

  return (
    <div className="relative inline-block">
      <div
        className={`relative inline-flex items-center justify-center overflow-hidden rounded-full flex-shrink-0 ${sizeClass} ${variantClass} ${className}`}
        {...props}
      >
        {src ? (
          <img src={src} alt={alt || name} className="w-full h-full object-cover" />
        ) : children ? (
          children
        ) : (
          <span className="font-medium">{initials || '?'}</span>
        )}
      </div>
      {status && (
        <span
          className={`absolute bottom-0 right-0 rounded-full border-2 border-white ${
            statusColor
          } ${
            size === 'xs'
              ? 'w-2 h-2'
              : size === 'sm'
              ? 'w-2.5 h-2.5'
              : size === 'lg' || size === 'xl' || size === '2xl'
              ? 'w-3.5 h-3.5'
              : 'w-3 h-3'
          }`}
        />
      )}
    </div>
  );
};

export const AvatarGroup: React.FC<{
  children: React.ReactNode;
  max?: number;
  className?: string;
}> = ({ children, max = 4, className = '' }) => {
  const childrenArray = React.Children.toArray(children);
  const visible = childrenArray.slice(0, max);
  const remaining = childrenArray.length - max;

  return (
    <div className={`flex -space-x-2 ${className}`}>
      {visible}
      {remaining > 0 && (
        <div className="w-10 h-10 rounded-full bg-[#EDE8E2] flex items-center justify-center text-sm font-medium text-[#475569] border-2 border-white">
          +{remaining}
        </div>
      )}
    </div>
  );
};

export default Avatar;