// src/modules/property/property.controller.ts

import { Request, Response } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import { ApiResponse } from '@/utils/apiResponse';
import { ApiError } from '@/utils/apiError';
import { PropertyService } from './property.service';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export class PropertyController {
  constructor(private propertyService: PropertyService) {}

  // ============================================
  // 1. CREATE PROPERTY - ALL DATA IN FORM-DATA!
  // ============================================
  createProperty = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      throw new ApiError(401, 'Authentication required');
    }

    if (!userRole) {
      throw new ApiError(401, 'User role not found');
    }

    // ✅ Parse data from form-data
    let data = req.body;
    if (req.body.data) {
      try {
        data = typeof req.body.data === 'string' 
          ? JSON.parse(req.body.data) 
          : req.body.data;
      } catch (error) {
        throw new ApiError(400, 'Invalid JSON data in data field');
      }
    }

    const files = req.files as Express.Multer.File[] | undefined;
    const images = files?.filter((file) => file.fieldname === 'images') || [];
    const videos = files?.filter((file) => file.fieldname === 'videos') || [];

    const property = await this.propertyService.createProperty(
      userId,
      userRole,
      data,
      images,
      videos
    );

    ApiResponse.success(res, 201, 'Property listed successfully', property);
  });

  // ============================================
  // 2. GET ALL PROPERTIES
  // ============================================
  getProperties = asyncHandler(async (req: Request, res: Response) => {
    const filters = {
      search: req.query.search as string,
      location: req.query.location as string,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      propertyType: req.query.propertyType as any,
      bedrooms: req.query.bedrooms ? Number(req.query.bedrooms) : undefined,
      bathrooms: req.query.bathrooms ? Number(req.query.bathrooms) : undefined,
      parking: req.query.parking === 'true' ? true : undefined,
      amenities: req.query.amenities ? (req.query.amenities as string).split(',') : undefined,
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 20,
      sortBy: req.query.sortBy as any,
      sortOrder: req.query.sortOrder as any,
    };

    const result = await this.propertyService.getProperties(filters);
    ApiResponse.success(res, 200, 'Properties fetched successfully', result);
  });

  // ============================================
  // 3. GET PROPERTY BY ID
  // ============================================
  getPropertyById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    if (!id) {
      throw new ApiError(400, 'Property ID is required');
    }

    const property = await this.propertyService.getPropertyById(id);
    ApiResponse.success(res, 200, 'Property fetched successfully', property);
  });

  // ============================================
  // 4. UPDATE PROPERTY
  // ============================================
  updateProperty = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      throw new ApiError(401, 'Authentication required');
    }

    if (!userRole) {
      throw new ApiError(401, 'User role not found');
    }

    const id = req.params.id as string;
    if (!id) {
      throw new ApiError(400, 'Property ID is required');
    }

    // ✅ Parse data from form-data
    let data = req.body;
    if (req.body.data) {
      try {
        data = typeof req.body.data === 'string' 
          ? JSON.parse(req.body.data) 
          : req.body.data;
      } catch (error) {
        throw new ApiError(400, 'Invalid JSON data in data field');
      }
    }

    const files = req.files as Express.Multer.File[] | undefined;
    const images = files?.filter((file) => file.fieldname === 'images') || [];
    const videos = files?.filter((file) => file.fieldname === 'videos') || [];

    const property = await this.propertyService.updateProperty(
      id,
      userId,
      userRole,
      data,
      images,
      videos
    );

    ApiResponse.success(res, 200, 'Property updated successfully', property);
  });

  // ============================================
  // 5. DELETE PROPERTY
  // ============================================
  deleteProperty = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      throw new ApiError(401, 'Authentication required');
    }

    if (!userRole) {
      throw new ApiError(401, 'User role not found');
    }

    const id = req.params.id as string;
    if (!id) {
      throw new ApiError(400, 'Property ID is required');
    }

    await this.propertyService.deleteProperty(id, userId, userRole);

    ApiResponse.success(res, 200, 'Property deleted successfully');
  });

  // ============================================
  // 6. GET USER PROPERTIES
  // ============================================
  getUserProperties = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'Authentication required');
    }

    const properties = await this.propertyService.getUserProperties(userId);
    ApiResponse.success(res, 200, 'Your properties fetched successfully', properties);
  });

  // ============================================
  // 7. ADMIN: UPDATE PROPERTY STATUS
  // ============================================
  updatePropertyStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;
    if (!id) {
      throw new ApiError(400, 'Property ID is required');
    }

    const { status, reason } = req.body;

    const property = await this.propertyService.updatePropertyStatus(id, status, reason);
    ApiResponse.success(res, 200, 'Property status updated successfully', property);
  });

  // ============================================
  // 8. GET PROPERTIES FOR MAP
  // ============================================
  getPropertiesForMap = asyncHandler(async (req: Request, res: Response) => {
    const properties = await this.propertyService.getPropertiesForMap();
    ApiResponse.success(res, 200, 'Properties for map fetched successfully', properties);
  });

  // ============================================
  // 9. GET PROPERTY STATS
  // ============================================
  getPropertyStats = asyncHandler(async (req: AuthRequest, res: Response) => {
    const stats = await this.propertyService.getPropertyStats();
    ApiResponse.success(res, 200, 'Property stats fetched successfully', stats);
  });

  // ============================================
  // 10. TOGGLE FAVORITE
  // ============================================
  toggleFavorite = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'Authentication required');
    }

    const id = req.params.id as string;
    if (!id) {
      throw new ApiError(400, 'Property ID is required');
    }

    const result = await this.propertyService.toggleFavorite(userId, id);

    ApiResponse.success(res, 200, result.message, { favorited: result.favorited });
  });

  // ============================================
  // 11. GET FAVORITES
  // ============================================
  getFavorites = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'Authentication required');
    }

    const properties = await this.propertyService.getFavorites(userId);
    ApiResponse.success(res, 200, 'Favorites fetched successfully', properties);
  });
}