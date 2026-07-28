// frontend/src/hooks/useSubscription.ts

import { useState, useEffect } from 'react';
// ❌ Comment out subscriptionApi import
// import { subscriptionApi } from '../services/api/subscription';
import { useAuth } from '../context/AuthContext';

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<any>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isPremiumSeller, setIsPremiumSeller] = useState(false);
  const [isPremiumBuyer, setIsPremiumBuyer] = useState(false);
  const [matchesRemaining, setMatchesRemaining] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = async () => {
    // ✅ Always return default values - no API call
    console.log('⏭️ Subscription disabled - returning default values');
    setIsLoading(false);
    setSubscription(null);
    setIsPremium(false);
    setIsPremiumSeller(false);
    setIsPremiumBuyer(false);
    setMatchesRemaining(3);
    return;
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const refreshSubscription = async () => {
    await fetchSubscription();
  };

  return {
    subscription,
    isPremium,
    isPremiumSeller,
    isPremiumBuyer,
    matchesRemaining,
    isLoading,
    error,
    refreshSubscription,
  };
};

export default useSubscription;