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
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ApiError(409, 'Email already registered');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash: hashedPassword,
        name: data.name,
        phone: data.phone,
        role: data.role || 'BUYER',
      },
    });

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

    await this.cacheService.set(
      `refresh_token:${user.id}`,
      refreshToken,
      7 * 24 * 60 * 60
    );

    this.sendVerificationEmail(user.id, user.email).catch(() => {
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
  // 2. LOGIN - ✅ PERMANENT ADMIN FIX
  // ============================================
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    let user = await this.prisma.user.findUnique({
      where: { email: credentials.email },
    });

    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // ✅ Check if user registered with Google
    if (user.googleId && !user.passwordHash) {
      throw new ApiError(401, 'This account uses Google Sign-In. Please use "Sign in with Google" instead.');
    }

    if (!user.isActive) {
      throw new ApiError(403, 'Account is deactivated. Please contact support.');
    }

    // For normal users with password
    if (user.passwordHash) {
      const isPasswordValid = await bcrypt.compare(
        credentials.password,
        user.passwordHash
      );

      if (!isPasswordValid) {
        throw new ApiError(401, 'Invalid email or password');
      }
    } else {
      throw new ApiError(401, 'Invalid credentials');
    }

    // ✅✅✅ PERMANENT FIX: Auto set ADMIN role for admin email ✅✅✅
    const ADMIN_EMAILS = [
      'admin@smartgharjagga.com',
      'admin@gmail.com',
      'superadmin@gmail.com',
    ];

    if (ADMIN_EMAILS.includes(credentials.email.toLowerCase()) && user.role !== 'ADMIN') {
      // ✅ Force update to ADMIN
      user = await this.prisma.user.update({
        where: { email: credentials.email },
        data: { 
          role: 'ADMIN',
          isVerified: true,
          isEmailVerified: true,
          isActive: true,
        },
      });
      console.log(`🔧 Auto-fixed admin role for: ${credentials.email}`);
    }

    // ✅ Last login update
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // ✅ Generate token with role from DATABASE (always correct)
    const accessToken = this.generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role, // ✅ ALWAYS FROM DATABASE
    });
    
    const refreshToken = this.generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role, // ✅ ALWAYS FROM DATABASE
    });

    await this.cacheService.set(
      `refresh_token:${user.id}`,
      refreshToken,
      7 * 24 * 60 * 60
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role, // ✅ ALWAYS CORRECT
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

    const storedToken = await this.cacheService.get(
      `refresh_token:${decoded.userId}`
    );

    if (storedToken !== refreshToken) {
      throw new ApiError(401, 'Invalid refresh token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || !user.isActive) {
      throw new ApiError(401, 'User not found or inactive');
    }

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
      return;
    }

    if (user.googleId && !user.passwordHash) {
      throw new ApiError(400, 'This account uses Google Sign-In. Password reset is not available. Please use "Sign in with Google".');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');

    await this.cacheService.set(
      `reset_token:${resetToken}`,
      user.id,
      60 * 60
    );

    await this.emailService.sendPasswordResetEmail(email, resetToken);
  }

  // ============================================
  // 6. RESET PASSWORD
  // ============================================
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const userId = await this.cacheService.get(`reset_token:${token}`);

    if (!userId) {
      throw new ApiError(400, 'Invalid or expired reset token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    if (user.googleId && !user.passwordHash) {
      throw new ApiError(400, 'This account uses Google Sign-In. Password reset is not available.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hashedPassword },
    });

    await this.cacheService.delete(`reset_token:${token}`);
  }

  // ============================================
  // 7. VERIFY EMAIL
  // ============================================
  async verifyEmail(token: string): Promise<void> {
    const userId = await this.cacheService.get(`verify_token:${token}`);

    if (!userId) {
      throw new ApiError(400, 'Invalid or expired verification token');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { isEmailVerified: true },
    });

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

    if (user.googleId && !user.passwordHash) {
      throw new ApiError(400, 'This account uses Google Sign-In. Password change is not available. Please use Google to sign in.');
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.passwordHash || ''
    );

    if (!isPasswordValid) {
      throw new ApiError(401, 'Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hashedPassword },
    });
  }

  // ============================================
  // 10. GET PROFILE - ✅ PERMANENT FIX
  // ============================================
  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
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

    // ✅ Add Google user indicator
    const { passwordHash, ...userWithoutPassword } = user;

    return {
      ...userWithoutPassword,
      isGoogleUser: user.googleId ? true : false,
    };
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
        googleId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      ...user,
      isGoogleUser: user.googleId ? true : false,
    };
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
        googleId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    return {
      ...user,
      isGoogleUser: user.googleId ? true : false,
    };
  }

  // ============================================
  // 14. LINK GOOGLE ACCOUNT
  // ============================================
  async linkGoogleAccount(
    userId: string,
    googleId: string,
    avatarUrl?: string
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const existingGoogleUser = await this.prisma.user.findUnique({
      where: { googleId },
    });

    if (existingGoogleUser && existingGoogleUser.id !== userId) {
      throw new ApiError(409, 'Google account already linked to another user');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        googleId,
        avatarUrl: avatarUrl || user.avatarUrl,
        isEmailVerified: true,
      },
    });
  }

  // ============================================
  // 15. UNLINK GOOGLE ACCOUNT
  // ============================================
  async unlinkGoogleAccount(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    if (!user.passwordHash) {
      throw new ApiError(400, 'Cannot unlink Google account. Please set a password first.');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        googleId: null,
      },
    });
  }

  // ============================================
  // 16. SET PASSWORD FOR GOOGLE USER
  // ============================================
  async setPasswordForGoogleUser(
    userId: string,
    newPassword: string
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    if (user.passwordHash) {
      throw new ApiError(400, 'User already has a password set');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: hashedPassword,
      },
    });
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

    await this.cacheService.set(
      `verify_token:${verificationToken}`,
      userId,
      7 * 24 * 60 * 60
    );

    await this.emailService.sendVerificationEmail(email, verificationToken);
  }
}