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
  // 1. Get All Plans
  // ============================================
  getPlans = asyncHandler(async (req: Request, res: Response) => {
    const plans = this.subscriptionService.getPlans();
    ApiResponse.success(res, 200, 'Plans fetched successfully', plans);
  });

  // ============================================
  // 2. Get User's Subscription
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
  // 3. Create Subscription
  // ============================================
  createSubscription = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'Authentication required');
    }

    const subscription = await this.subscriptionService.createSubscription(
      userId,
      req.body
    );

    ApiResponse.success(res, 201, 'Subscription created successfully', subscription);
  });

  // ============================================
  // 4. Cancel Subscription
  // ============================================
  cancelSubscription = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'Authentication required');
    }

    await this.subscriptionService.cancelSubscription(userId);
    ApiResponse.success(res, 200, 'Subscription cancelled successfully');
  });

  // ============================================
  // 5. Get Subscription Status
  // ============================================
  getSubscriptionStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'Authentication required');
    }

    const status = await this.subscriptionService.getSubscriptionStatus(userId);
    ApiResponse.success(res, 200, 'Subscription status fetched successfully', status);
  });

  // ============================================
  // 6. Get Subscription History
  // ============================================
  getSubscriptionHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'Authentication required');
    }

    const history = await this.subscriptionService.getSubscriptionHistory(userId);
    ApiResponse.success(res, 200, 'Subscription history fetched successfully', history);
  });

  // ============================================
  // 7. Get Subscription Analytics (Admin)
  // ============================================
  getSubscriptionAnalytics = asyncHandler(async (req: AuthRequest, res: Response) => {
    const analytics = await this.subscriptionService.getSubscriptionAnalytics();
    ApiResponse.success(res, 200, 'Subscription analytics fetched successfully', analytics);
  });
}