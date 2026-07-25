// src/pages/Subscription/Subscription.tsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../../components/common/Badge/Badge';
import { Button } from '../../components/common/Button/Button';
import { Card, CardContent } from '../../components/common/Card/Card';
import { useAuth } from '../../hooks/useAuth';
import { useSubscription } from '../../hooks/useSubscription';
import { SELLER_PLANS, BUYER_PLANS, FEATURE_COMPARISON } from '../../constants/subscriptionPlans';
import PaymentModal from './components/PaymentModal';
import FeatureComparison from './components/FeatureComparison';

const Subscription: React.FC = () => {
  const { user } = useAuth();
  const { isPremium, isPremiumSeller, isPremiumBuyer, upgradeToPremium } = useSubscription();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  // Update plans with current status
  const sellerPlans = SELLER_PLANS.map(plan => ({
    ...plan,
    isCurrent: plan.id === 'seller_premium' ? isPremiumSeller : !isPremiumSeller && !isPremiumBuyer,
  }));

  const buyerPlans = BUYER_PLANS.map(plan => ({
    ...plan,
    isCurrent: plan.id === 'buyer_premium' ? isPremiumBuyer : !isPremiumBuyer && !isPremiumSeller,
  }));

  const handleUpgrade = (plan: any) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async () => {
    if (selectedPlan) {
      const planType = selectedPlan.id === 'seller_premium' ? 'SELLER_PREMIUM' : 'BUYER_PREMIUM';
      await upgradeToPremium(planType);
      setShowPaymentModal(false);
      setSelectedPlan(null);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' as const },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <div className="pt-16 md:pt-20 bg-[var(--color-primary)] min-h-screen">
      <div className="max-w-7xl mx-auto px-8 py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-text-primary)]">
            Choose Your <span className="text-[#2D5A27]">Perfect Plan</span>
          </h1>
          <p className="mt-3 text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Get more visibility and faster sales with our premium features
          </p>
        </motion.div>

        {/* Seller Plans */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <Badge variant="primary" size="lg">📊 SELLER PLANS</Badge>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mt-3">
              Sell Your Property Faster
            </h2>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {sellerPlans.map((plan) => (
              <motion.div key={plan.id} variants={fadeInUp}>
                <PlanCard
                  plan={plan}
                  onUpgrade={() => handleUpgrade(plan)}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Buyer Plans */}
        <div>
          <div className="text-center mb-8">
            <Badge variant="secondary" size="lg">🛒 BUYER PLANS</Badge>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mt-3">
              Find Your Dream Home with AI
            </h2>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {buyerPlans.map((plan) => (
              <motion.div key={plan.id} variants={fadeInUp}>
                <PlanCard
                  plan={plan}
                  onUpgrade={() => handleUpgrade(plan)}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Feature Comparison */}
        <motion.div
          variants={fadeInUp}
          className="mt-16"
        >
          <FeatureComparison />
        </motion.div>

        {/* AI Matching Info */}
        <motion.div
          variants={fadeInUp}
          className="mt-12 bg-gradient-to-r from-[#E8F0E4] to-[#2D5A27]/10 rounded-2xl p-8 border border-[#2D5A27]/20 max-w-4xl mx-auto"
        >
          <div className="flex items-start gap-4">
            <span className="text-4xl">🤖</span>
            <div>
              <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
                Cosine Similarity AI Matching
              </h3>
              <p className="text-[var(--color-text-secondary)] mt-1">
                Our AI uses advanced cosine similarity algorithms to find the perfect property match for you.
                {isPremium ? (
                  <span className="text-[#2D5A27] font-semibold"> 🚀 Unlimited matches!</span>
                ) : (
                  <span className="text-[#D4AF37] font-semibold"> Upgrade to Premium for unlimited matches!</span>
                )}
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                <Badge variant="primary">🎯 95% Accuracy</Badge>
                <Badge variant="secondary">⚡ Real-time Matching</Badge>
                <Badge variant="gold">🏆 AI-Powered</Badge>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          plan={selectedPlan}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedPlan(null);
          }}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default Subscription;