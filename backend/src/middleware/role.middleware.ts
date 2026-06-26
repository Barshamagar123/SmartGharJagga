import { Request, Response, NextFunction } from 'express';
import { ApiError } from '@/utils/apiError';

/**
 * Role-based access control middleware.
 * Usage: requireRole('ADMIN', 'AGENT')
 */
export const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `Access denied. Required role: ${allowedRoles.join(' or ')}`
        )
      );
    }

    next();
  };
};
