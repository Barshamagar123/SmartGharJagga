// src/constants/subscription.ts

export const SUBSCRIPTION_PLANS = {
  FREE: {
    id: 'FREE',
    name: 'Free',
    price: 0,
    currency: 'NPR',
    features: [
      '3 photos per listing',
      'Basic listing',
      'Manual search',
      '5 favorites',
      '3 AI matches',
    ],
    color: 'gray',
  },
  SELLER_PREMIUM: {
    id: 'SELLER_PREMIUM',
    name: 'Seller Premium',
    price: 7000,
    currency: 'NPR',
    features: [
      '20 photos per listing',
      'Featured badge',
      'TOP position in search',
      'AI buyer matching',
      'Buyer insights',
      'Advanced analytics',
      'Priority support',
      'Video tour',
    ],
    color: 'gold',
    popular: true,
  },
  BUYER_PREMIUM: {
    id: 'BUYER_PREMIUM',
    name: 'Buyer Premium',
    price: 999,
    currency: 'NPR',
    features: [
      'Unlimited AI matches',
      'Match scores',
      'Property alerts',
      'Unlimited favorites',
      'Market insights',
      'WhatsApp notifications',
      'Priority support',
    ],
    color: 'green',
    popular: true,
  },
};

export const PAYMENT_METHODS = [
  { id: 'KHALTI', name: 'Khalti', icon: '💳' },
  { id: 'ESEWA', name: 'eSewa', icon: '🏦' },
  { id: 'STRIPE', name: 'Stripe', icon: '💳' },
];