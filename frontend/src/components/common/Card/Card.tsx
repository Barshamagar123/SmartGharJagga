// src/components/common/Card.tsx

import React from 'react';

// Utility function for conditional class names
const cn = (...classes: (string | undefined | boolean | null | number)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'hover' | 'elevated' | 'outline' | 'ghost' | 'glass';
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  as?: 'div' | 'article' | 'section';
  withBorder?: boolean;
  interactive?: boolean;
}

// Variant configurations
const variantClasses: Record<NonNullable<CardProps['variant']>, string> = {
  default: 'bg-white shadow-sm',
  hover: 'bg-white shadow-sm hover:shadow-lg hover:-translate-y-0.5',
  elevated: 'bg-white shadow-md hover:shadow-lg',
  outline: 'bg-transparent border-2 border-gray-200 hover:border-gray-400',
  ghost: 'bg-transparent hover:bg-gray-50',
  glass: 'bg-white/80 backdrop-blur-md border border-white/20 shadow-lg',
};

const paddingClasses: Record<NonNullable<CardProps['padding']>, string> = {
  none: 'p-0',
  xs: 'p-2',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-5',
};

const radiusClasses: Record<NonNullable<CardProps['radius']>, string> = {
  none: 'rounded-none',
  sm: 'rounded',
  md: 'rounded-lg',
  lg: 'rounded-xl',
  xl: 'rounded-2xl',
  full: 'rounded-3xl',
};

export const Card: React.FC<CardProps> = ({
  className = '',
  variant = 'default',
  padding = 'md',
  radius = 'lg',
  as: Component = 'div',
  withBorder = true,
  interactive = false,
  children,
  ...props
}) => {
  const baseClasses = [
    'transition-all duration-200 ease-in-out',
    withBorder && 'border border-gray-200/80',
    variantClasses[variant],
    paddingClasses[padding],
    radiusClasses[radius],
    interactive && 'cursor-pointer active:scale-[0.98]',
    className,
  ];

  return (
    <Component className={cn(...baseClasses)} {...props}>
      {children}
    </Component>
  );
};

// Header Component
export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div
    className={cn(
      'flex items-center justify-between border-b border-gray-200/80 pb-2.5 mb-2.5',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

// Title Component
export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <h3
    className={cn(
      'text-base font-semibold tracking-tight text-gray-900',
      className
    )}
    {...props}
  >
    {children}
  </h3>
);

// Description Component
export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <p
    className={cn(
      'text-xs text-gray-500 font-normal leading-relaxed',
      className
    )}
    {...props}
  >
    {children}
  </p>
);

// Content Component
export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div
    className={cn(
      'text-sm text-gray-700 leading-relaxed',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

// Footer Component
export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div
    className={cn(
      'flex items-center justify-end gap-2 border-t border-gray-200/80 pt-2.5 mt-2.5',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

// Actions Component
export const CardActions: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div
    className={cn(
      'flex items-center gap-1.5 mt-2',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

// Badge Component
export interface CardBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
  size?: 'sm' | 'md';
}

export const CardBadge: React.FC<CardBadgeProps> = ({
  className = '',
  variant = 'default',
  size = 'sm',
  children,
  ...props
}) => {
  const badgeClasses: Record<NonNullable<CardBadgeProps['variant']>, string> = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-50 text-green-700',
    warning: 'bg-yellow-50 text-yellow-700',
    danger: 'bg-red-50 text-red-700',
    info: 'bg-blue-50 text-blue-700',
    purple: 'bg-purple-50 text-purple-700',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        badgeClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

// Divider Component
export const CardDivider: React.FC<React.HTMLAttributes<HTMLHRElement>> = ({
  className = '',
  ...props
}) => (
  <hr
    className={cn(
      'my-2.5 border-t border-gray-200/80',
      className
    )}
    {...props}
  />
);

// Image Component
export const CardImage: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = ({
  className = '',
  alt = '',
  ...props
}) => (
  <img
    className={cn(
      'w-full h-auto object-cover -m-4 mb-0 rounded-t-xl',
      className
    )}
    alt={alt}
    {...props}
  />
);

export default Card;