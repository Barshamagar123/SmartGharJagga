// src/services/api/matching.ts

import axios from 'axios';
import type { PropertyType } from '../../types/property';
import type { Purpose } from './property';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

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

export const matchingApi = {
  // ✅ Save user preferences
  savePreferences: async (preferences: UserPreferences): Promise<any> => {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/matching/preferences`,
      preferences,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  // ✅ Get property matches
  getMatches: async (): Promise<MatchResult[]> => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/matching/properties`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  // ✅ Get user preferences
  getUserPreferences: async (): Promise<UserPreferences> => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/matching/preferences`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },

  // ✅ Get match count
  getMatchCount: async (): Promise<number> => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/matching/count`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data.count;
  },

  // ✅ Learn from user behavior
  updateFromBehavior: async (propertyId: string): Promise<void> => {
    const token = localStorage.getItem('token');
    await axios.post(
      `${API_URL}/matching/learn`,
      { propertyId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
};