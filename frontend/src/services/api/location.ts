// src/services/api/location.ts

import apiClient from './client';

export const locationApi = {
  // ✅ Get all unique locations
  getAllLocations: async (): Promise<string[]> => {
    try {
      const response = await apiClient.get('/properties/locations');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching locations:', error);
      return [];
    }
  },

  // ✅ Search locations
  searchLocations: async (query: string): Promise<string[]> => {
    try {
      const response = await apiClient.get(`/properties/locations/search?q=${encodeURIComponent(query)}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error searching locations:', error);
      return [];
    }
  },

  // ✅ Get popular locations
  getPopularLocations: async (limit: number = 10): Promise<string[]> => {
    try {
      const response = await apiClient.get(`/properties/locations/popular?limit=${limit}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching popular locations:', error);
      return [];
    }
  },
};