// src/pages/Subscription/Subscription.tsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSubscription } from '../../hooks/useSubscription';
import { Badge } from '../../components/common/Badge/Badge';
import { Button } from '../../components/common/Button/Button';
import { Card, CardContent } from '../../components/common/Card/Card';
import PlanCard from './components/PlanCard';
import PaymentModal from './components/PaymentModal';
import { SUBSCRIPTION_PLANS, PAYMENT_METHODS } from '../../constants/subscription';

const Subscription: React.FC = () => {
  const {
    plans,
    currentSubscription,
    isPremium,
    isLoading,
    initiateSubscription,
    refreshSubscription,
  } = useSubscription();

  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('KHALTI');

  const handleUpgrade = (plan: any) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handlePayment = async () => {
    if (!selectedPlan) return;

    const result = await initiateSubscription(selectedPlan.id, selectedMethod as any);
    
    if (result.success) {
      // ✅ Redirect handled in hook
    } else {
      alert(result.message || 'Payment initiation failed');
    }
  };

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel your subscription?')) {
      await cancelSubscription();
      refreshSubscription();
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

        {/* Current Subscription Status */}
        {currentSubscription && currentSubscription.hasActiveSubscription && (
          <motion.div
            variants={fadeInUp}
            className="mb-8 max-w-4xl mx-auto"
          >
            <Card variant="elevated" padding="md" className="border border-[#2D5A27]">
              <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">✅</span>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
                      Current Plan: {currentSubscription.planType}
                    </h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      {currentSubscription.daysRemaining} days remaining
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="gold" size="lg">ACTIVE</Badge>
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Plans Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Free Plan */}
          <PlanCard
            plan={SUBSCRIPTION_PLANS.FREE}
            isCurrent={!isPremium}
            onUpgrade={() => handleUpgrade(SUBSCRIPTION_PLANS.FREE)}
          />

          {/* Seller Premium */}
          <PlanCard
            plan={SUBSCRIPTION_PLANS.SELLER_PREMIUM}
            isCurrent={currentSubscription?.planType === 'SELLER_PREMIUM'}
            onUpgrade={() => handleUpgrade(SUBSCRIPTION_PLANS.SELLER_PREMIUM)}
          />

          {/* Buyer Premium */}
          <PlanCard
            plan={SUBSCRIPTION_PLANS.BUYER_PREMIUM}
            isCurrent={currentSubscription?.planType === 'BUYER_PREMIUM'}
            onUpgrade={() => handleUpgrade(SUBSCRIPTION_PLANS.BUYER_PREMIUM)}
          />
        </motion.div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <PaymentModal
            plan={selectedPlan}
            onClose={() => {
              setShowPaymentModal(false);
              setSelectedPlan(null);
            }}
            onPayment={handlePayment}
            selectedMethod={selectedMethod}
            setSelectedMethod={setSelectedMethod}
          />
        )}
      </div>
    </div>
  );
};

export default Subscription;