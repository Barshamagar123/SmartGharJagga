// src/modules/auth/auth.service.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import { config } from '@/config';
import { ApiError } from '@/utils/apiError';
import { EmailService } from '@/services/external/email.service';
import { CacheService } from '@/services/internal/cache.service';
import { 
  RegisterRequest, 
  LoginRequest, 
  AuthResponse, 
  JwtPayload,
  TokenPayload 
} from './auth.types';

export class AuthService {
  constructor(
    private prisma: PrismaClient,
    private emailService: EmailService,
    private cacheService: CacheService
  ) {}

  // ============================================
  // 1. REGISTER
  // ============================================
  async register(data: RegisterRequest): Promise<AuthResponse> {
    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ApiError(409, 'Email already registered');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash: hashedPassword,
        name: data.name,
        phone: data.phone,
        role: data.role || 'BUYER',
      },
    });

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

    // Store refresh token in Redis
    await this.cacheService.set(
      `refresh_token:${user.id}`,
      refreshToken,
      7 * 24 * 60 * 60 // 7 days
    );

    // Send verification email (async, don't await)
    this.sendVerificationEmail(user.id, user.email).catch(() => {
      // Log error but don't fail registration
      console.log('Failed to send verification email');
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

  // ============================================
  // 2. LOGIN
  // ============================================
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email: credentials.email },
    });

    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    if (!user.isActive) {
      throw new ApiError(403, 'Account is deactivated. Please contact support.');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

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

    // Store refresh token in Redis
    await this.cacheService.set(
      `refresh_token:${user.id}`,
      refreshToken,
      7 * 24 * 60 * 60 // 7 days
    );

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

  // ============================================
  // 3. LOGOUT
  // ============================================
  async logout(userId: string, accessToken: string): Promise<void> {
    // Blacklist access token
    const decoded = jwt.decode(accessToken) as { exp: number };
    if (decoded && decoded.exp) {
      const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
      if (expiresIn > 0) {
        await this.cacheService.set(
          `blacklist:${accessToken}`,
          'true',
          expiresIn
        );
      }
    }

    // Remove refresh token
    await this.cacheService.delete(`refresh_token:${userId}`);
  }

  // ============================================
  // 4. REFRESH TOKEN
  // ============================================
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(
        refreshToken,
        config.JWT_REFRESH_SECRET
      ) as JwtPayload;
    } catch (error) {
      throw new ApiError(401, 'Invalid or expired refresh token');
    }

    // Check if refresh token exists in Redis
    const storedToken = await this.cacheService.get(
      `refresh_token:${decoded.userId}`
    );

    if (storedToken !== refreshToken) {
      throw new ApiError(401, 'Invalid refresh token');
    }

    // Get user to ensure they still exist and are active
    const user = await this.prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || !user.isActive) {
      throw new ApiError(401, 'User not found or inactive');
    }

    // Generate new access token
    const newAccessToken = this.generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return { accessToken: newAccessToken };
  }

  // ============================================
  // 5. FORGOT PASSWORD
  // ============================================
  async forgotPassword(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists for security
      return;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Store reset token in Redis
    await this.cacheService.set(
      `reset_token:${resetToken}`,
      user.id,
      60 * 60 // 1 hour
    );

    // Send reset email
    await this.emailService.sendPasswordResetEmail(email, resetToken);
  }

  // ============================================
  // 6. RESET PASSWORD
  // ============================================
  async resetPassword(token: string, newPassword: string): Promise<void> {
    // Get user ID from token
    const userId = await this.cacheService.get(`reset_token:${token}`);

    if (!userId) {
      throw new ApiError(400, 'Invalid or expired reset token');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hashedPassword },
    });

    // Delete reset token
    await this.cacheService.delete(`reset_token:${token}`);
  }

  // ============================================
  // 7. VERIFY EMAIL
  // ============================================
  async verifyEmail(token: string): Promise<void> {
    // Get user ID from token
    const userId = await this.cacheService.get(`verify_token:${token}`);

    if (!userId) {
      throw new ApiError(400, 'Invalid or expired verification token');
    }

    // Update user
    await this.prisma.user.update({
      where: { id: userId },
      data: { isEmailVerified: true },
    });

    // Delete verification token
    await this.cacheService.delete(`verify_token:${token}`);
  }

  // ============================================
  // 8. RESEND VERIFICATION EMAIL
  // ============================================
  async resendVerificationEmail(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    if (user.isEmailVerified) {
      throw new ApiError(400, 'Email already verified');
    }

    await this.sendVerificationEmail(user.id, user.email);
  }

  // ============================================
  // 9. CHANGE PASSWORD
  // ============================================
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.passwordHash
    );

    if (!isPasswordValid) {
      throw new ApiError(401, 'Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hashedPassword },
    });
  }

  // ============================================
  // 10. GET PROFILE
  // ============================================
  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        agent: {
          include: {
            reviews: {
              select: {
                rating: true,
                comment: true,
                createdAt: true,
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
        },
        properties: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            price: true,
            propertyType: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Don't return password hash
    const { passwordHash, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  // ============================================
  // 11. UPDATE PROFILE
  // ============================================
  async updateProfile(userId: string, data: {
    name?: string;
    phone?: string;
    languagePref?: 'ENGLISH' | 'NEPALI';
    avatarUrl?: string;
  }) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        languagePref: true,
        avatarUrl: true,
        role: true,
        isVerified: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  // ============================================
  // 12. DELETE ACCOUNT (Soft Delete)
  // ============================================
  async deleteAccount(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        isActive: false,
      },
    });

    // Delete refresh tokens
    await this.cacheService.delete(`refresh_token:${userId}`);
  }

  // ============================================
  // 13. GET USER BY ID (Internal)
  // ============================================
  async getUserById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isVerified: true,
        isEmailVerified: true,
        isActive: true,
        avatarUrl: true,
        languagePref: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    return user;
  }

  // ============================================
  // PRIVATE METHODS
  // ============================================

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

  private async sendVerificationEmail(userId: string, email: string): Promise<void> {
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Store verification token in Redis
    await this.cacheService.set(
      `verify_token:${verificationToken}`,
      userId,
      7 * 24 * 60 * 60 // 7 days
    );

    await this.emailService.sendVerificationEmail(email, verificationToken);
  }
}