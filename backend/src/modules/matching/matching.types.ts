// src/modules/matching/matching.types.ts

import { PropertyType, Purpose } from '@prisma/client';

export interface PreferenceRequest {
  budgetMin: number;
  budgetMax: number;
  location: string;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  purpose: Purpose;
  parkingNeeded: boolean;
}

export interface MatchResult {
  propertyId: string;
  propertyTitle: string;
  price: number;
  location: string;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  mainImage?: string;
  matchScore: number;
  matchPercentage: string;
}