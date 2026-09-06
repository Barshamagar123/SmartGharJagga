// src/modules/notification/notification.service.ts

import { PrismaClient } from '@prisma/client';
import { ApiError } from '@/utils/apiError';
import { CreateNotificationRequest, NotificationResponse } from './notification.types';
// ✅ Import WebSocket server
import { io, adminSockets } from '../../server.js';

export class NotificationService {
  constructor(private prisma: PrismaClient) {}

  // ✅ Add WebSocket emission method
  private async emitNotificationToAdmins(notification: NotificationResponse): Promise<void> {
    try {
      const adminSocketIds = Array.from(adminSockets.values());
      
      if (adminSocketIds.length > 0) {
        io.to(adminSocketIds).emit('notification:new', {
          notificationId: notification.id,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          data: notification.data,
          timestamp: notification.createdAt,
        });
        
        console.log(`📤 Sent real-time notification to ${adminSocketIds.length} admins`);
      } else {
        console.log('⚠️ No admins connected to receive real-time notification');
      }
    } catch (error) {
      console.error('❌ Error emitting notification via WebSocket:', error);
    }
  }

  // ============================================
  // 1. CREATE NOTIFICATION
  // ============================================
  async createNotification(data: CreateNotificationRequest): Promise<NotificationResponse> {
    try {
      const notification = await this.prisma.notification.create({
        data: {
          title: data.title,
          message: data.message,
          type: data.type,
          userId: data.userId,
          data: data.data || {},
        },
        select: {
          id: true,
          title: true,
          message: true,
          type: true,
          isRead: true,
          userId: true,
          data: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      console.log(`📤 Notification created: ${data.title} for user ${data.userId}`);
      
      // ✅ Emit WebSocket event
      await this.emitNotificationToAdmins(notification as NotificationResponse);
      
      return notification as NotificationResponse;
    } catch (error) {
      console.error('❌ Error creating notification:', error);
      throw new ApiError(500, 'Failed to create notification');
    }
  }

  // ============================================
  // 2. CREATE NOTIFICATION FOR ALL ADMINS
  // ============================================
  async createNotificationForAdmins(
    title: string,
    message: string,
    type: string,
    data?: Record<string, any>
  ): Promise<NotificationResponse[]> {
    try {
      // Get all admin users
      const admins = await this.prisma.user.findMany({
        where: {
          role: 'ADMIN',
          isActive: true,
        },
        select: {
          id: true,
        },
      });

      if (admins.length === 0) {
        console.log('⚠️ No admin users found to send notification');
        return [];
      }

      // Create notification for each admin
      const notifications = await Promise.all(
        admins.map((admin) =>
          this.prisma.notification.create({
            data: {
              title,
              message,
              type,
              userId: admin.id,
              data: data || {},
            },
            select: {
              id: true,
              title: true,
              message: true,
              type: true,
              isRead: true,
              userId: true,
              data: true,
              createdAt: true,
              updatedAt: true,
            },
          })
        )
      );

      console.log(`📤 Notification sent to ${notifications.length} admins (DB saved)`);
      
      // ✅ Emit WebSocket events for each notification
      for (const notification of notifications) {
        await this.emitNotificationToAdmins(notification as NotificationResponse);
      }

      return notifications as NotificationResponse[];
    } catch (error) {
      console.error('❌ Error creating notifications for admins:', error);
      throw new ApiError(500, 'Failed to create notifications');
    }
  }

  // ============================================
  // 3. GET NOTIFICATIONS FOR USER
  // ============================================
  async getNotifications(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    notifications: NotificationResponse[];
    total: number;
    unread: number;
  }> {
    try {
      const skip = (page - 1) * limit;

      const [notifications, total, unread] = await Promise.all([
        this.prisma.notification.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
          select: {
            id: true,
            title: true,
            message: true,
            type: true,
            isRead: true,
            userId: true,
            data: true,
            createdAt: true,
            updatedAt: true,
          },
        }),
        this.prisma.notification.count({
          where: { userId },
        }),
        this.prisma.notification.count({
          where: { userId, isRead: false },
        }),
      ]);

      return {
        notifications: notifications as NotificationResponse[],
        total,
        unread,
      };
    } catch (error) {
      console.error('❌ Error fetching notifications:', error);
      throw new ApiError(500, 'Failed to fetch notifications');
    }
  }

  // ============================================
  // 4. MARK NOTIFICATION AS READ
  // ============================================
  async markAsRead(notificationId: string, userId: string): Promise<NotificationResponse> {
    try {
      const notification = await this.prisma.notification.findFirst({
        where: {
          id: notificationId,
          userId,
        },
      });

      if (!notification) {
        throw new ApiError(404, 'Notification not found');
      }

      const updated = await this.prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true },
        select: {
          id: true,
          title: true,
          message: true,
          type: true,
          isRead: true,
          userId: true,
          data: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return updated as NotificationResponse;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      console.error('❌ Error marking notification as read:', error);
      throw new ApiError(500, 'Failed to mark notification as read');
    }
  }

  // ============================================
  // 5. MARK ALL NOTIFICATIONS AS READ
  // ============================================
  async markAllAsRead(userId: string): Promise<{ count: number }> {
    try {
      const result = await this.prisma.notification.updateMany({
        where: {
          userId,
          isRead: false,
        },
        data: { isRead: true },
      });

      return { count: result.count };
    } catch (error) {
      console.error('❌ Error marking all notifications as read:', error);
      throw new ApiError(500, 'Failed to mark all notifications as read');
    }
  }

  // ============================================
  // 6. DELETE NOTIFICATION
  // ============================================
  async deleteNotification(notificationId: string, userId: string): Promise<{ success: boolean }> {
    try {
      const notification = await this.prisma.notification.findFirst({
        where: {
          id: notificationId,
          userId,
        },
      });

      if (!notification) {
        throw new ApiError(404, 'Notification not found');
      }

      await this.prisma.notification.delete({
        where: { id: notificationId },
      });

      return { success: true };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      console.error('❌ Error deleting notification:', error);
      throw new ApiError(500, 'Failed to delete notification');
    }
  }

  // ============================================
  // 7. DELETE ALL NOTIFICATIONS FOR USER
  // ============================================
  async deleteAllNotifications(userId: string): Promise<{ count: number }> {
    try {
      const result = await this.prisma.notification.deleteMany({
        where: { userId },
      });

      return { count: result.count };
    } catch (error) {
      console.error('❌ Error deleting all notifications:', error);
      throw new ApiError(500, 'Failed to delete all notifications');
    }
  }

  // ============================================
  // 8. GET UNREAD COUNT
  // ============================================
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const count = await this.prisma.notification.count({
        where: {
          userId,
          isRead: false,
        },
      });

      return count;
    } catch (error) {
      console.error('❌ Error getting unread count:', error);
      throw new ApiError(500, 'Failed to get unread count');
    }
  }

  // ============================================
  // 9. SEND PROPERTY CREATED NOTIFICATION
  // ============================================
  async sendPropertyCreatedNotification(
    propertyTitle: string,
    propertyLocation: string,
    propertyPrice: number,
    sellerName: string,
    sellerId: string,
    propertyId: string
  ): Promise<void> {
    const title = '🏠 New Property Listed';
    const message = `"${propertyTitle}" in ${propertyLocation} has been listed by ${sellerName} for Rs ${propertyPrice.toLocaleString()}`;
    const data = {
      propertyId,
      propertyTitle,
      propertyLocation,
      propertyPrice,
      sellerId,
      sellerName,
    };

    await this.createNotificationForAdmins(title, message, 'PROPERTY_CREATED', data);
  }

  // ============================================
  // 10. SEND REVIEW ADDED NOTIFICATION
  // ============================================
  async sendReviewAddedNotification(
    propertyTitle: string,
    rating: number,
    reviewerName: string,
    reviewerId: string,
    reviewId: string,
    propertyId: string
  ): Promise<void> {
    const title = '⭐ New Review Added';
    const message = `${reviewerName} gave ${rating} stars for "${propertyTitle}"`;
    const data = {
      reviewId,
      propertyId,
      propertyTitle,
      rating,
      reviewerId,
      reviewerName,
    };

    await this.createNotificationForAdmins(title, message, 'REVIEW_ADDED', data);
  }

  // ============================================
  // 11. SEND PROPERTY SOLD NOTIFICATION
  // ============================================
  async sendPropertySoldNotification(
    propertyTitle: string,
    propertyLocation: string,
    propertyPrice: number,
    sellerName: string,
    buyerName: string,
    propertyId: string
  ): Promise<void> {
    const title = '💰 Property Sold!';
    const message = `"${propertyTitle}" in ${propertyLocation} has been sold for Rs ${propertyPrice.toLocaleString()}`;
    const data = {
      propertyId,
      propertyTitle,
      propertyLocation,
      propertyPrice,
      sellerName,
      buyerName,
    };

    await this.createNotificationForAdmins(title, message, 'PROPERTY_SOLD', data);
  }
}