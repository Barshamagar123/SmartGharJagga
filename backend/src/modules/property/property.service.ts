// src/modules/property/property.service.ts

import { PrismaClient, PropertyStatus } from '@prisma/client';
import { ApiError } from '@/utils/apiError';
import { FileService } from '@/services/internal/file.service';
import {
  CreatePropertyRequest,
  UpdatePropertyRequest,
  PropertyFilter,
  AreaUnit,
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

  // ============================================
  // 1. CREATE PROPERTY - ✅ FIXED
  // ============================================
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

    const imageUrls = this.getFileUrls(imageFiles || [], 'images');
    const videoUrls = this.getFileUrls(videoFiles || [], 'videos');

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
        areaUnit: data.areaUnit,
        propertyType: data.propertyType,
        purpose: data.purpose || 'SALE', // ✅ NOW WORKS - type has purpose
        amenities: data.amenities || [],
        images: imageUrls.length > 0 ? imageUrls : [],
        videos: videoUrls.length > 0 ? videoUrls : [],
        mainImage: imageUrls.length > 0 ? imageUrls[0] : null,
        parking: data.parking || false,
        floor: data.floor,
        yearBuilt: data.yearBuilt,
        userId: userId,
        status: 'PENDING',
        isFeatured: data.isFeatured || false,
      },
    });

    return property;
  }

  // ============================================
  // 2. GET PROPERTIES - ✅ FIXED with favorite status
  // ============================================
  async getProperties(filters: PropertyFilter, userId?: string) {
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
      isFeatured,
    } = filters;

    const skip = (page - 1) * limit;
    const where: any = {};

    if (status && status !== 'ALL') {
      where.status = status;
    }

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
    
    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
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

    // ✅ Get user's favorite IDs if logged in
    let favoriteIds: Set<string> = new Set();
    if (userId) {
      const favorites = await this.prisma.favorite.findMany({
        where: { userId },
        select: { propertyId: true },
      });
      favoriteIds = new Set(favorites.map(f => f.propertyId));
    }

    // ✅ Add isFavorited flag to each property
    const propertiesWithFavorites = properties.map(property => ({
      ...property,
      isFavorited: favoriteIds.has(property.id),
    }));

    return {
      properties: propertiesWithFavorites,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // ============================================
  // 3. GET PROPERTY BY ID - ✅ FIXED with favorite status
  // ============================================
  async getPropertyById(id: string, userId?: string) {
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

    // ✅ Check if property is favorited by user
    let isFavorited = false;
    if (userId) {
      const favorite = await this.prisma.favorite.findUnique({
        where: {
          userId_propertyId: {
            userId,
            propertyId: id,
          },
        },
      });
      isFavorited = !!favorite;
    }

    // Increment views
    await this.prisma.property.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    return {
      ...property,
      isFavorited,
    };
  }

  // ============================================
  // 4. UPDATE PROPERTY - ✅ FIXED
  // ============================================
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
        areaUnit: data.areaUnit,
        propertyType: data.propertyType,
        purpose: data.purpose, // ✅ NOW WORKS - type has purpose
        amenities: data.amenities,
        parking: data.parking,
        floor: data.floor,
        yearBuilt: data.yearBuilt,
        images: imageUrls,
        videos: videoUrls,
        mainImage: imageUrls.length > 0 ? imageUrls[0] : property.mainImage,
        isFeatured: data.isFeatured !== undefined ? data.isFeatured : property.isFeatured,
        ...(userRole !== 'ADMIN' ? { status: 'PENDING' } : {}),
      },
    });

    return updatedProperty;
  }

  // ============================================
  // 5. DELETE PROPERTY
  // ============================================
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

  // ============================================
  // 6. GET USER PROPERTIES - ✅ FIXED
  // ============================================
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

    // ✅ User's own properties are not favorited by themselves
    return properties.map(property => ({
      ...property,
      isFavorited: false,
    }));
  }

  // ============================================
  // 7. UPDATE PROPERTY STATUS
  // ============================================
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

  // ============================================
  // 8. GET PROPERTIES FOR MAP - ✅ FIXED
  // ============================================
  async getPropertiesForMap(userId?: string) {
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
        area: true,
        areaUnit: true,
        isFeatured: true,
      },
    });

    // ✅ Get user's favorite IDs if logged in
    let favoriteIds: Set<string> = new Set();
    if (userId) {
      const favorites = await this.prisma.favorite.findMany({
        where: { userId },
        select: { propertyId: true },
      });
      favoriteIds = new Set(favorites.map(f => f.propertyId));
    }

    return properties.map(property => ({
      ...property,
      isFavorited: favoriteIds.has(property.id),
    }));
  }

  // ============================================
  // 9. GET PROPERTY STATS
  // ============================================
  async getPropertyStats() {
    try {
      const total = await this.prisma.property.count();
      const pending = await this.prisma.property.count({ where: { status: 'PENDING' } });
      const approved = await this.prisma.property.count({ where: { status: 'APPROVED' } });
      const sold = await this.prisma.property.count({ where: { status: 'SOLD' } });
      const rejected = await this.prisma.property.count({ where: { status: 'REJECTED' } });
      const featured = await this.prisma.property.count({ where: { isFeatured: true } });

      return {
        total: total || 0,
        pending: pending || 0,
        approved: approved || 0,
        sold: sold || 0,
        rejected: rejected || 0,
        featured: featured || 0,
      };
    } catch (error) {
      console.error('Error fetching property stats:', error);
      return {
        total: 0,
        pending: 0,
        approved: 0,
        sold: 0,
        rejected: 0,
        featured: 0,
      };
    }
  }

  // ============================================
  // 10. TOGGLE FAVORITE - ✅ COMPLETE FIXED
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
  // 11. GET FAVORITES - ✅ COMPLETE FIXED
  // ============================================
  async getFavorites(userId: string) {
    const favorites = await this.prisma.favorite.findMany({
      where: { 
        userId: userId 
      },
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
      orderBy: { 
        createdAt: 'desc' 
      },
    });

    if (favorites.length === 0) {
      return [];
    }

    // ✅ Map to properties with isFavorited flag = true
    return favorites.map((favorite) => ({
      ...favorite.property,
      isFavorited: true, // ✅ Always true for favorites list
    }));
  }

  // ============================================
  // 12. TOGGLE FEATURED
  // ============================================
  async toggleFeatured(id: string, userId: string, userRole: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      throw new ApiError(404, 'Property not found');
    }

    if (property.userId !== userId && userRole !== 'ADMIN') {
      throw new ApiError(403, 'You are not authorized to perform this action');
    }

    const updatedProperty = await this.prisma.property.update({
      where: { id },
      data: {
        isFeatured: !property.isFeatured,
      },
    });

    return {
      isFeatured: updatedProperty.isFeatured,
      message: updatedProperty.isFeatured ? 'Property featured successfully' : 'Property unfeatured successfully',
    };
  }

  // ============================================
  // 13. GET FEATURED PROPERTIES - ✅ FIXED
  // ============================================
  async getFeaturedProperties(limit: number = 6, userId?: string) {
    const properties = await this.prisma.property.findMany({
      where: {
        isFeatured: true,
        status: 'APPROVED',
      },
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
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

    // ✅ Get user's favorite IDs if logged in
    let favoriteIds: Set<string> = new Set();
    if (userId) {
      const favorites = await this.prisma.favorite.findMany({
        where: { userId },
        select: { propertyId: true },
      });
      favoriteIds = new Set(favorites.map(f => f.propertyId));
    }

    return properties.map(property => ({
      ...property,
      isFavorited: favoriteIds.has(property.id),
    }));
  }

  // ============================================
  // 14. GET ALL UNIQUE LOCATIONS
  // ============================================
  async getAllLocations(): Promise<string[]> {
    try {
      const properties = await this.prisma.property.findMany({
        where: {
          status: 'APPROVED',
        },
        select: {
          location: true,
        },
        distinct: ['location'],
        orderBy: {
          location: 'asc',
        },
      });

      const locations = properties
        .map(p => p.location)
        .filter((loc): loc is string => 
          loc !== null && 
          loc !== undefined && 
          typeof loc === 'string' && 
          loc.trim() !== ''
        );

      return locations;
    } catch (error) {
      console.error('❌ Error fetching locations:', error);
      return [];
    }
  }

  // ============================================
  // 15. SEARCH LOCATIONS
  // ============================================
  async searchLocations(query: string): Promise<string[]> {
    try {
      if (!query || query.trim().length === 0) {
        return this.getAllLocations();
      }

      const properties = await this.prisma.property.findMany({
        where: {
          status: 'APPROVED',
          location: {
            contains: query,
            mode: 'insensitive',
          },
        },
        select: {
          location: true,
        },
        distinct: ['location'],
        take: 20,
        orderBy: {
          location: 'asc',
        },
      });

      return properties
        .map(p => p.location)
        .filter((loc): loc is string => 
          loc !== null && 
          loc !== undefined && 
          typeof loc === 'string' && 
          loc.trim() !== ''
        );
    } catch (error) {
      console.error(`❌ Error searching locations for "${query}":`, error);
      return [];
    }
  }

  // ============================================
  // 16. GET POPULAR LOCATIONS
  // ============================================
  async getPopularLocations(limit: number = 10): Promise<string[]> {
    try {
      const popular = await this.prisma.property.groupBy({
        by: ['location'],
        where: {
          status: 'APPROVED',
        },
        _count: {
          location: true,
        },
        orderBy: {
          _count: {
            location: 'desc',
          },
        },
        take: limit,
      });

      return popular
        .map(p => p.location)
        .filter((loc): loc is string => 
          loc !== null && 
          loc !== undefined && 
          typeof loc === 'string' && 
          loc.trim() !== ''
        );
    } catch (error) {
      console.error('❌ Error fetching popular locations:', error);
      return [];
    }
  }
}