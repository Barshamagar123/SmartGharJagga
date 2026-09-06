// src/modules/notification/notification.types.ts

export interface CreateNotificationRequest {
  title: string;
  message: string;
  type: NotificationType;
  userId: string;
  data?: Record<string, any>;
}

export interface NotificationResponse {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
  data?: Record<string, any>;
}

export type NotificationType = 
  | 'PROPERTY_CREATED'
  | 'REVIEW_ADDED'
  | 'PROPERTY_SOLD'
  | 'USER_REGISTERED'
  | 'PROPERTY_APPROVED'
  | 'PROPERTY_REJECTED';

export interface NotificationCountResponse {
  count: number;
}

export interface NotificationListResponse {
  notifications: NotificationResponse[];
  total: number;
  unread: number;
}

export interface NotificationWebSocketData {
  notificationId: string;
  title: string;
  message: string;
  type: string;
  data?: Record<string, any>;
  timestamp: string;
}