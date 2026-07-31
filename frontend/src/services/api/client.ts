// src/services/api/client.ts

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

console.log('🔗 API Base URL:', API_BASE_URL);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 30000, // ✅ 30 seconds timeout
});

// ✅ Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // ✅ Log request for debugging (only in development)
    if (import.meta.env.DEV) {
      console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// ✅ Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    // ✅ Log response (only in development)
    if (import.meta.env.DEV) {
      console.log(`📥 ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    // ✅ Handle 401 Unauthorized - Redirect to login
    if (error.response?.status === 401) {
      console.warn('🔒 Session expired. Redirecting to login...');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      // ✅ Redirect to login page (if not already there)
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    // ✅ Log error details
    console.error('❌ API Error:', {
      status: error.response?.status,
      message: error.response?.data?.message,
      errors: error.response?.data?.errors,
      url: error.config?.url,
    });
    
    return Promise.reject(error);
  }
);

export default apiClient;