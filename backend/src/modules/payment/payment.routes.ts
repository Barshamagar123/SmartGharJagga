// backend/src/modules/payment/payment.routes.ts

import express from 'express';
import { PaymentController } from './payment.controller';
import { authMiddleware } from '@/middleware/auth.middleware';


const router = express.Router();

// ✅ Public routes
router.get('/callback', PaymentController.paymentCallback);

// ✅ Protected routes
router.use(authMiddleware);

router.post('/initiate', PaymentController.initiatePayment);
router.post('/verify', PaymentController.verifyPayment);
router.get('/status/:transactionId', PaymentController.getPaymentStatus);
router.get('/history', PaymentController.getPaymentHistory);

export default router;