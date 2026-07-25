// backend/src/modules/payment/payment.types.ts

export enum PaymentMethod {
  KHALTI = 'KHALTI',
  ESEWA = 'ESEWA',
  STRIPE = 'STRIPE',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export interface InitiatePaymentDto {
  plan: 'SELLER_PREMIUM' | 'BUYER_PREMIUM';
  paymentMethod: PaymentMethod;
}

export interface VerifyPaymentDto {
  transactionId: string;
  paymentMethod: PaymentMethod;
}

export interface PaymentResponse {
  transactionId: string;
  paymentUrl: string;
  amount: number;
  plan: {
    id: string;
    name: string;
    price: number;
    duration: number;
  };
}

export interface PaymentVerificationResponse {
  success: boolean;
  message: string;
  transactionId: string;
  status: PaymentStatus;
}