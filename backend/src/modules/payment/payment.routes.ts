// backend/src/modules/payment/payment.routes.ts

import express from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = express.Router();

// ============================================
// 📌 PUBLIC ROUTES (No authentication required)
// ============================================

/**
 * @route   GET /api/v1/payments/callback
 * @desc    Payment callback from Khalti/eSewa/Stripe
 * @access  Public
 */
router.get('/callback', PaymentController.paymentCallback);

// ============================================
// 📌 PROTECTED ROUTES (Authentication required)
// ============================================

// Apply authentication middleware to all routes below
router.use(authMiddleware);

/**
 * @route   POST /api/v1/payments/initiate
 * @desc    Initiate a new payment
 * @access  Private
 * @body    { plan: 'SELLER_PREMIUM' | 'BUYER_PREMIUM', paymentMethod: 'KHALTI' | 'ESEWA' | 'STRIPE' }
 */
router.post('/initiate', PaymentController.initiatePayment);

/**
 * @route   POST /api/v1/payments/verify
 * @desc    Verify payment status
 * @access  Private
 * @body    { transactionId: string, paymentMethod: 'KHALTI' | 'ESEWA' | 'STRIPE' }
 */
router.post('/verify', PaymentController.verifyPayment);

/**
 * @route   GET /api/v1/payments/status/:transactionId
 * @desc    Get payment status by transaction ID
 * @access  Private
 * @params  transactionId: string
 */
router.get('/status/:transactionId', PaymentController.getPaymentStatus);

/**
 * @route   GET /api/v1/payments/history
 * @desc    Get user's payment history
 * @access  Private
 * @query   page: number (optional, default: 1)
 * @query   limit: number (optional, default: 10)
 */
router.get('/history', PaymentController.getPaymentHistory);

/**
 * @route   POST /api/v1/payments/refund/:transactionId
 * @desc    Refund a payment (Admin only)
 * @access  Private/Admin
 * @params  transactionId: string
 * @body    { reason: string }
 */
router.post('/refund/:transactionId', PaymentController.refundPayment);

export default router;