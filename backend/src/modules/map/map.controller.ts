// src/modules/map/map.controller.ts

import { Request, Response } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import { ApiResponse } from '@/utils/apiResponse';
import { ApiError } from '@/utils/apiError';
import { MapService } from './map.service';
import { PrismaClient } from '@prisma/client';

export class MapController {
  private prisma: PrismaClient;

  constructor(private mapService: MapService) {
    this.prisma = new PrismaClient();
  }

  // ============================================
  // 1. Get Property Locations
  // ============================================
  getPropertyLocations = asyncHandler(async (req: Request, res: Response) => {
    const locations = await this.mapService.getPropertyLocations();
    ApiResponse.success(res, 200, 'Property locations fetched successfully', {
      locations,
      total: locations.length,
    });
  });

  // ============================================
  // 2. Get Heat Map Data
  // ============================================
  getHeatMapData = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.mapService.getHeatMapData();
    ApiResponse.success(res, 200, 'Heat map data fetched successfully', {
      data,
      total: data.length,
    });
  });

  // ============================================
  // 3. Get Price Heat Map Data
  // ============================================
  getPriceHeatMapData = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.mapService.getPriceHeatMapData();
    ApiResponse.success(res, 200, 'Price heat map data fetched successfully', {
      data,
      total: data.length,
    });
  });

  // ============================================
  // 4. Search by Area (Draw-to-Search)
  // ============================================
  searchByArea = asyncHandler(async (req: Request, res: Response) => {
    const { lat, lng, radius } = req.body;

    if (!lat || !lng || !radius) {
      throw new ApiError(400, 'Latitude, longitude, and radius are required');
    }

    const properties = await this.mapService.searchByArea({
      lat: Number(lat),
      lng: Number(lng),
      radius: Number(radius),
    });

    ApiResponse.success(res, 200, 'Properties found in area', {
      properties,
      total: properties.length,
      searchArea: {
        lat: Number(lat),
        lng: Number(lng),
        radius: Number(radius),
      },
    });
  });

  // ============================================
  // 5. Get Nearby Places - DYNAMIC (Google Places API)
  // ============================================
  getNearbyPlaces = asyncHandler(async (req: Request, res: Response) => {
    const { 
      lat, 
      lng, 
      radius, 
      types, 
      limit, 
      keyword, 
      minRating 
    } = req.query;

    if (!lat || !lng) {
      throw new ApiError(400, 'Latitude and longitude are required');
    }

    // ✅ Parse types from comma-separated string
    const typesArray = types 
      ? (types as string).split(',').map(t => t.trim()) 
      : ['school', 'hospital', 'market', 'park', 'restaurant', 'bank', 'pharmacy', 'supermarket', 'cafe', 'gym'];

    const places = await this.mapService.getNearbyPlaces(
      Number(lat),
      Number(lng),
      radius ? Number(radius) : 2,
      typesArray,
      limit ? Number(limit) : 20,
      keyword as string,
      minRating ? Number(minRating) : undefined
    );

    // ✅ Determine data source
    const source = places.length > 0 && places[0].rating !== undefined 
      ? 'google_places' 
      : 'database';

    ApiResponse.success(res, 200, 'Nearby places fetched successfully', {
      places,
      total: places.length,
      filters: {
        lat: Number(lat),
        lng: Number(lng),
        radius: Number(radius) || 2,
        types: typesArray,
        limit: Number(limit) || 20,
        keyword: keyword || null,
        minRating: minRating || null,
      },
      source,
    });
  });

  // ============================================
  // 6. Get Nearest Properties
  // ============================================
  getNearestProperties = asyncHandler(async (req: Request, res: Response) => {
    const { lat, lng, limit } = req.query;

    if (!lat || !lng) {
      throw new ApiError(400, 'Latitude and longitude are required');
    }

    const properties = await this.mapService.getNearestProperties(
      Number(lat),
      Number(lng),
      limit ? Number(limit) : 10
    );

    ApiResponse.success(res, 200, 'Nearest properties fetched successfully', {
      properties,
      total: properties.length,
      location: {
        lat: Number(lat),
        lng: Number(lng),
      },
    });
  });

  // ============================================
  // 7. Get Place Photo (Helper for Google Places)
  // ============================================
  getPlacePhoto = asyncHandler(async (req: Request, res: Response) => {
    const { photoReference, maxWidth } = req.query;

    if (!photoReference) {
      throw new ApiError(400, 'Photo reference is required');
    }

    const photoUrl = this.mapService.getPlacePhotoUrl(
      photoReference as string,
      maxWidth ? Number(maxWidth) : 400
    );

    if (!photoUrl) {
      throw new ApiError(400, 'Google Places API key not configured');
    }

    // ✅ Redirect to Google's photo URL
    res.redirect(photoUrl);
  });

  // ============================================
  // 8. Get Property by ID with Location
  // ============================================
  getPropertyLocation = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    // ✅ Fix: Ensure id is a string
    if (!id || typeof id !== 'string') {
      throw new ApiError(400, 'Valid property ID is required');
    }

    const property = await this.prisma.property.findUnique({
      where: { id: id as string }, // ✅ Type assertion
      select: {
        id: true,
        title: true,
        price: true,
        location: true,
        latitude: true,
        longitude: true,
        propertyType: true,
        bedrooms: true,
        bathrooms: true,
        area: true,
        images: true,
        mainImage: true,
        createdAt: true,
      },
    });

    if (!property) {
      throw new ApiError(404, 'Property not found');
    }

    if (!property.latitude || !property.longitude) {
      throw new ApiError(404, 'Property location not available');
    }

    ApiResponse.success(res, 200, 'Property location fetched successfully', {
      id: property.id,
      title: property.title,
      price: Number(property.price),
      location: property.location,
      latitude: property.latitude,
      longitude: property.longitude,
      propertyType: property.propertyType,
      bedrooms: property.bedrooms || 0,
      bathrooms: property.bathrooms || 0,
      area: property.area || 0,
      images: property.images,
      mainImage: property.mainImage,
      createdAt: property.createdAt,
    });
  });
}