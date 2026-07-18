// src/modules/subscription/subscription.types.ts

import { SubscriptionPlan, SubscriptionStatus } from '@prisma/client';

export interface SubscriptionPlanData {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: number; // in days
  features: string[];
  type: 'BUYER' | 'SELLER';
}

export interface SubscriptionResponse {
  id: string;
  userId: string;
  planType: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  price: number;
  features: any;
  isActive: boolean;
  daysRemaining: number;
}

export interface CreateSubscriptionRequest {
  planType: SubscriptionPlan;
  paymentMethod: 'khalti' | 'esewa' | 'stripe';
  paymentDetails?: any;
}

export interface SubscriptionStatusResponse {
  isActive: boolean;
  planType: SubscriptionPlan;
  daysRemaining: number;
  features: string[];
}