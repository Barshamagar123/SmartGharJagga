// src/modules/payment/payment.controller.ts

import { Request, Response } from 'express';
import { PaymentService } from './payment.service';
import { SubscriptionService } from '../subscription/subscription.service';

const subscriptionService = new SubscriptionService();

export class PaymentController {
  // ============================================
  // 1. INITIATE PAYMENT
  // ============================================
  static async initiatePayment(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { plan, paymentMethod } = req.body;

      const planDetails = subscriptionService.getPlanDetails(plan);
      if (!planDetails) {
        return res.status(400).json({
          success: false,
          message: 'Invalid plan selected',
        });
      }

      const result = await subscriptionService.initiateSubscription(userId, {
        planType: plan,
        paymentMethod: paymentMethod,
      });

      return res.status(200).json({
        success: true,
        data: result,
        message: 'Payment initiated successfully',
      });

    } catch (error: any) {
      console.error('❌ Payment initiation error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Payment initiation failed',
      });
    }
  }

  // ============================================
  // 2. VERIFY PAYMENT
  // ============================================
  static async verifyPayment(req: Request, res: Response) {
    try {
      const { transactionId, paymentMethod } = req.body;

      if (!transactionId || !paymentMethod) {
        return res.status(400).json({
          success: false,
          message: 'Transaction ID and payment method are required',
        });
      }

      let verificationResult;
      switch (paymentMethod) {
        case 'KHALTI':
          verificationResult = await PaymentService.verifyKhaltiPayment(transactionId);
          break;
        case 'ESEWA':
          verificationResult = await PaymentService.verifyEsewaPayment(transactionId);
          break;
        case 'STRIPE':
          verificationResult = await PaymentService.verifyStripePayment(transactionId);
          break;
        default:
          return res.status(400).json({
            success: false,
            message: 'Invalid payment method',
          });
      }

      if (!verificationResult.success) {
        return res.status(400).json({
          success: false,
          message: 'Payment verification failed',
        });
      }

      const result = await subscriptionService.activateSubscription(
        transactionId,
        verificationResult.data
      );

      return res.status(200).json({
        success: true,
        data: result,
        message: 'Payment verified and subscription activated',
      });

    } catch (error: any) {
      console.error('❌ Payment verification error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Payment verification failed',
      });
    }
  }

  // ============================================
  // 3. PAYMENT CALLBACK - FIXED
  // ============================================
  static async paymentCallback(req: Request, res: Response) {
    try {
      // ✅ Safe function to extract string
      const getString = (value: any): string => {
        if (!value) return '';
        if (typeof value === 'string') return value;
        if (Array.isArray(value)) return value[0] || '';
        return String(value);
      };

      const transactionId = getString(req.query.transactionId);
      const status = getString(req.query.status);

      console.log('📥 Payment callback:', { transactionId, status });

      if (!transactionId || !status) {
        console.error('❌ Missing transaction details');
        return res.redirect(`${process.env.FRONTEND_URL}/subscription/failed`);
      }

      if (status === 'success' || status === 'Completed') {
        await subscriptionService.confirmPayment(transactionId);
        return res.redirect(`${process.env.FRONTEND_URL}/subscription/success?txn=${transactionId}`);
      } else {
        await subscriptionService.failPayment(transactionId);
        return res.redirect(`${process.env.FRONTEND_URL}/subscription/failed?txn=${transactionId}`);
      }

    } catch (error: any) {
      console.error('❌ Payment callback error:', error);
      return res.redirect(`${process.env.FRONTEND_URL}/subscription/failed`);
    }
  }

  // ============================================
  // 4. GET PAYMENT STATUS - ✅ LINE 157 FIXED
  // ============================================
  static async getPaymentStatus(req: Request, res: Response) {
    try {
      // ✅ Fix: Safely extract transactionId from params
      const getString = (value: any): string => {
        if (!value) return '';
        if (typeof value === 'string') return value;
        if (Array.isArray(value)) return value[0] || '';
        return String(value);
      };

      const transactionId = getString(req.params.transactionId);
      const userId = (req as any).user.id;

      if (!transactionId) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found',
        });
      }

      const status = await subscriptionService.getPaymentStatus(transactionId, userId);

      if (!status) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: status,
      });

    } catch (error: any) {
      console.error('❌ Get payment status error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to get payment status',
      });
    }
  }

  // ============================================
  // 5. GET PAYMENT HISTORY
  // ============================================
  static async getPaymentHistory(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const history = await subscriptionService.getPaymentHistory(userId, page, limit);

      return res.status(200).json({
        success: true,
        data: history,
      });

    } catch (error: any) {
      console.error('❌ Get payment history error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to get payment history',
      });
    }
  }
}

export default PaymentController;