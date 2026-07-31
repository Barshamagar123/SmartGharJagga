// src/types/property.ts

/**
 * Area units supported for land/property measurement
 */
export type AreaUnit =
  | 'DHUR'
  | 'AANA'
  | 'ROPANI'
  | 'BISWA'
  | 'KATHA'
  | 'SQFT'
  | 'SQUARE_FEET'
  | 'SQUARE_METER'
  | 'HECTARE';

/**
 * Property types (matches backend enum)
 */
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

/**
 * Property listing status
 */
export type PropertyStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'SOLD'
  | 'RENTED'
  | 'INACTIVE';

/**
 * Property purpose (sale, rent, lease)
 */
export type PropertyPurpose = 'SALE' | 'RENT' | 'LEASE';

/**
 * Complete Property interface
 * Matches the Prisma schema + relations
 */
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
  /** Agent/Seller info (populated on detail) */
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatarUrl?: string;
  };
}

/**
 * Property filters for listing/search
 */
export interface PropertyFilters {
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
  isFeatured?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'createdAt' | 'views';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated property response
 */
export interface PropertyListResponse {
  properties: Property[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ✅ Export all types
export type { 
  PropertyType as PropertyTypeEnum,
  PropertyStatus as PropertyStatusEnum,
  PropertyPurpose as PropertyPurposeEnum,
};