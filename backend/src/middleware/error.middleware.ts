import { Request, Response, NextFunction } from 'express';
import { ApiError } from '@/utils/apiError';
import { ApiResponse } from '@/utils/apiResponse';

export const errorHandler = (
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  if (err instanceof ApiError) {
    return ApiResponse.error(res, err.statusCode, err.message);
  }

  console.error('Unhandled error:', err);
  return ApiResponse.error(res, 500, 'Internal server error');
};

export const notFoundHandler = (
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  return ApiResponse.error(res, 404, 'Route not found');
};