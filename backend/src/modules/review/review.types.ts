// src/modules/review/review.types.ts

export interface CreateReviewRequest {
  propertyId: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewRequest {
  rating?: number;
  comment?: string;
  isApproved?: boolean;
}

export interface ReviewResponse {
  id: string;
  propertyId: string;
  propertyTitle: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar?: string;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PropertyRatingResponse {
  propertyId: string;
  propertyTitle: string;
  averageRating: number;
  totalReviews: number;
  reviews: ReviewResponse[];
  ratingDistribution: {
    stars: number;
    count: number;
    percentage: number;
  }[];
}