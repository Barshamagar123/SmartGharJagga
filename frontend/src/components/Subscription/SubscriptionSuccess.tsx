// src/pages/Subscription/components/SubscriptionSuccess.tsx

import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Card, { CardContent } from '../common/Card/Card';
import Button from '../common/Button/Button';


const SubscriptionSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const transactionId = searchParams.get('txn');

  useEffect(() => {
    // ✅ Refresh subscription status
    // You can call API to verify payment
  }, []);

  return (
    <div className="pt-16 md:pt-20 bg-[var(--color-primary)] min-h-screen flex items-center justify-center px-4">
      <Card variant="elevated" padding="lg" className="max-w-md w-full text-center">
        <CardContent>
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Payment Successful!
          </h2>
          <p className="text-[var(--color-text-secondary)] mt-2">
            Your subscription has been activated successfully.
          </p>
          {transactionId && (
            <p className="text-xs text-[var(--color-text-tertiary)] mt-2">
              Transaction ID: {transactionId}
            </p>
          )}
          <div className="mt-6 flex flex-col gap-3">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
            </Button>
            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={() => navigate('/properties')}
            >
              Browse Properties
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionSuccess;