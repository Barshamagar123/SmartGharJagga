// src/modules/message/message.service.ts

import { PrismaClient } from '@prisma/client';
import { ApiError } from '@/utils/apiError';
import { SendMessageRequest, ConversationResponse, MessageResponse } from './message.types';

export class MessageService {
  constructor(private prisma: PrismaClient) {}

  // ============================================
  // 1. GET OR CREATE CONVERSATION
  // ============================================
  async getOrCreateConversation(
    buyerId: string,
    sellerId: string,
    propertyId?: string
  ) {
    // Check if conversation exists
    let conversation = await this.prisma.conversation.findFirst({
      where: {
        buyerId,
        sellerId,
        ...(propertyId ? { propertyId } : {}),
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
            receiver: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
        property: {
          select: {
            id: true,
            title: true,
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    // If no conversation, create one
    if (!conversation) {
      conversation = await this.prisma.conversation.create({
        data: {
          buyerId,
          sellerId,
          propertyId: propertyId || null,
        },
        include: {
          messages: true,
          property: {
            select: {
              id: true,
              title: true,
            },
          },
          buyer: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
          seller: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
      });
    }

    return conversation;
  }

  // ============================================
  // 2. SEND MESSAGE
  // ============================================
  async sendMessage(userId: string, data: SendMessageRequest) {
    const { content, conversationId, propertyId, receiverId } = data;

    if (!content || content.trim().length === 0) {
      throw new ApiError(400, 'Message content is required');
    }

    // Validate receiver exists
    const receiver = await this.prisma.user.findUnique({
      where: { id: receiverId },
    });

    if (!receiver) {
      throw new ApiError(404, 'Receiver not found');
    }

    // Don't allow sending message to yourself
    if (userId === receiverId) {
      throw new ApiError(400, 'You cannot send a message to yourself');
    }

    let conversation;

    // If conversationId provided, use existing conversation
    if (conversationId) {
      conversation = await this.prisma.conversation.findUnique({
        where: { id: conversationId },
      });

      if (!conversation) {
        throw new ApiError(404, 'Conversation not found');
      }

      // Check if user is part of this conversation
      if (conversation.buyerId !== userId && conversation.sellerId !== userId) {
        throw new ApiError(403, 'You are not part of this conversation');
      }
    } else {
      // Determine roles: sender is buyer, receiver is seller
      const buyerId = userId;
      const sellerId = receiverId;

      conversation = await this.getOrCreateConversation(buyerId, sellerId, propertyId);
    }

    // Create message
    const message = await this.prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: userId,
        receiverId: receiverId,
        content: content.trim(),
        status: 'SENT',
        propertyId: propertyId || conversation.propertyId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Update conversation last message
    await this.prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        lastMessage: content.trim(),
        lastMessageAt: new Date(),
      },
    });

    return message;
  }

  // ============================================
  // 3. GET USER CONVERSATIONS
  // ============================================
  async getUserConversations(userId: string): Promise<ConversationResponse[]> {
    const conversations = await this.prisma.conversation.findMany({
      where: {
        OR: [{ buyerId: userId }, { sellerId: userId }],
        isActive: true,
      },
      orderBy: {
        lastMessageAt: 'desc',
      },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
            receiver: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
        property: {
          select: {
            id: true,
            title: true,
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    const result: ConversationResponse[] = [];

    for (const conv of conversations) {
      const unreadCount = await this.prisma.message.count({
        where: {
          conversationId: conv.id,
          receiverId: userId,
          isRead: false,
        },
      });

      const allMessages = await this.prisma.message.findMany({
        where: { conversationId: conv.id },
        orderBy: { createdAt: 'asc' },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
          receiver: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
      });

      const isBuyer = conv.buyerId === userId;
      const otherUser = isBuyer ? conv.seller : conv.buyer;

      result.push({
        id: conv.id,
        propertyId: conv.propertyId || undefined,
        propertyTitle: conv.property?.title,
        buyerId: conv.buyerId,
        buyerName: conv.buyer.name,
        buyerAvatar: conv.buyer.avatarUrl || undefined,
        sellerId: conv.sellerId,
        sellerName: conv.seller.name,
        sellerAvatar: conv.seller.avatarUrl || undefined,
        lastMessage: conv.lastMessage || undefined,
        lastMessageAt: conv.lastMessageAt,
        unreadCount,
        messages: allMessages.map((m) => ({
          id: m.id,
          content: m.content,
          senderId: m.senderId,
          senderName: m.sender.name,
          senderAvatar: m.sender.avatarUrl || undefined,
          receiverId: m.receiverId,
          receiverName: m.receiver.name,
          receiverAvatar: m.receiver.avatarUrl || undefined,
          isRead: m.isRead,
          readAt: m.readAt || undefined,
          createdAt: m.createdAt,
        })),
      });
    }

    return result;
  }

  // ============================================
  // 4. GET CONVERSATION BY ID
  // ============================================
  async getConversationById(conversationId: string, userId: string) {
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [{ buyerId: userId }, { sellerId: userId }],
        isActive: true,
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
            receiver: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
        property: {
          select: {
            id: true,
            title: true,
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!conversation) {
      throw new ApiError(404, 'Conversation not found');
    }

    // Mark messages as read
    await this.prisma.message.updateMany({
      where: {
        conversationId,
        receiverId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return conversation;
  }

  // ============================================
  // 5. MARK MESSAGES AS READ
  // ============================================
  async markMessagesAsRead(userId: string, messageIds: string[]) {
    if (!messageIds || messageIds.length === 0) {
      throw new ApiError(400, 'Message IDs are required');
    }

    const messages = await this.prisma.message.findMany({
      where: {
        id: { in: messageIds },
        receiverId: userId,
      },
    });

    if (messages.length === 0) {
      throw new ApiError(404, 'No messages found to mark as read');
    }

    const updated = await this.prisma.message.updateMany({
      where: {
        id: { in: messageIds },
        receiverId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return {
      success: true,
      message: `Marked ${updated.count} messages as read`,
      count: updated.count,
    };
  }

  // ============================================
  // 6. MARK CONVERSATION AS READ
  // ============================================
  async markConversationAsRead(userId: string, conversationId: string) {
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [{ buyerId: userId }, { sellerId: userId }],
      },
    });

    if (!conversation) {
      throw new ApiError(404, 'Conversation not found');
    }

    const updated = await this.prisma.message.updateMany({
      where: {
        conversationId,
        receiverId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return {
      success: true,
      message: `Marked ${updated.count} messages as read`,
      count: updated.count,
    };
  }

  // ============================================
  // 7. GET UNREAD COUNT
  // ============================================
  async getUnreadCount(userId: string) {
    const count = await this.prisma.message.count({
      where: {
        receiverId: userId,
        isRead: false,
      },
    });

    return { count };
  }

  // ============================================
  // 8. DELETE MESSAGE
  // ============================================
  async deleteMessage(messageId: string, userId: string) {
    const message = await this.prisma.message.findFirst({
      where: {
        id: messageId,
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
    });

    if (!message) {
      throw new ApiError(404, 'Message not found');
    }

    await this.prisma.message.delete({
      where: { id: messageId },
    });

    return { success: true, message: 'Message deleted' };
  }

  // ============================================
  // 9. DELETE CONVERSATION
  // ============================================
  async deleteConversation(conversationId: string, userId: string) {
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [{ buyerId: userId }, { sellerId: userId }],
      },
    });

    if (!conversation) {
      throw new ApiError(404, 'Conversation not found');
    }

    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { isActive: false },
    });

    return { success: true, message: 'Conversation deleted' };
  }

  // ============================================
  // 10. CHECK UNREAD MESSAGES (For Notification)
  // ============================================
  async checkUnreadMessages(userId: string) {
    const count = await this.prisma.message.count({
      where: {
        receiverId: userId,
        isRead: false,
      },
    });

    const conversations = await this.prisma.conversation.findMany({
      where: {
        OR: [{ buyerId: userId }, { sellerId: userId }],
        isActive: true,
        messages: {
          some: {
            receiverId: userId,
            isRead: false,
          },
        },
      },
      select: {
        id: true,
        buyerId: true,
        sellerId: true,
        _count: {
          select: {
            messages: {
              where: {
                receiverId: userId,
                isRead: false,
              },
            },
          },
        },
      },
    });

    return {
      totalUnread: count,
      conversations: conversations.map((c) => ({
        conversationId: c.id,
        unreadCount: c._count.messages,
        isBuyer: c.buyerId === userId,
      })),
    };
  }
}