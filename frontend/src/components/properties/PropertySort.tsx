// src/components/properties/PropertySort.tsx

import React from 'react';
import { SORT_OPTIONS } from '../../constants/filters';

interface PropertySortProps {
  value: string;
  onChange: (value: string) => void;
}

const PropertySort: React.FC<PropertySortProps> = ({ value, onChange }) => {
  return (
    <div className="flex justify-end items-center mb-6 mt-2"> {/* Added mt-2 */}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none pl-5 pr-10 py-2.5 bg-white border border-[var(--color-primary-border)] rounded-full text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[#2D5A27]"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--color-text-tertiary)]"
          viewBox="0 0 12 8"
          fill="none"
          aria-hidden="true"
        >
          <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
};

export default PropertySort;