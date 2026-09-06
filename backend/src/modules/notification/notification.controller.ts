// src/modules/notification/notification.controller.ts

import { Request, Response } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import { ApiResponse } from '@/utils/apiResponse';
import { ApiError } from '@/utils/apiError';
import { NotificationService } from './notification.service';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  // ============================================
  // 1. GET ALL NOTIFICATIONS FOR USER
  // ============================================
  getNotifications = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'Authentication required');
    }

    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 20;

    const result = await this.notificationService.getNotifications(userId, page, limit);
    ApiResponse.success(res, 200, 'Notifications fetched successfully', result);
  });

  // ============================================
  // 2. MARK NOTIFICATION AS READ - ✅ FIXED
  // ============================================
  markAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'Authentication required');
    }

    // ✅ Extract and validate notification ID
    const notificationIdParam = req.params.id;
    if (!notificationIdParam) {
      throw new ApiError(400, 'Notification ID is required');
    }

    // ✅ Convert to string if it's an array
    const notificationId = Array.isArray(notificationIdParam) 
      ? notificationIdParam[0] 
      : notificationIdParam;

    if (!notificationId) {
      throw new ApiError(400, 'Invalid notification ID');
    }

    const notification = await this.notificationService.markAsRead(notificationId, userId);
    ApiResponse.success(res, 200, 'Notification marked as read', notification);
  });

  // ============================================
  // 3. MARK ALL NOTIFICATIONS AS READ
  // ============================================
  markAllAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'Authentication required');
    }

    const result = await this.notificationService.markAllAsRead(userId);
    ApiResponse.success(res, 200, 'All notifications marked as read', result);
  });

  // ============================================
  // 4. DELETE NOTIFICATION - ✅ FIXED
  // ============================================
  deleteNotification = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'Authentication required');
    }

    // ✅ Extract and validate notification ID
    const notificationIdParam = req.params.id;
    if (!notificationIdParam) {
      throw new ApiError(400, 'Notification ID is required');
    }

    // ✅ Convert to string if it's an array
    const notificationId = Array.isArray(notificationIdParam) 
      ? notificationIdParam[0] 
      : notificationIdParam;

    if (!notificationId) {
      throw new ApiError(400, 'Invalid notification ID');
    }

    const result = await this.notificationService.deleteNotification(notificationId, userId);
    ApiResponse.success(res, 200, 'Notification deleted successfully', result);
  });

  // ============================================
  // 5. DELETE ALL NOTIFICATIONS
  // ============================================
  deleteAllNotifications = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'Authentication required');
    }

    const result = await this.notificationService.deleteAllNotifications(userId);
    ApiResponse.success(res, 200, 'All notifications deleted successfully', result);
  });

  // ============================================
  // 6. GET UNREAD COUNT
  // ============================================
  getUnreadCount = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'Authentication required');
    }

    const count = await this.notificationService.getUnreadCount(userId);
    ApiResponse.success(res, 200, 'Unread count fetched successfully', { count });
  });
}