// src/modules/matching/matching.service.ts

import { PrismaClient } from '@prisma/client';
import { ApiError } from '@/utils/apiError';
import { VectorService } from './vector.service';
import {
  UserPreferences,
  MatchResult,
  AgentMatchResult,
  PreferenceRequest,
} from './matching.types';

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
    // Get user preferences
    const preferences = await this.prisma.userPreference.findUnique({
      where: { userId },
    });

    if (!preferences) {
      throw new ApiError(404, 'User preferences not found. Please set preferences first.');
    }

    // Get user vector
    const userVector = preferences.propertyVector as number[];
    if (!userVector || userVector.length === 0) {
      throw new ApiError(400, 'User preferences vector not found. Please update preferences.');
    }

    // Get all approved properties
    const properties = await this.prisma.property.findMany({
      where: {
        status: 'APPROVED',
        // Filter by user's preferences
        propertyType: preferences.propertyType || undefined,
        bedrooms: preferences.bedrooms ? { gte: preferences.bedrooms - 1 } : undefined,
        price: {
          gte: preferences.budgetMin || 0,
          lte: preferences.budgetMax || 999999999,
        },
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

    // Calculate similarity scores
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
        mainImage: property.mainImage || null,
        matchScore: score,
        matchPercentage: `${Math.round(score * 100)}%`,
      };
    });

    // Sort by score (highest first)
    matches.sort((a, b) => b.matchScore - a.matchScore);

    // Return top 10 matches
    return matches.slice(0, 10);
  }

  // ============================================
  // 3. Get Agent Matches
  // ============================================
  async getAgentMatches(userId: string): Promise<AgentMatchResult[]> {
    // Get user preferences
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

    // Get all verified agents
    const agents = await this.prisma.agent.findMany({
      where: {
        verified: true,
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

    if (agents.length === 0) {
      return [];
    }

    // Calculate similarity scores for agents
    const matches = agents.map((agent) => {
      // Create agent vector based on specialization and location
      const agentVector = this.createAgentVector(agent);

      const score = this.vectorService.calculateCosineSimilarity(
        userVector,
        agentVector
      );

      return {
        agentId: agent.id,
        agentName: agent.user.name,
        company: agent.company || 'Independent',
        experience: agent.experience || 0,
        rating: Number(agent.rating) || 0,
        specialization: agent.specialization || [],
        matchScore: score,
        matchPercentage: `${Math.round(score * 100)}%`,
      };
    });

    matches.sort((a, b) => b.matchScore - a.matchScore);
    return matches.slice(0, 5);
  }

  // ============================================
  // 4. Get User Preferences
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
  // 5. Get Match Count
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
  // Helper: Create Agent Vector
  // ============================================
  private createAgentVector(agent: any): number[] {
    // Map specialization to numeric values
    const specializationValue = agent.specialization?.length || 0;
    
    // Map location to numeric value
    const locationValue = agent.location 
      ? this.vectorService['normalizeLocation'](agent.location)
      : 0.5;

    // Experience value (normalized)
    const experienceValue = Math.min((agent.experience || 0) / 20, 1);

    // Rating value (normalized)
    const ratingValue = (Number(agent.rating) || 0) / 5;

    return [
      locationValue,
      specializationValue / 5,
      experienceValue,
      ratingValue,
    ];
  }
}