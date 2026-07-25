// src/modules/subscription/subscription.service.ts

import { PrismaClient, SubscriptionPlan, SubscriptionStatus, PaymentMethod, PaymentStatus, Role } from '@prisma/client';
import { ApiError } from '../../utils/apiError';
import { PaymentService } from '../payment/payment.service';

// ✅ Create Prisma instance directly
const prisma = new PrismaClient();

export class SubscriptionService {
  // ============================================
  // 1. GET PLANS
  // ============================================
  getPlans() {
    return {
      free: {
        id: 'FREE',
        name: 'Free',
        price: 0,
        currency: 'NPR',
        duration: 0,
        features: ['3 photos per listing', 'Basic listing', 'Manual search'],
      },
      sellerPremium: {
        id: 'SELLER_PREMIUM',
        name: 'Seller Premium',
        price: 7000,
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
      buyerPremium: {
        id: 'BUYER_PREMIUM',
        name: 'Buyer Premium',
        price: 999,
        currency: 'NPR',
        duration: 30,
        features: [
          'Unlimited AI matches',
          'Match scores',
          'Property alerts',
          'Unlimited favorites',
          'Market insights',
          'WhatsApp notifications',
          'Priority support',
        ],
      },
    };
  }

  // ============================================
  // 2. GET PLAN DETAILS
  // ============================================
  getPlanDetails(planType: string) {
    const plans: Record<string, any> = {
      SELLER_PREMIUM: {
        id: 'SELLER_PREMIUM',
        name: 'Seller Premium',
        price: 7000,
        duration: 30,
        features: {
          aiMatching: true,
          aiMatchesLimit: -1,
          propertyListings: -1,
          photos: 20,
          videoTour: true,
          favorites: 0,
          marketInsights: true,
          whatsAppNotifications: true,
          prioritySupport: true,
          featuredListing: true,
        },
      },
      BUYER_PREMIUM: {
        id: 'BUYER_PREMIUM',
        name: 'Buyer Premium',
        price: 999,
        duration: 30,
        features: {
          aiMatching: true,
          aiMatchesLimit: -1,
          propertyListings: 0,
          photos: 0,
          videoTour: false,
          favorites: -1,
          marketInsights: true,
          whatsAppNotifications: true,
          prioritySupport: true,
          featuredListing: false,
        },
      },
      FREE: {
        id: 'FREE',
        name: 'Free',
        price: 0,
        duration: 0,
        features: {
          aiMatching: false,
          aiMatchesLimit: 0,
          propertyListings: 1,
          photos: 3,
          videoTour: false,
          favorites: 5,
          marketInsights: false,
          whatsAppNotifications: false,
          prioritySupport: false,
          featuredListing: false,
        },
      },
    };
    return plans[planType] || null;
  }

  // ============================================
  // 3. INITIATE SUBSCRIPTION
  // ============================================
  async initiateSubscription(
    userId: string,
    data: { planType: SubscriptionPlan; paymentMethod: PaymentMethod }
  ) {
    const { planType, paymentMethod } = data;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const existing = await prisma.subscription.findFirst({
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

    const transactionId = PaymentService.generateTransactionId();

    // Create subscription
    const subscription = await prisma.subscription.create({
      data: {
        userId,
        planType: planType,
        status: 'PENDING' as SubscriptionStatus,
        isActive: false,
        startDate: new Date(),
        endDate: new Date(Date.now() + plan.duration * 24 * 60 * 60 * 1000),
        price: plan.price,
        features: plan.features,
        paymentId: transactionId,
      },
    });

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        subscriptionId: subscription.id,
        userId,
        amount: plan.price,
        paymentMethod: paymentMethod,
        transactionId: transactionId,
        paymentStatus: 'PENDING' as PaymentStatus,
        paymentData: {
          initiatedAt: new Date().toISOString(),
          planType: planType,
          customerName: user.name,
          customerEmail: user.email,
        },
      },
    });

    let paymentUrl = '';
    switch (paymentMethod) {
      case 'KHALTI':
        paymentUrl = await PaymentService.initiateKhaltiPayment(
          plan.price,
          transactionId,
          user.name,
          user.email,
          user.phone || '9800000000'
        );
        break;
      case 'ESEWA':
        paymentUrl = await PaymentService.initiateEsewaPayment(
          plan.price,
          transactionId,
          user.name,
          user.email,
          user.phone || '9800000000'
        );
        break;
      case 'STRIPE':
        paymentUrl = await PaymentService.initiateStripePayment(
          plan.price,
          transactionId,
          user.email
        );
        break;
      default:
        throw new ApiError(400, 'Invalid payment method');
    }

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
  // 4. ACTIVATE SUBSCRIPTION
  // ============================================
  async activateSubscription(transactionId: string, paymentData: any) {
    const subscription = await prisma.subscription.findFirst({
      where: {
        paymentId: transactionId,
        isActive: false,
      },
    });

    if (!subscription) {
      throw new ApiError(404, 'Subscription not found');
    }

    const payment = await prisma.payment.findFirst({
      where: {
        transactionId: transactionId,
        paymentStatus: 'PENDING' as PaymentStatus,
      },
    });

    if (!payment) {
      throw new ApiError(404, 'Payment not found');
    }

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        paymentStatus: 'SUCCESS' as PaymentStatus,
        paidAt: new Date(),
        paymentData: {
          ...(payment.paymentData as any),
          success: true,
          response: paymentData,
          completedAt: new Date().toISOString(),
        },
      },
    });

    const activatedSubscription = await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        isActive: true,
        status: 'ACTIVE' as SubscriptionStatus,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    if (subscription.planType === 'PREMIUM') {
      await prisma.user.update({
        where: { id: subscription.userId },
        data: { role: 'SELLER' as Role },
      });
    }

    return {
      success: true,
      message: 'Payment successful! Subscription activated.',
      subscription: activatedSubscription,
      payment,
    };
  }

  // ============================================
  // 5. CONFIRM PAYMENT (Callback)
  // ============================================
  async confirmPayment(transactionId: string) {
    const subscription = await prisma.subscription.findFirst({
      where: { paymentId: transactionId },
    });

    if (!subscription) {
      throw new ApiError(404, 'Subscription not found for transaction: ' + transactionId);
    }

    return prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: 'ACTIVE' as SubscriptionStatus,
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
  }

  // ============================================
  // 6. FAIL PAYMENT (Callback)
  // ============================================
  async failPayment(transactionId: string) {
    const subscription = await prisma.subscription.findFirst({
      where: { paymentId: transactionId },
    });

    if (!subscription) {
      throw new ApiError(404, 'Subscription not found for transaction: ' + transactionId);
    }

    return prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: 'CANCELLED' as SubscriptionStatus,
        isActive: false,
      },
    });
  }

  // ============================================
  // 7. HANDLE PAYMENT FAILURE
  // ============================================
  async handlePaymentFailure(transactionId: string, failureReason: string) {
    const subscription = await prisma.subscription.findFirst({
      where: {
        paymentId: transactionId,
        isActive: false,
      },
    });

    if (!subscription) {
      throw new ApiError(404, 'Subscription not found');
    }

    const payment = await prisma.payment.findFirst({
      where: {
        transactionId: transactionId,
        paymentStatus: 'PENDING' as PaymentStatus,
      },
    });

    if (!payment) {
      throw new ApiError(404, 'Payment not found');
    }

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        paymentStatus: 'FAILED' as PaymentStatus,
        failureReason: failureReason,
        paymentData: {
          ...(payment.paymentData as any),
          success: false,
          failureReason,
          failedAt: new Date().toISOString(),
        },
      },
    });

    const cancelledSubscription = await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: 'CANCELLED' as SubscriptionStatus,
      },
    });

    return {
      success: false,
      message: 'Payment failed',
      subscription: cancelledSubscription,
      payment,
    };
  }

  // ============================================
  // 8. GET USER SUBSCRIPTION
  // ============================================
  async getUserSubscription(userId: string) {
    const subscription = await prisma.subscription.findFirst({
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
      payments: subscription.payments.map((p: any) => ({
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
  // 9. GET PAYMENT STATUS
  // ============================================
  async getPaymentStatus(transactionId: string, userId: string) {
    return prisma.subscription.findFirst({
      where: {
        userId,
        paymentId: transactionId,
      },
      select: {
        id: true,
        planType: true,
        price: true,
        status: true,
        isActive: true,
        startDate: true,
        endDate: true,
        createdAt: true,
      },
    });
  }

  // ============================================
  // 10. GET PAYMENT HISTORY
  // ============================================
  async getPaymentHistory(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [subscriptions, total] = await Promise.all([
      prisma.subscription.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          planType: true,
          price: true,
          status: true,
          isActive: true,
          startDate: true,
          endDate: true,
          createdAt: true,
          paymentId: true,
        },
      }),
      prisma.subscription.count({ where: { userId } }),
    ]);

    return {
      transactions: subscriptions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ============================================
  // 11. CANCEL SUBSCRIPTION
  // ============================================
  async cancelSubscription(userId: string) {
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        isActive: true,
        endDate: { gt: new Date() },
      },
    });

    if (!subscription) {
      throw new ApiError(404, 'No active subscription found');
    }

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        isActive: false,
        status: 'CANCELLED' as SubscriptionStatus,
      },
    });

    return { message: 'Subscription cancelled successfully' };
  }

  // ============================================
  // 12. HAS ACTIVE SUBSCRIPTION
  // ============================================
  async hasActiveSubscription(userId: string) {
    const subscription = await prisma.subscription.findFirst({
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
  // 13. GET SUBSCRIPTION ANALYTICS (Admin)
  // ============================================
  async getSubscriptionAnalytics() {
    const totalSubscriptions = await prisma.subscription.count();
    const activeSubscriptions = await prisma.subscription.count({
      where: { isActive: true },
    });
    const expiredSubscriptions = await prisma.subscription.count({
      where: { status: 'EXPIRED' as SubscriptionStatus },
    });
    const cancelledSubscriptions = await prisma.subscription.count({
      where: { status: 'CANCELLED' as SubscriptionStatus },
    });

    const totalRevenue = await prisma.payment.aggregate({
      where: { paymentStatus: 'SUCCESS' as PaymentStatus },
      _sum: { amount: true },
    });

    const successfulPayments = await prisma.payment.count({
      where: { paymentStatus: 'SUCCESS' as PaymentStatus },
    });
    const failedPayments = await prisma.payment.count({
      where: { paymentStatus: 'FAILED' as PaymentStatus },
    });
    const pendingPayments = await prisma.payment.count({
      where: { paymentStatus: 'PENDING' as PaymentStatus },
    });

    const byPlan = await prisma.subscription.groupBy({
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
}