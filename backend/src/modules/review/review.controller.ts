// src/modules/review/review.controller.ts

import { Request, Response } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import { ApiResponse } from '@/utils/apiResponse';
import { ApiError } from '@/utils/apiError';
import { ReviewService } from './review.service';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  // ============================================
  // 1. CREATE REVIEW
  // ============================================
  createReview = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'Authentication required');
    }

    const review = await this.reviewService.createReview(userId, req.body);
    ApiResponse.success(res, 201, 'Review created successfully', review);
  });

  // ============================================
  // 2. GET PROPERTY REVIEWS
  // ============================================
  getPropertyReviews = asyncHandler(async (req: Request, res: Response) => {
    // ✅ FIX: Cast propertyId to string
    const propertyId = req.params.propertyId as string;
    if (!propertyId) {
      throw new ApiError(400, 'Property ID is required');
    }

    const reviews = await this.reviewService.getPropertyReviews(propertyId);
    ApiResponse.success(res, 200, 'Property reviews fetched successfully', reviews);
  });

  // ============================================
  // 3. GET PROPERTY RATING SUMMARY
  // ============================================
  getPropertyRating = asyncHandler(async (req: Request, res: Response) => {
    // ✅ FIX: Cast propertyId to string
    const propertyId = req.params.propertyId as string;
    if (!propertyId) {
      throw new ApiError(400, 'Property ID is required');
    }

    const rating = await this.reviewService.getPropertyRatingSummary(propertyId);
    ApiResponse.success(res, 200, 'Property rating fetched successfully', rating);
  });

  // ============================================
  // 4. GET USER REVIEWS
  // ============================================
  getUserReviews = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'Authentication required');
    }

    const reviews = await this.reviewService.getUserReviews(userId);
    ApiResponse.success(res, 200, 'User reviews fetched successfully', reviews);
  });

  // ============================================
  // 5. UPDATE REVIEW
  // ============================================
  updateReview = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'Authentication required');
    }

    // ✅ FIX: Cast reviewId to string
    const reviewId = req.params.reviewId as string;
    if (!reviewId) {
      throw new ApiError(400, 'Review ID is required');
    }

    const review = await this.reviewService.updateReview(reviewId, userId, req.body);
    ApiResponse.success(res, 200, 'Review updated successfully', review);
  });

  // ============================================
  // 6. DELETE REVIEW
  // ============================================
  deleteReview = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, 'Authentication required');
    }

    // ✅ FIX: Cast reviewId to string
    const reviewId = req.params.reviewId as string;
    if (!reviewId) {
      throw new ApiError(400, 'Review ID is required');
    }

    const result = await this.reviewService.deleteReview(reviewId, userId);
    ApiResponse.success(res, 200, result.message);
  });

  // ============================================
  // 7. ADMIN: APPROVE REVIEW
  // ============================================
  approveReview = asyncHandler(async (req: AuthRequest, res: Response) => {
    // ✅ FIX: Cast reviewId to string
    const reviewId = req.params.reviewId as string;
    if (!reviewId) {
      throw new ApiError(400, 'Review ID is required');
    }

    const review = await this.reviewService.approveReview(reviewId);
    ApiResponse.success(res, 200, 'Review approved successfully', review);
  });

  // ============================================
  // 8. ADMIN: REJECT REVIEW
  // ============================================
  rejectReview = asyncHandler(async (req: AuthRequest, res: Response) => {
    // ✅ FIX: Cast reviewId to string
    const reviewId = req.params.reviewId as string;
    if (!reviewId) {
      throw new ApiError(400, 'Review ID is required');
    }

    const review = await this.reviewService.rejectReview(reviewId);
    ApiResponse.success(res, 200, 'Review rejected successfully', review);
  });

  // ============================================
  // 9. ADMIN: GET ALL REVIEWS
  // ============================================
  getAllReviews = asyncHandler(async (req: AuthRequest, res: Response) => {
    const reviews = await this.reviewService.getAllReviews();
    ApiResponse.success(res, 200, 'All reviews fetched successfully', reviews);
  });
}