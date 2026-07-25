// src/pages/Subscription/components/PlanCard.tsx

import React from 'react';
import { Card, CardContent } from '../../../components/common/Card/Card';
import { Badge } from '../../../components/common/Badge/Badge';
import { Button } from '../../../components/common/Button/Button';

interface PlanCardProps {
  plan: {
    id: string;
    name: string;
    price: number;
    currency: string;
    features: string[];
    color: string;
    popular?: boolean;
  };
  isCurrent: boolean;
  onUpgrade: () => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, isCurrent, onUpgrade }) => {
  const isFree = plan.price === 0;

  return (
    <Card
      variant={plan.popular ? 'elevated' : 'default'}
      padding="lg"
      className={`border-2 h-full ${
        isCurrent
          ? 'border-[#2D5A27]'
          : plan.popular
          ? 'border-[#D4AF37]'
          : 'border-[var(--color-primary-border)]'
      } ${plan.popular ? 'relative transform scale-105' : ''}`}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-[#D4AF37] text-white text-xs font-bold px-6 py-1.5 rounded-full shadow-lg shadow-[#D4AF37]/25">
            MOST POPULAR
          </span>
        </div>
      )}
      <CardContent>
        <div className="text-center">
          <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">
            {plan.name}
          </h3>
          <div className="mt-4">
            <span className="text-4xl font-bold text-[#2D5A27]">
              {isFree ? 'Free' : `Rs ${plan.price.toLocaleString()}`}
            </span>
            {!isFree && (
              <span className="text-[var(--color-text-tertiary)]"> / month</span>
            )}
          </div>
          {isCurrent && (
            <Badge variant="success" size="sm" className="mt-2">
              ✓ Current Plan
            </Badge>
          )}
        </div>

        <ul className="mt-6 space-y-3">
          {plan.features.map((feature, index) => (
            <li
              key={index}
              className="flex items-center gap-3 text-[var(--color-text-secondary)]"
            >
              <span className="text-[#2D5A27] text-lg">✓</span>
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        <Button
          variant={plan.popular ? 'gold' : 'primary'}
          size="lg"
          fullWidth
          className="mt-6"
          disabled={isCurrent}
          onClick={onUpgrade}
        >
          {isCurrent ? 'Current Plan' : isFree ? 'Get Started' : 'Upgrade Now'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PlanCard;