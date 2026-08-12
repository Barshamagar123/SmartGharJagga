// src/types/review.ts

export interface Review {
  id: string;
  propertyId: string;
  reviewerId: string;
  rating: number;
  comment?: string;
  isApproved?: boolean;
  createdAt?: string;
  updatedAt?: string;
  reviewer?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  property?: {
    id: string;
    title: string;
    location?: string;
    mainImage?: string;
  };
}

export interface ReviewStats {
  propertyId: string;
  propertyTitle: string;
  averageRating: number;
  totalReviews: number;
  reviews: Review[];
  ratingDistribution: {
    stars: number;
    count: number;
    percentage: number;
  }[];
}

export interface CreateReviewData {
  propertyId: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewData {
  rating?: number;
  comment?: string;
}

export interface ReviewFilters {
  propertyId?: string;
  userId?: string;
  rating?: number;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

export interface ReviewListResponse {
  reviews: Review[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}