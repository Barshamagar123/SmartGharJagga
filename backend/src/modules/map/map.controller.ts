// src/modules/map/map.controller.ts

import { Request, Response } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import { ApiResponse } from '@/utils/apiResponse';
import { ApiError } from '@/utils/apiError';
import { MapService } from './map.service';

export class MapController {
  constructor(private mapService: MapService) {}

  // ============================================
  // 1. Get Property Locations
  // ============================================
  getPropertyLocations = asyncHandler(async (req: Request, res: Response) => {
    const locations = await this.mapService.getPropertyLocations();
    ApiResponse.success(res, 200, 'Property locations fetched successfully', locations);
  });

  // ============================================
  // 2. Get Heat Map Data
  // ============================================
  getHeatMapData = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.mapService.getHeatMapData();
    ApiResponse.success(res, 200, 'Heat map data fetched successfully', data);
  });

  // ============================================
  // 3. Get Price Heat Map Data
  // ============================================
  getPriceHeatMapData = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.mapService.getPriceHeatMapData();
    ApiResponse.success(res, 200, 'Price heat map data fetched successfully', data);
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

    ApiResponse.success(res, 200, 'Properties found in area', properties);
  });

  // ============================================
  // 5. Get Nearby Places
  // ============================================
  getNearbyPlaces = asyncHandler(async (req: Request, res: Response) => {
    const { lat, lng, radius } = req.query;

    if (!lat || !lng) {
      throw new ApiError(400, 'Latitude and longitude are required');
    }

    const places = await this.mapService.getNearbyPlaces(
      Number(lat),
      Number(lng),
      radius ? Number(radius) : 2
    );

    ApiResponse.success(res, 200, 'Nearby places fetched successfully', places);
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

    ApiResponse.success(res, 200, 'Nearest properties fetched successfully', properties);
  });
}