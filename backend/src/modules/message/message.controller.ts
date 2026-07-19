// src/modules/message/message.controller.ts

import { Request, Response } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import { ApiResponse } from '@/utils/apiResponse';
import { ApiError } from '@/utils/apiError';
import { MessageService } from './message.service';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export class MessageController {
  constructor(private messageService: MessageService) {}

  // ============================================
  // 1. SEND MESSAGE
  // ============================================
  sendMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'Authentication required');
    }

    const message = await this.messageService.sendMessage(userId, req.body);
    ApiResponse.success(res, 201, 'Message sent successfully', message);
  });

  // ============================================
  // 2. GET MY CONVERSATIONS
  // ============================================
  getMyConversations = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'Authentication required');
    }

    const conversations = await this.messageService.getUserConversations(userId);
    ApiResponse.success(res, 200, 'Conversations fetched successfully', conversations);
  });

  // ============================================
  // 3. GET CONVERSATION BY ID
  // ============================================
  getConversationById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'Authentication required');
    }

    const { conversationId } = req.params;
    const conversation = await this.messageService.getConversationById(conversationId, userId);
    ApiResponse.success(res, 200, 'Conversation fetched successfully', conversation);
  });

  // ============================================
  // 4. MARK MESSAGES AS READ
  // ============================================
  markAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'Authentication required');
    }

    const { messageIds } = req.body;
    const result = await this.messageService.markMessagesAsRead(userId, messageIds);
    ApiResponse.success(res, 200, result.message, result);
  });

  // ============================================
  // 5. MARK CONVERSATION AS READ
  // ============================================
  markConversationAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'Authentication required');
    }

    const { conversationId } = req.params;
    const result = await this.messageService.markConversationAsRead(userId, conversationId);
    ApiResponse.success(res, 200, result.message, result);
  });

  // ============================================
  // 6. GET UNREAD COUNT
  // ============================================
  getUnreadCount = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'Authentication required');
    }

    const result = await this.messageService.getUnreadCount(userId);
    ApiResponse.success(res, 200, 'Unread count fetched', result);
  });

  // ============================================
  // 7. DELETE MESSAGE
  // ============================================
  deleteMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'Authentication required');
    }

    const { messageId } = req.params;
    const result = await this.messageService.deleteMessage(messageId, userId);
    ApiResponse.success(res, 200, 'Message deleted', result);
  });

  // ============================================
  // 8. DELETE CONVERSATION
  // ============================================
  deleteConversation = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'Authentication required');
    }

    const { conversationId } = req.params;
    const result = await this.messageService.deleteConversation(conversationId, userId);
    ApiResponse.success(res, 200, 'Conversation deleted', result);
  });

  // ============================================
  // 9. CHECK UNREAD (For Notification Badge)
  // ============================================
  checkUnread = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'Authentication required');
    }

    const result = await this.messageService.checkUnreadMessages(userId);
    ApiResponse.success(res, 200, 'Unread messages fetched', result);
  });
}