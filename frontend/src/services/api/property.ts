// src/services/api/property.ts

import apiClient from './client';
import type { Property, PropertyType, PropertyStatus, PropertyPurpose } from '../../types/property';

// ============================================
// TYPES
// ============================================

export interface CreatePropertyData {
  title: string;
  description?: string;
  price: number;
  location: string;
  latitude?: number;
  longitude?: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  areaUnit?: string;
  propertyType: PropertyType;
  purpose: PropertyPurpose;
  amenities?: string[];
  parking?: boolean;
  floor?: number;
  yearBuilt?: number;
  isFeatured?: boolean;
}

export interface UpdatePropertyData extends Partial<CreatePropertyData> {
  status?: PropertyStatus;
}

export interface PropertyFilter {
  search?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: PropertyType;
  bedrooms?: number;
  bathrooms?: number;
  parking?: boolean;
  amenities?: string[];
  status?: PropertyStatus;
  isFeatured?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'createdAt' | 'views';
  sortOrder?: 'asc' | 'desc';
}

export interface PropertyResponse {
  properties: Property[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================
// PROPERTY API
// ============================================

export const propertyApi = {
  // ============================================
  // 1. CREATE PROPERTY
  // ============================================
  create: async (data: FormData | CreatePropertyData): Promise<Property> => {
    // If data is FormData, send as is
    if (data instanceof FormData) {
      const response = await apiClient.post('/properties', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    }

    // If data is object, send as JSON
    const response = await apiClient.post('/properties', data);
    return response.data.data;
  },

  // ============================================
  // 2. GET ALL PROPERTIES
  // ============================================
  getAll: async (filters?: PropertyFilter): Promise<PropertyResponse> => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const response = await apiClient.get(`/properties?${params.toString()}`);
    return response.data.data;
  },

  // ============================================
  // 3. GET PROPERTY BY ID
  // ============================================
  getById: async (id: string): Promise<Property> => {
    const response = await apiClient.get(`/properties/${id}`);
    return response.data.data;
  },

  // ============================================
  // 4. UPDATE PROPERTY
  // ============================================
  update: async (id: string, data: FormData | UpdatePropertyData): Promise<Property> => {
    if (data instanceof FormData) {
      const response = await apiClient.put(`/properties/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    }

    const response = await apiClient.put(`/properties/${id}`, data);
    return response.data.data;
  },

  // ============================================
  // 5. DELETE PROPERTY
  // ============================================
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/properties/${id}`);
  },

  // ============================================
  // 6. GET USER'S PROPERTIES
  // ============================================
  getMyProperties: async (): Promise<Property[]> => {
    const response = await apiClient.get('/properties/my/properties');
    return response.data.data;
  },

  // ============================================
  // 7. GET FEATURED PROPERTIES
  // ============================================
  getFeatured: async (limit: number = 6): Promise<Property[]> => {
    const response = await apiClient.get(`/properties/featured?limit=${limit}`);
    return response.data.data;
  },

  // ============================================
  // 8. GET PROPERTIES FOR MAP
  // ============================================
  getForMap: async (): Promise<Property[]> => {
    const response = await apiClient.get('/properties/map');
    return response.data.data;
  },

  // ============================================
  // 9. GET PROPERTY STATS
  // ============================================
  getStats: async (): Promise<{
    total: number;
    pending: number;
    approved: number;
    sold: number;
    rejected: number;
    featured: number;
  }> => {
    const response = await apiClient.get('/properties/stats');
    return response.data.data;
  },

  // ============================================
  // 10. TOGGLE FAVORITE
  // ============================================
  toggleFavorite: async (propertyId: string): Promise<{ favorited: boolean }> => {
    const response = await apiClient.post(`/properties/${propertyId}/favorite`);
    return response.data.data;
  },

  // ============================================
  // 11. GET FAVORITES
  // ============================================
  getFavorites: async (): Promise<Property[]> => {
    const response = await apiClient.get('/properties/favorites');
    return response.data.data;
  },

  // ============================================
  // 12. TOGGLE FEATURED (Admin/Seller)
  // ============================================
  toggleFeatured: async (propertyId: string): Promise<{ isFeatured: boolean }> => {
    const response = await apiClient.put(`/properties/${propertyId}/toggle-featured`);
    return response.data.data;
  },

  // ============================================
  // 13. UPDATE PROPERTY STATUS (Admin only)
  // ============================================
  updateStatus: async (propertyId: string, status: PropertyStatus, reason?: string): Promise<Property> => {
    const response = await apiClient.put(`/properties/${propertyId}/status`, { status, reason });
    return response.data.data;
  },
};

export default propertyApi;