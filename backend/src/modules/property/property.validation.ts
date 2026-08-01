// src/modules/property/property.validation.ts

import { z } from 'zod';

// ✅ AreaUnit enum for validation
const AreaUnitEnum = z.enum([
  'DHUR',
  'AANA',
  'ROPANI',
  'BISWA',
  'KATHA',
  'SQFT',
  'SQUARE_FEET',
  'SQUARE_METER',
  'HECTARE',
]);

/**
 * The frontend sends property data as multipart/form-data with a single
 * field called "data" whose value is JSON.stringify(payload) — this is
 * required so files (images/videos) can travel in the same request.
 *
 * That means req.body looks like:
 *   { data: '{"title":"...","price":500000,...}' }
 * NOT like:
 *   { title: "...", price: 500000, ... }
 *
 * This preprocessor parses that JSON string back into an object so Zod can
 * validate the actual fields instead of failing on a raw string / missing
 * top-level keys.
 */
const parseJsonField = (val: unknown) => {
  if (typeof val === 'string') {
    try {
      return JSON.parse(val);
    } catch {
      // Let zod's own validation catch this and produce a clean error
      // instead of throwing here.
      return val;
    }
  }
  // Already an object (e.g. plain JSON request with no files) — pass through.
  return val;
};

const propertyDataShape = {
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  price: z.coerce.number().positive(),
  location: z.string().min(2, 'Location is required'),
  latitude: z.coerce.number().optional().nullable(),
  longitude: z.coerce.number().optional().nullable(),
  bedrooms: z.coerce.number().int().min(0).optional().nullable(),
  bathrooms: z.coerce.number().int().min(0).optional().nullable(),
  area: z.coerce.number().positive().optional().nullable(),
  areaUnit: AreaUnitEnum.optional(),
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
  purpose: z.enum(['SALE', 'RENT']).optional(), // ✅ ADDED — was missing, backend previously hardcoded 'SALE'
  amenities: z.array(z.string()).optional(),
  parking: z.coerce.boolean().optional(),
  floor: z.coerce.number().int().optional().nullable(),
  yearBuilt: z.coerce.number().int().min(1900).max(2100).optional().nullable(),
  images: z.array(z.string()).optional(),
  videos: z.array(z.string()).optional(),
  isFeatured: z.coerce.boolean().optional(),
};

export const createPropertySchema = z.object({
  body: z.object({
    // ✅ FIXED: validate the parsed contents of the "data" field, not
    // top-level req.body keys.
    data: z.preprocess(parseJsonField, z.object(propertyDataShape)),
  }),
});

export const updatePropertySchema = z.object({
  body: z.object({
    data: z.preprocess(
      parseJsonField,
      z
        .object({
          ...propertyDataShape,
          title: z.string().min(3).optional(),
          price: z.coerce.number().positive().optional(),
          location: z.string().min(2).optional(),
          propertyType: propertyDataShape.propertyType.optional(),
          status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'SOLD']).optional(),
        })
    ),
  }),
});