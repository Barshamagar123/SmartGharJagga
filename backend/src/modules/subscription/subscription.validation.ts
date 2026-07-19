// src/modules/subscription/subscription.validation.ts

import { z } from 'zod';

export const initiateSubscriptionSchema = z.object({
  body: z.object({
    planType: z.enum(['FREE', 'PREMIUM']),
    paymentMethod: z.enum(['KHALTI', 'ESEWA']),
  }),
});