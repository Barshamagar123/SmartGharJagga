// src/modules/subscription/subscription.types.ts

import { SubscriptionPlan, SubscriptionStatus, PaymentMethod, PaymentStatus } from '@prisma/client';

export interface InitiateSubscriptionRequest {
  planType: SubscriptionPlan;
  paymentMethod: PaymentMethod;
}

export interface SubscriptionResponse {
  id: string;
  userId: string;
  planType: SubscriptionPlan;
  status: SubscriptionStatus;
  isActive: boolean;
  startDate: Date;
  endDate: Date;
  price: number;
  features: any;
  daysRemaining: number;
}

export interface PaymentResponse {
  id: string;
  subscriptionId: string;
  userId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionId: string;
  paymentStatus: PaymentStatus;
  paidAt?: Date;
}

export interface InitiatePaymentResponse {
  subscriptionId: string;
  paymentId: string;
  transactionId: string;
  amount: number;
  paymentUrl: string;
  paymentMethod: PaymentMethod;
}