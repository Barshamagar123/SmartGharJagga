// src/modules/payment/payment.routes.ts

import express from 'express';
import PaymentController from './payment.controller';
import { authMiddleware } from '@/middleware/auth.middleware';

const router = express.Router();

router.get('/callback', PaymentController.paymentCallback);

router.post('/initiate', authMiddleware, PaymentController.initiatePayment);
router.post('/verify', authMiddleware, PaymentController.verifyPayment);
router.get('/status/:transactionId', authMiddleware, PaymentController.getPaymentStatus);
router.get('/history', authMiddleware, PaymentController.getPaymentHistory);

export default router;