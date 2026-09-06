// src/services/api/admin.ts

import apiClient from './client';

// ============================================
// TYPES
// ============================================

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  avatarUrl?: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Property {
  id: string;
  propertyId: string;
  title: string;
  price: number;
  location: string;
  propertyType: string;
  status: string;
  userId: string;
  views: number;
  favoritesCount: number;
  isFeatured: boolean;
  isVerified: boolean;
  createdAt: string;
  // ✅ Add _count field to match RecentProperty
  _count?: {
    views: number;
    favorites: number;
  };
  user?: {
    name: string;
    email: string;
    phone?: string;
  };
  images?: any[];
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  reviewer: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  property: {
    id: string;
    title: string;
    location: string;
    propertyId?: string;
  };
}

export interface Subscription {
  id: string;
  userId: string;
  planType: string;
  status: string;
  startDate: string;
  endDate: string;
  price: number;
  user?: {
    name: string;
    email: string;
  };
}

export interface Commission {
  id: string;
  amount: number;
  percentage: number;
  status: string;
  propertyId: string;
  buyerId: string;
  createdAt: string;
  property?: {
    title: string;
    price: number;
  };
  buyer?: {
    name: string;
    email: string;
  };
}

// ✅ COMPLETE AdminStats interface
export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  blockedUsers: number;
  totalProperties: number;
  totalPropertiesPending: number;
  totalPropertiesApproved: number;
  totalPropertiesRejected: number;
  totalPropertiesSold: number;
  totalReviews: number;
  pendingReviews: number;
  totalRevenue: number;
  totalCommissions: number;
  pendingCommissions: number;
  totalAdmins: number;
  totalSellers: number;
  totalBuyers: number;
  totalSubscriptions: number;
  revenue: number;
  monthlyStats?: Array<{ month: string; count: number; revenue?: number }>;
  activeStats?: Array<{ isActive: boolean; _count: { isActive: number } }>;
  roleDistribution?: Array<{ role: string; _count: { role: number } }>;
}

export interface Activity {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  property?: {
    id: string;
    title: string;
  };
}

// ============================================
// ADMIN API SERVICE
// ============================================

