// src/modules/message/message.types.ts

export interface SendMessageRequest {
  content: string;
  conversationId?: string;
  propertyId?: string;
  receiverId: string;
}

export interface ConversationResponse {
  id: string;
  propertyId?: string;
  propertyTitle?: string;
  buyerId: string;
  buyerName: string;
  buyerAvatar?: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar?: string;
  lastMessage?: string;
  lastMessageAt: Date;
  unreadCount: number;
  messages: MessageResponse[];
}

export interface MessageResponse {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  receiverId: string;
  receiverName: string;
  receiverAvatar?: string;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

export interface MarkAsReadRequest {
  messageIds: string[];
}