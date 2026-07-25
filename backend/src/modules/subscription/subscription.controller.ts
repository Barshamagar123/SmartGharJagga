// src/modules/subscription/subscription.controller.ts

import { Request, Response } from 'express';
import { SubscriptionService } from './subscription.service';
import { ApiError } from '../../utils/apiError';

const subscriptionService = new SubscriptionService();

export class SubscriptionController {
  // ============================================
  // 1. GET PLANS
  // ============================================
  static async getPlans(req: Request, res: Response) {
    try {
      const plans = subscriptionService.getPlans();
      return res.status(200).json({ success: true, data: plans });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // ============================================
  // 2. INITIATE SUBSCRIPTION
  // ============================================
  static async initiateSubscription(req: Request, res: Response) {
    try {
      // ✅ Access user from req.user (added by authMiddleware)
      const userId = (req as any).user.id;
      const { planType, paymentMethod } = req.body;

      if (!planType || !paymentMethod) {
        return res.status(400).json({
          success: false,
          message: 'Plan type and payment method are required',
        });
      }

      const result = await subscriptionService.initiateSubscription(userId, {
        planType,
        paymentMethod,
      });

      return res.status(200).json({
        success: true,
        data: result,
        message: 'Subscription initiated successfully',
      });

    } catch (error: any) {
      console.error('❌ Initiate subscription error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to initiate subscription',
      });
    }
  }

  // ============================================
  // 3. GET MY SUBSCRIPTION
  // ============================================
  static async getMySubscription(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const subscription = await subscriptionService.getUserSubscription(userId);

      return res.status(200).json({
        success: true,
        data: subscription,
      });

    } catch (error: any) {
      console.error('❌ Get subscription error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to get subscription',
      });
    }
  }

  // ============================================
  // 4. CANCEL SUBSCRIPTION
  // ============================================
  static async cancelSubscription(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const result = await subscriptionService.cancelSubscription(userId);

      return res.status(200).json({
        success: true,
        data: result,
        message: 'Subscription cancelled successfully',
      });

    } catch (error: any) {
      console.error('❌ Cancel subscription error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to cancel subscription',
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
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to get payment history',
      });
    }
  }

  // ============================================
  // 6. CHECK SUBSCRIPTION STATUS
  // ============================================
  static async checkSubscriptionStatus(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const status = await subscriptionService.hasActiveSubscription(userId);

      return res.status(200).json({
        success: true,
        data: status,
      });

    } catch (error: any) {
      console.error('❌ Check subscription status error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to check subscription status',
      });
    }
  }
}

export default SubscriptionController;