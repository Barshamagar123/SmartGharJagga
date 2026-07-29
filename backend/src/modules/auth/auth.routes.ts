// src/modules/auth/auth.routes.ts

import { Router } from 'express';
import passport from 'passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleAuthService } from './google-auth.service';
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
import { config } from '@/config';

// ============================================
// INITIALIZE DEPENDENCIES
// ============================================

const prisma = new PrismaClient();
const emailService = new EmailService();
const cacheService = new CacheService();
const authService = new AuthService(prisma, emailService, cacheService);
const googleAuthService = new GoogleAuthService(prisma, cacheService);

// ✅ Pass prisma to controller
const authController = new AuthController(authService, googleAuthService, prisma);

const router = Router();

// ============================================
// PUBLIC ROUTES (No Auth Required)
// ============================================

/**
 * Register a new user
 */
router.post(
  '/register',
  validate(registerSchema),
  authController.register
);

/**
 * Login user
 */
router.post(
  '/login',
  validate(loginSchema),
  authController.login
);

/**
 * Refresh access token
 */
router.post(
  '/refresh-token',
  validate(refreshTokenSchema),
  authController.refreshToken
);

/**
 * Forgot password - send reset email
 */
router.post(
  '/forgot-password',
  validate(forgotPasswordSchema),
  authController.forgotPassword
);

/**
 * Reset password with token
 */
router.post(
  '/reset-password',
  validate(resetPasswordSchema),
  authController.resetPassword
);

/**
 * Verify email with token
 */
router.get(
  '/verify-email',
  validate(verifyEmailSchema),
  authController.verifyEmail
);

/**
 * Resend verification email
 */
router.post(
  '/resend-verification',
  validate(forgotPasswordSchema),
  authController.resendVerification
);

// ============================================
// GOOGLE OAUTH ROUTES
// ============================================

/**
 * Initiate Google OAuth
 * Redirects user to Google login page
 */
router.get(
  '/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false 
  })
);

/**
 * Google OAuth Callback
 * Handles the callback from Google
 */
router.get(
  '/google/callback',
  passport.authenticate('google', { 
    session: false,
    failureRedirect: `${config.FRONTEND_URL}/login?error=google_auth_failed`
  }),
  authController.googleAuthCallback
);

/**
 * Get Google OAuth URL (optional helper)
 */
router.get(
  '/google/url',
  authController.getGoogleAuthUrl
);

/**
 * Check Google auth status (authenticated)
 */
router.get(
  '/google/status',
  authMiddleware,
  authController.checkGoogleAuth
);

// ============================================
// ✅ ROLE MANAGEMENT ROUTES (NEW)
// ============================================

/**
 * Update user role
 * Allows users to switch between BUYER, SELLER, ADMIN
 */
router.put(
  '/update-role',
  authMiddleware,
  authController.updateRole
);

/**
 * Get current user role
 */
router.get(
  '/role',
  authMiddleware,
  authController.getRole
);

// ============================================
// PROTECTED ROUTES (Auth Required)
// ============================================

/**
 * Logout user
 */
router.post(
  '/logout',
  authMiddleware,
  authController.logout
);

/**
 * Change password
 */
router.post(
  '/change-password',
  authMiddleware,
  validate(changePasswordSchema),
  authController.changePassword
);

/**
 * Get user profile
 */
router.get(
  '/profile',
  authMiddleware,
  authController.getProfile
);

/**
 * Update user profile
 */
router.put(
  '/profile',
  authMiddleware,
  validate(updateProfileSchema),
  authController.updateProfile
);

/**
 * Delete/Deactivate account
 */
router.delete(
  '/account',
  authMiddleware,
  authController.deleteAccount
);

export default router;