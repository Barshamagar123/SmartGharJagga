// src/components/context/SubscriptionContext.tsx

import React, { createContext, useState, useEffect } from 'react';
import { useAuth } from '../components/context/AuthContext';

// ✅ Define the context type
interface SubscriptionContextType {
  subscription: any;
  isPremium: boolean;
  isPremiumSeller: boolean;
  isPremiumBuyer: boolean;
  matchesRemaining: number;
  upgradeToPremium: (plan: string) => Promise<void>;
  cancelSubscription: () => Promise<void>;
}

// ✅ Create context with default values
const SubscriptionContext = createContext<SubscriptionContextType>({
  subscription: null,
  isPremium: false,
  isPremiumSeller: false,
  isPremiumBuyer: false,
  matchesRemaining: 3,
  upgradeToPremium: async () => {},
  cancelSubscription: async () => {},
});

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<any>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isPremiumSeller, setIsPremiumSeller] = useState(false);
  const [isPremiumBuyer, setIsPremiumBuyer] = useState(false);
  const [matchesRemaining, setMatchesRemaining] = useState(3);

  useEffect(() => {
    if (user) {
      // TODO: Fetch subscription from API
      const mockSubscription = {
        plan: 'FREE',
        isActive: false,
        matchesRemaining: 3,
        expiresAt: null,
      };
      setSubscription(mockSubscription);
      setIsPremium(mockSubscription.plan !== 'FREE' && mockSubscription.isActive);
      setIsPremiumSeller(mockSubscription.plan === 'SELLER_PREMIUM' && mockSubscription.isActive);
      setIsPremiumBuyer(mockSubscription.plan === 'BUYER_PREMIUM' && mockSubscription.isActive);
      setMatchesRemaining(mockSubscription.matchesRemaining);
    }
  }, [user]);

  const upgradeToPremium = async (plan: string) => {
    console.log(`Upgrading to ${plan}`);
  };

  const cancelSubscription = async () => {
    console.log('Canceling subscription');
  };

  // ✅ The value object must contain ALL the properties
  const value = {
    subscription,
    isPremium,
    isPremiumSeller,
    isPremiumBuyer,
    matchesRemaining,
    upgradeToPremium,
    cancelSubscription,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export default SubscriptionContext;