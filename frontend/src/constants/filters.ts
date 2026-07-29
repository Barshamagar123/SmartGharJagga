// src/constants/filters.ts

export const BEDROOM_OPTIONS = ['Any', '1+', '2+', '3+', '4+', '5+'];
export const BATHROOM_OPTIONS = ['Any', '1+', '2+', '3+', '4+'];
export const PURPOSE_OPTIONS = [
  { value: 'SALE', label: 'For Sale' },
  { value: 'RENT', label: 'For Rent' },
  { value: 'LEASE', label: 'For Lease' },
];
// src/constants/filters.ts

// ✅ Make sure property types match the enum
export const PROPERTY_TYPE_OPTIONS = [
  { value: '', label: 'All Types' },
  { value: 'HOUSE', label: 'House' },
  { value: 'APARTMENT', label: 'Apartment' },
  { value: 'VILLA', label: 'Villa' },
  { value: 'BUNGALOW', label: 'Bungalow' },
  { value: 'RESIDENTIAL_LAND', label: 'Residential Land' },
  { value: 'COMMERCIAL_LAND', label: 'Commercial Land' },
  { value: 'AGRICULTURAL_LAND', label: 'Agricultural Land' },
  { value: 'INDUSTRIAL_LAND', label: 'Industrial Land' },
  { value: 'SHOP', label: 'Shop' },
  { value: 'OFFICE', label: 'Office' },
  { value: 'WAREHOUSE', label: 'Warehouse' },
  { value: 'HOTEL', label: 'Hotel' },
  { value: 'RESTAURANT', label: 'Restaurant' },
];
export const SORT_OPTIONS = [
  { value: 'latest', label: 'Sort by: Latest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
];