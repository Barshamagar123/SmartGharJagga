
import axios from 'axios';
import { ApiError } from '@/utils/apiError';
import { PaymentMethod } from '@prisma/client';

export class PaymentService {
  // ============================================
  // 1. GENERATE TRANSACTION ID
  // ============================================
  generateTransactionId(): string {
    const prefix = 'TXN';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }

  // ============================================
  // 2. INITIATE KHALTI PAYMENT
  // ============================================
  async initiateKhaltiPayment(
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
        return_url: `${process.env.APP_URL || 'http://localhost:5001'}/api/v1/subscriptions/payment/callback`,
        website_url: 'https://smartgharjagga.com',
      };

      console.log('📤 Initiating Khalti payment:', { amount, transactionId });

      const response = await axios.post(KHALTI_API_URL, payload, {
        headers: {
          'Authorization': `Key ${KHALTI_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('✅ Khalti response:', response.data);

      if (response.data.status === 'success') {
        return response.data.redirect_url;
      } else {
        throw new Error(response.data.message || 'Khalti payment initiation failed');
      }
    } catch (error: any) {
      console.error('❌ Khalti Payment Error:', error.response?.data || error.message);
      throw new ApiError(400, error.response?.data?.message || 'Payment initiation failed');
    }
  }

  // ============================================
  // 3. INITIATE ESEWA PAYMENT
  // ============================================
  async initiateEsewaPayment(
    amount: number,
    transactionId: string,
    customerName: string,
    customerEmail: string,
    customerPhone: string
  ): Promise<string> {
    try {
      const ESEWA_MERCHANT_ID = process.env.ESEWA_MERCHANT_ID || 'EPAYTEST';
      const ESEWA_URL = process.env.ESEWA_URL || 'https://rc.esewa.com.np/epay/main';

      const successUrl = `${process.env.APP_URL || 'http://localhost:5001'}/api/v1/subscriptions/payment/callback?status=success&transactionId=${transactionId}`;
      const failureUrl = `${process.env.APP_URL || 'http://localhost:5001'}/api/v1/subscriptions/payment/callback?status=failed&transactionId=${transactionId}`;

      const paymentUrl = `${ESEWA_URL}?amt=${amount}&txnId=${transactionId}&pid=SmartGharJagga&scd=${ESEWA_MERCHANT_ID}&su=${encodeURIComponent(successUrl)}&fu=${encodeURIComponent(failureUrl)}`;

      console.log('📤 eSewa payment URL:', paymentUrl);

      return paymentUrl;
    } catch (error: any) {
      console.error('❌ eSewa Payment Error:', error.message);
      throw new ApiError(400, 'eSewa payment initiation failed');
    }
  }

  // ============================================
  // 4. GENERATE PAYMENT URL
  // ============================================
  generatePaymentUrl(
    amount: number,
    transactionId: string,
    paymentMethod: PaymentMethod,
    user: any
  ): string {
    if (paymentMethod === 'KHALTI') {
      // Return Khalti URL - actual integration in service
      return `https://khalti.com/pay?amount=${amount}&txn=${transactionId}`;
    } else if (paymentMethod === 'ESEWA') {
      return `https://rc.esewa.com.np/epay/main?amt=${amount}&txnId=${transactionId}`;
    }
    return '';
  }
}