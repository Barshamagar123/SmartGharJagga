// src/modules/subscription/subscription.service.ts

import { PrismaClient, SubscriptionPlan, SubscriptionStatus, PaymentMethod, PaymentStatus } from '@prisma/client';
import { ApiError } from '@/utils/apiError';
import { PaymentService } from './payment.service';
import { InitiateSubscriptionRequest, InitiatePaymentResponse } from './subscription.types';

export class SubscriptionService {
  private paymentService: PaymentService;

  constructor(private prisma: PrismaClient) {
    this.paymentService = new PaymentService();
  }

  // ============================================
  // 1. GET PLANS
  // ============================================
  getPlans() {
    return {
      free: {
        id: 'free',
        name: 'Free',
        price: 0,
        currency: 'NPR',
        duration: 0,
        features: ['3 photos per listing', 'Basic listing', 'Manual search'],
      },
      premium: {
        id: 'premium',
        name: 'Premium',
        price: 4000,
        currency: 'NPR',
        duration: 30,
        features: [
          '20 photos per listing',
          'Featured badge',
          'TOP position in search',
          'AI buyer matching',
          'Buyer insights',
          'Advanced analytics',
          'Priority support',
        ],
      },
    };
  }

  // ============================================
  // 2. INITIATE SUBSCRIPTION
  // ============================================
  async initiateSubscription(
    userId: string,
    data: InitiateSubscriptionRequest
  ): Promise<InitiatePaymentResponse> {
    const { planType, paymentMethod } = data;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const existing = await this.prisma.subscription.findFirst({
      where: {
        userId,
        isActive: true,
        endDate: { gt: new Date() },
      },
    });

    if (existing) {
      throw new ApiError(400, 'You already have an active subscription');
    }

    const plan = this.getPlanDetails(planType);
    if (!plan) {
      throw new ApiError(400, 'Invalid plan');
    }

    const transactionId = this.paymentService.generateTransactionId();

    // Create subscription
    const subscription = await this.prisma.subscription.create({
      data: {
        userId,
        planType,
        status: 'EXPIRED',
        isActive: false,
        startDate: new Date(),
        endDate: new Date(Date.now() + plan.duration * 24 * 60 * 60 * 1000),
        price: plan.price,
        features: plan.features,
        // ✅ Store transactionId
        paymentId: transactionId,
      },
    });

    // Create payment record (PENDING)
    const payment = await this.prisma.payment.create({
      data: {
        subscriptionId: subscription.id,
        userId,
        amount: plan.price,
        paymentMethod: paymentMethod,
        transactionId: transactionId,
        paymentStatus: 'PENDING',
        paymentData: {
          initiatedAt: new Date().toISOString(),
          planType: planType,
          customerName: user.name,
          customerEmail: user.email,
        },
      },
    });

    const paymentUrl = this.paymentService.generatePaymentUrl(
      plan.price,
      transactionId,
      paymentMethod,
      user
    );

    return {
      subscriptionId: subscription.id,
      paymentId: payment.id,
      transactionId,
      amount: plan.price,
      paymentUrl,
      paymentMethod,
    };
  }

