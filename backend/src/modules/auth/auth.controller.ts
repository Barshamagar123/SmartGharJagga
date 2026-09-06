// src/modules/auth/auth.controller.ts

import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { GoogleAuthService } from './google-auth.service';
import { asyncHandler } from '@/utils/asyncHandler';
import { ApiResponse } from '@/utils/apiResponse';
import { ApiError } from '@/utils/apiError';
import { config } from '@/config';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

export class AuthController {
  constructor(
    private authService: AuthService,
    private googleAuthService: GoogleAuthService,
    private prisma: PrismaClient
  ) {}

  // ============================================
  // AUTHENTICATION METHODS
  // ============================================

  register = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.authService.register(req.body);
    ApiResponse.success(res, 201, 'User registered successfully', result);
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.authService.login(req.body);
    ApiResponse.success(res, 200, 'Login successful', result);
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const accessToken = req.headers.authorization?.split(' ')[1];
    
    if (!userId) throw new ApiError(401, 'Authentication required');
    if (accessToken) {
      await this.authService.logout(userId, accessToken);
    }
    
    ApiResponse.success(res, 200, 'Logout successful');
  });

  refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const result = await this.authService.refreshToken(refreshToken);
    ApiResponse.success(res, 200, 'Token refreshed successfully', result);
  });

  // ============================================
  // PASSWORD MANAGEMENT
  // ============================================

  forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    await this.authService.forgotPassword(email);
    ApiResponse.success(res, 200, 'Password reset email sent');
  });

  resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;
    await this.authService.resetPassword(token, newPassword);
    ApiResponse.success(res, 200, 'Password reset successfully');
  });

  changePassword = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new ApiError(401, 'Authentication required');
    const { currentPassword, newPassword } = req.body;
    await this.authService.changePassword(userId, currentPassword, newPassword);
    ApiResponse.success(res, 200, 'Password changed successfully');
  });

  // ============================================
  // EMAIL VERIFICATION
  // ============================================

  verifyEmail = asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.query;
    await this.authService.verifyEmail(token as string);
    ApiResponse.success(res, 200, 'Email verified successfully');
  });

  resendVerification = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    await this.authService.resendVerificationEmail(email);
    ApiResponse.success(res, 200, 'Verification email sent');
  });

  // ============================================
  // PROFILE MANAGEMENT
  // ============================================

  getProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new ApiError(401, 'Authentication required');
    const user = await this.authService.getProfile(userId);
    ApiResponse.success(res, 200, 'Profile fetched successfully', user);
  });

  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new ApiError(401, 'Authentication required');
    const user = await this.authService.updateProfile(userId, req.body);
    ApiResponse.success(res, 200, 'Profile updated successfully', user);
  });

  deleteAccount = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new ApiError(401, 'Authentication required');
    await this.authService.deleteAccount(userId);
    ApiResponse.success(res, 200, 'Account deactivated successfully');
  });

  // ============================================
  // GOOGLE OAUTH METHODS
  // ============================================

  googleAuthCallback = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user as any;
    
    if (!user) {
      console.error('Google auth failed: No user found in request');
      return res.redirect(`${config.FRONTEND_URL}/login?error=google_auth_failed`);
    }

    try {
      const result = await this.googleAuthService.handleGoogleCallback(user);
      const redirectUrl = `${config.FRONTEND_URL}/auth/callback?` +
        `accessToken=${encodeURIComponent(result.accessToken)}&` +
        `refreshToken=${encodeURIComponent(result.refreshToken)}&` +
        `user=${encodeURIComponent(JSON.stringify(result.user))}&` +
        `isNewUser=${result.isNewUser || false}`;

      console.log('Google auth successful, redirecting to frontend');
      return res.redirect(redirectUrl);
    } catch (error) {
      console.error('Google auth callback error:', error);
      return res.redirect(`${config.FRONTEND_URL}/login?error=google_auth_failed`);
    }
  });

  getGoogleAuthUrl = asyncHandler(async (req: Request, res: Response) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const authUrl = `${baseUrl}/api/v1/auth/google`;
    ApiResponse.success(res, 200, 'Google auth URL', { url: authUrl });
  });

  checkGoogleAuth = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new ApiError(401, 'Authentication required');
    
    const user = await this.authService.getProfile(userId);
    ApiResponse.success(res, 200, 'Google auth status', {
      isGoogleUser: user.googleId ? true : false,
      user,
    });
  });

  // ============================================
  // ✅ ROLE MANAGEMENT (PERMANENT FIX - 10 YEARS)
  // ============================================

  /**
   * ✅ PERMANENT FIX: Update user role
   * - Validates role
   * - Updates database
   * - Generates NEW token with updated role
   * - Returns fresh user data with new token
   */
  updateRole = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new ApiError(401, 'Authentication required');
    
    const { role } = req.body;
    
    // ✅ Validate role
    const validRoles = ['BUYER', 'SELLER', 'ADMIN'];
    if (!role || !validRoles.includes(role.toUpperCase())) {
      throw new ApiError(400, `Invalid role. Must be one of: ${validRoles.join(', ')}`);
    }

    const normalizedRole = role.toUpperCase();

    // ✅ Update user role in database
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { role: normalizedRole },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isVerified: true,
        isEmailVerified: true,
        avatarUrl: true,
        phone: true,
        googleId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // ✅ Generate NEW token with updated role
    const newToken = jwt.sign(
      { 
        id: updatedUser.id, 
        email: updatedUser.email, 
        role: updatedUser.role 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // ✅ Return updated user with new token
    ApiResponse.success(res, 200, 'Role updated successfully', {
      user: updatedUser,
      token: newToken, // ✅ Send new token to frontend
    });
  });

  /**
   * ✅ Get current user role
   */
  getRole = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new ApiError(401, 'Authentication required');

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    ApiResponse.success(res, 200, 'Role fetched successfully', { 
      role: user.role,
      lastUpdated: user.updatedAt,
    });
  });

  /**
   * ✅ SYNC ROLE: Self-healing endpoint
   * Frontend calls this when role mismatch is detected
   * Returns fresh user data with correct role
   */
  syncRole = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new ApiError(401, 'Authentication required');

    // ✅ Get fresh user from database
    const freshUser = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isVerified: true,
        isEmailVerified: true,
        avatarUrl: true,
        phone: true,
        googleId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!freshUser) {
      throw new ApiError(404, 'User not found');
    }

    // ✅ Generate new token with correct role
    const newToken = jwt.sign(
      { 
        id: freshUser.id, 
        email: freshUser.email, 
        role: freshUser.role 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    ApiResponse.success(res, 200, 'Role synced successfully', {
      user: freshUser,
      token: newToken,
    });
  });
}