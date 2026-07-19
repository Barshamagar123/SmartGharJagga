// src/modules/review/review.service.ts

import { PrismaClient } from '@prisma/client';
import { ApiError } from '@/utils/apiError';
import { CreateReviewRequest, UpdateReviewRequest, PropertyRatingResponse } from './review.types';

export class ReviewService {
  constructor(private prisma: PrismaClient) {}

  // ============================================
  // 1. CREATE REVIEW
  // ============================================
  async createReview(userId: string, data: CreateReviewRequest) {
    const { propertyId, rating, comment } = data;

    // Validate rating
    if (rating < 1 || rating > 5) {
      throw new ApiError(400, 'Rating must be between 1 and 5');
    }

    // Check if property exists
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new ApiError(404, 'Property not found');
    }

    // Check if user already reviewed this property
    const existingReview = await this.prisma.review.findUnique({
      where: {
        propertyId_reviewerId: {
          propertyId,
          reviewerId: userId,
        },
      },
    });

    if (existingReview) {
      throw new ApiError(400, 'You have already reviewed this property');
    }

    // Create review
    const review = await this.prisma.review.create({
      data: {
        propertyId,
        reviewerId: userId,
        rating,
        comment,
      },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        property: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // Update property average rating
    await this.updatePropertyRating(propertyId);

    return review;
  }

  // ============================================
  // 2. GET PROPERTY REVIEWS
  // ============================================
  async getPropertyReviews(propertyId: string) {
    const reviews = await this.prisma.review.findMany({
      where: {
        propertyId,
        isApproved: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        property: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return reviews;
  }

  // ============================================
  // 3. GET PROPERTY RATING SUMMARY
  // ============================================
  async getPropertyRatingSummary(propertyId: string): Promise<PropertyRatingResponse> {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
      select: {
        id: true,
        title: true,
        averageRating: true,
        totalReviews: true,
        reviews: {
          where: { isApproved: true },
          orderBy: { createdAt: 'desc' },
          include: {
            reviewer: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    if (!property) {
      throw new ApiError(404, 'Property not found');
    }

    // Calculate rating distribution
    const distribution = this.calculateRatingDistribution(property.reviews);

    return {
      propertyId: property.id,
      propertyTitle: property.title,
      averageRating: Number(property.averageRating) || 0,
      totalReviews: property.totalReviews || 0,
      reviews: property.reviews.map((r) => ({
        id: r.id,
        propertyId: r.propertyId,
        propertyTitle: property.title,
        reviewerId: r.reviewerId,
        reviewerName: r.reviewer.name,
        reviewerAvatar: r.reviewer.avatarUrl || undefined,
        rating: r.rating,
        comment: r.comment || undefined,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      })),
      ratingDistribution: distribution,
    };
  }

  // ============================================
  // 4. GET USER REVIEWS
  // ============================================
  async getUserReviews(userId: string) {
    const reviews = await this.prisma.review.findMany({
      where: {
        reviewerId: userId,
        isApproved: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            propertyType: true,
            location: true,
            mainImage: true,
          },
        },
      },
    });

    return reviews;
  }

  // ============================================
  // 5. UPDATE REVIEW
  // ============================================
  async updateReview(reviewId: string, userId: string, data: UpdateReviewRequest) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new ApiError(404, 'Review not found');
    }

    if (review.reviewerId !== userId) {
      throw new ApiError(403, 'You can only update your own reviews');
    }

    const updatedReview = await this.prisma.review.update({
      where: { id: reviewId },
      data: {
        rating: data.rating,
        comment: data.comment,
      },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        property: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // Update property rating
    await this.updatePropertyRating(review.propertyId);

    return updatedReview;
  }

  // ============================================
  // 6. DELETE REVIEW
  // ============================================
  async deleteReview(reviewId: string, userId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new ApiError(404, 'Review not found');
    }

    if (review.reviewerId !== userId) {
      throw new ApiError(403, 'You can only delete your own reviews');
    }

    await this.prisma.review.delete({
      where: { id: reviewId },
    });

    // Update property rating
    await this.updatePropertyRating(review.propertyId);

    return { message: 'Review deleted successfully' };
  }

  // ============================================
  // 7. ADMIN: APPROVE REVIEW
  // ============================================
  async approveReview(reviewId: string) {
    const review = await this.prisma.review.update({
      where: { id: reviewId },
      data: {
        isApproved: true,
      },
    });

    await this.updatePropertyRating(review.propertyId);

    return review;
  }

  // ============================================
  // 8. ADMIN: REJECT REVIEW
  // ============================================
  async rejectReview(reviewId: string) {
    const review = await this.prisma.review.update({
      where: { id: reviewId },
      data: {
        isApproved: false,
      },
    });

    await this.updatePropertyRating(review.propertyId);

    return review;
  }

  // ============================================
  // 9. ADMIN: GET ALL REVIEWS
  // ============================================
  async getAllReviews() {
    const reviews = await this.prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        property: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return reviews;
  }

  // ============================================
  // PRIVATE: Update Property Rating
  // ============================================
  private async updatePropertyRating(propertyId: string) {
    const reviews = await this.prisma.review.findMany({
      where: {
        propertyId,
        isApproved: true,
      },
      select: {
        rating: true,
      },
    });

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

    await this.prisma.property.update({
      where: { id: propertyId },
      data: {
        totalReviews,
        averageRating: averageRating,
      },
    });
  }

  // ============================================
  // PRIVATE: Calculate Rating Distribution
  // ============================================
  private calculateRatingDistribution(reviews: any[]) {
    const distribution = [];
    const total = reviews.length || 1;

    for (let stars = 5; stars >= 1; stars--) {
      const count = reviews.filter((r) => r.rating === stars).length;
      distribution.push({
        stars,
        count,
        percentage: Math.round((count / total) * 100),
      });
    }

    return distribution;
  }
}