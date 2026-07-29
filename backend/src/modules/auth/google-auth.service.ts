// src/modules/auth/google-auth.service.ts

import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { config } from '@/config';
import { ApiError } from '@/utils/apiError';
import { CacheService } from '@/services/internal/cache.service';
import { TokenPayload, AuthResponse } from './auth.types';

export class GoogleAuthService {
  constructor(
    private prisma: PrismaClient,
    private cacheService: CacheService
  ) {}

  async handleGoogleCallback(user: any): Promise<AuthResponse> {
    if (!user) {
      throw new ApiError(401, 'Google authentication failed');
    }

    // Generate tokens
    const accessToken = this.generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = this.generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Store refresh token in cache
    await this.cacheService.set(
      `refresh_token:${user.id}`,
      refreshToken,
      7 * 24 * 60 * 60 // 7 days
    );

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isVerified: user.isEmailVerified,
        avatarUrl: user.avatarUrl,
      },
      accessToken,
      refreshToken,
    };
  }

  private generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(
      payload,
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN } as jwt.SignOptions
    );
  }

  private generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(
      payload,
      config.JWT_REFRESH_SECRET,
      { expiresIn: config.JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions
    );
  }
}