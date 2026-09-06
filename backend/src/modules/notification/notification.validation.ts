// src/modules/notification/notification.validation.ts

import { z } from 'zod';

export const createNotificationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
    message: z.string().min(1, 'Message is required').max(1000, 'Message is too long'),
    type: z.enum([
      'PROPERTY_CREATED',
      'REVIEW_ADDED',
      'PROPERTY_SOLD',
      'USER_REGISTERED',
      'PROPERTY_APPROVED',
      'PROPERTY_REJECTED',
    ]),
    data: z.record(z.any()).optional(),
  }),
});

export const notificationIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid notification ID'),
  }),
});

export const markAllReadSchema = z.object({
  body: z.object({
    userId: z.string().uuid('Invalid user ID').optional(),
  }),
});