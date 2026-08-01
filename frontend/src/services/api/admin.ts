// src/services/api/admin.ts

import apiClient from './client';

export const adminApi = {
  // ============================================
  // DASHBOARD
  // ============================================
  getStats: async () => {
    const response = await apiClient.get('/admin/stats');
    return response.data.data;
  },

  getRecentActivity: async () => {
    const response = await apiClient.get('/admin/activity');
    return response.data.data;
  },

  getRecentProperties: async () => {
    const response = await apiClient.get('/admin/recent-properties');
    return response.data.data;
  },

  // ============================================
  // USER MANAGEMENT
  // ============================================
  getUsers: async () => {
    const response = await apiClient.get('/admin/users');
    return response.data.data;
  },

  getUser: async (id: string) => {
    const response = await apiClient.get(`/admin/users/${id}`);
    return response.data.data;
  },

  blockUser: async (id: string) => {
    const response = await apiClient.put(`/admin/users/${id}/block`);
    return response.data.data;
  },

  unblockUser: async (id: string) => {
    const response = await apiClient.put(`/admin/users/${id}/unblock`);
    return response.data.data;
  },

  deleteUser: async (id: string) => {
    const response = await apiClient.delete(`/admin/users/${id}`);
    return response.data.data;
  },

  updateUserRole: async (id: string, role: string) => {
    const response = await apiClient.put(`/admin/users/${id}/role`, { role });
    return response.data.data;
  },

  // ============================================
  // PROPERTY MANAGEMENT
  // ============================================
  getProperties: async () => {
    const response = await apiClient.get('/admin/properties');
    return response.data.data;
  },

  approveProperty: async (id: string) => {
    const response = await apiClient.put(`/admin/properties/${id}/approve`);
    return response.data.data;
  },

  rejectProperty: async (id: string, reason: string) => {
    const response = await apiClient.put(`/admin/properties/${id}/reject`, { reason });
    return response.data.data;
  },

  deleteProperty: async (id: string) => {
    const response = await apiClient.delete(`/admin/properties/${id}`);
    return response.data.data;
  },

  // ============================================
  // REVIEW MANAGEMENT
  // ============================================
  getAllReviews: async () => {
    const response = await apiClient.get('/reviews/admin/all');
    return response.data.data;
  },

  approveReview: async (id: string) => {
    const response = await apiClient.put(`/reviews/${id}/approve`);
    return response.data.data;
  },

  rejectReview: async (id: string) => {
    const response = await apiClient.put(`/reviews/${id}/reject`);
    return response.data.data;
  },

  deleteReview: async (id: string) => {
    const response = await apiClient.delete(`/reviews/${id}`);
    return response.data;
  },

  // ============================================
  // ANALYTICS
  // ============================================
  getAnalytics: async () => {
    const response = await apiClient.get('/admin/analytics');
    return response.data.data;
  },

  // ============================================
  // CONTENT MANAGEMENT
  // ============================================
  getContent: async (type: string) => {
    const response = await apiClient.get(`/admin/content/${type}`);
    return response.data.data;
  },

  createContent: async (type: string, data: any) => {
    const response = await apiClient.post(`/admin/content/${type}`, data);
    return response.data.data;
  },

  updateContent: async (type: string, id: string, data: any) => {
    const response = await apiClient.put(`/admin/content/${type}/${id}`, data);
    return response.data.data;
  },

  deleteContent: async (type: string, id: string) => {
    const response = await apiClient.delete(`/admin/content/${type}/${id}`);
    return response.data.data;
  },

  // ============================================
  // REPORTS
  // ============================================
  generateReport: async (params: any) => {
    const response = await apiClient.post('/admin/reports/generate', params);
    return response.data.data;
  },

  downloadReport: async (id: string) => {
    const response = await apiClient.get(`/admin/reports/${id}/download`);
    return response.data.data;
  },

  // ============================================
  // SUBSCRIPTIONS
  // ============================================
  getSubscriptions: async () => {
    const response = await apiClient.get('/admin/subscriptions');
    return response.data.data;
  },

  updateSubscription: async (id: string, data: any) => {
    const response = await apiClient.put(`/admin/subscriptions/${id}`, data);
    return response.data.data;
  },

  // ============================================
  // COMMISSIONS
  // ============================================
  getCommissions: async () => {
    const response = await apiClient.get('/admin/commissions');
    return response.data.data;
  },

  markCommissionPaid: async (id: string) => {
    const response = await apiClient.put(`/admin/commissions/${id}/paid`);
    return response.data.data;
  },

  // ============================================
  // BANNERS
  // ============================================
  getBanners: async () => {
    const response = await apiClient.get('/admin/banners');
    return response.data.data;
  },

  createBanner: async (data: FormData) => {
    const response = await apiClient.post('/admin/banners', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  updateBanner: async (id: string, data: FormData) => {
    const response = await apiClient.put(`/admin/banners/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  deleteBanner: async (id: string) => {
    const response = await apiClient.delete(`/admin/banners/${id}`);
    return response.data.data;
  },

  // ============================================
  // VERIFICATION
  // ============================================
  getVerificationRequests: async () => {
    const response = await apiClient.get('/admin/verification');
    return response.data.data;
  },

  approveVerification: async (id: string) => {
    const response = await apiClient.put(`/admin/verification/${id}/approve`);
    return response.data.data;
  },

  rejectVerification: async (id: string, reason: string) => {
    const response = await apiClient.put(`/admin/verification/${id}/reject`, { reason });
    return response.data.data;
  },

  // ============================================
  // SYSTEM SETTINGS
  // ============================================
  getSettings: async () => {
    const response = await apiClient.get('/admin/settings');
    return response.data.data;
  },

  updateSettings: async (data: any) => {
    const response = await apiClient.put('/admin/settings', data);
    return response.data.data;
  },
};

export default adminApi;