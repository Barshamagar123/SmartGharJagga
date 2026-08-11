// src/pages/subscription/SubscriptionPlans.tsx

import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import UpgradeModal from '../../components/Subscription/UpgradeModal';

const SubscriptionPlans: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<{
    name: string;
    price: number;
    features: string[];
  } | null>(null);
  const [showModal, setShowModal] = useState(false);

  const plans = [
    {
      name: 'FREE',
      price: 0,
      features: ['5 Properties', 'Basic Support', '1 Image/Property']
    },
    {
      name: 'PREMIUM',
      price: 999,
      features: ['50 Properties', 'Priority Support', '10 Images/Property', 'Featured Properties', 'Analytics']
    },
    {
      name: 'BUSINESS',
      price: 2499,
      features: ['Unlimited Properties', '24/7 Support', '20 Images/Property', 'Featured+', 'Advanced Analytics']
    }
  ];

  const handleUpgrade = (plan: {
    name: string;
    price: number;
    features: string[];
  }) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const handleSuccess = () => {
    console.log('Subscription upgraded successfully!');
    setShowModal(false);
    // ✅ Refresh subscription status
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        💎 Choose Your Plan
      </h1>
      <p className="text-gray-500 mb-8">
        Select the perfect plan for your real estate needs
      </p>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold">{plan.name}</h3>
            <p className="text-3xl font-bold text-[#2D5A27] mt-2">
              ₹{plan.price}
              <span className="text-sm font-normal text-gray-400">/month</span>
            </p>
            <ul className="mt-4 space-y-2">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
            {plan.price > 0 ? (
              <button
                onClick={() => handleUpgrade(plan)}
                className="w-full mt-6 py-2.5 bg-[#2D5A27] text-white rounded-xl hover:bg-[#23461E] transition-colors font-medium"
              >
                Upgrade →
              </button>
            ) : (
              <button
                disabled
                className="w-full mt-6 py-2.5 bg-gray-100 text-gray-400 rounded-xl cursor-not-allowed font-medium"
              >
                Current Plan
              </button>
            )}
          </div>
        ))}
      </div>

      {/* ✅ Only render modal when plan is not null */}
      {showModal && selectedPlan && (
        <UpgradeModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          plan={selectedPlan}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default SubscriptionPlans;