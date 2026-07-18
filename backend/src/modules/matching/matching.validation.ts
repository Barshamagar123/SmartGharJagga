// src/modules/matching/matching.validation.ts

import { z } from 'zod';

export const preferenceSchema = z.object({
  body: z.object({
    budgetMin: z.number().min(0, 'Minimum budget must be 0 or more'),
    budgetMax: z.number().positive('Maximum budget must be positive'),
    location: z.string().min(1, 'Location is required'),
    propertyType: z.enum([
      'HOUSE',
      'APARTMENT',
      'BUNGALOW',
      'VILLA',
      'RESIDENTIAL_LAND',
      'COMMERCIAL_LAND',
      'AGRICULTURAL_LAND',
      'INDUSTRIAL_LAND',
      'SHOP',
      'OFFICE',
      'WAREHOUSE',
      'HOTEL',
      'RESTAURANT',
    ]),
    bedrooms: z.number().int().min(0).default(0),
    bathrooms: z.number().int().min(0).default(0),
    amenities: z.array(z.string()).default([]),
    purpose: z.enum(['SALE', 'RENT']),
    parkingNeeded: z.boolean().default(false),
  }),
});