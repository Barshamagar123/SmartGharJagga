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

router.post(
  '/preferences',
  authMiddleware,
  validate(preferenceSchema),
  matchingController.savePreferences
);

router.get(
  '/properties',
  authMiddleware,
  matchingController.getPropertyMatches
);

router.get(
  '/preferences',
  authMiddleware,
  matchingController.getUserPreferences
);

router.get(
  '/count',
  authMiddleware,
  matchingController.getMatchCount
);

router.post(
  '/learn',
  authMiddleware,
  matchingController.updateFromBehavior
);

export default router;