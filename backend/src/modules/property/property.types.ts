// src/modules/property/property.types.ts

import { PropertyType, PropertyStatus } from '@prisma/client';
import { Request } from 'express';

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
  propertyType: PropertyType;
  amenities?: string[];
  parking?: boolean;
  floor?: number;
  yearBuilt?: number;
  images?: string[];
  videos?: string[];  // ✅ NEW
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
  propertyType?: PropertyType;
  amenities?: string[];
  parking?: boolean;
  floor?: number;
  yearBuilt?: number;
  status?: PropertyStatus;
  images?: string[];
  videos?: string[];  // ✅ NEW
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
}

export interface PropertyResponse {
  id: string;
  propertyId: string;
  title: string;
  description?: string;
  price: number;
  location: string;
  latitude?: number;
  longitude?: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  propertyType: PropertyType;
  amenities: string[];
  images: string[];
  videos: string[];  // ✅ NEW
  mainImage?: string;
  status: PropertyStatus;
  parking: boolean;
  floor?: number;
  yearBuilt?: number;
  views: number;
  favoritesCount: number;
  isFeatured: boolean;
  isVerified: boolean;
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatarUrl?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}