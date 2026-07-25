// backend/src/modules/payment/payment.controller.ts

import { Request, Response } from 'express';
import { PaymentService } from './payment.service';
import { SubscriptionService } from '../subscription/subscription.service';

interface AuthRequest extends Request {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    phone?: string;
  };
}

export class PaymentController {
  // ============================================
  // 1. INITIATE PAYMENT
  // ============================================
  static async initiatePayment(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.id;
      const { plan, paymentMethod } = req.body;

      const planDetails = SubscriptionService.getPlanDetails(plan);
      if (!planDetails) {
        return res.status(400).json({
          success: false,
          message: 'Invalid plan selected',
        });
      }

      const transactionId = PaymentService.generateTransactionId();

      await SubscriptionService.createPendingSubscription({
        userId,
        plan,
        transactionId,
        amount: planDetails.price,
        paymentMethod,
      });

      let paymentUrl = '';
      const user = req.user;

      switch (paymentMethod) {
        case 'KHALTI':
          paymentUrl = await PaymentService.initiateKhaltiPayment(
            planDetails.price,
            transactionId,
            user.name,
            user.email,
            user.phone || '9800000000'
          );
          break;

        case 'ESEWA':
          paymentUrl = await PaymentService.initiateEsewaPayment(
            planDetails.price,
            transactionId,
            user.name,
            user.email,
            user.phone || '9800000000'
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
          return res.status(400).json({
            success: false,
            message: 'Invalid payment method',
          });
      }

      return res.status(200).json({
        success: true,
        data: {
          transactionId,
          paymentUrl,
          amount: planDetails.price,
          plan: planDetails,
        },
        message: 'Payment initiated successfully',
      });

    } catch (error: any) {
      console.error('❌ Payment initiation error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Payment initiation failed',
      });
    }
  }

  // ============================================
  // 2. VERIFY PAYMENT
  // ============================================
  static async verifyPayment(req: AuthRequest, res: Response) {
    try {
      const { transactionId, paymentMethod } = req.body;

      if (!transactionId || !paymentMethod) {
        return res.status(400).json({
          success: false,
          message: 'Transaction ID and payment method are required',
        });
      }

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
          return res.status(400).json({
            success: false,
            message: 'Invalid payment method',
          });
      }

      if (!verificationResult.success) {
        return res.status(400).json({
          success: false,
          message: 'Payment verification failed',
        });
      }

      // ✅ Now this works - confirmPayment exists!
      await SubscriptionService.confirmPayment(transactionId);

      return res.status(200).json({
        success: true,
        message: 'Payment verified and subscription activated',
      });

    } catch (error: any) {
      console.error('❌ Payment verification error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Payment verification failed',
      });
    }
  }

  // ============================================
  // 3. PAYMENT CALLBACK
  // ============================================
  static async paymentCallback(req: Request, res: Response) {
    try {
      const { transactionId, status } = req.query;

      if (!transactionId || !status) {
        return res.status(400).json({
          success: false,
          message: 'Missing transaction details',
        });
      }

      if (status === 'success' || status === 'Completed') {
        // ✅ Now this works - confirmPayment exists!
        await SubscriptionService.confirmPayment(transactionId as string);
        return res.redirect(`${process.env.FRONTEND_URL}/subscription/success?txn=${transactionId}`);
      } else {
        // ✅ Now this works - failPayment exists!
        await SubscriptionService.failPayment(transactionId as string);
        return res.redirect(`${process.env.FRONTEND_URL}/subscription/failed?txn=${transactionId}`);
      }

    } catch (error: any) {
      console.error('❌ Payment callback error:', error);
      return res.redirect(`${process.env.FRONTEND_URL}/subscription/failed`);
    }
  }

  // ============================================
  // 4. GET PAYMENT STATUS
  // ============================================
  static async getPaymentStatus(req: AuthRequest, res: Response) {
    try {
      const { transactionId } = req.params;
      const userId = req.user.id;

      const status = await SubscriptionService.getPaymentStatus(transactionId, userId);

      if (!status) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: status,
      });

    } catch (error: any) {
      console.error('❌ Get payment status error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to get payment status',
      });
    }
  }

  // ============================================
  // 5. GET PAYMENT HISTORY
  // ============================================
  static async getPaymentHistory(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const history = await SubscriptionService.getPaymentHistory(userId, page, limit);

      return res.status(200).json({
        success: true,
        data: history,
      });

    } catch (error: any) {
      console.error('❌ Get payment history error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to get payment history',
      });
    }
  }
}

export default PaymentController;