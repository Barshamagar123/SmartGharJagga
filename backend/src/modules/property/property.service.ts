// src/modules/property/property.service.ts

import { PrismaClient, PropertyStatus } from '@prisma/client';
import { ApiError } from '@/utils/apiError';
import { FileService } from '@/services/internal/file.service';
import {
  CreatePropertyRequest,
  UpdatePropertyRequest,
  PropertyFilter,
} from './property.types';

export class PropertyService {
  private fileService: FileService;

  constructor(private prisma: PrismaClient) {
    this.fileService = new FileService();
  }


  private getFileUrls(files: Express.Multer.File[], folder: 'images' | 'videos'): string[] {
    if (!files || files.length === 0) return [];
    return files.map((file) => `/uploads/properties/${folder}/${file.filename}`);
  }


  async createProperty(
    userId: string,
    userRole: string,
    data: CreatePropertyRequest,
    imageFiles?: Express.Multer.File[],
    videoFiles?: Express.Multer.File[]
  ) {
    if (userRole !== 'SELLER' && userRole !== 'ADMIN') {
      throw new ApiError(403, 'Only sellers and admins can list properties');
    }

    // ✅ Get image and video URLs from uploaded files
    const imageUrls = this.getFileUrls(imageFiles || [], 'images');
    const videoUrls = this.getFileUrls(videoFiles || [], 'videos');

    console.log('📦 Data:', data);
    console.log('📸 Images:', imageUrls);
    console.log('📹 Videos:', videoUrls);

    const propertyId = `PROP-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const property = await this.prisma.property.create({
      data: {
        propertyId,
        title: data.title,
        description: data.description,
        price: data.price,
        location: data.location,
        latitude: data.latitude,
        longitude: data.longitude,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        area: data.area,
        propertyType: data.propertyType,
        purpose: 'SALE',
        amenities: data.amenities || [],
        images: imageUrls.length > 0 ? imageUrls : [],
        videos: videoUrls.length > 0 ? videoUrls : [],
        mainImage: imageUrls.length > 0 ? imageUrls[0] : null,
        parking: data.parking || false,
        floor: data.floor,
        yearBuilt: data.yearBuilt,
        userId: userId,
        status: 'PENDING',
      },
    });

    return property;
  }

  async getProperties(filters: PropertyFilter) {
    const {
      search,
      location,
      minPrice,
      maxPrice,
      propertyType,
      bedrooms,
      bathrooms,
      parking,
      amenities,
      status = 'APPROVED',
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;

    const skip = (page - 1) * limit;
    const where: any = { status };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (propertyType) where.propertyType = propertyType;
    if (bedrooms) where.bedrooms = bedrooms;
    if (bathrooms) where.bathrooms = bathrooms;
    if (parking !== undefined) where.parking = parking;
    if (amenities && amenities.length > 0) {
      where.amenities = { hasSome: amenities };
    }

    const total = await this.prisma.property.count({ where });

    const properties = await this.prisma.property.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatarUrl: true,
          },
        },
      },
    });

    return {
      properties,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // ============================================
  // 3. GET PROPERTY BY ID
  // ============================================
  async getPropertyById(id: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!property) {
      throw new ApiError(404, 'Property not found');
    }

    await this.prisma.property.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    return property;
  }

  
  async updateProperty(
    id: string,
    userId: string,
    userRole: string,
    data: UpdatePropertyRequest,
    imageFiles?: Express.Multer.File[],
    videoFiles?: Express.Multer.File[]
  ) {
    const property = await this.prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      throw new ApiError(404, 'Property not found');
    }

    if (property.userId !== userId && userRole !== 'ADMIN') {
      throw new ApiError(403, 'You are not authorized to update this property');
    }

    let imageUrls = property.images;
    let videoUrls = property.videos;

    if (imageFiles && imageFiles.length > 0) {
      const newImages = this.getFileUrls(imageFiles, 'images');
      imageUrls = [...imageUrls, ...newImages];
    }

    if (videoFiles && videoFiles.length > 0) {
      const newVideos = this.getFileUrls(videoFiles, 'videos');
      videoUrls = [...videoUrls, ...newVideos];
    }

    const updatedProperty = await this.prisma.property.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        location: data.location,
        latitude: data.latitude,
        longitude: data.longitude,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        area: data.area,
        propertyType: data.propertyType,
        amenities: data.amenities,
        parking: data.parking,
        floor: data.floor,
        yearBuilt: data.yearBuilt,
        images: imageUrls,
        videos: videoUrls,
        mainImage: imageUrls.length > 0 ? imageUrls[0] : property.mainImage,
        ...(userRole !== 'ADMIN' ? { status: 'PENDING' } : {}),
      },
    });

    return updatedProperty;
  }

  async deleteProperty(id: string, userId: string, userRole: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      throw new ApiError(404, 'Property not found');
    }

    if (property.userId !== userId && userRole !== 'ADMIN') {
      throw new ApiError(403, 'You are not authorized to delete this property');
    }

    const allFiles = [...property.images, ...property.videos];
    if (allFiles.length > 0) {
      allFiles.forEach((filePath) => {
        this.fileService.deleteFile(filePath);
      });
    }

    await this.prisma.property.delete({
      where: { id },
    });

    return { message: 'Property deleted successfully' };
  }


  async getUserProperties(userId: string) {
    const properties = await this.prisma.property.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatarUrl: true,
          },
        },
      },
    });

    return properties;
  }


  async updatePropertyStatus(id: string, status: PropertyStatus, reason?: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      throw new ApiError(404, 'Property not found');
    }

    const updatedProperty = await this.prisma.property.update({
      where: { id },
      data: {
        status,
        rejectionReason: status === 'REJECTED' ? reason : null,
        isVerified: status === 'APPROVED' ? true : false,
      },
    });

    return updatedProperty;
  }

  
  async getPropertiesForMap() {
    const properties = await this.prisma.property.findMany({
      where: {
        status: 'APPROVED',
        latitude: { not: null },
        longitude: { not: null },
      },
      select: {
        id: true,
        title: true,
        price: true,
        location: true,
        latitude: true,
        longitude: true,
        propertyType: true,
        bedrooms: true,
        mainImage: true,
      },
    });

    return properties;
  }

  // ============================================
  // 9. GET PROPERTY STATS
  // ============================================
// ============================================
// 9. GET PROPERTY STATS - FIXED!
// ============================================
async getPropertyStats() {
  try {
    const total = await this.prisma.property.count();
    const pending = await this.prisma.property.count({ where: { status: 'PENDING' } });
    const approved = await this.prisma.property.count({ where: { status: 'APPROVED' } });
    const sold = await this.prisma.property.count({ where: { status: 'SOLD' } });
    const rejected = await this.prisma.property.count({ where: { status: 'REJECTED' } });

    return { 
      total: total || 0,
      pending: pending || 0,
      approved: approved || 0,
      sold: sold || 0,
      rejected: rejected || 0 
    };
  } catch (error) {
    console.error('Error fetching property stats:', error);
    return { 
      total: 0, 
      pending: 0, 
      approved: 0, 
      sold: 0, 
      rejected: 0 
    };
  }
}

  // ============================================
  // 10. TOGGLE FAVORITE
  // ============================================
  async toggleFavorite(userId: string, propertyId: string) {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new ApiError(404, 'Property not found');
    }

    const existing = await this.prisma.favorite.findUnique({
      where: {
        userId_propertyId: {
          userId,
          propertyId,
        },
      },
    });

    if (existing) {
      await this.prisma.favorite.delete({
        where: { id: existing.id },
      });

      await this.prisma.property.update({
        where: { id: propertyId },
        data: { favoritesCount: { decrement: 1 } },
      });

      return { favorited: false, message: 'Removed from favorites' };
    }

    await this.prisma.favorite.create({
      data: {
        userId,
        propertyId,
      },
    });

    await this.prisma.property.update({
      where: { id: propertyId },
      data: { favoritesCount: { increment: 1 } },
    });

    return { favorited: true, message: 'Added to favorites' };
  }

  // ============================================
  // 11. GET FAVORITES
  // ============================================
  async getFavorites(userId: string) {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      include: {
        property: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return favorites.map((f) => f.property);
  }
}