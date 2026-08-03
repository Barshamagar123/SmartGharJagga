// src/modules/admin/admin.types.ts

export interface UserFilterParams {
  page?: number;
  limit?: number;
  role?: 'BUYER' | 'SELLER' | 'ADMIN';
  search?: string;
  isVerified?: boolean;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface BulkUpdateRequest {
  userIds: string[];
  updates: {
    role?: 'BUYER' | 'SELLER' | 'ADMIN';
    isActive?: boolean;
    isEmailVerified?: boolean;
  };
}