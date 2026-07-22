// src/components/common/Input.tsx

import React, { forwardRef } from 'react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'error' | 'success' | 'ghost';
  inputSize?: 'sm' | 'md' | 'lg';  // ✅ Renamed to inputSize
}

const variantClasses = {
  default:
    'bg-[#FFFDFB] border-[#EDE8E2] text-[#0F172A] placeholder-[#94A3B8] focus:ring-[#2D5A27] focus:border-transparent',
  error:
    'bg-[#FFFDFB] border-red-500 text-[#0F172A] placeholder-[#94A3B8] focus:ring-red-500 focus:border-transparent',
  success:
    'bg-[#FFFDFB] border-green-500 text-[#0F172A] placeholder-[#94A3B8] focus:ring-green-500 focus:border-transparent',
  ghost:
    'bg-transparent border-transparent text-[#0F172A] placeholder-[#94A3B8] focus:ring-[#2D5A27]',
};

const sizeClasses = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3 text-base',
  lg: 'px-5 py-4 text-lg',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = '',
      variant = 'default',
      inputSize = 'md',  // ✅ Changed from 'size' to 'inputSize'
      label,
      error,
      helper,
      leftIcon,
      rightIcon,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`;
    const variantClass = variantClasses[variant] || variantClasses.default;
    const sizeClass = sizeClasses[inputSize] || sizeClasses.md;  // ✅ Changed

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[#475569] mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${variantClass} ${sizeClass} ${
              leftIcon ? 'pl-10' : ''
            } ${rightIcon ? 'pr-10' : ''} ${className}`}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
              {rightIcon}
            </span>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        {helper && !error && <p className="mt-1 text-sm text-[#94A3B8]">{helper}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;