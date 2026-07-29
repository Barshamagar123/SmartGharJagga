// src/utils/areaUtils.ts

// ✅ Area Unit Options for Dropdown
export const AREA_UNIT_OPTIONS = [
  { value: 'DHUR', label: 'Dhur' },
  { value: 'AANA', label: 'Aana' },
  { value: 'ROPANI', label: 'Ropani' },
  { value: 'BISWA', label: 'Biswa' },
  { value: 'KATHA', label: 'Katha' },
  { value: 'SQFT', label: 'Sq. Ft.' },
  { value: 'SQUARE_FEET', label: 'Square Feet' },
  { value: 'SQUARE_METER', label: 'Square Meter' },
  { value: 'HECTARE', label: 'Hectare' },
];

// ✅ Area unit mapping
export const AREA_UNITS: Record<string, string> = {
  DHUR: 'Dhur',
  AANA: 'Aana',
  ROPANI: 'Ropani',
  BISWA: 'Biswa',
  KATHA: 'Katha',
  SQFT: 'sqft',
  SQUARE_FEET: 'sqft',
  SQUARE_METER: 'sqm',
  HECTARE: 'Hectare',
};

// ✅ Format area with unit
export const formatArea = (area: number | null | undefined, unit: string | null | undefined): string => {
  if (!area) return 'N/A';
  if (!unit) return `${area}`;
  const displayUnit = AREA_UNITS[unit] || unit;
  return `${area} ${displayUnit}`;
};

// ✅ Get area icon
export const getAreaIcon = (unit: string | null | undefined): string => {
  if (!unit) return '📏';
  const landUnits = ['DHUR', 'AANA', 'ROPANI', 'BISWA', 'KATHA'];
  if (landUnits.includes(unit)) {
    return '📐';
  }
  return '📏';
};

// ✅ Get full area label
export const getAreaLabel = (area: number | null | undefined, unit: string | null | undefined): string => {
  if (!area) return 'Area not specified';
  return formatArea(area, unit);
};