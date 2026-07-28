// frontend/src/services/api/client.ts

import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// ✅ Request Interceptor - Add token if exists
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor - Handle errors gracefully
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ✅ Only handle 401 if it's NOT a subscription request
    // Subscription 401 just means no subscription - that's fine!
    if (error.response?.status === 401 && 
        !originalRequest._retry && 
        !originalRequest.url?.includes('/subscriptions')) {
      // Only refresh token for non-subscription requests
      originalRequest._retry = true;
      // ... refresh token logic
    }

    return Promise.reject(error);
  }
);

export default apiClient;