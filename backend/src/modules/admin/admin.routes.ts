// src/modules/admin/admin.routes.ts

import { Router } from 'express';
import { AdminController } from './admin.controller';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '@/middleware/auth.middleware';
import { requireAdmin } from '@/middleware/admin.middleware';
import { validate } from '@/middleware/validation.middleware';
import { z } from 'zod';

const prisma = new PrismaClient();
const adminController = new AdminController(prisma);

const router = Router();

// All admin routes require authentication and admin role
router.use(authMiddleware);
router.use(requireAdmin);

// Validation schemas
const updateRoleSchema = z.object({
  body: z.object({
    role: z.enum(['BUYER', 'SELLER', 'ADMIN']),
  }),
});

const updateStatusSchema = z.object({
  body: z.object({
    isActive: z.boolean(),
  }),
});

const bulkUpdateSchema = z.object({
  body: z.object({
    userIds: z.array(z.string()),
    updates: z.object({
      role: z.enum(['BUYER', 'SELLER', 'ADMIN']).optional(),
      isActive: z.boolean().optional(),
      isEmailVerified: z.boolean().optional(),
    }),
  }),
});

/**
 * User Management Routes
 */
router.get('/users', adminController.getAllUsers);
router.get('/users/stats', adminController.getUserStats);
router.get('/users/search', adminController.searchUsers);
router.get('/users/role/:role', adminController.getUsersByRole);
router.get('/users/:id', adminController.getUserById);

router.put(
  '/users/:id/role',
  validate(updateRoleSchema),
  adminController.updateUserRole
);

router.put(
  '/users/:id/status',
  validate(updateStatusSchema),
  adminController.updateUserStatus
);

router.delete('/users/:id', adminController.deleteUser);

router.post(
  '/users/bulk',
  validate(bulkUpdateSchema),
  adminController.bulkUpdateUsers
);

export default router;