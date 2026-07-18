// src/modules/qr/qr.routes.ts

import { Router } from 'express';
import { QRController } from './qr.controller';
import { QRService } from './qr.service';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '@/middleware/auth.middleware';
import { requireRole } from '@/middleware/role.middleware';

const prisma = new PrismaClient();
const qrService = new QRService(prisma);
const qrController = new QRController(qrService);

const router = Router();

// ============================================
// PROTECTED ROUTES (Auth Required)
// ============================================

/**
 * @route POST /api/v1/qr/generate/:propertyId
 * @desc Generate QR code for a property
 * @access Private (Seller/Admin)
 */
router.post(
  '/generate/:propertyId',
  authMiddleware,
  requireRole('SELLER', 'ADMIN'),
  qrController.generateQRCode
);

/**
 * @route GET /api/v1/qr/:propertyId
 * @desc Get QR code by property ID
 * @access Private
 */
router.get(
  '/:propertyId',
  authMiddleware,
  qrController.getQRCode
);

/**
 * @route GET /api/v1/qr/download/:propertyId
 * @desc Download QR code
 * @access Public
 */
router.get(
  '/download/:propertyId',
  qrController.downloadQRCode
);

/**
 * @route POST /api/v1/qr/scan
 * @desc Scan QR code and get property details
 * @access Public
 */
router.post(
  '/scan',
  qrController.scanQRCode
);

/**
 * @route DELETE /api/v1/qr/:propertyId
 * @desc Delete QR code
 * @access Private (Seller/Admin)
 */
router.delete(
  '/:propertyId',
  authMiddleware,
  requireRole('SELLER', 'ADMIN'),
  qrController.deleteQRCode
);

export default router;