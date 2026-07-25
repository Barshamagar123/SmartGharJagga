// src/constants/subscriptionPlans.ts

export const SELLER_PLANS = [
  {
    id: 'seller_free',
    name: 'Free',
    price: '₹0',
    period: '/mo',
    role: 'SELLER',
    badge: null,
    features: [
      'Basic listing',
      '3 photos',
      'Standard visibility',
      'No AI matching',
      'Basic support',
    ],
    isPopular: false,
    isCurrent: false,
  },
  {
    id: 'seller_premium',
    name: 'Premium',
    price: '₹7,000',
    period: '/mo',
    role: 'SELLER',
    badge: 'MOST POPULAR',
    features: [
      'Everything in Free',
      'Video tour',
      '✅ Cosine Similarity AI',
      'FULL AI POWER!',
      '20+ photos',
      'Featured listing',
      'Priority support',
      'Advanced analytics',
    ],
    isPopular: true,
    isCurrent: false,
  },
];

export const BUYER_PLANS = [
  {
    id: 'buyer_free',
    name: 'Free',
    price: '₹0',
    period: '/mo',
    role: 'BUYER',
    badge: null,
    features: [
      'Basic search',
      'View properties',
      'Contact sellers',
      '5 favorites',
      '3 AI matches',
    ],
    isPopular: false,
    isCurrent: false,
  },
  {
    id: 'buyer_premium',
    name: 'Premium',
    price: '₹999',
    period: '/mo',
    role: 'BUYER',
    badge: 'BEST VALUE',
    features: [
      'Unlimited AI matches',
      'Match scores',
      'Property alerts',
      'Unlimited favorites',
      'Market insights',
      'WhatsApp notifications',
      'Priority support',
    ],
    isPopular: true,
    isCurrent: false,
  },
];

export const FEATURE_COMPARISON = {
  seller: [
    { feature: 'Property Listings', free: '1', premium: 'Unlimited' },
    { feature: 'Photos', free: '3', premium: '20+' },
    { feature: 'Video Tour', free: '❌', premium: '✅' },
    { feature: 'AI Matching', free: '❌', premium: '✅ Full AI Power' },
    { feature: 'Featured Listing', free: '❌', premium: '✅' },
    { feature: 'Priority Support', free: '❌', premium: '✅' },
    { feature: 'Analytics', free: 'Basic', premium: 'Advanced' },
  ],
  buyer: [
    { feature: 'Property Search', free: 'Basic', premium: 'Advanced' },
    { feature: 'AI Matches', free: '3', premium: 'Unlimited' },
    { feature: 'Match Scores', free: '❌', premium: '✅' },
    { feature: 'Favorites', free: '5', premium: 'Unlimited' },
    { feature: 'Property Alerts', free: '❌', premium: '✅' },
    { feature: 'Market Insights', free: '❌', premium: '✅' },
    { feature: 'WhatsApp Notifications', free: '❌', premium: '✅' },
  ],
};