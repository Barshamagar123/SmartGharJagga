// src/modules/auth/auth.controller.ts

import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { GoogleAuthService } from './google-auth.service';
import { asyncHandler } from '@/utils/asyncHandler';
import { ApiResponse } from '@/utils/apiResponse';
import { ApiError } from '@/utils/apiError';
import { config } from '@/config';

export class AuthController {
  constructor(
    private authService: AuthService,
    private googleAuthService: GoogleAuthService
  ) {}

  // ============================================
  // AUTHENTICATION METHODS
  // ============================================

  /**
   * Register a new user
   */
  register = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.authService.register(req.body);
    ApiResponse.success(res, 201, 'User registered successfully', result);
  });

  /**
   * Login user
   */
  login = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.authService.login(req.body);
    ApiResponse.success(res, 200, 'Login successful', result);
  });

  /**
   * Logout user
   */
  logout = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const accessToken = req.headers.authorization?.split(' ')[1];
    
    if (!userId) throw new ApiError(401, 'Authentication required');
    if (accessToken) {
      await this.authService.logout(userId, accessToken);
    }
    
    ApiResponse.success(res, 200, 'Logout successful');
  });

  /**
   * Refresh access token
   */
  refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const result = await this.authService.refreshToken(refreshToken);
    ApiResponse.success(res, 200, 'Token refreshed successfully', result);
  });

  // ============================================
  // PASSWORD MANAGEMENT
  // ============================================

  /**
   * Forgot password - send reset email
   */
  forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    await this.authService.forgotPassword(email);
    ApiResponse.success(res, 200, 'Password reset email sent');
  });

  /**
   * Reset password with token
   */
  resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;
    await this.authService.resetPassword(token, newPassword);
    ApiResponse.success(res, 200, 'Password reset successfully');
  });

  /**
   * Change password (authenticated)
   */
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

  /**
   * Verify email with token
   */
  verifyEmail = asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.query;
    await this.authService.verifyEmail(token as string);
    ApiResponse.success(res, 200, 'Email verified successfully');
  });

  /**
   * Resend verification email
   */
  resendVerification = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    await this.authService.resendVerificationEmail(email);
    ApiResponse.success(res, 200, 'Verification email sent');
  });

  // ============================================
  // PROFILE MANAGEMENT
  // ============================================

  /**
   * Get user profile
   */
  getProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new ApiError(401, 'Authentication required');
    const user = await this.authService.getProfile(userId);
    ApiResponse.success(res, 200, 'Profile fetched successfully', user);
  });

  /**
   * Update user profile
   */
  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new ApiError(401, 'Authentication required');
    const user = await this.authService.updateProfile(userId, req.body);
    ApiResponse.success(res, 200, 'Profile updated successfully', user);
  });

  /**
   * Delete/Deactivate account
   */
  deleteAccount = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new ApiError(401, 'Authentication required');
    await this.authService.deleteAccount(userId);
    ApiResponse.success(res, 200, 'Account deactivated successfully');
  });

  // ============================================
  // GOOGLE OAUTH METHODS
  // ============================================

  /**
   * Google OAuth Callback Handler
   * Handles the callback from Google after authentication
   * Redirects to frontend with tokens
   */
  googleAuthCallback = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user as any;
    
    if (!user) {
      console.error('Google auth failed: No user found in request');
      return res.redirect(`${config.FRONTEND_URL}/login?error=google_auth_failed`);
    }

    try {
      // Process Google user and generate tokens
      const result = await this.googleAuthService.handleGoogleCallback(user);

      // Redirect to frontend with tokens as query params
      const redirectUrl = `${config.FRONTEND_URL}/auth/callback?` +
        `accessToken=${encodeURIComponent(result.accessToken)}&` +
        `refreshToken=${encodeURIComponent(result.refreshToken)}&` +
        `user=${encodeURIComponent(JSON.stringify(result.user))}`;

      console.log('Google auth successful, redirecting to frontend');
      return res.redirect(redirectUrl);
    } catch (error) {
      console.error('Google auth callback error:', error);
      return res.redirect(`${config.FRONTEND_URL}/login?error=google_auth_failed`);
    }
  });

  /**
   * Get Google OAuth URL
   * Returns the URL to initiate Google OAuth (optional helper)
   */
  getGoogleAuthUrl = asyncHandler(async (req: Request, res: Response) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const authUrl = `${baseUrl}/api/v1/auth/google`;
    
    ApiResponse.success(res, 200, 'Google auth URL', { url: authUrl });
  });

  /**
   * Check if user is authenticated with Google
   * Returns user info if authenticated
   */
  checkGoogleAuth = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new ApiError(401, 'Authentication required');
    
    const user = await this.authService.getProfile(userId);
    
    // Check if user signed up with Google
    const isGoogleUser = user.googleId ? true : false;
    
    ApiResponse.success(res, 200, 'Google auth status', {
      isGoogleUser,
      user,
    });
  });
}