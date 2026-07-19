// src/modules/message/message.validation.ts

import { z } from 'zod';

export const sendMessageSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Message content is required'),
    conversationId: z.string().optional(),
    propertyId: z.string().optional(),
    receiverId: z.string().min(1, 'Receiver ID is required'),
  }),
});

export const markAsReadSchema = z.object({
  body: z.object({
    messageIds: z.array(z.string()).min(1, 'At least one message ID is required'),
  }),
});