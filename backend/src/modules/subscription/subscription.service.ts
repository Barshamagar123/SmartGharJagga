// src/modules/subscription/subscription.service.ts

import { PrismaClient, SubscriptionPlan, SubscriptionStatus } from '@prisma/client';
import { ApiError } from '@/utils/apiError';
import { CreateSubscriptionRequest, SubscriptionResponse } from './subscription.types';

export class SubscriptionService {
  constructor(private prisma: PrismaClient) {}

  // ============================================
  // 1. Get All Subscription Plans
  // ============================================
  getPlans() {
    return {
      buyer: [
        {
          id: 'buyer-free',
          name: 'Free',
          description: 'Basic property search',
          price: 0,
          currency: 'NPR',
          duration: 0,
          type: 'BUYER',
          features: [
            'Basic property search',
            '5 favorites',
            '5 AI matches per month',
            'Standard support',
          ],
        },
        {
          id: 'buyer-premium',
          name: 'Premium',
          description: 'Unlimited AI-powered property matching',
          price: 999,
          currency: 'NPR',
          duration: 30,
          type: 'BUYER',
          features: [
            'Unlimited AI matches',
            'Unlimited favorites',
            'Property alerts',
            'WhatsApp notifications',
            'Market insights',
            'Price trends',
            'Priority support',
          ],
        },
      ],
      seller: [
        {
          id: 'seller-free',
          name: 'Free',
          description: 'Basic property listing',
          price: 0,
          currency: 'NPR',
          duration: 0,
          type: 'SELLER',
          features: [
            '3 photos per listing',
            'Basic listing',
            'Manual search visibility',
            'Standard support',
          ],
        },
        {
          id: 'seller-premium',
          name: 'Premium',
          description: 'Featured listings with AI matching',
          price: 4000,
          currency: 'NPR',
          duration: 30,
          type: 'SELLER',
          features: [
            '20 photos per listing',
            'Featured badge',
            'TOP position in search',
            'AI buyer matching',
            'Buyer insights',
            'Advanced analytics',
            'Priority support',
            'WhatsApp alerts',
          ],
        },
      ],
    };
  }

