// frontend/src/components/context/SubscriptionContext.tsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

interface SubscriptionContextType {
  subscription: any;
  isPremium: boolean;
  isPremiumSeller: boolean;
  isPremiumBuyer: boolean;
  matchesRemaining: number;
  isLoading: boolean;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ✅ Get auth (but don't use it if disabled)
  const auth = useAuth();
  
  const [subscription, setSubscription] = useState<any>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isPremiumSeller, setIsPremiumSeller] = useState(false);
  const [isPremiumBuyer, setIsPremiumBuyer] = useState(false);
  const [matchesRemaining, setMatchesRemaining] = useState(3);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Always return default values - no API call
  const fetchSubscription = async () => {
    console.log('⏭️ Subscription disabled in context - returning default values');
    setIsLoading(false);
    setSubscription(null);
    setIsPremium(false);
    setIsPremiumSeller(false);
    setIsPremiumBuyer(false);
    setMatchesRemaining(3);
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const refreshSubscription = async () => {
    await fetchSubscription();
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        isPremium,
        isPremiumSeller,
        isPremiumBuyer,
        matchesRemaining,
        isLoading,
        refreshSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    // ✅ Return default values if context not available
    console.warn('useSubscription: Context not available, returning default values');
    return {
      subscription: null,
      isPremium: false,
      isPremiumSeller: false,
      isPremiumBuyer: false,
      matchesRemaining: 3,
      isLoading: false,
      refreshSubscription: async () => {},
    };
  }
  return context;
};

export default SubscriptionContext;