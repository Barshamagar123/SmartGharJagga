// src/modules/qr/qr.service.ts

import { PrismaClient } from '@prisma/client';
import { ApiError } from '@/utils/apiError';
import QRCode from 'qrcode';
import { QRCodeData, QRCodeResponse } from './qr.types';

export class QRService {
  constructor(private prisma: PrismaClient) {}

  // ============================================
  // 1. Generate QR Code for Property
  // ============================================
  async generateQRCode(propertyId: string): Promise<QRCodeResponse> {
    // Get property details
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!property) {
      throw new ApiError(404, 'Property not found');
    }

    // Check if property is verified
    if (!property.isVerified) {
      throw new ApiError(400, 'Property must be verified to generate QR code');
    }

    // Create QR data
    const qrData: QRCodeData = {
      id: property.id,
      propertyId: property.propertyId,
      title: property.title,
      price: Number(property.price),
      location: property.location,
      propertyType: property.propertyType,
      isVerified: property.isVerified,
      status: property.status,
      createdAt: property.createdAt,
    };

    // Generate QR code
    const qrCodeUrl = await this.generateQRCodeImage(qrData);
    const qrCodeSvg = await this.generateQRCodeSvg(qrData);

    // Save QR code to database
    const qrRecord = await this.prisma.qRCode.create({
      data: {
        propertyId: property.id,
        qrCode: qrCodeUrl,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    return {
      id: qrRecord.id,
      propertyId: property.propertyId,
      qrCode: qrCodeUrl,
      qrCodeUrl: qrCodeUrl,
      downloadLinks: {
        png: `/api/v1/qr/download/${property.id}?format=png`,
        svg: `/api/v1/qr/download/${property.id}?format=svg`,
        pdf: `/api/v1/qr/download/${property.id}?format=pdf`,
      },
    };
  }

  // ============================================
  // 2. Generate QR Code Image (PNG)
  // ============================================
  async generateQRCodeImage(data: QRCodeData): Promise<string> {
    const qrData = JSON.stringify(data);
    
    return new Promise((resolve, reject) => {
      QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#1a56db', // Primary color
          light: '#ffffff',
        },
        errorCorrectionLevel: 'H',
      }, (err: Error | null | undefined, url: string) => {
        if (err) reject(err);
        else resolve(url);
      });
    });
  }

  // ============================================
  // 3. Generate QR Code SVG
  // ============================================
  async generateQRCodeSvg(data: QRCodeData): Promise<string> {
    const qrData = JSON.stringify(data);
    
    return new Promise((resolve, reject) => {
      QRCode.toString(qrData, {
        type: 'svg',
        width: 300,
        margin: 2,
        color: {
          dark: '#1a56db',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'H',
      }, (err: Error | null | undefined, svg: string) => {
        if (err) reject(err);
        else resolve(svg);
      });
    });
  }

  // ============================================
  // 4. Get QR Code by Property ID
  // ============================================
  async getQRCodeByPropertyId(propertyId: string): Promise<QRCodeResponse> {
    const qrRecord = await this.prisma.qRCode.findFirst({
      where: {
        propertyId: propertyId,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!qrRecord) {
      // Generate new QR code if expired or not found
      return this.generateQRCode(propertyId);
    }

    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new ApiError(404, 'Property not found');
    }

    return {
      id: qrRecord.id,
      propertyId: property.propertyId,
      qrCode: qrRecord.qrCode,
      qrCodeUrl: qrRecord.qrCode,
      downloadLinks: {
        png: `/api/v1/qr/download/${property.id}?format=png`,
        svg: `/api/v1/qr/download/${property.id}?format=svg`,
        pdf: `/api/v1/qr/download/${property.id}?format=pdf`,
      },
    };
  }

  // ============================================
  // 5. Download QR Code
  // ============================================
  async downloadQRCode(
    propertyId: string,
    format: 'png' | 'svg' | 'pdf'
  ): Promise<{ buffer: Buffer; contentType: string; filename: string }> {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new ApiError(404, 'Property not found');
    }

    const qrData: QRCodeData = {
      id: property.id,
      propertyId: property.propertyId,
      title: property.title,
      price: Number(property.price),
      location: property.location,
      propertyType: property.propertyType,
      isVerified: property.isVerified,
      status: property.status,
      createdAt: property.createdAt,
    };

    const qrDataString = JSON.stringify(qrData);

    let buffer: Buffer;
    let contentType: string;
    let filename: string;

    switch (format) {
      case 'png':
        const pngDataUrl = await this.generateQRCodeImage(qrData);
        const base64Data = pngDataUrl.replace(/^data:image\/png;base64,/, '');
        buffer = Buffer.from(base64Data, 'base64');
        contentType = 'image/png';
        filename = `qr-${property.propertyId}.png`;
        break;

      case 'svg':
        const svg = await this.generateQRCodeSvg(qrData);
        buffer = Buffer.from(svg, 'utf-8');
        contentType = 'image/svg+xml';
        filename = `qr-${property.propertyId}.svg`;
        break;

      case 'pdf':
        // For PDF, we'll generate PNG and wrap in PDF
        const pdfDataUrl = await this.generateQRCodeImage(qrData);
        const pdfBase64 = pdfDataUrl.replace(/^data:image\/png;base64,/, '');
        const pdfBuffer = Buffer.from(pdfBase64, 'base64');
        
        // Simple PDF wrapper (using png as image)
        // In production, use a PDF library like pdfkit
        buffer = pdfBuffer;
        contentType = 'application/pdf';
        filename = `qr-${property.propertyId}.pdf`;
        break;

      default:
        throw new ApiError(400, 'Invalid format. Use png, svg, or pdf');
    }

    return { buffer, contentType, filename };
  }

  // ============================================
  // 6. Scan QR Code (Get property from QR data)
  // ============================================
  async scanQRCode(qrData: string): Promise<any> {
    try {
      const data = JSON.parse(qrData);
      
      const property = await this.prisma.property.findUnique({
        where: { id: data.id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      });

      if (!property) {
        throw new ApiError(404, 'Property not found');
      }

      return {
        property: {
          id: property.id,
          propertyId: property.propertyId,
          title: property.title,
          price: Number(property.price),
          location: property.location,
          propertyType: property.propertyType,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          area: property.area,
          images: property.images,
          mainImage: property.mainImage,
          isVerified: property.isVerified,
          status: property.status,
          user: property.user,
          createdAt: property.createdAt,
        },
        qrData: data,
      };
    } catch (error) {
      throw new ApiError(400, 'Invalid QR code data');
    }
  }

  // ============================================
  // 7. Delete QR Code
  // ============================================
  async deleteQRCode(propertyId: string): Promise<void> {
    await this.prisma.qRCode.deleteMany({
      where: { propertyId },
    });
  }
}