  // ============================================
  // 2. Get User's Current Subscription
  // ============================================
  async getUserSubscription(userId: string): Promise<SubscriptionResponse | null> {
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
        endDate: {
          gt: new Date(),
        },
      },
      orderBy: {
        endDate: 'desc',
      },
    });

    if (!subscription) {
      return null;
    }

    const daysRemaining = Math.ceil(
      (subscription.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      id: subscription.id,
      userId: subscription.userId,
      planType: subscription.planType,
      status: subscription.status,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      price: Number(subscription.price),
      features: subscription.features,
      isActive: subscription.status === 'ACTIVE' && subscription.endDate > new Date(),
      daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
    };
  }

  // ============================================
  // 3. Create Subscription
  // ============================================
  async createSubscription(
    userId: string,
    data: CreateSubscriptionRequest
  ): Promise<SubscriptionResponse> {
    const { planType, paymentMethod } = data;

    // Get plan details
    const plans = this.getPlans();
    let plan: any = null;

    // Find plan in buyer or seller
    for (const category of ['buyer', 'seller']) {
      const found = (plans as any)[category].find((p: any) => p.id === `${category}-${planType.toLowerCase()}`);
      if (found) {
        plan = found;
        break;
      }
    }

    if (!plan) {
      throw new ApiError(400, 'Invalid plan type');
    }

    // Check if user already has active subscription
    const existing = await this.prisma.subscription.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
        endDate: {
          gt: new Date(),
        },
      },
    });

    if (existing) {
      throw new ApiError(400, 'You already have an active subscription');
    }

    // Calculate end date
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.duration);

    // Create subscription
    const subscription = await this.prisma.subscription.create({
      data: {
        userId,
        planType: planType,
        status: 'ACTIVE',
        startDate,
        endDate,
        price: plan.price,
        features: plan.features,
        paymentId: `PAY-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      },
    });

    // Update user role if needed
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        role: planType === 'PREMIUM' ? 'SELLER' : 'BUYER',
      },
    });

    const daysRemaining = Math.ceil(
      (endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      id: subscription.id,
      userId: subscription.userId,
      planType: subscription.planType,
      status: subscription.status,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      price: Number(subscription.price),
      features: subscription.features,
      isActive: true,
      daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
    };
  }

  // ============================================
  // 4. Cancel Subscription
  // ============================================
  async cancelSubscription(userId: string): Promise<void> {
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
        endDate: {
          gt: new Date(),
        },
      },
    });

    if (!subscription) {
      throw new ApiError(404, 'No active subscription found');
    }

    await this.prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: 'CANCELLED',
      },
    });
  }

  // ============================================
  // 5. Check if User Has Premium Access
  // ============================================
  async hasPremiumAccess(userId: string, feature: string): Promise<boolean> {
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
        endDate: {
          gt: new Date(),
        },
      },
    });

    if (!subscription) {
      return false;
    }

    if (subscription.planType !== 'PREMIUM') {
      return false;
    }

    // Check if feature is included
    const features = subscription.features as string[];
    if (!features || features.length === 0) {
      return true; // Premium has all features
    }

    return features.includes(feature);
  }

  // ============================================
  // 6. Get Subscription Status
  // ============================================
  async getSubscriptionStatus(userId: string): Promise<{
    isActive: boolean;
    planType: SubscriptionPlan;
    daysRemaining: number;
    features: string[];
  }> {
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
        endDate: {
          gt: new Date(),
        },
      },
    });

    if (!subscription) {
      return {
        isActive: false,
        planType: 'FREE',
        daysRemaining: 0,
        features: [],
      };
    }

    const daysRemaining = Math.ceil(
      (subscription.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      isActive: true,
      planType: subscription.planType,
      daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
      features: subscription.features as string[] || [],
    };
  }

  // ============================================
  // 7. Get Subscription History
  // ============================================
  async getSubscriptionHistory(userId: string) {
    const subscriptions = await this.prisma.subscription.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return subscriptions.map((sub) => ({
      id: sub.id,
      planType: sub.planType,
      status: sub.status,
      startDate: sub.startDate,
      endDate: sub.endDate,
      price: Number(sub.price),
    }));
  }

  // ============================================
  // 8. Check and Expire Subscriptions (Cron Job)
  // ============================================
  async expireSubscriptions(): Promise<void> {
    const expired = await this.prisma.subscription.updateMany({
      where: {
        status: 'ACTIVE',
        endDate: {
          lt: new Date(),
        },
      },
      data: {
        status: 'EXPIRED',
      },
    });

    console.log(`✅ Expired ${expired.count} subscriptions`);
  }

  // ============================================
  // 9. Get Subscription Analytics (Admin)
  // ============================================
  async getSubscriptionAnalytics() {
    const total = await this.prisma.subscription.count();
    const active = await this.prisma.subscription.count({
      where: {
        status: 'ACTIVE',
        endDate: {
          gt: new Date(),
        },
      },
    });
    const expired = await this.prisma.subscription.count({
      where: { status: 'EXPIRED' },
    });
    const cancelled = await this.prisma.subscription.count({
      where: { status: 'CANCELLED' },
    });

    const revenue = await this.prisma.subscription.aggregate({
      where: {
        status: 'ACTIVE',
      },
      _sum: {
        price: true,
      },
    });

    const byPlan = await this.prisma.subscription.groupBy({
      by: ['planType'],
      _count: true,
    });

    return {
      total,
      active,
      expired,
      cancelled,
      revenue: Number(revenue._sum.price) || 0,
      byPlan: byPlan.map((p) => ({
        plan: p.planType,
        count: p._count,
      })),
    };
  }
}