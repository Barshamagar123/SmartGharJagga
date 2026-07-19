// src/modules/subscription/subscription.controller.ts

import { Request, Response } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import { ApiResponse } from '@/utils/apiResponse';
import { ApiError } from '@/utils/apiError';
import { SubscriptionService } from './subscription.service';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  // ============================================
  // 1. GET PLANS
  // ============================================
  getPlans = asyncHandler(async (req: Request, res: Response) => {
    const plans = this.subscriptionService.getPlans();
    ApiResponse.success(res, 200, 'Plans fetched successfully', plans);
  });

  // ============================================
  // 2. INITIATE SUBSCRIPTION
  // ============================================
  initiateSubscription = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'Authentication required');
    }

    const { planType, paymentMethod } = req.body;

    if (!planType || !paymentMethod) {
      throw new ApiError(400, 'Plan type and payment method are required');
    }

    const result = await this.subscriptionService.initiateSubscription(userId, {
      planType,
      paymentMethod,
    });

    ApiResponse.success(res, 200, 'Payment initiated successfully', result);
  });

  // ============================================
  // 3. PAYMENT CALLBACK
  // ============================================
  paymentCallback = asyncHandler(async (req: Request, res: Response) => {
    const transactionId = req.query.transactionId as string;
    const status = req.query.status as string;

    console.log('📥 Payment callback:', { transactionId, status });

    try {
      let result;

      if (status === 'success' || status === 'SUCCESS') {
        result = await this.subscriptionService.activateSubscription(
          transactionId,
          req.query
        );
      } else {
        result = await this.subscriptionService.handlePaymentFailure(
          transactionId,
          'Payment failed or cancelled by user'
        );
      }

      if (result.success) {
        return res.redirect(
          `${process.env.FRONTEND_URL || 'http://localhost:3000'}/subscription/success?transactionId=${transactionId}`
        );
      } else {
        return res.redirect(
          `${process.env.FRONTEND_URL || 'http://localhost:3000'}/subscription/failed?transactionId=${transactionId}`
        );
      }
    } catch (error: any) {
      console.error('❌ Payment callback error:', error.message);
      return res.redirect(
        `${process.env.FRONTEND_URL || 'http://localhost:3000'}/subscription/failed?transactionId=${transactionId}&error=${error.message}`
      );
    }
  });

  // ============================================
  // 4. GET USER SUBSCRIPTION
  // ============================================
  getUserSubscription = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'Authentication required');
    }

    const subscription = await this.subscriptionService.getUserSubscription(userId);
    ApiResponse.success(res, 200, 'Subscription fetched successfully', subscription);
  });

  // ============================================
  // 5. GET PAYMENT HISTORY
  // ============================================
  getPaymentHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'Authentication required');
    }

    const payments = await this.subscriptionService.getPaymentHistory(userId);
    ApiResponse.success(res, 200, 'Payment history fetched successfully', payments);
  });

  // ============================================
  // 6. GET PAYMENT BY ID - FIXED!
  // ============================================
  getPaymentById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'Authentication required');
    }

    // ✅ FIX: Cast paymentId to string
    const paymentId = req.params.paymentId as string;
    if (!paymentId) {
      throw new ApiError(400, 'Payment ID is required');
    }

    const payment = await this.subscriptionService.getPaymentById(paymentId, userId);
    ApiResponse.success(res, 200, 'Payment fetched successfully', payment);
  });

  // ============================================
  // 7. CANCEL SUBSCRIPTION
  // ============================================
  cancelSubscription = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'Authentication required');
    }

    const result = await this.subscriptionService.cancelSubscription(userId);
    ApiResponse.success(res, 200, 'Subscription cancelled successfully', result);
  });

  // ============================================
  // 8. CHECK PREMIUM ACCESS
  // ============================================
  checkPremiumAccess = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'Authentication required');
    }

    const status = await this.subscriptionService.hasActiveSubscription(userId);
    ApiResponse.success(res, 200, 'Premium access status', status);
  });

  // ============================================
  // 9. GET ANALYTICS (Admin)
  // ============================================
  getSubscriptionAnalytics = asyncHandler(async (req: AuthRequest, res: Response) => {
    const analytics = await this.subscriptionService.getSubscriptionAnalytics();
    ApiResponse.success(res, 200, 'Subscription analytics fetched successfully', analytics);
  });
}