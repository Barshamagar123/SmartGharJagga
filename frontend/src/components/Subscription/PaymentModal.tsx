// src/pages/Subscription/components/PaymentModal.tsx

import React from 'react';
import { Modal } from '../../../components/common/Modal/Modal';
import { Button } from '../../../components/common/Button/Button';
import { Badge } from '../../../components/common/Badge/Badge';
import { PAYMENT_METHODS } from '../../../constants/subscription';

interface PaymentModalProps {
  plan: any;
  onClose: () => void;
  onPayment: () => void;
  selectedMethod: string;
  setSelectedMethod: (method: string) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  plan,
  onClose,
  onPayment,
  selectedMethod,
  setSelectedMethod,
}) => {
  const isFree = plan?.price === 0;

  if (!plan) return null;

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={isFree ? 'Get Started Free' : '💳 Complete Payment'}
      size="md"
    >
      <div className="space-y-6">
        {/* Plan Summary */}
        <div className="bg-[var(--color-primary-surface)] rounded-xl p-4 border border-[var(--color-primary-border)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">Plan</p>
              <p className="font-bold text-[var(--color-text-primary)]">{plan.name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-[var(--color-text-secondary)]">Price</p>
              <p className="text-2xl font-bold text-[#2D5A27]">
                {plan.price === 0 ? 'Free' : `Rs ${plan.price.toLocaleString()}`}
              </p>
            </div>
          </div>
          {plan.popular && (
            <Badge variant="gold" size="sm" className="mt-2">
              Most Popular
            </Badge>
          )}
        </div>

        {/* Payment Methods (Only for paid plans) */}
        {!isFree && (
          <div>
            <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
              Select Payment Method
            </p>
            <div className="grid grid-cols-3 gap-3">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
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
        )}

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
            variant={plan.popular ? 'gold' : 'primary'}
            size="md"
            fullWidth
            onClick={onPayment}
          >
            {isFree ? 'Start Free Plan' : `Pay Rs ${plan.price.toLocaleString()}`}
          </Button>
        </div>

        {!isFree && (
          <p className="text-xs text-center text-[var(--color-text-tertiary)]">
            🔒 Secure payment powered by {selectedMethod}
          </p>
        )}
      </div>
    </Modal>
  );
};

export default PaymentModal;