// src/modules/matching/vector.service.ts

import { PropertyType, Purpose } from '@prisma/client';

export class VectorService {
  // ============================================
  // Create User Preference Vector
  // ============================================
  createUserVector(preferences: {
    budgetMin: number;
    budgetMax: number;
    location: string;
    propertyType: PropertyType;
    bedrooms: number;
    bathrooms: number;
    amenities: string[];
    purpose: Purpose;
    parkingNeeded: boolean;
  }): number[] {
    const avgBudget = (preferences.budgetMin + preferences.budgetMax) / 2;
    
    return [
      this.normalizeBudget(avgBudget),
      this.normalizeLocation(preferences.location),
      this.normalizePropertyType(preferences.propertyType),
      this.normalizeBedrooms(preferences.bedrooms),
      this.normalizeBathrooms(preferences.bathrooms),
      this.normalizeAmenities(preferences.amenities),
      this.normalizePurpose(preferences.purpose),
      this.normalizeParking(preferences.parkingNeeded),
    ];
  }

  // ============================================
  // Create Property Vector
  // ============================================
  createPropertyVector(property: {
    price: number;
    location: string;
    propertyType: PropertyType;
    bedrooms: number;
    bathrooms: number;
    amenities: string[];
    purpose: Purpose;
    parking: boolean;
  }): number[] {
    return [
      this.normalizeBudget(property.price),
      this.normalizeLocation(property.location),
      this.normalizePropertyType(property.propertyType),
      this.normalizeBedrooms(property.bedrooms),
      this.normalizeBathrooms(property.bathrooms),
      this.normalizeAmenities(property.amenities),
      this.normalizePurpose(property.purpose),
      this.normalizeParking(property.parking),
    ];
  }

  // ============================================
  // Cosine Similarity Calculation
  // ============================================
  calculateCosineSimilarity(vec1: number[], vec2: number[]): number {
    if (vec1.length !== vec2.length) {
      throw new Error('Vectors must have same length');
    }

    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;

    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i];
      magnitude1 += vec1[i] * vec1[i];
      magnitude2 += vec2[i] * vec2[i];
    }

    magnitude1 = Math.sqrt(magnitude1);
    magnitude2 = Math.sqrt(magnitude2);

    if (magnitude1 === 0 || magnitude2 === 0) {
      return 0;
    }

    return dotProduct / (magnitude1 * magnitude2);
  }

  // ============================================
  // Get Top Matches
  // ============================================
  getTopMatches<T>(
    userVector: number[],
    items: T[],
    getVector: (item: T) => number[],
    limit: number = 10
  ): { item: T; score: number }[] {
    const scores = items.map((item) => ({
      item,
      score: this.calculateCosineSimilarity(userVector, getVector(item)),
    }));

    scores.sort((a, b) => b.score - a.score);
    return scores.slice(0, limit);
  }

  // ============================================
  // Normalization Functions
  // ============================================
  
  private normalizeBudget(value: number): number {
    return Math.min(value / 50000000, 1);
  }

  private normalizeLocation(location: string): number {
    const locationMap: { [key: string]: number } = {
      'kathmandu': 1.0,
      'lalitpur': 0.9,
      'bhaktapur': 0.8,
      'pokhara': 0.7,
      'other': 0.5,
    };
    return locationMap[location.toLowerCase()] || 0.5;
  }

  private normalizePropertyType(type: PropertyType): number {
    const typeMap: { [key: string]: number } = {
      'HOUSE': 1.0,
      'RESIDENTIAL_LAND': 0.7,
      'COMMERCIAL_LAND': 0.6,
      'AGRICULTURAL_LAND': 0.5,
      'INDUSTRIAL_LAND': 0.4,
      'SHOP': 0.8,
      'OFFICE': 0.75,
      'WAREHOUSE': 0.6,
      'HOTEL': 0.85,
      'RESTAURANT': 0.8,
    };
    return typeMap[type] || 0.5;
  }

  private normalizeBedrooms(value: number): number {
    return Math.min(value / 5, 1);
  }

  private normalizeBathrooms(value: number): number {
    return Math.min(value / 3, 1);
  }

  private normalizeAmenities(amenities: string[]): number {
    return Math.min(amenities.length / 10, 1);
  }

  private normalizePurpose(purpose: Purpose): number {
    return purpose === 'SALE' ? 1.0 : 0.5;
  }

  private normalizeParking(parking: boolean): number {
    return parking ? 1.0 : 0.0;
  }
}