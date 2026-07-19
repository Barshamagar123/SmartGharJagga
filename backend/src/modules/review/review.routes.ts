// src/modules/review/review.routes.ts

import { Router } from 'express';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '@/middleware/auth.middleware';
import { requireRole } from '@/middleware/role.middleware';
import { validate } from '@/middleware/validation.middleware';
import { createReviewSchema, updateReviewSchema } from './review.validation';

const prisma = new PrismaClient();
const reviewService = new ReviewService(prisma);
const reviewController = new ReviewController(reviewService);

const router = Router();

// ============================================
// PUBLIC ROUTES
// ============================================

/**
 * @route GET /api/v1/reviews/property/:propertyId
 * @desc Get reviews for a property
 * @access Public
 */
router.get('/property/:propertyId', reviewController.getPropertyReviews);

/**
 * @route GET /api/v1/reviews/property/:propertyId/rating
 * @desc Get property rating summary
 * @access Public
 */
router.get('/property/:propertyId/rating', reviewController.getPropertyRating);

// ============================================
// PROTECTED ROUTES
// ============================================

/**
 * @route POST /api/v1/reviews
 * @desc Create a review
 * @access Private
 */
router.post(
  '/',
  authMiddleware,
  validate(createReviewSchema),
  reviewController.createReview
);

/**
 * @route GET /api/v1/reviews/my
 * @desc Get current user's reviews
 * @access Private
 */
router.get(
  '/my',
  authMiddleware,
  reviewController.getUserReviews
);

/**
 * @route PUT /api/v1/reviews/:reviewId
 * @desc Update a review
 * @access Private (Owner only)
 */
router.put(
  '/:reviewId',
  authMiddleware,
  validate(updateReviewSchema),
  reviewController.updateReview
);

/**
 * @route DELETE /api/v1/reviews/:reviewId
 * @desc Delete a review
 * @access Private (Owner only)
 */
router.delete(
  '/:reviewId',
  authMiddleware,
  reviewController.deleteReview
);

// ============================================
// ADMIN ROUTES
// ============================================

/**
 * @route PUT /api/v1/reviews/:reviewId/approve
 * @desc Approve a review
 * @access Admin only
 */
router.put(
  '/:reviewId/approve',
  authMiddleware,
  requireRole('ADMIN'),
  reviewController.approveReview
);

/**
 * @route PUT /api/v1/reviews/:reviewId/reject
 * @desc Reject a review
 * @access Admin only
 */
router.put(
  '/:reviewId/reject',
  authMiddleware,
  requireRole('ADMIN'),
  reviewController.rejectReview
);

/**
 * @route GET /api/v1/reviews/admin/all
 * @desc Get all reviews (admin view)
 * @access Admin only
 */
router.get(
  '/admin/all',
  authMiddleware,
  requireRole('ADMIN'),
  reviewController.getAllReviews
);

export default router;