  // ============================================
  // 3. ACTIVATE SUBSCRIPTION (After Payment)
  // ============================================
  async activateSubscription(transactionId: string, paymentData: any) {
    // ✅ FIX: Use paymentId instead of transactionId
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        paymentId: transactionId,  // ✅ Use paymentId field
        isActive: false,
      },
    });

    if (!subscription) {
      throw new ApiError(404, 'Subscription not found');
    }

    const payment = await this.prisma.payment.findFirst({
      where: {
        transactionId: transactionId,
        paymentStatus: 'PENDING',
      },
    });

    if (!payment) {
      throw new ApiError(404, 'Payment not found');
    }

    const updatedPayment = await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        paymentStatus: 'SUCCESS',
        paidAt: new Date(),
        paymentData: {
          ...(payment.paymentData as any),
          success: true,
          response: paymentData,
          completedAt: new Date().toISOString(),
        },
      },
    });

    const activatedSubscription = await this.prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        isActive: true,
        status: 'ACTIVE',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        paymentId: payment.id,
      },
    });

    await this.prisma.user.update({
      where: { id: subscription.userId },
      data: { role: 'SELLER' },
    });

    return {
      success: true,
      message: 'Payment successful! Subscription activated.',
      subscription: activatedSubscription,
      payment: updatedPayment,
    };
  }

  // ============================================
  // 4. HANDLE PAYMENT FAILURE
  // ============================================
  async handlePaymentFailure(transactionId: string, failureReason: string) {
    // ✅ FIX: Use paymentId instead of transactionId
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        paymentId: transactionId,  // ✅ Use paymentId field
        isActive: false,
      },
    });

    if (!subscription) {
      throw new ApiError(404, 'Subscription not found');
    }

    const payment = await this.prisma.payment.findFirst({
      where: {
        transactionId: transactionId,
        paymentStatus: 'PENDING',
      },
    });

    if (!payment) {
      throw new ApiError(404, 'Payment not found');
    }

    const updatedPayment = await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        paymentStatus: 'FAILED',
        failureReason: failureReason,
        paymentData: {
          ...(payment.paymentData as any),
          success: false,
          failureReason,
          failedAt: new Date().toISOString(),
        },
      },
    });

    const cancelledSubscription = await this.prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: 'CANCELLED',
      },
    });

    return {
      success: false,
      message: 'Payment failed',
      subscription: cancelledSubscription,
      payment: updatedPayment,
    };
  }

  // ============================================
  // 5. GET USER SUBSCRIPTION
  // ============================================
  async getUserSubscription(userId: string) {
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        userId,
        isActive: true,
        endDate: { gt: new Date() },
      },
      include: {
        payments: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!subscription) {
      return {
        hasActiveSubscription: false,
        planType: 'FREE',
        daysRemaining: 0,
        features: [],
      };
    }

    const daysRemaining = Math.ceil(
      (subscription.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      hasActiveSubscription: true,
      planType: subscription.planType,
      daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
      features: subscription.features,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      payments: subscription.payments.map((p) => ({
        id: p.id,
        amount: Number(p.amount),
        status: p.paymentStatus,
        method: p.paymentMethod,
        paidAt: p.paidAt,
        transactionId: p.transactionId,
      })),
    };
  }

  // ============================================
  // 6. GET PAYMENT HISTORY
  // ============================================
  async getPaymentHistory(userId: string) {
    const payments = await this.prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        subscription: {
          select: {
            id: true,
            planType: true,
            isActive: true,
          },
        },
      },
    });

    return payments.map((p) => ({
      id: p.id,
      amount: Number(p.amount),
      method: p.paymentMethod,
      status: p.paymentStatus,
      transactionId: p.transactionId,
      paidAt: p.paidAt,
      createdAt: p.createdAt,
      subscription: {
        id: p.subscriptionId,
        planType: p.subscription.planType,
        isActive: p.subscription.isActive,
      },
    }));
  }

  // ============================================
  // 7. GET PAYMENT BY ID
  // ============================================
  async getPaymentById(paymentId: string, userId: string) {
    const payment = await this.prisma.payment.findFirst({
      where: {
        id: paymentId,
        userId,
      },
      include: {
        subscription: true,
      },
    });

    if (!payment) {
      throw new ApiError(404, 'Payment not found');
    }

    return payment;
  }

  // ============================================
  // 8. CANCEL SUBSCRIPTION
  // ============================================
  async cancelSubscription(userId: string) {
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        userId,
        isActive: true,
        endDate: { gt: new Date() },
      },
    });

    if (!subscription) {
      throw new ApiError(404, 'No active subscription found');
    }

    await this.prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        isActive: false,
        status: 'CANCELLED',
      },
    });

    return { message: 'Subscription cancelled successfully' };
  }

  // ============================================
  // 9. CHECK ACTIVE SUBSCRIPTION
  // ============================================
  async hasActiveSubscription(userId: string) {
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        userId,
        isActive: true,
        endDate: { gt: new Date() },
      },
    });

    return {
      hasActive: !!subscription,
      planType: subscription?.planType || 'FREE',
      daysRemaining: subscription
        ? Math.ceil((subscription.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        : 0,
    };
  }

  // ============================================
  // 10. GET SUBSCRIPTION ANALYTICS (Admin)
  // ============================================
  async getSubscriptionAnalytics() {
    const totalSubscriptions = await this.prisma.subscription.count();
    const activeSubscriptions = await this.prisma.subscription.count({
      where: { isActive: true },
    });
    const expiredSubscriptions = await this.prisma.subscription.count({
      where: { status: 'EXPIRED' },
    });
    const cancelledSubscriptions = await this.prisma.subscription.count({
      where: { status: 'CANCELLED' },
    });

    const totalRevenue = await this.prisma.payment.aggregate({
      where: { paymentStatus: 'SUCCESS' },
      _sum: { amount: true },
    });

    const successfulPayments = await this.prisma.payment.count({
      where: { paymentStatus: 'SUCCESS' },
    });
    const failedPayments = await this.prisma.payment.count({
      where: { paymentStatus: 'FAILED' },
    });
    const pendingPayments = await this.prisma.payment.count({
      where: { paymentStatus: 'PENDING' },
    });

    const byPlan = await this.prisma.subscription.groupBy({
      by: ['planType'],
      where: { isActive: true },
      _count: true,
    });

    return {
      subscriptions: {
        total: totalSubscriptions,
        active: activeSubscriptions,
        expired: expiredSubscriptions,
        cancelled: cancelledSubscriptions,
        byPlan: byPlan.map((p) => ({
          plan: p.planType,
          count: p._count,
        })),
      },
      payments: {
        totalRevenue: Number(totalRevenue._sum.amount) || 0,
        successful: successfulPayments,
        failed: failedPayments,
        pending: pendingPayments,
      },
    };
  }

  // ============================================
  // 11. PRIVATE HELPERS
  // ============================================
  private getPlanDetails(planType: SubscriptionPlan) {
    const plans = {
      PREMIUM: {
        name: 'Premium',
        price: 4000,
        duration: 30,
        features: [
          '20 photos per listing',
          'Featured badge',
          'TOP position in search',
          'AI buyer matching',
          'Buyer insights',
          'Advanced analytics',
          'Priority support',
        ],
      },
      FREE: {
        name: 'Free',
        price: 0,
        duration: 0,
        features: ['3 photos per listing', 'Basic listing', 'Manual search'],
      },
    };
    return plans[planType] || null;
  }
}