// frontend/src/hooks/useSubscription.ts

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { subscriptionApi } from '../services/api/subscription';

export const useSubscription = () => {
  // ✅ Get auth state FIRST
  const { user, isAuthenticated } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      // ✅ STEP 1: Check if user is authenticated
      if (!isAuthenticated || !user) {
        console.log('⏭️ Skipping subscription - user not authenticated');
        setIsLoading(false);
        return; // ✅ Exit early - NO API CALL
      }

      // ✅ STEP 2: Only now fetch subscription (with token)
      try {
        setIsLoading(true);
        const response = await subscriptionApi.getMySubscription();
        setIsPremium(response.data?.hasActiveSubscription || false);
      } catch (error) {
        // ✅ Silent fail - subscription may not exist
        setIsPremium(false);
      } finally {
        setIsLoading(false);
      }
    };

    // ✅ STEP 3: Only run when auth changes
    fetchSubscription();
  }, [isAuthenticated, user]); // ✅ Depends on auth

  return { isPremium, isLoading };
};