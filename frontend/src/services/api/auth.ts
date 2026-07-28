// frontend/src/services/api/auth.ts

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
      avatarUrl?: string;
    };
    accessToken: string;
    refreshToken: string;
  };
  message: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: string;
  isVerified: boolean;
  isEmailVerified: boolean;
  isActive: boolean;
  avatarUrl?: string;
  languagePref: string;
  createdAt: string;
  updatedAt: string;
}

export const authApi = {
  // ✅ Register
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
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

  // ✅ Refresh Token
  refreshToken: async (refreshToken: string): Promise<{ accessToken: string }> => {
    const response = await apiClient.post('/auth/refresh-token', { refreshToken });
    return response.data.data;
  },

  // ✅ Get Profile
  getProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get('/auth/profile');
    return response.data.data;
  },

  // ✅ Update Profile
  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await apiClient.put('/auth/profile', data);
    return response.data.data;
  },

  // ✅ Change Password
  changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<void> => {
    await apiClient.post('/auth/change-password', data);
  },

  // ✅ Forgot Password
  forgotPassword: async (email: string): Promise<void> => {
    await apiClient.post('/auth/forgot-password', { email });
  },

  // ✅ Reset Password
  resetPassword: async (data: { token: string; newPassword: string }): Promise<void> => {
    await apiClient.post('/auth/reset-password', data);
  },

  // ✅ Verify Email
  verifyEmail: async (token: string): Promise<void> => {
    await apiClient.get(`/auth/verify-email?token=${token}`);
  },

  // ✅ Resend Verification
  resendVerification: async (email: string): Promise<void> => {
    await apiClient.post('/auth/resend-verification', { email });
  },

  // ✅ Delete Account
  deleteAccount: async (): Promise<void> => {
    await apiClient.delete('/auth/account');
  },
};