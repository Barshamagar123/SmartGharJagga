// src/modules/auth/auth.controller.ts

import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { asyncHandler } from '@/utils/asyncHandler';
import { ApiResponse } from '@/utils/apiResponse';
import { ApiError } from '@/utils/apiError';

export class AuthController {
  constructor(private authService: AuthService) {}

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

  changePassword = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new ApiError(401, 'Authentication required');
    const { currentPassword, newPassword } = req.body;
    await this.authService.changePassword(userId, currentPassword, newPassword);
    ApiResponse.success(res, 200, 'Password changed successfully');
  });

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
}