// src/modules/auth/auth.routes.ts

import { Router } from 'express';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaClient } from '@prisma/client';

import { validate } from '@/middleware/validation.middleware';
import { authMiddleware } from '@/middleware/auth.middleware';
import { 
  registerSchema, 
  loginSchema, 
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  verifyEmailSchema,
  updateProfileSchema,
} from './auth.validation';

import { EmailService } from '@/services/external/email.service';
import { CacheService } from '@/services/internal/cache.service';

// Initialize dependencies
const prisma = new PrismaClient();
const emailService = new EmailService();
const cacheService = new CacheService();
const authService = new AuthService(prisma, emailService, cacheService);
const authController = new AuthController(authService);

const router = Router();

// ============================================
// PUBLIC ROUTES (No Auth Required)
// ============================================

/**
 * @route POST /api/v1/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post(
  '/register',
  validate(registerSchema),
  authController.register
);

/**
 * @route POST /api/v1/auth/login
 * @desc Login user
 * @access Public
 */
router.post(
  '/login',
  validate(loginSchema),
  authController.login
);

/**
 * @route POST /api/v1/auth/refresh-token
 * @desc Refresh access token
 * @access Public
 */
router.post(
  '/refresh-token',
  validate(refreshTokenSchema),
  authController.refreshToken
);

/**
 * @route POST /api/v1/auth/forgot-password
 * @desc Send password reset email
 * @access Public
 */
router.post(
  '/forgot-password',
  validate(forgotPasswordSchema),
  authController.forgotPassword
);

/**
 * @route POST /api/v1/auth/reset-password
 * @desc Reset password
 * @access Public
 */
router.post(
  '/reset-password',
  validate(resetPasswordSchema),
  authController.resetPassword
);

/**
 * @route GET /api/v1/auth/verify-email
 * @desc Verify email
 * @access Public
 */
router.get(
  '/verify-email',
  validate(verifyEmailSchema),
  authController.verifyEmail
);

/**
 * @route POST /api/v1/auth/resend-verification
 * @desc Resend verification email
 * @access Public
 */
router.post(
  '/resend-verification',
  validate(forgotPasswordSchema),
  authController.resendVerification
);

// ============================================
// PROTECTED ROUTES (Auth Required)
// ============================================

/**
 * @route POST /api/v1/auth/logout
 * @desc Logout user
 * @access Private
 */
router.post(
  '/logout',
  authMiddleware,
  authController.logout
);

/**
 * @route POST /api/v1/auth/change-password
 * @desc Change password
 * @access Private
 */
router.post(
  '/change-password',
  authMiddleware,
  validate(changePasswordSchema),
  authController.changePassword
);

/**
 * @route GET /api/v1/auth/profile
 * @desc Get user profile
 * @access Private
 */
router.get(
  '/profile',
  authMiddleware,
  authController.getProfile
);

/**
 * @route PUT /api/v1/auth/profile
 * @desc Update user profile
 * @access Private
 */
router.put(
  '/profile',
  authMiddleware,
  validate(updateProfileSchema),
  authController.updateProfile
);

/**
 * @route DELETE /api/v1/auth/account
 * @desc Delete/Deactivate account
 * @access Private
 */
router.delete(
  '/account',
  authMiddleware,
  authController.deleteAccount
);

export default router;