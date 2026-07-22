// src/components/properties/PropertyFilters.tsx

import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '../common/Card/Card';
import { BEDROOM_OPTIONS, BATHROOM_OPTIONS, PROPERTY_TYPE_OPTIONS } from '../../constants/filters';

interface PropertyFiltersProps {
  propertyType: string;
  setPropertyType: (value: string) => void;
  maxPrice: number;
  setMaxPrice: (value: number) => void;
  bedrooms: string;
  setBedrooms: (value: string) => void;
  bathrooms: string;
  setBathrooms: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  onApplyFilters: () => void;
}

const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  propertyType,
  setPropertyType,
  maxPrice,
  setMaxPrice,
  bedrooms,
  setBedrooms,
  bathrooms,
  setBathrooms,
  location,
  setLocation,
  onApplyFilters,
}) => {
  return (
    <Card 
      variant="default" 
      padding="md" 
      radius="lg" 
      className="sticky top-28 mt-4" // Added mt-4 and adjusted top
    >
      <CardHeader className="pb-3 mb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <SlidersHorizontal size={17} className="text-[#2D5A27]" aria-hidden="true" />
          Filters
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Property Type */}
        <div>
          <label
            htmlFor="property-type"
            className="text-[11px] font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider block mb-1.5"
          >
            Property type
          </label>
          <div className="relative">
            <select
              id="property-type"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full appearance-none px-4 py-2 text-sm bg-[var(--color-primary-surface)] border border-[var(--color-primary-border)] rounded-full text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[#2D5A27] transition-all"
            >
              {PROPERTY_TYPE_OPTIONS.map((option) => (
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

        {/* Max Price */}
        <div>
          <label
            htmlFor="max-price"
            className="text-[11px] font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider block mb-2"
          >
            Max price <span className="text-[var(--color-text-primary)] normal-case font-semibold">(Rs {maxPrice} Lakh)</span>
          </label>
          <input
            id="max-price"
            type="range"
            min="0"
            max="1000"
            step="10"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            aria-valuetext={`Rs ${maxPrice} Lakh`}
            className="w-full h-1.5 bg-[var(--color-primary-border)] rounded-full appearance-none cursor-pointer accent-[#2D5A27]"
          />
        </div>

        {/* Bedrooms */}
        <fieldset>
          <legend className="text-[11px] font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider block mb-1.5">
            Bedrooms
          </legend>
          <div className="flex flex-wrap gap-1.5">
            {BEDROOM_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setBedrooms(option)}
                aria-pressed={bedrooms === option}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                  bedrooms === option
                    ? 'bg-[#2D5A27] text-white shadow-sm'
                    : 'bg-[var(--color-primary-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-border)]'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Bathrooms */}
        <fieldset>
          <legend className="text-[11px] font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider block mb-1.5">
            Bathrooms
          </legend>
          <div className="flex flex-wrap gap-1.5">
            {BATHROOM_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setBathrooms(option)}
                aria-pressed={bathrooms === option}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                  bathrooms === option
                    ? 'bg-[#2D5A27] text-white shadow-sm'
                    : 'bg-[var(--color-primary-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-border)]'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Location */}
        <div>
          <label
            htmlFor="location"
            className="text-[11px] font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider block mb-1.5"
          >
            Location
          </label>
          <input
            id="location"
            type="text"
            placeholder="e.g. Lalitpur"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-2 text-sm bg-[var(--color-primary-surface)] border border-[var(--color-primary-border)] rounded-full text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[#2D5A27] transition-all"
          />
        </div>
      </CardContent>

      <CardFooter className="pt-3 mt-0">
        <button
          type="button"
          onClick={onApplyFilters}
          className="w-full py-2.5 text-sm bg-[#2D5A27] text-white font-semibold rounded-full hover:bg-[#23461E] transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2D5A27] focus-visible:ring-offset-2"
        >
          Apply Filters
        </button>
      </CardFooter>
    </Card>
  );
};

export default PropertyFilters;