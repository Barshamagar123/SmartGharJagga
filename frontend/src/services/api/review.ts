// src/services/api/review.ts

import apiClient from './client';

export const reviewApi = {
  // ✅ Get reviews for a property
  getByProperty: async (propertyId: string) => {
    const response = await apiClient.get(`/reviews/property/${propertyId}`);
    return response.data.data;
  },

  // ✅ Get review stats for a property
  getStats: async (propertyId: string) => {
    const response = await apiClient.get(`/reviews/property/${propertyId}/rating`);
    return response.data.data;
  },

  // ✅ Create a review
  create: async (data: { propertyId: string; rating: number; comment?: string }) => {
    const response = await apiClient.post('/reviews', data);
    return response.data.data;
  },

  // ✅ Update a review
  update: async (id: string, data: { rating?: number; comment?: string }) => {
    const response = await apiClient.put(`/reviews/${id}`, data);
    return response.data.data;
  },

  // ✅ Delete a review
  delete: async (id: string) => {
    const response = await apiClient.delete(`/reviews/${id}`);
    return response.data;
  },

  // ✅ Get user's reviews
  getMyReviews: async () => {
    const response = await apiClient.get('/reviews/my');
    return response.data.data;
  },
};