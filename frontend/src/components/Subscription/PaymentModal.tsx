// src/pages/Subscription/components/PaymentModal.tsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from '../../../components/common/Modal/Modal';
import { Button } from '../../../components/common/Button/Button';
import { Badge } from '../../../components/common/Badge/Badge';

interface PaymentModalProps {
  plan: any;
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ plan, onClose, onSuccess }) => {
  const [selectedMethod, setSelectedMethod] = useState<'khalti' | 'esewa' | 'stripe' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentMethods = [
    { id: 'khalti', name: 'Khalti', icon: '💳', color: 'bg-purple-500' },
    { id: 'esewa', name: 'eSewa', icon: '🏦', color: 'bg-blue-500' },
    { id: 'stripe', name: 'Stripe', icon: '💳', color: 'bg-indigo-500' },
  ];

  const handlePayment = async () => {
    if (!selectedMethod) return;
    
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    onSuccess();
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="💳 Complete Payment"
      size="md"
    >
      <div className="space-y-6">
        {/* Plan Summary */}
        <div className="bg-[var(--color-primary-surface)] rounded-xl p-4 border border-[var(--color-primary-border)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">Plan</p>
              <p className="font-bold text-[var(--color-text-primary)]">{plan?.name} Plan</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-[var(--color-text-secondary)]">Amount</p>
              <p className="text-2xl font-bold text-[#2D5A27]">{plan?.price}</p>
            </div>
          </div>
          {plan?.badge && (
            <Badge variant="gold" size="sm" className="mt-2">
              {plan.badge}
            </Badge>
          )}
        </div>

        {/* Payment Methods */}
        <div>
          <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
            Select Payment Method
          </p>
          <div className="grid grid-cols-3 gap-3">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id as any)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                  selectedMethod === method.id
                    ? 'border-[#2D5A27] bg-[#E8F0E4]'
                    : 'border-[var(--color-primary-border)] hover:border-[#2D5A27]'
                }`}
              >
                <span className="text-2xl block">{method.icon}</span>
                <span className="text-xs font-medium mt-1 block">{method.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-[var(--color-primary-border)]">
          <Button
            variant="outline"
            size="md"
            fullWidth
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="gold"
            size="md"
            fullWidth
            disabled={!selectedMethod || isProcessing}
            isLoading={isProcessing}
            loadingText="Processing..."
            onClick={handlePayment}
          >
            Pay {plan?.price}
          </Button>
        </div>

        <p className="text-xs text-center text-[var(--color-text-tertiary)]">
          🔒 Secure payment powered by {selectedMethod || 'payment gateway'}
        </p>
      </div>
    </Modal>
  );
};

export default PaymentModal;