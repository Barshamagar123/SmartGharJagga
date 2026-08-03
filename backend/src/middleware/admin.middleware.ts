// src/middleware/admin.middleware.ts

import { Request, Response, NextFunction } from 'express';
import { ApiError } from '@/utils/apiError';

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;

  if (!user) {
    return next(new ApiError(401, 'Authentication required'));
  }

  if (user.role !== 'ADMIN') {
    return next(new ApiError(403, 'Admin access required'));
  }

  next();
};