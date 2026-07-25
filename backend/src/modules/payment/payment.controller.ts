// backend/src/modules/payment/payment.controller.ts

import { Request, Response } from 'express';
import { PaymentService } from './payment.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { ApiResponse } from '../../utils/apiResponse';
import { ApiError } from '../../utils/apiError';
import { PaymentMethod } from './payment.types';

export class PaymentController {
  // ============================================
  // 1. INITIATE PAYMENT
  // ============================================
  static async initiatePayment(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const { plan, paymentMethod } = req.body;

      // Validate plan
      const planDetails = SubscriptionService.getPlanDetails(plan);
      if (!planDetails) {
        throw new ApiError(400, 'Invalid plan selected');
      }

      // Generate transaction ID
      const transactionId = PaymentService.generateTransactionId();

      // Create pending subscription
      await SubscriptionService.createPendingSubscription({
        userId,
        plan,
        transactionId,
        amount: planDetails.price,
        paymentMethod,
      });

      // Initiate payment based on method
      let paymentUrl = '';
      const user = req.user;

      switch (paymentMethod) {
        case 'KHALTI':
          paymentUrl = await PaymentService.initiateKhaltiPayment(
            planDetails.price,
            transactionId,
            user.name,
            user.email,
            user.phone
          );
          break;

        case 'ESEWA':
          paymentUrl = await PaymentService.initiateEsewaPayment(
            planDetails.price,
            transactionId,
            user.name,
            user.email,
            user.phone
          );
          break;

        case 'STRIPE':
          paymentUrl = await PaymentService.initiateStripePayment(
            planDetails.price,
            transactionId,
            user.email
          );
          break;

        default:
          throw new ApiError(400, 'Invalid payment method');
      }

      return ApiResponse.success(res, {
        transactionId,
        paymentUrl,
        amount: planDetails.price,
        plan: planDetails,
        message: 'Payment initiated successfully',
      });

    } catch (error: any) {
      return ApiResponse.error(res, error.message || 'Payment initiation failed', 400);
    }
  }

  // ============================================
  // 2. VERIFY PAYMENT
  // ============================================
  static async verifyPayment(req: Request, res: Response) {
    try {
      const { transactionId, paymentMethod } = req.body;

      // Verify payment with respective gateway
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
          throw new ApiError(400, 'Invalid payment method');
      }

      if (!verificationResult.success) {
        throw new ApiError(400, 'Payment verification failed');
      }

      // Activate subscription
      const subscription = await SubscriptionService.activateSubscription({
        userId: req.user.id,
        transactionId,
        paymentMethod,
      });

      return ApiResponse.success(res, {
        subscription,
        message: 'Payment verified and subscription activated',
      });

    } catch (error: any) {
      return ApiResponse.error(res, error.message || 'Payment verification failed', 400);
    }
  }

  // ============================================
  // 3. PAYMENT CALLBACK
  // ============================================
  static async paymentCallback(req: Request, res: Response) {
    try {
      const { transactionId, status, paymentMethod } = req.query;

      if (!transactionId || !status) {
        throw new ApiError(400, 'Missing transaction details');
      }

      // Update subscription status
      if (status === 'success' || status === 'Completed') {
        await SubscriptionService.confirmPayment(transactionId as string);
        return res.redirect(`${process.env.FRONTEND_URL}/subscription/success?txn=${transactionId}`);
      } else {
        await SubscriptionService.failPayment(transactionId as string);
        return res.redirect(`${process.env.FRONTEND_URL}/subscription/failed?txn=${transactionId}`);
      }

    } catch (error: any) {
      console.error('Payment callback error:', error);
      return res.redirect(`${process.env.FRONTEND_URL}/subscription/failed`);
    }
  }

  // ============================================
  // 4. GET PAYMENT STATUS
  // ============================================
  static async getPaymentStatus(req: Request, res: Response) {
    try {
      const { transactionId } = req.params;
      const userId = req.user.id;

      const status = await SubscriptionService.getPaymentStatus(transactionId, userId);

      return ApiResponse.success(res, status);

    } catch (error: any) {
      return ApiResponse.error(res, error.message || 'Failed to get payment status', 400);
    }
  }

  // ============================================
  // 5. GET PAYMENT HISTORY
  // ============================================
  static async getPaymentHistory(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10 } = req.query;

      const history = await SubscriptionService.getPaymentHistory(
        userId,
        Number(page),
        Number(limit)
      );

      return ApiResponse.success(res, history);

    } catch (error: any) {
      return ApiResponse.error(res, error.message || 'Failed to get payment history', 400);
    }
  }
}