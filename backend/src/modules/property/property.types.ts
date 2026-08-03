// src/modules/property/property.types.ts

import { PropertyType, PropertyStatus } from '@prisma/client';

export type AreaUnit = 'DHUR' | 'AANA' | 'ROPANI' | 'BISWA' | 'KATHA' | 'SQFT' | 'SQUARE_FEET' | 'SQUARE_METER' | 'HECTARE';

export interface CreatePropertyRequest {
  title: string;
  description?: string;
  price: number;
  location: string;
  latitude?: number;
  longitude?: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  areaUnit?: AreaUnit;
  propertyType: PropertyType;
  amenities?: string[];
  parking?: boolean;
  floor?: number;
  yearBuilt?: number;
  images?: string[];
  videos?: string[];
  isFeatured?: boolean;
}

export interface UpdatePropertyRequest {
  title?: string;
  description?: string;
  price?: number;
  location?: string;
  latitude?: number;
  longitude?: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  areaUnit?: AreaUnit;
  propertyType?: PropertyType;
  amenities?: string[];
  parking?: boolean;
  floor?: number;
  yearBuilt?: number;
  status?: PropertyStatus;
  images?: string[];
  videos?: string[];
  isFeatured?: boolean;
}

export interface PropertyFilter {
  search?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: PropertyType;
  bedrooms?: number;
  bathrooms?: number;
  parking?: boolean;
  amenities?: string[];
  status?: PropertyStatus | 'ALL'; // ✅ Allow 'ALL' as special value
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'createdAt' | 'views';
  sortOrder?: 'asc' | 'desc';
  isFeatured?: boolean;
  userId?: string; // ✅ Added for user filtering
}