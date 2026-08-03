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
  // 1. CREATE PROPERTY
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

    const files = req.files as {
      images?: Express.Multer.File[];
      videos?: Express.Multer.File[];
    };

    const images = files?.images || [];
    const videos = files?.videos || [];

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
  // 2. GET ALL PROPERTIES (UPDATED)
  // ============================================
  getProperties = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userRole = req.user?.role;
    const isAdmin = userRole === 'ADMIN';

    // ✅ Build filters from query params
    const filters: any = {
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
      isFeatured: req.query.isFeatured === 'true' ? true : req.query.isFeatured === 'false' ? false : undefined,
      // ✅ Get status from query params
      status: req.query.status as any,
      // ✅ Get userId from query (for sellers to see their own properties)
      userId: req.query.userId as string,
    };

    // ✅ ADMIN CHECK: If user is NOT admin, only show APPROVED properties
    // unless they are viewing their own properties
    if (!isAdmin) {
      // If user is authenticated and has a userId filter, allow them to see their own properties
      if (filters.userId && req.user?.id === filters.userId) {
        // Allow user to see their own properties (all statuses)
        // But we need to add a condition to only show their properties
        // This will be handled in the service
      } else {
        // For non-admin users, only show APPROVED properties
        // If status is explicitly requested, check if it's valid for non-admin
        if (filters.status) {
          // Non-admin users can only filter by their own status if they are viewing their own properties
          if (!filters.userId || req.user?.id !== filters.userId) {
            // If not viewing own properties, only allow APPROVED
            filters.status = 'APPROVED';
          }
        } else {
          // Default: only show APPROVED properties to non-admin users
          filters.status = 'APPROVED';
        }
      }
    }

    // ✅ If admin, they can see all statuses (no restriction)
    // If admin requests a specific status, use that, otherwise show all

    console.log('🔍 GetProperties Filters:', {
      isAdmin,
      userRole,
      userId: req.user?.id,
      filters,
    });

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

    const files = req.files as {
      images?: Express.Multer.File[];
      videos?: Express.Multer.File[];
    };

    const images = files?.images || [];
    const videos = files?.videos || [];

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

  // ============================================
  // 12. TOGGLE FEATURED
  // ============================================
  toggleFeatured = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      throw new ApiError(401, 'Authentication required');
    }

    const id = req.params.id as string;
    if (!id) {
      throw new ApiError(400, 'Property ID is required');
    }

    const result = await this.propertyService.toggleFeatured(id, userId, userRole || '');
    ApiResponse.success(res, 200, result.message, { isFeatured: result.isFeatured });
  });

  // ============================================
  // 13. GET FEATURED PROPERTIES
  // ============================================
  getFeaturedProperties = asyncHandler(async (req: Request, res: Response) => {
    const limit = req.query.limit ? Number(req.query.limit) : 6;
    const properties = await this.propertyService.getFeaturedProperties(limit);
    ApiResponse.success(res, 200, 'Featured properties fetched successfully', properties);
  });
}