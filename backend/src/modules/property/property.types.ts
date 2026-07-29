// src/modules/property/property.types.ts

import { PropertyType, PropertyStatus } from '@prisma/client';
import { Request } from 'express';

// ✅ Add AreaUnit type
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
  areaUnit?: AreaUnit; // ✅ ADDED
  propertyType: PropertyType;
  amenities?: string[];
  parking?: boolean;
  floor?: number;
  yearBuilt?: number;
  images?: string[];
  videos?: string[];
  isFeatured?: boolean; // ✅ ADDED
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
  areaUnit?: AreaUnit; // ✅ ADDED
  propertyType?: PropertyType;
  amenities?: string[];
  parking?: boolean;
  floor?: number;
  yearBuilt?: number;
  status?: PropertyStatus;
  images?: string[];
  videos?: string[];
  isFeatured?: boolean; // ✅ ADDED
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
  status?: PropertyStatus;
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'createdAt' | 'views';
  sortOrder?: 'asc' | 'desc';
  isFeatured?: boolean; // ✅ ADDED
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}