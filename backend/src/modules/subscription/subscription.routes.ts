// src/modules/subscription/subscription.routes.ts

import { Router } from 'express';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '@/middleware/auth.middleware';
import { requireRole } from '@/middleware/role.middleware';
import { validate } from '@/middleware/validation.middleware';
import { initiateSubscriptionSchema } from './subscription.validation';

const prisma = new PrismaClient();
const subscriptionService = new SubscriptionService(prisma);
const subscriptionController = new SubscriptionController(subscriptionService);

const router = Router();

// ============================================
// PUBLIC ROUTES
// ============================================

/**
 * @route GET /api/v1/subscriptions/plans
 * @desc Get all subscription plans
 * @access Public
 */
router.get('/plans', subscriptionController.getPlans);

/**
 * @route GET /api/v1/subscriptions/payment/callback
 * @desc Payment callback from Khalti/eSewa
 * @access Public
 */
router.get('/payment/callback', subscriptionController.paymentCallback);

// ============================================
// PROTECTED ROUTES
// ============================================

/**
 * @route POST /api/v1/subscriptions/initiate
 * @desc Initiate subscription with payment
 * @access Private
 */
router.post(
  '/initiate',
  authMiddleware,
  validate(initiateSubscriptionSchema),
  subscriptionController.initiateSubscription
);

/**
 * @route GET /api/v1/subscriptions/me
 * @desc Get user's current subscription
 * @access Private
 */
router.get(
  '/me',
  authMiddleware,
  subscriptionController.getUserSubscription
);

/**
 * @route GET /api/v1/subscriptions/payments
 * @desc Get payment history
 * @access Private
 */
router.get(
  '/payments',
  authMiddleware,
  subscriptionController.getPaymentHistory
);

/**
 * @route GET /api/v1/subscriptions/payments/:paymentId
 * @desc Get payment by ID
 * @access Private
 */
router.get(
  '/payments/:paymentId',
  authMiddleware,
  subscriptionController.getPaymentById
);

/**
 * @route POST /api/v1/subscriptions/cancel
 * @desc Cancel subscription
 * @access Private
 */
router.post(
  '/cancel',
  authMiddleware,
  subscriptionController.cancelSubscription
);

/**
 * @route GET /api/v1/subscriptions/premium-check
 * @desc Check if user has premium access
 * @access Private
 */
router.get(
  '/premium-check',
  authMiddleware,
  subscriptionController.checkPremiumAccess
);

// ============================================
// ADMIN ROUTES
// ============================================

/**
 * @route GET /api/v1/subscriptions/analytics
 * @desc Get subscription analytics
 * @access Admin only
 */
router.get(
  '/analytics',
  authMiddleware,
  requireRole('ADMIN'),
  subscriptionController.getSubscriptionAnalytics
);

export default router;