// src/constants/filters.ts

export const BEDROOM_OPTIONS = ['Any', '1+', '2+', '3+', '4+', '5+'];
export const BATHROOM_OPTIONS = ['Any', '1+', '2+', '3+', '4+'];
export const PROPERTY_TYPE_OPTIONS = [
  { value: '', label: 'Any' },
  { value: 'house', label: 'House' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'villa', label: 'Villa' },
  { value: 'bungalow', label: 'Bungalow' },
  { value: 'land', label: 'Land' },
  { value: 'commercial', label: 'Commercial' },
];
export const SORT_OPTIONS = [
  { value: 'latest', label: 'Sort by: Latest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
];