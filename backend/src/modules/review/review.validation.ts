// src/modules/review/review.validation.ts

import { z } from 'zod';

export const createReviewSchema = z.object({
  body: z.object({
    propertyId: z.string().uuid('Invalid property ID'),
    rating: z.number()
      .int()
      .min(1, 'Rating must be at least 1')
      .max(5, 'Rating must be at most 5'),
    comment: z.string()
      .max(1000, 'Comment cannot exceed 1000 characters')
      .optional(),
  }),
});

export const updateReviewSchema = z.object({
  body: z.object({
    rating: z.number()
      .int()
      .min(1, 'Rating must be at least 1')
      .max(5, 'Rating must be at most 5')
      .optional(),
    comment: z.string()
      .max(1000, 'Comment cannot exceed 1000 characters')
      .optional(),
  }),
});