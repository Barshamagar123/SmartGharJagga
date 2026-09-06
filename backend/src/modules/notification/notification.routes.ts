// src/modules/notification/notification.routes.ts

import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { authMiddleware } from '@/middleware/auth.middleware';
import { requireRole } from '@/middleware/role.middleware';

const prisma = new PrismaClient();
const notificationService = new NotificationService(prisma);
const notificationController = new NotificationController(notificationService);

const router = Router();

// ============================================
// ALL ROUTES REQUIRE AUTHENTICATION
// ============================================

/**
 * @route GET /api/v1/notifications
 * @desc Get all notifications for the logged-in user
 * @access Private
 */
router.get(
  '/',
  authMiddleware,
  notificationController.getNotifications
);

/**
 * @route GET /api/v1/notifications/unread-count
 * @desc Get unread notification count
 * @access Private
 */
router.get(
  '/unread-count',
  authMiddleware,
  notificationController.getUnreadCount
);

/**
 * @route PUT /api/v1/notifications/:id/read
 * @desc Mark a notification as read
 * @access Private
 */
router.put(
  '/:id/read',
  authMiddleware,
  notificationController.markAsRead
);

/**
 * @route PUT /api/v1/notifications/read-all
 * @desc Mark all notifications as read
 * @access Private
 */
router.put(
  '/read-all',
  authMiddleware,
  notificationController.markAllAsRead
);

/**
 * @route DELETE /api/v1/notifications/:id
 * @desc Delete a notification
 * @access Private
 */
router.delete(
  '/:id',
  authMiddleware,
  notificationController.deleteNotification
);

/**
 * @route DELETE /api/v1/notifications/delete-all
 * @desc Delete all notifications for the user
 * @access Private
 */
router.delete(
  '/delete-all',
  authMiddleware,
  notificationController.deleteAllNotifications
);

export default router;