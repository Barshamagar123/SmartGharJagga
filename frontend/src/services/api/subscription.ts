// src/services/api/subscription.ts

import axios from 'axios';

// ✅ Get API base URL from environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

// ✅ Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Add auth token interceptor
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

export interface InitiateSubscriptionRequest {
  planType: 'SELLER_PREMIUM' | 'BUYER_PREMIUM';
  paymentMethod: 'KHALTI' | 'ESEWA' | 'STRIPE';
}

export interface InitiateSubscriptionResponse {
  success: boolean;
  data: {
    subscriptionId: string;
    paymentId: string;
    transactionId: string;
    amount: number;
    paymentUrl: string;
    paymentMethod: string;
  };
  message: string;
}

export const subscriptionApi = {
  // ✅ Get all plans
  getPlans: async () => {
    const response = await apiClient.get('/subscriptions/plans');
    return response.data;
  },

  // ✅ Initiate subscription
  initiate: async (data: InitiateSubscriptionRequest): Promise<InitiateSubscriptionResponse> => {
    const response = await apiClient.post('/subscriptions/initiate', data);
    return response.data;
  },

  // ✅ Get my subscription
  getMySubscription: async () => {
    const response = await apiClient.get('/subscriptions/me');
    return response.data;
  },

  // ✅ Cancel subscription
  cancel: async () => {
    const response = await apiClient.post('/subscriptions/cancel');
    return response.data;
  },

  // ✅ Get payment history
  getPaymentHistory: async (page: number = 1, limit: number = 10) => {
    const response = await apiClient.get(`/subscriptions/history?page=${page}&limit=${limit}`);
    return response.data;
  },

  // ✅ Check subscription status
  getStatus: async () => {
    const response = await apiClient.get('/subscriptions/status');
    return response.data;
  },
};

export default subscriptionApi;