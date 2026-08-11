// src/components/subscription/UpgradeModal.tsx

import React, { useState } from 'react';
import { X, CreditCard, Wallet, Loader2, CheckCircle } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    name: string;
    price: number;
    features: string[];
  };
  onSuccess: () => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  plan,
  onSuccess
}) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    // ✅ Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    setSuccess(true);
    setTimeout(() => {
      onSuccess();
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            ⬆️ Upgrade to {plan.name}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        {!success ? (
          <div className="p-6 space-y-6">
            {/* Plan Details */}
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">{plan.name} Plan</p>
                  <p className="text-2xl font-bold text-[#2D5A27]">₹{plan.price}/month</p>
                </div>
                <span className="px-3 py-1 bg-amber-200 text-amber-800 text-xs font-bold rounded-full">
                  🏆 POPULAR
                </span>
              </div>
              <div className="mt-3 space-y-1.5">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-3">
                Select Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`py-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#2D5A27] bg-[#EDF5EC]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="text-xs font-medium">Card</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('esewa')}
                  className={`py-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${
                    paymentMethod === 'esewa'
                      ? 'border-[#2D5A27] bg-[#EDF5EC]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Wallet className="w-5 h-5" />
                  <span className="text-xs font-medium">eSewa</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('khalti')}
                  className={`py-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${
                    paymentMethod === 'khalti'
                      ? 'border-[#2D5A27] bg-[#EDF5EC]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Wallet className="w-5 h-5" />
                  <span className="text-xs font-medium">Khalti</span>
                </button>
              </div>
            </div>

            {/* Payment Details */}
            {paymentMethod === 'card' && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D5A27] text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600 block mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D5A27] text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 block mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D5A27] text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Total & Actions */}
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-600">Total</span>
                <span className="text-xl font-bold text-[#2D5A27]">₹{plan.price}</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="flex-1 py-3 bg-[#2D5A27] text-white rounded-xl hover:bg-[#23461E] transition-colors font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Pay ₹${plan.price}`
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Success State
          <div className="p-8 text-center space-y-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Payment Successful!</h3>
            <p className="text-gray-500">
              Your subscription to <span className="font-semibold">{plan.name}</span> has been activated.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#2D5A27] text-white rounded-xl hover:bg-[#23461E] transition-colors font-medium"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpgradeModal;