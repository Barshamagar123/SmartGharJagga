// src/modules/qr/qr.controller.ts

import { Request, Response } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import { ApiResponse } from '@/utils/apiResponse';
import { ApiError } from '@/utils/apiError';
import { QRService } from './qr.service';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export class QRController {
  constructor(private qrService: QRService) {}

  // ============================================
  // 1. Generate QR Code
  // ============================================
  generateQRCode = asyncHandler(async (req: AuthRequest, res: Response) => {
    // ✅ FIX: Cast propertyId to string
    const propertyId = req.params.propertyId as string;
    if (!propertyId) {
      throw new ApiError(400, 'Property ID is required');
    }

    const qrCode = await this.qrService.generateQRCode(propertyId);
    ApiResponse.success(res, 201, 'QR Code generated successfully', qrCode);
  });

  // ============================================
  // 2. Get QR Code by Property ID
  // ============================================
  getQRCode = asyncHandler(async (req: AuthRequest, res: Response) => {
    // ✅ FIX: Cast propertyId to string
    const propertyId = req.params.propertyId as string;
    if (!propertyId) {
      throw new ApiError(400, 'Property ID is required');
    }

    const qrCode = await this.qrService.getQRCodeByPropertyId(propertyId);
    ApiResponse.success(res, 200, 'QR Code fetched successfully', qrCode);
  });

  // ============================================
  // 3. Download QR Code
  // ============================================
  downloadQRCode = asyncHandler(async (req: AuthRequest, res: Response) => {
    // ✅ FIX: Cast propertyId to string
    const propertyId = req.params.propertyId as string;
    const format = req.query.format as string;

    if (!propertyId) {
      throw new ApiError(400, 'Property ID is required');
    }

    if (!format || !['png', 'svg', 'pdf'].includes(format)) {
      throw new ApiError(400, 'Invalid format. Use png, svg, or pdf');
    }

    const result = await this.qrService.downloadQRCode(
      propertyId,
      format as 'png' | 'svg' | 'pdf'
    );

    res.setHeader('Content-Type', result.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    res.send(result.buffer);
  });

  // ============================================
  // 4. Scan QR Code
  // ============================================
  scanQRCode = asyncHandler(async (req: Request, res: Response) => {
    const { qrData } = req.body;

    if (!qrData) {
      throw new ApiError(400, 'QR data is required');
    }

    const result = await this.qrService.scanQRCode(qrData);
    ApiResponse.success(res, 200, 'QR Code scanned successfully', result);
  });

  // ============================================
  // 5. Delete QR Code
  // ============================================
  deleteQRCode = asyncHandler(async (req: AuthRequest, res: Response) => {
    // ✅ FIX: Cast propertyId to string
    const propertyId = req.params.propertyId as string;
    if (!propertyId) {
      throw new ApiError(400, 'Property ID is required');
    }

    await this.qrService.deleteQRCode(propertyId);
    ApiResponse.success(res, 200, 'QR Code deleted successfully');
  });
}