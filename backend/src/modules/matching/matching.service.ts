// src/modules/matching/matching.service.ts

import { PrismaClient, PropertyType, Purpose } from '@prisma/client';
import { ApiError } from '@/utils/apiError';
import { VectorService } from './vector.service';
import { PreferenceRequest, MatchResult } from './matching.types';

export class MatchingService {
  private vectorService: VectorService;

  constructor(private prisma: PrismaClient) {
    this.vectorService = new VectorService();
  }

  // ============================================
  // 1. Save User Preferences
  // ============================================
  async savePreferences(userId: string, data: PreferenceRequest) {
    const existing = await this.prisma.userPreference.findUnique({
      where: { userId },
    });

    const userVector = this.vectorService.createUserVector(data);

    if (existing) {
      return await this.prisma.userPreference.update({
        where: { userId },
        data: {
          budgetMin: data.budgetMin,
          budgetMax: data.budgetMax,
          propertyType: data.propertyType,
          location: data.location,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          amenities: data.amenities,
          purpose: data.purpose,
          parkingNeeded: data.parkingNeeded,
          propertyVector: userVector,
        },
      });
    }

    return await this.prisma.userPreference.create({
      data: {
        userId,
        budgetMin: data.budgetMin,
        budgetMax: data.budgetMax,
        propertyType: data.propertyType,
        location: data.location,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        amenities: data.amenities,
        purpose: data.purpose,
        parkingNeeded: data.parkingNeeded,
        propertyVector: userVector,
      },
    });
  }

  // ============================================
  // 2. Get Property Matches
  // ============================================
  async getPropertyMatches(userId: string): Promise<MatchResult[]> {
    const preferences = await this.prisma.userPreference.findUnique({
      where: { userId },
    });

    if (!preferences) {
      throw new ApiError(404, 'User preferences not found. Please set preferences first.');
    }

    const userVector = preferences.propertyVector as number[];
    if (!userVector || userVector.length === 0) {
      throw new ApiError(400, 'User preferences vector not found.');
    }

    const properties = await this.prisma.property.findMany({
      where: {
        status: 'APPROVED',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (properties.length === 0) {
      return [];
    }

    const matches = properties.map((property) => {
      const propertyVector = this.vectorService.createPropertyVector({
        price: Number(property.price),
        location: property.location,
        propertyType: property.propertyType,
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        amenities: property.amenities,
        purpose: property.purpose,
        parking: property.parking,
      });

      const score = this.vectorService.calculateCosineSimilarity(
        userVector,
        propertyVector
      );

      return {
        propertyId: property.id,
        propertyTitle: property.title,
        price: Number(property.price),
        location: property.location,
        propertyType: property.propertyType,
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        images: property.images || [],
        mainImage: property.mainImage || undefined,
        matchScore: score,
        matchPercentage: `${Math.round(score * 100)}%`,
      };
    });

    matches.sort((a, b) => b.matchScore - a.matchScore);
    return matches.slice(0, 10);
  }

  // ============================================
  // 3. Get User Preferences
  // ============================================
  async getUserPreferences(userId: string) {
    const preferences = await this.prisma.userPreference.findUnique({
      where: { userId },
    });

    if (!preferences) {
      throw new ApiError(404, 'User preferences not found');
    }

    return preferences;
  }

  // ============================================
  // 4. Get Match Count
  // ============================================
  async getMatchCount(userId: string): Promise<number> {
    const preferences = await this.prisma.userPreference.findUnique({
      where: { userId },
    });

    if (!preferences) {
      return 0;
    }

    const userVector = preferences.propertyVector as number[];
    if (!userVector || userVector.length === 0) {
      return 0;
    }

    const properties = await this.prisma.property.findMany({
      where: {
        status: 'APPROVED',
      },
      select: {
        id: true,
        price: true,
        location: true,
        propertyType: true,
        bedrooms: true,
        bathrooms: true,
        amenities: true,
        purpose: true,
        parking: true,
      },
    });

    let matchCount = 0;
    for (const property of properties) {
      const propertyVector = this.vectorService.createPropertyVector({
        price: Number(property.price),
        location: property.location,
        propertyType: property.propertyType,
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        amenities: property.amenities,
        purpose: property.purpose,
        parking: property.parking,
      });

      const score = this.vectorService.calculateCosineSimilarity(
        userVector,
        propertyVector
      );

      if (score > 0.5) {
        matchCount++;
      }
    }

    return matchCount;
  }

  // ============================================
  // 5. Update Preferences Based on Behavior (Learning)
  // ============================================
  async updatePreferencesFromBehavior(userId: string, propertyId: string) {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new ApiError(404, 'Property not found');
    }

    const existing = await this.prisma.userPreference.findUnique({
      where: { userId },
    });

    if (!existing) {
      throw new ApiError(404, 'User preferences not found');
    }

    // Adjust budget based on viewed property
    const currentBudgetMin = Number(existing.budgetMin) || 0;
    const currentBudgetMax = Number(existing.budgetMax) || 100000000;
    const propertyPrice = Number(property.price);

    const newBudgetMin = Math.min(currentBudgetMin, propertyPrice * 0.8);
    const newBudgetMax = Math.max(currentBudgetMax, propertyPrice * 1.2);

    // Update preferences
    return await this.prisma.userPreference.update({
      where: { userId },
      data: {
        budgetMin: newBudgetMin,
        budgetMax: newBudgetMax,
        propertyType: property.propertyType,
        bedrooms: property.bedrooms || existing.bedrooms,
        bathrooms: property.bathrooms || existing.bathrooms,
        amenities: property.amenities,
        propertyVector: this.vectorService.createUserVector({
          budgetMin: newBudgetMin,
          budgetMax: newBudgetMax,
          location: existing.location || 'Kathmandu',
          propertyType: property.propertyType,
          bedrooms: property.bedrooms || 0,
          bathrooms: property.bathrooms || 0,
          amenities: property.amenities,
          purpose: property.purpose,
          parkingNeeded: property.parking,
        }),
      },
    });
  }
}