// src/modules/qr/qr.types.ts

export interface QRCodeData {
  id: string;
  propertyId: string;
  title: string;
  price: number;
  location: string;
  propertyType: string;
  isVerified: boolean;
  status: string;
  createdAt: Date;
}

export interface QRCodeResponse {
  id: string;
  propertyId: string;
  qrCode: string;
  qrCodeUrl: string;
  downloadLinks: {
    png: string;
    svg: string;
    pdf: string;
  };
}