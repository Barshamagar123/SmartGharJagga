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
      avatarUrl?: string | null;
    };
    accessToken: string;
    refreshToken: string;
  };
  message: string;
}

export const authApi = {
  // ✅ REGISTER
  register: async (data: RegisterData): Promise<AuthResponse> => {
    console.log('📤 Register API called with:', data);
    const response = await apiClient.post('/auth/register', data);
    console.log('📥 Register API response:', response.data);
    return response.data;
  },

  // ✅ LOGIN
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  // ✅ LOGOUT
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  // ✅ GET PROFILE
  getProfile: async () => {
    const response = await apiClient.get('/auth/profile');
    return response.data.data;
  },

  // ✅ REFRESH TOKEN
  refreshToken: async (refreshToken: string) => {
    const response = await apiClient.post('/auth/refresh-token', { refreshToken });
    return response.data.data;
  },

  // ✅ UPDATE PROFILE
  updateProfile: async (data: any) => {
    const response = await apiClient.put('/auth/profile', data);
    return response.data.data;
  },

  // ✅ CHANGE PASSWORD
  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    await apiClient.post('/auth/change-password', data);
  },

  // ✅ FORGOT PASSWORD
  forgotPassword: async (email: string) => {
    await apiClient.post('/auth/forgot-password', { email });
  },

  // ✅ RESET PASSWORD
  resetPassword: async (data: { token: string; newPassword: string }) => {
    await apiClient.post('/auth/reset-password', data);
  },

  // ✅ VERIFY EMAIL
  verifyEmail: async (token: string) => {
    await apiClient.get(`/auth/verify-email?token=${token}`);
  },

  // ✅ RESEND VERIFICATION
  resendVerification: async (email: string) => {
    await apiClient.post('/auth/resend-verification', { email });
  },

  // ✅ DELETE ACCOUNT
  deleteAccount: async () => {
    await apiClient.delete('/auth/account');
  },
};

export default authApi;