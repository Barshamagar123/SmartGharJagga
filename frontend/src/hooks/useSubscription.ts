// src/hooks/useSubscription.ts

import { useState, useEffect } from 'react';
import { subscriptionApi } from '../services/api/subscription';
import { SUBSCRIPTION_PLANS } from '../constants/subscription';

export const useSubscription = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch plans
  const fetchPlans = async () => {
    try {
      const response = await subscriptionApi.getPlans();
      setPlans(response.data || []);
    } catch (err: any) {
      console.error('Error fetching plans:', err);
    }
  };

  // ✅ Fetch current subscription
  const fetchSubscription = async () => {
    try {
      setIsLoading(true);
      const response = await subscriptionApi.getMySubscription();
      setCurrentSubscription(response.data);
      setIsPremium(response.data?.hasActiveSubscription || false);
    } catch (err: any) {
      console.error('Error fetching subscription:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Initiate subscription
  const initiateSubscription = async (
    planType: 'SELLER_PREMIUM' | 'BUYER_PREMIUM',
    paymentMethod: 'KHALTI' | 'ESEWA' | 'STRIPE'
  ) => {
    try {
      setError(null);
      const response = await subscriptionApi.initiate({
        planType,
        paymentMethod,
      });

      if (response.success && response.data.paymentUrl) {
        // ✅ Redirect to payment gateway
        window.location.href = response.data.paymentUrl;
        return { success: true, data: response.data };
      }

      return { success: false, message: 'Payment initiation failed' };
    } catch (err: any) {
      setError(err.message || 'Failed to initiate subscription');
      return { success: false, message: err.message };
    }
  };

  // ✅ Cancel subscription
  const cancelSubscription = async () => {
    try {
      const response = await subscriptionApi.cancel();
      await fetchSubscription();
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to cancel subscription');
      throw err;
    }
  };

  // ✅ Get payment history
  const getPaymentHistory = async (page: number = 1, limit: number = 10) => {
    try {
      const response = await subscriptionApi.getPaymentHistory(page, limit);
      return response.data;
    } catch (err: any) {
      console.error('Error fetching payment history:', err);
      throw err;
    }
  };

  // ✅ Check status
  const checkStatus = async () => {
    try {
      const response = await subscriptionApi.getStatus();
      setIsPremium(response.data?.hasActive || false);
      return response.data;
    } catch (err: any) {
      console.error('Error checking status:', err);
      return null;
    }
  };

  // ✅ Load data on mount
  useEffect(() => {
    fetchPlans();
    fetchSubscription();
  }, []);

  return {
    plans,
    currentSubscription,
    isPremium,
    isLoading,
    error,
    initiateSubscription,
    cancelSubscription,
    getPaymentHistory,
    checkStatus,
    refreshSubscription: fetchSubscription,
  };
};