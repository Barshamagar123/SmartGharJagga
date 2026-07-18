// src/modules/subscription/subscription.routes.ts

import { Router } from 'express';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '@/middleware/auth.middleware';
import { requireRole } from '@/middleware/role.middleware';
import { validate } from '@/middleware/validation.middleware';
import { createSubscriptionSchema } from './subscription.validation';

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

// ============================================
// PROTECTED ROUTES (Auth Required)
// ============================================

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
 * @route GET /api/v1/subscriptions/status
 * @desc Get subscription status
 * @access Private
 */
router.get(
  '/status',
  authMiddleware,
  subscriptionController.getSubscriptionStatus
);

/**
 * @route GET /api/v1/subscriptions/history
 * @desc Get subscription history
 * @access Private
 */
router.get(
  '/history',
  authMiddleware,
  subscriptionController.getSubscriptionHistory
);

/**
 * @route POST /api/v1/subscriptions/subscribe
 * @desc Create new subscription
 * @access Private
 */
router.post(
  '/subscribe',
  authMiddleware,
  validate(createSubscriptionSchema),
  subscriptionController.createSubscription
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