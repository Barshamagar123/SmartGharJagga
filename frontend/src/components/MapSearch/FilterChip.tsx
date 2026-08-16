// src/components/FilterChip.tsx

import React from 'react';

interface FilterChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'success' | 'danger' | 'warning';
}

const FilterChip: React.FC<FilterChipProps> = ({ 
  label, 
  active = false, 
  onClick, 
  size = 'md',
  variant = 'default'
}) => {
  // ✅ Size variants
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  // ✅ Color variants based on active state
  const getStyles = () => {
    if (active) {
      return {
        background: '#A4142C',
        color: '#FFFFFF',
        border: '1px solid #A4142C',
      };
    }

    switch (variant) {
      case 'primary':
        return {
          background: '#E8F0E4',
          color: '#2D5A27',
          border: '1px solid #2D5A27',
        };
      case 'success':
        return {
          background: '#E4F1EA',
          color: '#186B4C',
          border: '1px solid #186B4C',
        };
      case 'danger':
        return {
          background: '#FAECEF',
          color: '#A4142C',
          border: '1px solid #EFC4CB',
        };
      case 'warning':
        return {
          background: '#FAF1DC',
          color: '#B07C1E',
          border: '1px solid #D9A93F',
        };
      default:
        return {
          background: '#FFFFFF',
          color: '#333A44',
          border: '1px solid #D3CFC5',
        };
    }
  };

  const styles = getStyles();

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center rounded-lg font-medium transition-all duration-200 hover:scale-105 ${sizeClasses[size]}`}
      style={{
        minHeight: size === 'sm' ? 28 : size === 'md' ? 36 : 44,
        background: styles.background,
        color: styles.color,
        border: styles.border,
        fontFamily: 'Mukta, sans-serif',
        boxShadow: active ? '0 2px 8px rgba(164, 20, 44, 0.25)' : 'none',
      }}
    >
      {label}
      {active && (
        <span className="ml-1.5 text-xs">✓</span>
      )}
    </button>
  );
};

export default FilterChip;