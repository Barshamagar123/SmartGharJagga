// src/services/api/admin.ts

import apiClient from './client';

export const adminApi = {
  // ============================================
  // DASHBOARD
  // ============================================
  
  /**
   * Get admin dashboard statistics
   * GET /admin/stats
   */
  getStats: async () => {
    const response = await apiClient.get('/admin/stats');
    return response.data.data;
  },

  /**
   * Get recent activity
   * GET /admin/activity
   */
  getRecentActivity: async (limit: number = 10) => {
    const response = await apiClient.get('/admin/activity', { params: { limit } });
    return response.data.data;
  },

  /**
   * Get recent properties
   * GET /admin/recent-properties
   */
  getRecentProperties: async (limit: number = 10) => {
    const response = await apiClient.get('/admin/recent-properties', { params: { limit } });
    return response.data.data;
  },

  // ============================================
  // USER MANAGEMENT
  // ============================================
  
  /**
   * Get all users with filters
   * GET /admin/users
   */
  getUsers: async (params?: {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
    isActive?: boolean;
    isVerified?: boolean;
  }) => {
    const response = await apiClient.get('/admin/users', { params });
    return response.data.data;
  },

  /**
   * Get single user by ID
   * GET /admin/users/:id
   */
  getUser: async (id: string) => {
    const response = await apiClient.get(`/admin/users/${id}`);
    return response.data.data;
  },

  /**
   * Block user
   * PUT /admin/users/:id/block
   */
  blockUser: async (id: string) => {
    const response = await apiClient.put(`/admin/users/${id}/block`);
    return response.data.data;
  },

  /**
   * Unblock user
   * PUT /admin/users/:id/unblock
   */
  unblockUser: async (id: string) => {
    const response = await apiClient.put(`/admin/users/${id}/unblock`);
    return response.data.data;
  },

  /**
   * Delete user
   * DELETE /admin/users/:id
   */
  deleteUser: async (id: string) => {
    const response = await apiClient.delete(`/admin/users/${id}`);
    return response.data.data;
  },

  /**
   * Update user role
   * PUT /admin/users/:id/role
   */
  updateUserRole: async (id: string, role: string) => {
    const response = await apiClient.put(`/admin/users/${id}/role`, { role });
    return response.data.data;
  },

  /**
   * Search users
   * GET /admin/users/search
   */
  searchUsers: async (query: string, params?: { page?: number; limit?: number }) => {
    const response = await apiClient.get('/admin/users/search', { 
      params: { query, ...params } 
    });
    return response.data.data;
  },

  /**
   * Get users by role
   * GET /admin/users/role/:role
   */
  getUsersByRole: async (role: string, params?: { page?: number; limit?: number }) => {
    const response = await apiClient.get(`/admin/users/role/${role}`, { params });
    return response.data.data;
  },

  /**
   * Bulk update users
   * POST /admin/users/bulk
   */
  bulkUpdateUsers: async (userIds: string[], updates: any) => {
    const response = await apiClient.post('/admin/users/bulk', { userIds, updates });
    return response.data.data;
  },

  // ============================================
  // PROPERTY MANAGEMENT
  // ============================================
  
  /**
   * Get all properties with filters
   * GET /admin/properties
   */
  getProperties: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    propertyType?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => {
    const response = await apiClient.get('/admin/properties', { params });
    return response.data.data;
  },

  /**
   * Approve property
   * PUT /admin/properties/:id/approve
   */
  approveProperty: async (id: string) => {
    const response = await apiClient.put(`/admin/properties/${id}/approve`);
    return response.data.data;
  },

  /**
   * Reject property
   * PUT /admin/properties/:id/reject
   */
  rejectProperty: async (id: string, reason: string) => {
    const response = await apiClient.put(`/admin/properties/${id}/reject`, { reason });
    return response.data.data;
  },

  /**
   * Delete property
   * DELETE /admin/properties/:id
   */
  deleteProperty: async (id: string) => {
    const response = await apiClient.delete(`/admin/properties/${id}`);
    return response.data.data;
  },

  // ============================================
  // REVIEW MANAGEMENT
  // ============================================
  
  /**
   * Get all reviews
   * GET /admin/reviews
   */
  getAllReviews: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    rating?: number;
  }) => {
    const response = await apiClient.get('/admin/reviews', { params });
    return response.data.data;
  },

  /**
   * Approve review
   * PUT /admin/reviews/:id/approve
   */
  approveReview: async (id: string) => {
    const response = await apiClient.put(`/admin/reviews/${id}/approve`);
    return response.data.data;
  },

  /**
   * Reject review
   * PUT /admin/reviews/:id/reject
   */
  rejectReview: async (id: string) => {
    const response = await apiClient.put(`/admin/reviews/${id}/reject`);
    return response.data.data;
  },

  /**
   * Delete review
   * DELETE /admin/reviews/:id
   */
  deleteReview: async (id: string) => {
    const response = await apiClient.delete(`/admin/reviews/${id}`);
    return response.data;
  },

  // ============================================
  // ANALYTICS
  // ============================================
  
  /**
   * Get analytics data
   * GET /admin/analytics
   */
  getAnalytics: async (period?: 'week' | 'month' | 'year') => {
    const response = await apiClient.get('/admin/analytics', { params: { period } });
    return response.data.data;
  },

  // ============================================
  // SUBSCRIPTIONS
  // ============================================
  
  /**
   * Get all subscriptions
   * GET /admin/subscriptions
   */
  getSubscriptions: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) => {
    const response = await apiClient.get('/admin/subscriptions', { params });
    return response.data.data;
  },

  /**
   * Update subscription
   * PUT /admin/subscriptions/:id
   */
  updateSubscription: async (id: string, data: { status?: string; plan?: string }) => {
    const response = await apiClient.put(`/admin/subscriptions/${id}`, data);
    return response.data.data;
  },

  // ============================================
  // COMMISSIONS
  // ============================================
  
  /**
   * Get all commissions
   * GET /admin/commissions
   */
  getCommissions: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) => {
    const response = await apiClient.get('/admin/commissions', { params });
    return response.data.data;
  },

  /**
   * Mark commission as paid
   * PUT /admin/commissions/:id/paid
   */
  markCommissionPaid: async (id: string) => {
    const response = await apiClient.put(`/admin/commissions/${id}/paid`);
    return response.data.data;
  },

  // ============================================
  // VERIFICATION REQUESTS
  // ============================================
  
  /**
   * Get all verification requests
   * GET /admin/verification
   */
  getVerificationRequests: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) => {
    const response = await apiClient.get('/admin/verification', { params });
    return response.data.data;
  },

  /**
   * Approve verification
   * PUT /admin/verification/:id/approve
   */
  approveVerification: async (id: string) => {
    const response = await apiClient.put(`/admin/verification/${id}/approve`);
    return response.data.data;
  },

  /**
   * Reject verification
   * PUT /admin/verification/:id/reject
   */
  rejectVerification: async (id: string, reason: string) => {
    const response = await apiClient.put(`/admin/verification/${id}/reject`, { reason });
    return response.data.data;
  },

  // ============================================
  // SYSTEM SETTINGS
  // ============================================
  
  /**
   * Get system settings
   * GET /admin/settings
   */
  getSettings: async () => {
    const response = await apiClient.get('/admin/settings');
    return response.data.data;
  },

  /**
   * Update system settings
   * PUT /admin/settings
   */
  updateSettings: async (data: any) => {
    const response = await apiClient.put('/admin/settings', data);
    return response.data.data;
  },

  // ============================================
  // CONTENT MANAGEMENT (Optional - if needed)
  // ============================================
  
  /**
   * Get content by type
   * GET /admin/content/:type
   */
  getContent: async (type: string) => {
    const response = await apiClient.get(`/admin/content/${type}`);
    return response.data.data;
  },

  /**
   * Create content
   * POST /admin/content/:type
   */
  createContent: async (type: string, data: any) => {
    const response = await apiClient.post(`/admin/content/${type}`, data);
    return response.data.data;
  },

  /**
   * Update content
   * PUT /admin/content/:type/:id
   */
  updateContent: async (type: string, id: string, data: any) => {
    const response = await apiClient.put(`/admin/content/${type}/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete content
   * DELETE /admin/content/:type/:id
   */
  deleteContent: async (type: string, id: string) => {
    const response = await apiClient.delete(`/admin/content/${type}/${id}`);
    return response.data.data;
  },

  // ============================================
  // BANNERS (Optional - if needed)
  // ============================================
  
  /**
   * Get all banners
   * GET /admin/banners
   */
  getBanners: async () => {
    const response = await apiClient.get('/admin/banners');
    return response.data.data;
  },

  /**
   * Create banner
   * POST /admin/banners
   */
  createBanner: async (data: FormData) => {
    const response = await apiClient.post('/admin/banners', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  /**
   * Update banner
   * PUT /admin/banners/:id
   */
  updateBanner: async (id: string, data: FormData) => {
    const response = await apiClient.put(`/admin/banners/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  /**
   * Delete banner
   * DELETE /admin/banners/:id
   */
  deleteBanner: async (id: string) => {
    const response = await apiClient.delete(`/admin/banners/${id}`);
    return response.data.data;
  },

  // ============================================
  // REPORTS (Optional - if needed)
  // ============================================
  
  /**
   * Generate report
   * POST /admin/reports/generate
   */
  generateReport: async (params: any) => {
    const response = await apiClient.post('/admin/reports/generate', params);
    return response.data.data;
  },

  /**
   * Download report
   * GET /admin/reports/:id/download
   */
  downloadReport: async (id: string) => {
    const response = await apiClient.get(`/admin/reports/${id}/download`);
    return response.data.data;
  },
};

export default adminApi;