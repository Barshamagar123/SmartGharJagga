// src/modules/matching/matching.controller.ts

import { Request, Response } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import { ApiResponse } from '@/utils/apiResponse';
import { ApiError } from '@/utils/apiError';
import { MatchingService } from './matching.service';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export class MatchingController {
  constructor(private matchingService: MatchingService) {}

  // ============================================
  // 1. Save Preferences
  // ============================================
  savePreferences = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'Authentication required');
    }

    const preferences = await this.matchingService.savePreferences(
      userId,
      req.body
    );

    ApiResponse.success(res, 200, 'Preferences saved successfully', preferences);
  });

  // ============================================
  // 2. Get Property Matches
  // ============================================
  getPropertyMatches = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'Authentication required');
    }

    const matches = await this.matchingService.getPropertyMatches(userId);
    ApiResponse.success(res, 200, 'Property matches fetched successfully', matches);
  });

  // ============================================
  // 3. Get Agent Matches
  // ============================================
  getAgentMatches = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'Authentication required');
    }

    const matches = await this.matchingService.getAgentMatches(userId);
    ApiResponse.success(res, 200, 'Agent matches fetched successfully', matches);
  });

  // ============================================
  // 4. Get User Preferences
  // ============================================
  getUserPreferences = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'Authentication required');
    }

    const preferences = await this.matchingService.getUserPreferences(userId);
    ApiResponse.success(res, 200, 'Preferences fetched successfully', preferences);
  });

  // ============================================
  // 5. Get Match Count
  // ============================================
  getMatchCount = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'Authentication required');
    }

    const count = await this.matchingService.getMatchCount(userId);
    ApiResponse.success(res, 200, 'Match count fetched successfully', { count });
  });
}