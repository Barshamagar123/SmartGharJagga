// src/modules/property/property.routes.ts

import { Router } from 'express';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '@/middleware/auth.middleware';
import { optionalAuthMiddleware } from '@/middleware/auth.middleware'; // ✅ ADDED: Import optionalAuthMiddleware
import { requireRole } from '@/middleware/role.middleware';
import { validate } from '@/middleware/validation.middleware';
import { uploadPropertyMedia } from '@/middleware/upload.middleware';
import { createPropertySchema, updatePropertySchema } from './property.validation';

const prisma = new PrismaClient();
const propertyService = new PropertyService(prisma);
const propertyController = new PropertyController(propertyService);

const router = Router();

// ============================================
// PUBLIC ROUTES
// ============================================

// ✅ UPDATED: Added optionalAuthMiddleware to get all properties
router.get('/', optionalAuthMiddleware, propertyController.getProperties);

router.get('/map', propertyController.getPropertiesForMap);
router.get('/featured', propertyController.getFeaturedProperties);

router.get(
  '/stats',
  authMiddleware,
  requireRole('ADMIN'),
  propertyController.getPropertyStats
);

router.get(
  '/favorites',
  authMiddleware,
  requireRole('BUYER'),
  propertyController.getFavorites
);

// ============================================
// PROTECTED ROUTES
// ============================================

// ✅ CREATE PROPERTY
router.post(
  '/',
  authMiddleware,
  requireRole('SELLER', 'ADMIN'),
  uploadPropertyMedia,
  validate(createPropertySchema),
  propertyController.createProperty
);

router.get(
  '/my/properties',
  authMiddleware,
  propertyController.getUserProperties
);

router.put(
  '/:id',
  authMiddleware,
  uploadPropertyMedia,
  validate(updatePropertySchema),
  propertyController.updateProperty
);

router.delete(
  '/:id',
  authMiddleware,
  propertyController.deleteProperty
);

// ============================================
// FAVORITES ROUTES
// ============================================
router.post(
  '/:id/favorite',
  authMiddleware,
  requireRole('BUYER'),
  propertyController.toggleFavorite
);

// ============================================
// ✅ FEATURED ROUTES
// ============================================
router.put(
  '/:id/toggle-featured',
  authMiddleware,
  propertyController.toggleFeatured
);

// ============================================
// ADMIN ROUTES
// ============================================

router.get('/:id', propertyController.getPropertyById);

router.put(
  '/:id/status',
  authMiddleware,
  requireRole('ADMIN'),
  propertyController.updatePropertyStatus
);

export default router;