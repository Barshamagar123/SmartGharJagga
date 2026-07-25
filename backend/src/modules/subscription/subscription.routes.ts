// src/modules/subscription/subscription.routes.ts

import express, { Request, Response } from 'express';
import { SubscriptionController } from './subscription.controller';
import { authMiddleware } from '@/middleware/auth.middleware';

const router = express.Router();

// ============================================
// 📌 PUBLIC ROUTES
// ============================================

/**
 * @route   GET /api/v1/subscriptions/plans
 * @desc    Get all subscription plans
 * @access  Public
 */
router.get('/plans', SubscriptionController.getPlans);

// ============================================
// 📌 PROTECTED ROUTES
// ============================================

/**
 * @route   POST /api/v1/subscriptions/initiate
 * @desc    Initiate subscription
 * @access  Private
 */
router.post('/initiate', authMiddleware, SubscriptionController.initiateSubscription);

/**
 * @route   GET /api/v1/subscriptions/me
 * @desc    Get current user's subscription
 * @access  Private
 */
router.get('/me', authMiddleware, SubscriptionController.getMySubscription);

/**
 * @route   POST /api/v1/subscriptions/cancel
 * @desc    Cancel subscription
 * @access  Private
 */
router.post('/cancel', authMiddleware, SubscriptionController.cancelSubscription);

/**
 * @route   GET /api/v1/subscriptions/history
 * @desc    Get payment history
 * @access  Private
 */
router.get('/history', authMiddleware, SubscriptionController.getPaymentHistory);

/**
 * @route   GET /api/v1/subscriptions/status
 * @desc    Check if user has active subscription
 * @access  Private
 */
router.get('/status', authMiddleware, SubscriptionController.checkSubscriptionStatus);

export default router;