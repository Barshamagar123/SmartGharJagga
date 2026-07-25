// src/modules/payment/payment.service.ts

import axios from 'axios';
import { ApiError } from '../../utils/apiError';
import { PaymentMethod } from '@prisma/client';

export class PaymentService {
  // ============================================
  // 1. GENERATE TRANSACTION ID
  // ============================================
  static generateTransactionId(): string {
    const prefix = 'TXN';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }

  // ============================================
  // 2. GENERATE PAYMENT URL
  // ============================================
  static generatePaymentUrl(
    amount: number,
    transactionId: string,
    paymentMethod: PaymentMethod,
    user: any
  ): string {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    
    switch (paymentMethod) {
      case 'KHALTI':
        return `https://khalti.com/pay?amount=${amount}&txn=${transactionId}&return_url=${frontendUrl}/subscription/callback`;
      case 'ESEWA':
        return `https://rc.esewa.com.np/epay/main?amt=${amount}&txnId=${transactionId}&pid=SmartGharJagga`;
      case 'STRIPE':
        return `${frontendUrl}/checkout?session_id=${transactionId}`;
      default:
        return '';
    }
  }

  // ============================================
  // 3. INITIATE KHALTI PAYMENT
  // ============================================
  static async initiateKhaltiPayment(
    amount: number,
    transactionId: string,
    customerName: string,
    customerEmail: string,
    customerPhone: string
  ): Promise<string> {
    try {
      const KHALTI_API_URL = process.env.KHALTI_API_URL || 'https://a.khalti.com/api/v2/epayment/initiate/';
      const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY;

      if (!KHALTI_SECRET_KEY) {
        throw new Error('KHALTI_SECRET_KEY is not configured');
      }

      const amountInPaisa = Math.round(amount * 100);

      const payload = {
        amount: amountInPaisa,
        transaction_id: transactionId,
        product_name: 'Smart GharJagga Premium Subscription',
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        return_url: `${process.env.APP_URL || 'http://localhost:5001'}/api/v1/payments/callback`,
        website_url: 'https://smartgharjagga.com',
      };

      const response = await axios.post(KHALTI_API_URL, payload, {
        headers: {
          'Authorization': `Key ${KHALTI_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data.status === 'success' || response.data.payment_url) {
        return response.data.payment_url || response.data.redirect_url;
      } else {
        throw new Error(response.data.message || 'Khalti payment initiation failed');
      }
    } catch (error: any) {
      console.error('❌ Khalti Payment Error:', error.response?.data || error.message);
      throw new ApiError(400, error.response?.data?.message || 'Payment initiation failed');
    }
  }

  // ============================================
  // 4. INITIATE ESEWA PAYMENT
  // ============================================
  static async initiateEsewaPayment(
    amount: number,
    transactionId: string,
    customerName: string,
    customerEmail: string,
    customerPhone: string
  ): Promise<string> {
    try {
      const ESEWA_MERCHANT_ID = process.env.ESEWA_MERCHANT_ID || 'EPAYTEST';
      const ESEWA_URL = process.env.ESEWA_URL || 'https://rc.esewa.com.np/epay/main';

      const successUrl = `${process.env.APP_URL || 'http://localhost:5001'}/api/v1/payments/callback?status=success&transactionId=${transactionId}`;
      const failureUrl = `${process.env.APP_URL || 'http://localhost:5001'}/api/v1/payments/callback?status=failed&transactionId=${transactionId}`;

      const paymentUrl = `${ESEWA_URL}?amt=${amount}&txnId=${transactionId}&pid=SmartGharJagga&scd=${ESEWA_MERCHANT_ID}&su=${encodeURIComponent(successUrl)}&fu=${encodeURIComponent(failureUrl)}`;

      return paymentUrl;
    } catch (error: any) {
      console.error('❌ eSewa Payment Error:', error.message);
      throw new ApiError(400, 'eSewa payment initiation failed');
    }
  }

  // ============================================
  // 5. INITIATE STRIPE PAYMENT
  // ============================================
  static async initiateStripePayment(
    amount: number,
    transactionId: string,
    customerEmail: string
  ): Promise<string> {
    try {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'npr',
              product_data: {
                name: 'Smart GharJagga Premium Subscription',
                description: 'Get premium features for your real estate needs',
              },
              unit_amount: amount * 100,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/subscription/failed`,
        metadata: {
          transactionId,
          plan: 'PREMIUM',
        },
        customer_email: customerEmail,
      });

      return session.url;
    } catch (error: any) {
      console.error('❌ Stripe Payment Error:', error.message);
      throw new ApiError(400, 'Stripe payment initiation failed');
    }
  }

  // ============================================
  // 6. VERIFY KHALTI PAYMENT
  // ============================================
  static async verifyKhaltiPayment(transactionId: string): Promise<{ success: boolean; data?: any }> {
    try {
      const KHALTI_VERIFY_URL = process.env.KHALTI_VERIFY_URL || 'https://khalti.com/api/v2/epayment/lookup/';
      const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY;

      const response = await axios.post(
        KHALTI_VERIFY_URL,
        { transaction_id: transactionId },
        {
          headers: {
            'Authorization': `Key ${KHALTI_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.status === 'completed' || response.data.status === 'success') {
        return { success: true, data: response.data };
      }
      return { success: false };
    } catch (error: any) {
      console.error('❌ Khalti Verification Error:', error.message);
      return { success: false };
    }
  }

  // ============================================
  // 7. VERIFY ESEWA PAYMENT
  // ============================================
  static async verifyEsewaPayment(transactionId: string): Promise<{ success: boolean; data?: any }> {
    try {
      const ESEWA_VERIFY_URL = process.env.ESEWA_VERIFY_URL || 'https://rc.esewa.com.np/api/epay/transaction/status/';
      const response = await axios.get(`${ESEWA_VERIFY_URL}?txnId=${transactionId}`);

      if (response.data.status === 'success' || response.data.status === 'Completed') {
        return { success: true, data: response.data };
      }
      return { success: false };
    } catch (error: any) {
      console.error('❌ eSewa Verification Error:', error.message);
      return { success: false };
    }
  }

  // ============================================
  // 8. VERIFY STRIPE PAYMENT
  // ============================================
  static async verifyStripePayment(transactionId: string): Promise<{ success: boolean; data?: any }> {
    try {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      const sessions = await stripe.checkout.sessions.list({
        limit: 10,
        expand: ['data.payment_intent'],
      });

      const session = sessions.data.find(
        (s: any) => s.metadata?.transactionId === transactionId
      );

      if (session && session.payment_status === 'paid') {
        return { success: true, data: session };
      }
      return { success: false };
    } catch (error: any) {
      console.error('❌ Stripe Verification Error:', error.message);
      return { success: false };
    }
  }
}