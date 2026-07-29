// src/types/property.ts

export type AreaUnit = 'DHUR' | 'AANA' | 'ROPANI' | 'BISWA' | 'KATHA' | 'SQFT' | 'SQUARE_FEET' | 'SQUARE_METER' | 'HECTARE';

export type PropertyType = 
  | 'HOUSE'
  | 'RESIDENTIAL_LAND'
  | 'COMMERCIAL_LAND'
  | 'AGRICULTURAL_LAND'
  | 'INDUSTRIAL_LAND'
  | 'SHOP'
  | 'OFFICE'
  | 'WAREHOUSE'
  | 'HOTEL'
  | 'RESTAURANT'
  | 'APARTMENT'
  | 'VILLA'
  | 'BUNGALOW';

export type PropertyStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SOLD' | 'RENTED' | 'INACTIVE';
export type PropertyPurpose = 'SALE' | 'RENT' | 'LEASE';

export interface Property {
  id: string;
  propertyId: string;
  title: string;
  description?: string;
  price: number;
  location: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  areaUnit?: AreaUnit;
  propertyType: PropertyType;
  purpose: PropertyPurpose;
  amenities: string[];
  features?: string[];
  images: string[];
  mainImage?: string;
  videos?: string[];
  status: PropertyStatus;
  parking: boolean;
  furnished?: boolean;
  floor?: number;
  totalFloors?: number;
  yearBuilt?: number;
  views: number;
  favoritesCount: number;
  isFeatured: boolean;
  isVerified: boolean;
  isPremium?: boolean;
  rejectionReason?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  soldAt?: string;
  averageRating: number;
  totalReviews: number;
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatarUrl?: string;
  };
}