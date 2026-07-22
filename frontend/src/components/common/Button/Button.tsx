// src/components/common/Button.tsx

import React from 'react';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClasses = {
  // Primary - Uses: --color-secondary, --color-secondary-hover
  primary:
    'bg-[var(--color-secondary)] text-white hover:bg-[var(--color-secondary-hover)] shadow-md hover:shadow-lg',

  // Secondary - Uses: --color-secondary, --color-secondary-surface
  secondary:
    'bg-white text-[var(--color-secondary)] border-2 border-[var(--color-secondary)] hover:bg-[var(--color-secondary-surface)]',

  // Ghost - Uses: --color-secondary, --color-secondary-surface
  ghost:
    'text-[var(--color-secondary)] hover:bg-[var(--color-secondary-surface)]',

  // Outline - Uses: --color-primary-border, --color-primary-hover, --color-text-primary
  outline:
    'border-2 border-[var(--color-primary-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-primary-hover)] hover:border-[var(--color-secondary)]',
};

const sizeClasses = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-3 text-base rounded-xl',
  lg: 'px-8 py-4 text-lg rounded-xl',
  xl: 'px-10 py-5 text-xl rounded-xl',
};

export const Button: React.FC<ButtonProps> = ({
  className = '',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  loadingText,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-secondary)] disabled:opacity-50 disabled:cursor-not-allowed';

  const widthClass = fullWidth ? 'w-full' : '';
  const variantClass = variantClasses[variant] || variantClasses.primary;
  const sizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <button
      className={`${baseClasses} ${variantClass} ${sizeClass} ${widthClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5"
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
          {loadingText || 'Loading...'}
        </>
      ) : (
        <>
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;