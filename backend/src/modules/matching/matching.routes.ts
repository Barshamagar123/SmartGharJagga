// src/modules/matching/matching.routes.ts

import { Router } from 'express';
import { MatchingController } from './matching.controller';
import { MatchingService } from './matching.service';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '@/middleware/auth.middleware';
import { validate } from '@/middleware/validation.middleware';
import { preferenceSchema } from './matching.validation';

const prisma = new PrismaClient();
const matchingService = new MatchingService(prisma);
const matchingController = new MatchingController(matchingService);

const router = Router();

// ============================================
// PROTECTED ROUTES (Auth Required)
// ============================================

/**
 * @route POST /api/v1/matching/preferences
 * @desc Save user preferences for AI matching
 * @access Private
 */
router.post(
  '/preferences',
  authMiddleware,
  validate(preferenceSchema),
  matchingController.savePreferences
);

/**
 * @route GET /api/v1/matching/properties
 * @desc Get matched properties based on user preferences
 * @access Private
 */
router.get(
  '/properties',
  authMiddleware,
  matchingController.getPropertyMatches
);

/**
 * @route GET /api/v1/matching/agents
 * @desc Get matched agents based on user preferences
 * @access Private
 */
router.get(
  '/agents',
  authMiddleware,
  matchingController.getAgentMatches
);

/**
 * @route GET /api/v1/matching/preferences
 * @desc Get user preferences
 * @access Private
 */
router.get(
  '/preferences',
  authMiddleware,
  matchingController.getUserPreferences
);

/**
 * @route GET /api/v1/matching/count
 * @desc Get number of matching properties
 * @access Private
 */
router.get(
  '/count',
  authMiddleware,
  matchingController.getMatchCount
);

export default router;