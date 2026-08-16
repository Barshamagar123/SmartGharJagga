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
  // ✅ Get all property locations
  getLocations: async (): Promise<PropertyLocation[]> => {
    const response = await apiClient.get('/map/locations');
    return response.data.data.locations;
  },

  // ✅ Get heat map data
  getHeatMap: async (): Promise<HeatMapData[]> => {
    const response = await apiClient.get('/map/heatmap');
    return response.data.data.data;
  },

  // ✅ Get price heat map data
  getPriceHeatMap: async (): Promise<HeatMapData[]> => {
    const response = await apiClient.get('/map/price-heatmap');
    return response.data.data.data;
  },

  // ✅ Search by area (Draw to Search)
  searchByArea: async (lat: number, lng: number, radius: number): Promise<PropertyLocation[]> => {
    const response = await apiClient.post('/map/search-area', { lat, lng, radius });
    return response.data.data.properties;
  },

  // ✅ Get nearby places
  getNearbyPlaces: async (params: {
    lat: number;
    lng: number;
    radius?: number;
    types?: string[];
    limit?: number;
    keyword?: string;
    minRating?: number;
  }): Promise<NearbyPlace[]> => {
    const response = await apiClient.get('/map/nearby', { params });
    return response.data.data.places;
  },

  // ✅ Get nearest properties
  getNearestProperties: async (lat: number, lng: number, limit: number = 10): Promise<PropertyLocation[]> => {
    const response = await apiClient.get('/map/nearest', { params: { lat, lng, limit } });
    return response.data.data.properties;
  },

  // ✅ Get property location by ID
  getPropertyLocation: async (id: string): Promise<PropertyLocation> => {
    const response = await apiClient.get(`/map/property/${id}/location`);
    return response.data.data;
  },

  // ✅ Get place photo URL
  getPlacePhotoUrl: (photoReference: string, maxWidth: number = 400): string => {
    return `${import.meta.env.VITE_API_URL}/map/photo?photoReference=${photoReference}&maxWidth=${maxWidth}`;
  },
};