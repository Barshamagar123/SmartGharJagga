// src/modules/matching/matching.types.ts

import { PropertyType, Purpose } from '@prisma/client';

export interface UserPreferences {
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

export interface PropertyVector {
  id: string;
  title: string;
  price: number;
  location: string;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  purpose: Purpose;
  parking: boolean;
  vector: number[];
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
  matchScore: number;
  matchPercentage: string;
  mainImage?: string;
}

export interface AgentMatchResult {
  agentId: string;
  agentName: string;
  company: string;
  experience: number;
  rating: number;
  specialization: string[];
  matchScore: number;
  matchPercentage: string;
}

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