export const adminApi = {
  // ============================================
  // DASHBOARD
  // ============================================
  
  getStats: async (): Promise<AdminStats> => {
    try {
      const response = await apiClient.get('/admin/stats');
      console.log('📊 Stats API Response:', response.data);
      
      const data = response.data?.data || {};
      return {
        totalUsers: data.totalUsers || 0,
        activeUsers: data.activeUsers || 0,
        blockedUsers: data.blockedUsers || 0,
        totalProperties: data.totalProperties || 0,
        totalPropertiesPending: data.totalPropertiesPending || 0,
        totalPropertiesApproved: data.totalPropertiesApproved || 0,
        totalPropertiesRejected: data.totalPropertiesRejected || 0,
        totalPropertiesSold: data.totalPropertiesSold || 0,
        totalReviews: data.totalReviews || 0,
        pendingReviews: data.pendingReviews || 0,
        totalRevenue: data.totalRevenue || 0,
        totalCommissions: data.totalCommissions || 0,
        pendingCommissions: data.pendingCommissions || 0,
        totalAdmins: data.totalAdmins || 0,
        totalSellers: data.totalSellers || 0,
        totalBuyers: data.totalBuyers || 0,
        totalSubscriptions: data.totalSubscriptions || 0,
        revenue: data.revenue || 0,
        monthlyStats: data.monthlyStats || [],
        activeStats: data.activeStats || [],
        roleDistribution: data.roleDistribution || [],
      };
    } catch (error) {
      console.error('❌ Error fetching stats:', error);
      return {
        totalUsers: 0,
        activeUsers: 0,
        blockedUsers: 0,
        totalProperties: 0,
        totalPropertiesPending: 0,
        totalPropertiesApproved: 0,
        totalPropertiesRejected: 0,
        totalPropertiesSold: 0,
        totalReviews: 0,
        pendingReviews: 0,
        totalRevenue: 0,
        totalCommissions: 0,
        pendingCommissions: 0,
        totalAdmins: 0,
        totalSellers: 0,
        totalBuyers: 0,
        totalSubscriptions: 0,
        revenue: 0,
        monthlyStats: [],
        activeStats: [],
        roleDistribution: [],
      };
    }
  },

  getRecentActivity: async (limit: number = 10): Promise<Activity[]> => {
    try {
      const response = await apiClient.get('/admin/activity', { params: { limit } });
      return response.data?.data || [];
    } catch (error) {
      console.error('❌ Error fetching activity:', error);
      return [];
    }
  },

  getRecentProperties: async (limit: number = 10): Promise<Property[]> => {
    try {
      const response = await apiClient.get('/admin/recent-properties', { params: { limit } });
      return response.data?.data || [];
    } catch (error) {
      console.error('❌ Error fetching recent properties:', error);
      return [];
    }
  },

  // ============================================
  // USER MANAGEMENT
  // ============================================
  
  getUsers: async (params?: {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
    isActive?: boolean;
    isVerified?: boolean;
  }): Promise<{ users: User[]; total: number; page: number; totalPages: number }> => {
    try {
      const response = await apiClient.get('/admin/users', { params });
      return response.data?.data || { users: [], total: 0, page: 1, totalPages: 1 };
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      return { users: [], total: 0, page: 1, totalPages: 1 };
    }
  },

  getUser: async (id: string): Promise<User> => {
    const response = await apiClient.get(`/admin/users/${id}`);
    return response.data.data;
  },

  blockUser: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.put(`/admin/users/${id}/block`);
    return response.data.data;
  },

  unblockUser: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.put(`/admin/users/${id}/unblock`);
    return response.data.data;
  },

  deleteUser: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/admin/users/${id}`);
    return response.data.data;
  },

  updateUserRole: async (id: string, role: string): Promise<User> => {
    const response = await apiClient.put(`/admin/users/${id}/role`, { role });
    return response.data.data;
  },

  searchUsers: async (query: string, params?: { page?: number; limit?: number }): Promise<{ users: User[]; total: number }> => {
    const response = await apiClient.get('/admin/users/search', { 
      params: { query, ...params } 
    });
    return response.data.data;
  },

  getUsersByRole: async (role: string, params?: { page?: number; limit?: number }): Promise<{ users: User[]; total: number }> => {
    const response = await apiClient.get(`/admin/users/role/${role}`, { params });
    return response.data.data;
  },

  bulkUpdateUsers: async (userIds: string[], updates: any): Promise<{ success: boolean; updated: number }> => {
    const response = await apiClient.post('/admin/users/bulk', { userIds, updates });
    return response.data.data;
  },

  // ============================================
  // PROPERTY MANAGEMENT
  // ============================================
  
  getProperties: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    propertyType?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<{ properties: Property[]; total: number; page: number; totalPages: number }> => {
    const response = await apiClient.get('/admin/properties', { params });
    return response.data.data;
  },

  approveProperty: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.put(`/admin/properties/${id}/approve`);
    return response.data.data;
  },

  rejectProperty: async (id: string, reason: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.put(`/admin/properties/${id}/reject`, { reason });
    return response.data.data;
  },

  deleteProperty: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/admin/properties/${id}`);
    return response.data.data;
  },

  // ============================================
  // REVIEW MANAGEMENT
  // ============================================
  
  getAllReviews: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    rating?: number;
  }): Promise<Review[]> => {
    try {
      console.log('📡 Fetching all reviews from API...');
      const response = await apiClient.get('/reviews/admin/all', { params });
      console.log('✅ Reviews API Response:', response.data);
      
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return [];
    } catch (error: any) {
      console.error('❌ Error fetching reviews:', error);
      throw error;
    }
  },

  approveReview: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.put(`/reviews/${id}/approve`);
    return response.data;
  },

  rejectReview: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.put(`/reviews/${id}/reject`);
    return response.data;
  },

  deleteReview: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/reviews/${id}`);
    return response.data;
  },

  // ============================================
  // ANALYTICS
  // ============================================
  
  getAnalytics: async (period?: 'week' | 'month' | 'year'): Promise<any> => {
    const response = await apiClient.get('/admin/analytics', { params: { period } });
    return response.data.data;
  },

  // ============================================
  // SUBSCRIPTIONS
  // ============================================
  
  getSubscriptions: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<{ subscriptions: Subscription[]; total: number }> => {
    const response = await apiClient.get('/admin/subscriptions', { params });
    return response.data.data;
  },

  updateSubscription: async (id: string, data: { status?: string; plan?: string }): Promise<Subscription> => {
    const response = await apiClient.put(`/admin/subscriptions/${id}`, data);
    return response.data.data;
  },

  // ============================================
  // COMMISSIONS
  // ============================================
  
  getCommissions: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<{ commissions: Commission[]; total: number }> => {
    const response = await apiClient.get('/admin/commissions', { params });
    return response.data.data;
  },

  markCommissionPaid: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.put(`/admin/commissions/${id}/paid`);
    return response.data.data;
  },

  // ============================================
  // VERIFICATION REQUESTS
  // ============================================
  
  getVerificationRequests: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<{ requests: any[]; total: number }> => {
    const response = await apiClient.get('/admin/verification', { params });
    return response.data.data;
  },

  approveVerification: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.put(`/admin/verification/${id}/approve`);
    return response.data.data;
  },

  rejectVerification: async (id: string, reason: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.put(`/admin/verification/${id}/reject`, { reason });
    return response.data.data;
  },

  // ============================================
  // SYSTEM SETTINGS
  // ============================================
  
  getSettings: async (): Promise<any> => {
    const response = await apiClient.get('/admin/settings');
    return response.data.data;
  },

  updateSettings: async (data: any): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.put('/admin/settings', data);
    return response.data.data;
  },

  // ============================================
  // CONTENT MANAGEMENT
  // ============================================
  
  getContent: async (type: string): Promise<any[]> => {
    const response = await apiClient.get(`/admin/content/${type}`);
    return response.data.data;
  },

  createContent: async (type: string, data: any): Promise<any> => {
    const response = await apiClient.post(`/admin/content/${type}`, data);
    return response.data.data;
  },

  updateContent: async (type: string, id: string, data: any): Promise<any> => {
    const response = await apiClient.put(`/admin/content/${type}/${id}`, data);
    return response.data.data;
  },

  deleteContent: async (type: string, id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/admin/content/${type}/${id}`);
    return response.data.data;
  },

  // ============================================
  // BANNERS
  // ============================================
  
  getBanners: async (): Promise<any[]> => {
    const response = await apiClient.get('/admin/banners');
    return response.data.data;
  },

  createBanner: async (data: FormData): Promise<any> => {
    const response = await apiClient.post('/admin/banners', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  updateBanner: async (id: string, data: FormData): Promise<any> => {
    const response = await apiClient.put(`/admin/banners/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  deleteBanner: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/admin/banners/${id}`);
    return response.data.data;
  },

  // ============================================
  // REPORTS
  // ============================================
  
  generateReport: async (params: any): Promise<any> => {
    const response = await apiClient.post('/admin/reports/generate', params);
    return response.data.data;
  },

  downloadReport: async (id: string): Promise<any> => {
    const response = await apiClient.get(`/admin/reports/${id}/download`);
    return response.data.data;
  },
};

export default adminApi;