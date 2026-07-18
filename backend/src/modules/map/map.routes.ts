// src/modules/map/map.routes.ts

import { Router } from 'express';
import { MapController } from './map.controller';
import { MapService } from './map.service';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '@/middleware/auth.middleware';

const prisma = new PrismaClient();
const mapService = new MapService(prisma);
const mapController = new MapController(mapService);

const router = Router();

// ============================================
// PUBLIC ROUTES
// ============================================

/**
 * @route GET /api/v1/map/locations
 * @desc Get all property locations for map
 * @access Public
 */
router.get('/locations', mapController.getPropertyLocations);

/**
 * @route GET /api/v1/map/heatmap
 * @desc Get heat map data
 * @access Public
 */
router.get('/heatmap', mapController.getHeatMapData);

/**
 * @route GET /api/v1/map/price-heatmap
 * @desc Get price heat map data
 * @access Public
 */
router.get('/price-heatmap', mapController.getPriceHeatMapData);

/**
 * @route GET /api/v1/map/nearby
 * @desc Get nearby places (schools, hospitals, etc.)
 * @access Public
 */
router.get('/nearby', mapController.getNearbyPlaces);

/**
 * @route GET /api/v1/map/nearest
 * @desc Get nearest properties to a location
 * @access Public
 */
router.get('/nearest', mapController.getNearestProperties);

/**
 * @route POST /api/v1/map/search-area
 * @desc Search properties by drawing area (Draw-to-Search)
 * @access Public
 */
router.post('/search-area', mapController.searchByArea);

export default router;