// src/modules/property/property.validation.ts

import { z } from 'zod';

export const createPropertySchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().optional(),
    price: z.coerce.number().positive(),

    location: z.string().min(2, 'Location is required'),
    latitude: z.coerce.number().optional(),
   longitude: z.coerce.number().optional(),
bedrooms: z.coerce.number().int().min(0).optional(),
bathrooms: z.coerce.number().int().min(0).optional(),
area: z.coerce.number().positive().optional(),


    propertyType: z.enum([
      'HOUSE',
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
    amenities: z.array(z.string()).optional(),
   parking: z.coerce.boolean().optional(),

floor: z.coerce.number().int().optional(),

yearBuilt: z.coerce.number().int().min(1900).max(2100).optional(),
    images: z.array(z.string()).optional(),
    videos: z.array(z.string()).optional(),
  }),
});

export const updatePropertySchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().optional(),
    price: z.number().positive().optional(),
    location: z.string().min(2).optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    bedrooms: z.number().int().min(0).optional(),
    bathrooms: z.number().int().min(0).optional(),
    area: z.number().positive().optional(),
    propertyType: z.enum([
      'HOUSE',
      'RESIDENTIAL_LAND',
      'COMMERCIAL_LAND',
      'AGRICULTURAL_LAND',
      'INDUSTRIAL_LAND',
      'SHOP',
      'OFFICE',
      'WAREHOUSE',
      'HOTEL',
      'RESTAURANT',
    ]).optional(),
    amenities: z.array(z.string()).optional(),
    parking: z.boolean().optional(),
    floor: z.number().int().optional(),
    yearBuilt: z.number().int().min(1900).max(2100).optional(),
    images: z.array(z.string()).optional(),
    videos: z.array(z.string()).optional(),
    status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'SOLD']).optional(),
  }),
});