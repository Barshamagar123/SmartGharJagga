// src/services/api/map.ts

import apiClient from './client';

export interface PropertyLocation {
  id: string;
  title: string;
  price: number;
  location: string;
  latitude: number;
  longitude: number;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  mainImage?: string;
}

export interface NearbyPlace {
  id: string;
  name: string;
  address?: string;
  type: 'school' | 'hospital' | 'market' | 'park' | 'restaurant' | 'bank' | 'pharmacy' | 'supermarket' | 'cafe' | 'gym';
  lat: number;
  lng: number;
  distance: number;
  rating?: number;
  userRatingsTotal?: number;
  priceLevel?: number;
  phoneNumber?: string;
  website?: string;
  openingHours?: string[];
  photoReference?: string;
  isOpen?: boolean;
}

export interface HeatMapData {
  lat: number;
  lng: number;
  weight: number;
  propertyId?: string;
}

export const mapApi = {
  getLocations: async (): Promise<PropertyLocation[]> => {
    try {
      const response = await apiClient.get('/map/locations');
      return response.data.data.locations || [];
    } catch (error) {
      console.error('Error fetching property locations:', error);
      return [];
    }
  },

  getHeatMap: async (): Promise<HeatMapData[]> => {
    try {
      const response = await apiClient.get('/map/heatmap');
      return response.data.data.data || [];
    } catch (error) {
      console.error('Error fetching heat map data:', error);
      return [];
    }
  },

  getPriceHeatMap: async (): Promise<HeatMapData[]> => {
    try {
      const response = await apiClient.get('/map/price-heatmap');
      return response.data.data.data || [];
    } catch (error) {
      console.error('Error fetching price heat map data:', error);
      return [];
    }
  },

  searchByArea: async (lat: number, lng: number, radius: number): Promise<PropertyLocation[]> => {
    try {
      const response = await apiClient.post('/map/search-area', { lat, lng, radius });
      return response.data.data.properties || [];
    } catch (error) {
      console.error('Error searching by area:', error);
      return [];
    }
  },

  getNearbyPlaces: async (params: {
    lat: number;
    lng: number;
    radius?: number;
    types?: string[];
    limit?: number;
    keyword?: string;
    minRating?: number;
  }): Promise<NearbyPlace[]> => {
    try {
      const response = await apiClient.get('/map/nearby', { params });
      return response.data.data.places || [];
    } catch (error) {
      console.error('Error fetching nearby places:', error);
      return [];
    }
  },

  getNearestProperties: async (lat: number, lng: number, limit: number = 10): Promise<PropertyLocation[]> => {
    try {
      const response = await apiClient.get('/map/nearest', { params: { lat, lng, limit } });
      return response.data.data.properties || [];
    } catch (error) {
      console.error('Error fetching nearest properties:', error);
      return [];
    }
  },

  getPropertyLocation: async (id: string): Promise<PropertyLocation | null> => {
    try {
      const response = await apiClient.get(`/map/property/${id}/location`);
      return response.data.data || null;
    } catch (error) {
      console.error('Error fetching property location:', error);
      return null;
    }
  },

  getPlacePhotoUrl: (photoReference: string, maxWidth: number = 400): string => {
    return `${import.meta.env.VITE_API_URL}/map/photo?photoReference=${photoReference}&maxWidth=${maxWidth}`;
  },
};