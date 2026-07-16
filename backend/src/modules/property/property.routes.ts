// src/modules/property/property.routes.ts

import { Router } from 'express';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '@/middleware/auth.middleware';
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

router.get('/', propertyController.getProperties);
router.get('/map', propertyController.getPropertiesForMap);
router.get('/:id', propertyController.getPropertyById);

// ============================================
// PROTECTED ROUTES
// ============================================

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

router.get(
  '/favorites',
  authMiddleware,
  requireRole('BUYER'),
  propertyController.getFavorites
);

// ============================================
// ADMIN ROUTES
// ============================================

router.put(
  '/:id/status',
  authMiddleware,
  requireRole('ADMIN'),
  propertyController.updatePropertyStatus
);

router.get(
  '/stats',
  authMiddleware,
  requireRole('ADMIN'),
  propertyController.getPropertyStats
);

export default router;