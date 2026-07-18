// src/modules/subscription/subscription.validation.ts

import { z } from 'zod';

export const createSubscriptionSchema = z.object({
  body: z.object({
    planType: z.enum(['FREE', 'PREMIUM']),
    paymentMethod: z.enum(['khalti', 'esewa', 'stripe']),
    paymentDetails: z.any().optional(),
  }),
});