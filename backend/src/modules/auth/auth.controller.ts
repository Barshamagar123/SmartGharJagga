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

  // ============================================
  // 4. REFRESH TOKEN
  // ============================================
  refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const result = await this.authService.refreshToken(refreshToken);
    ApiResponse.success(res, 200, 'Token refreshed successfully', result);
  });

  // ============================================
  // 5. FORGOT PASSWORD
  // ============================================
  forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    await this.authService.forgotPassword(email);
    ApiResponse.success(res, 200, 'Password reset email sent');
  });

  // ============================================
  // 6. RESET PASSWORD
  // ============================================
  resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;
    await this.authService.resetPassword(token, newPassword);
    ApiResponse.success(res, 200, 'Password reset successfully');
  });

  // ============================================
  // 7. VERIFY EMAIL
  // ============================================
  verifyEmail = asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.query;
    await this.authService.verifyEmail(token as string);
    ApiResponse.success(res, 200, 'Email verified successfully');
  });

  // ============================================
  // 8. RESEND VERIFICATION
  // ============================================
  resendVerification = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    await this.authService.resendVerificationEmail(email);
    ApiResponse.success(res, 200, 'Verification email sent');
  });

  // ============================================
  // 9. CHANGE PASSWORD
  // ============================================
  changePassword = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new ApiError(401, 'Authentication required');
    const { currentPassword, newPassword } = req.body;
    await this.authService.changePassword(userId, currentPassword, newPassword);
    ApiResponse.success(res, 200, 'Password changed successfully');
  });

  // ============================================
  // 10. GET PROFILE
  // ============================================
  getProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new ApiError(401, 'Authentication required');
    const user = await this.authService.getProfile(userId);
    ApiResponse.success(res, 200, 'Profile fetched successfully', user);
  });

  // ============================================
  // 11. UPDATE PROFILE
  // ============================================
  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new ApiError(401, 'Authentication required');
    const user = await this.authService.updateProfile(userId, req.body);
    ApiResponse.success(res, 200, 'Profile updated successfully', user);
  });

  // ============================================
  // 12. DELETE ACCOUNT
  // ============================================
  deleteAccount = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new ApiError(401, 'Authentication required');
    await this.authService.deleteAccount(userId);
    ApiResponse.success(res, 200, 'Account deactivated successfully');
  });
}