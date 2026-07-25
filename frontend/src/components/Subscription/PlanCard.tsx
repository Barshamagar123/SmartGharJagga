// src/pages/Subscription/components/PlanCard.tsx

import React from 'react';
import { Card, CardContent } from '../../../components/common/Card/Card';
import { Badge } from '../../../components/common/Badge/Badge';
import { Button } from '../../../components/common/Button/Button';

interface PlanCardProps {
  plan: {
    id: string;
    name: string;
    price: string;
    period: string;
    role: string;
    badge: string | null;
    features: string[];
    isPopular: boolean;
    isCurrent: boolean;
  };
  onUpgrade: () => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, onUpgrade }) => {
  return (
    <Card
      variant={plan.isPopular ? 'elevated' : 'default'}
      padding="lg"
      className={`border-2 h-full ${
        plan.isCurrent
          ? 'border-[#2D5A27]'
          : plan.isPopular
          ? 'border-[#D4AF37]'
          : 'border-[var(--color-primary-border)]'
      } ${plan.isPopular ? 'relative transform scale-105' : ''}`}
    >
      {plan.badge && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-[#D4AF37] text-white text-xs font-bold px-6 py-1.5 rounded-full shadow-lg shadow-[#D4AF37]/25">
            {plan.badge}
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
              {plan.price}
            </span>
            <span className="text-[var(--color-text-tertiary)]">
              {plan.period}
            </span>
          </div>
          {plan.isCurrent && (
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
              <span className="text-[#2D5A27] text-lg">
                {feature.includes('✅') ? '✓' : feature.includes('FULL AI POWER!') ? '🚀' : '✓'}
              </span>
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        <Button
          variant={plan.isPopular ? 'gold' : 'primary'}
          size="lg"
          fullWidth
          className="mt-6"
          disabled={plan.isCurrent}
          onClick={onUpgrade}
        >
          {plan.isCurrent ? 'Current Plan' : plan.price === '₹0' ? 'Get Started' : 'Upgrade Now'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PlanCard;