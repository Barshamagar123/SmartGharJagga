// src/modules/auth/auth.validation.ts

import { z } from 'zod';

// ============================================
// AUTH VALIDATION SCHEMAS
// ============================================

/**
 * Register validation schema
 */
export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().optional(),
    role: z.enum(['BUYER', 'SELLER', 'ADMIN']).default('BUYER'),
  }),
});

/**
 * Login validation schema
 */
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
  }),
});

/**
 * Refresh token validation schema
 */
export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  }),
});

/**
 * Forgot password validation schema
 */
export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
  }),
});

/**
 * Reset password validation schema
 */
export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Token is required'),
    newPassword: z.string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
  }),
});

/**
 * Change password validation schema
 */
export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
  }),
});

/**
 * Verify email validation schema
 */
export const verifyEmailSchema = z.object({
  query: z.object({
    token: z.string().min(1, 'Token is required'),
  }),
});

/**
 * Update profile validation schema
 */
export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    phone: z.string().optional(),
    languagePref: z.enum(['ENGLISH', 'NEPALI']).optional(),
    avatarUrl: z.string().url('Invalid URL format').optional(),
  }),
});

// ============================================
// ✅ ROLE MANAGEMENT SCHEMAS
// ============================================

/**
 * ✅ Update role validation schema
 * Used when user switches between BUYER, SELLER, ADMIN
 */
export const updateRoleSchema = z.object({
  body: z.object({
    role: z.enum(['BUYER', 'SELLER', 'ADMIN'], {
      errorMap: () => ({ message: 'Role must be BUYER, SELLER, or ADMIN' })
    }),
  }),
});

/**
 * ✅ Sync role validation schema
 * Used for self-healing when role mismatch is detected
 */
export const syncRoleSchema = z.object({
  body: z.object({
    force: z.boolean().optional().default(false),
  }),
});

/**
 * ✅ Get role validation schema
 * Used to fetch current user role
 */
export const getRoleSchema = z.object({
  params: z.object({
    userId: z.string().uuid('Invalid user ID').optional(),
  }),
});

// ============================================
// ✅ EXTRA VALIDATION SCHEMAS (Optional)
// ============================================

/**
 * Social login validation schema
 */
export const socialLoginSchema = z.object({
  body: z.object({
    provider: z.enum(['GOOGLE', 'FACEBOOK']),
    token: z.string().min(1, 'Social token is required'),
  }),
});

/**
 * Email verification resend schema
 */
export const resendVerificationSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
  }),
});

// ============================================
// EXPORT ALL SCHEMAS
// ============================================

export default {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  verifyEmailSchema,
  updateProfileSchema,
  updateRoleSchema,
  syncRoleSchema,
  getRoleSchema,
  socialLoginSchema,
  resendVerificationSchema,
};