// src/services/api/matching.ts

import apiClient from './client';

export interface PreferenceRequest {
  budgetMin: number;
  budgetMax: number;
  location: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  purpose: string;
  parkingNeeded: boolean;
}

export interface MatchResult {
  propertyId: string;
  propertyTitle: string;
  price: number;
  location: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  mainImage?: string;
  matchScore: number;
  matchPercentage: string;
}

export interface UserPreferences {
  id: string;
  userId: string;
  budgetMin: number;
  budgetMax: number;
  location: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  purpose: string;
  parkingNeeded: boolean;
  propertyVector: number[];
  createdAt: string;
  updatedAt: string;
}

export const matchingApi = {
  // ✅ Save user preferences
  savePreferences: async (preferences: PreferenceRequest): Promise<UserPreferences> => {
    try {
      const response = await apiClient.post('/matching/preferences', preferences);
      return response.data.data;
    } catch (error: any) {
      console.error('Error saving preferences:', error);
      if (error.response?.status === 401) {
        throw new Error('Please login to save preferences');
      }
      throw error;
    }
  },

  // ✅ Get property matches
  getPropertyMatches: async (): Promise<MatchResult[]> => {
    try {
      const response = await apiClient.get('/matching/properties');
      return response.data.data || [];
    } catch (error: any) {
      console.error('Error getting matches:', error);
      if (error.response?.status === 401) {
        throw new Error('Please login to view matches');
      }
      return [];
    }
  },

  // ✅ Get user preferences
  getUserPreferences: async (): Promise<UserPreferences | null> => {
    try {
      const response = await apiClient.get('/matching/preferences');
      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null; // No preferences found
      }
      console.error('Error getting preferences:', error);
      return null;
    }
  },

  // ✅ Get match count
  getMatchCount: async (): Promise<number> => {
    try {
      const response = await apiClient.get('/matching/count');
      return response.data.data.count || 0;
    } catch (error: any) {
      console.error('Error getting match count:', error);
      return 0;
    }
  },

  // ✅ Update preferences from behavior (learning)
  updateFromBehavior: async (propertyId: string): Promise<UserPreferences> => {
    try {
      const response = await apiClient.post('/matching/learn', { propertyId });
      return response.data.data;
    } catch (error: any) {
      console.error('Error updating from behavior:', error);
      throw error;
    }
  },
};