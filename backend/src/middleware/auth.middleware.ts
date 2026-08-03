import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '@/config';
import { ApiError } from '@/utils/apiError';
import { CacheService } from '@/services/internal/cache.service';

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

// Shared CacheService instance for blacklist checking
const cacheService = new CacheService();

export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Authentication required'));
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return next(new ApiError(401, 'Authentication required'));
  }

  try {
    // Check if token is blacklisted (logged out)
    const isBlacklisted = await cacheService.exists(`blacklist:${token}`);
    if (isBlacklisted) {
      return next(new ApiError(401, 'Token has been revoked. Please login again.'));
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new ApiError(401, 'Token expired. Please login again.'));
    }
    return next(new ApiError(401, 'Invalid or expired token'));
  }
};

// ============================================
// OPTIONAL AUTH MIDDLEWARE
// ============================================
// For routes that must stay public (e.g. GET /properties, so logged-out
// buyers can browse) but that also want to know the caller's role IF they
// happen to be logged in (e.g. so an Admin viewing the same endpoint can
// see all property statuses, not just APPROVED).
//
// - No token / malformed header  -> continue, req.user stays undefined.
// - Valid token                  -> req.user gets populated, like authMiddleware.
// - Invalid/expired/blacklisted  -> DO NOT reject; treat as anonymous and continue.
export const optionalAuthMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return next();
  }

  try {
    const isBlacklisted = await cacheService.exists(`blacklist:${token}`);
    if (isBlacklisted) {
      return next();
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (error) {
    // Invalid/expired token on a public route — just treat as anonymous,
    // don't block the request.
  }

  next();
};