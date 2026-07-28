// src/services/api/auth.ts

import apiClient from './client';

export interface RegisterData {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role?: 'BUYER' | 'SELLER' | 'ADMIN';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      isVerified: boolean;
      avatarUrl?: string | null;
    };
    accessToken: string;
    refreshToken: string;
  };
  message: string;
}

export const authApi = {
  // ✅ Register - MUST return full response
  register: async (data: RegisterData): Promise<AuthResponse> => {
    console.log('📤 authApi.register called with:', data);
    try {
      const response = await apiClient.post('/auth/register', data);
      console.log('📥 authApi.register response:', response);
      console.log('📥 authApi.register data:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ authApi.register error:', error);
      throw error;
    }
  },

  // ✅ Login
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  // ✅ Logout
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  // ✅ Get Profile
  getProfile: async () => {
    const response = await apiClient.get('/auth/profile');
    return response.data.data;
  },

  // ✅ Refresh Token
  refreshToken: async (refreshToken: string) => {
    const response = await apiClient.post('/auth/refresh-token', { refreshToken });
    return response.data.data;
  },

  // ✅ Update Profile
  updateProfile: async (data: any) => {
    const response = await apiClient.put('/auth/profile', data);
    return response.data.data;
  },

  // ✅ Change Password
  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    await apiClient.post('/auth/change-password', data);
  },

  // ✅ Forgot Password
  forgotPassword: async (email: string) => {
    await apiClient.post('/auth/forgot-password', { email });
  },

  // ✅ Reset Password
  resetPassword: async (data: { token: string; newPassword: string }) => {
    await apiClient.post('/auth/reset-password', data);
  },

  // ✅ Verify Email
  verifyEmail: async (token: string) => {
    await apiClient.get(`/auth/verify-email?token=${token}`);
  },

  // ✅ Resend Verification
  resendVerification: async (email: string) => {
    await apiClient.post('/auth/resend-verification', { email });
  },

  // ✅ Delete Account
  deleteAccount: async () => {
    await apiClient.delete('/auth/account');
  },
};