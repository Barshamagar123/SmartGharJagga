// frontend/src/services/api/subscription.ts

import apiClient from './client';

export const subscriptionApi = {
  // ✅ Get my subscription - Requires token
  getMySubscription: async () => {
    // ✅ Check token before making request
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await apiClient.get('/subscriptions/me');
    return response.data;
  },
};