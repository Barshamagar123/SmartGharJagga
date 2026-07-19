// src/modules/message/message.routes.ts

import { Router } from 'express';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '@/middleware/auth.middleware';
import { validate } from '@/middleware/validation.middleware';
import { sendMessageSchema, markAsReadSchema } from './message.validation';

const prisma = new PrismaClient();
const messageService = new MessageService(prisma);
const messageController = new MessageController(messageService);

const router = Router();

// ============================================
// PROTECTED ROUTES (Auth Required)
// ============================================

/**
 * @route POST /api/v1/messages
 * @desc Send a message
 * @access Private
 */
router.post(
  '/',
  authMiddleware,
  validate(sendMessageSchema),
  messageController.sendMessage
);

/**
 * @route GET /api/v1/messages/conversations
 * @desc Get all conversations for current user
 * @access Private
 */
router.get(
  '/conversations',
  authMiddleware,
  messageController.getMyConversations
);

/**
 * @route GET /api/v1/messages/conversations/:conversationId
 * @desc Get conversation by ID
 * @access Private
 */
router.get(
  '/conversations/:conversationId',
  authMiddleware,
  messageController.getConversationById
);

/**
 * @route POST /api/v1/messages/read
 * @desc Mark messages as read
 * @access Private
 */
router.post(
  '/read',
  authMiddleware,
  validate(markAsReadSchema),
  messageController.markAsRead
);

/**
 * @route POST /api/v1/messages/conversations/:conversationId/read
 * @desc Mark entire conversation as read
 * @access Private
 */
router.post(
  '/conversations/:conversationId/read',
  authMiddleware,
  messageController.markConversationAsRead
);

/**
 * @route GET /api/v1/messages/unread/count
 * @desc Get unread message count
 * @access Private
 */
router.get(
  '/unread/count',
  authMiddleware,
  messageController.getUnreadCount
);

/**
 * @route GET /api/v1/messages/unread/check
 * @desc Check unread messages (for notification badge)
 * @access Private
 */
router.get(
  '/unread/check',
  authMiddleware,
  messageController.checkUnread
);

/**
 * @route DELETE /api/v1/messages/:messageId
 * @desc Delete a message
 * @access Private
 */
router.delete(
  '/:messageId',
  authMiddleware,
  messageController.deleteMessage
);

/**
 * @route DELETE /api/v1/messages/conversations/:conversationId
 * @desc Delete a conversation
 * @access Private
 */
router.delete(
  '/conversations/:conversationId',
  authMiddleware,
  messageController.deleteConversation
);

export default router;