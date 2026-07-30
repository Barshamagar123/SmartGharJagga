// src/modules/map/map.routes.ts

import { Router } from 'express';
import { MapController } from './map.controller';
import { MapService } from './map.service';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '@/middleware/auth.middleware';
import rateLimit from 'express-rate-limit';

const prisma = new PrismaClient();
const mapService = new MapService(prisma);
const mapController = new MapController(mapService);

const router = Router();

// ============================================
// RATE LIMITING (Optional but recommended)
// ============================================
const mapRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: 'Too many map requests, please try again later.',
});

const nearbyRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 50, // 50 requests per minute for nearby places
  message: 'Too many nearby places requests, please try again later.',
});

// ============================================
// PUBLIC ROUTES (No Auth Required)
// ============================================

/**
 * @route   GET /api/v1/map/locations
 * @desc    Get all property locations for map
 * @access  Public
 * @query   {number} limit - Max results (optional)
 * @query   {string} propertyType - Filter by property type (optional)
 */
router.get('/locations', mapRateLimit, mapController.getPropertyLocations);

/**
 * @route   GET /api/v1/map/heatmap
 * @desc    Get heat map data (property density + popularity)
 * @access  Public
 */
router.get('/heatmap', mapRateLimit, mapController.getHeatMapData);

/**
 * @route   GET /api/v1/map/price-heatmap
 * @desc    Get price heat map data
 * @access  Public
 */
router.get('/price-heatmap', mapRateLimit, mapController.getPriceHeatMapData);

/**
 * @route   GET /api/v1/map/nearby
 * @desc    Get nearby places (schools, hospitals, restaurants, etc.)
 * @access  Public
 * @query   {number} lat - Latitude
 * @query   {number} lng - Longitude
 * @query   {number} radius - Search radius in km (default: 2)
 * @query   {string} types - Comma-separated place types
 * @query   {number} limit - Max results (default: 20)
 * @query   {string} keyword - Search keyword (optional)
 * @query   {number} minRating - Minimum rating (optional)
 */
router.get('/nearby', nearbyRateLimit, mapController.getNearbyPlaces);

/**
 * @route   GET /api/v1/map/nearest
 * @desc    Get nearest properties to a location
 * @access  Public
 * @query   {number} lat - Latitude
 * @query   {number} lng - Longitude
 * @query   {number} limit - Max results (default: 10)
 */
router.get('/nearest', mapRateLimit, mapController.getNearestProperties);

/**
 * @route   GET /api/v1/map/photo
 * @desc    Get place photo from Google Places
 * @access  Public
 * @query   {string} photoReference - Google photo reference
 * @query   {number} maxWidth - Max width (default: 400)
 */
router.get('/photo', mapRateLimit, mapController.getPlacePhoto);

/**
 * @route   GET /api/v1/map/property/:id/location
 * @desc    Get property location by ID
 * @access  Public
 * @params  {string} id - Property ID
 */
router.get('/property/:id/location', mapRateLimit, mapController.getPropertyLocation);

// ============================================
// PROTECTED ROUTES (Auth Required)
// ============================================

/**
 * @route   POST /api/v1/map/search-area
 * @desc    Search properties by drawing area (Draw-to-Search)
 * @access  Public (or Protected - choose based on your needs)
 * @body    {number} lat - Center latitude
 * @body    {number} lng - Center longitude
 * @body    {number} radius - Search radius in km
 */
router.post('/search-area', mapRateLimit, mapController.searchByArea);

export default router;