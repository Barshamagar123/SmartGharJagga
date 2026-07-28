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

router.post(
  '/register',
  validate(registerSchema),
  authController.register
);

router.post(
  '/login',
  validate(loginSchema),
  authController.login
);

router.post(
  '/refresh-token',
  validate(refreshTokenSchema),
  authController.refreshToken
);

router.post(
  '/forgot-password',
  validate(forgotPasswordSchema),
  authController.forgotPassword
);

router.post(
  '/reset-password',
  validate(resetPasswordSchema),
  authController.resetPassword
);

router.get(
  '/verify-email',
  validate(verifyEmailSchema),
  authController.verifyEmail
);

router.post(
  '/resend-verification',
  validate(forgotPasswordSchema),
  authController.resendVerification
);

// ============================================
// PROTECTED ROUTES (Auth Required)
// ============================================

router.post(
  '/logout',
  authMiddleware,
  authController.logout
);

router.post(
  '/change-password',
  authMiddleware,
  validate(changePasswordSchema),
  authController.changePassword
);

router.get(
  '/profile',
  authMiddleware,
  authController.getProfile
);

router.put(
  '/profile',
  authMiddleware,
  validate(updateProfileSchema),
  authController.updateProfile
);

router.delete(
  '/account',
  authMiddleware,
  authController.deleteAccount
);

export default router;