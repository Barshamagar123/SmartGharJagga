// src/modules/admin/admin.controller.ts

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '@/utils/asyncHandler';
import { ApiResponse } from '@/utils/apiResponse';
import { ApiError } from '@/utils/apiError';

export class AdminController {
  constructor(private prisma: PrismaClient) {}

  /**
   * Get all users with filters
   */
  getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const { 
      page = 1, 
      limit = 10, 
      role, 
      search, 
      isVerified,
      isActive 
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    // Build where clause
    const where: any = {};
    if (role) where.role = role;
    if (isVerified !== undefined) where.isEmailVerified = isVerified === 'true';
    if (isActive !== undefined) where.isActive = isActive === 'true';
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          phone: true,
          isEmailVerified: true,
          isActive: true,
          avatarUrl: true,
          googleId: true,
          lastLogin: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              properties: true,
            },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    ApiResponse.success(res, 200, 'Users fetched successfully', {
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  });

  /**
   * Get single user by ID
   */
  getUserById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    // ✅ Fix: Ensure id is a string
    const userId = Array.isArray(id) ? id[0] : id;

    if (!userId) {
      throw new ApiError(400, 'User ID is required');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        properties: {
          select: {
            id: true,
            title: true,
            price: true,
            status: true,
            propertyType: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            properties: true,
          },
        },
      },
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const { passwordHash, ...userWithoutPassword } = user;
    ApiResponse.success(res, 200, 'User fetched successfully', userWithoutPassword);
  });

  /**
   * Update user role
   */
  updateUserRole = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { role } = req.body;

    // ✅ Fix: Ensure id is a string
    const userId = Array.isArray(id) ? id[0] : id;

    if (!userId) {
      throw new ApiError(400, 'User ID is required');
    }

    if (!role || !['BUYER', 'SELLER', 'ADMIN'].includes(role)) {
      throw new ApiError(400, 'Invalid role. Must be BUYER, SELLER, or ADMIN');
    }

    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new ApiError(404, 'User not found');
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        updatedAt: true,
      },
    });

    ApiResponse.success(res, 200, 'User role updated successfully', user);
  });

  /**
   * Update user status (activate/deactivate)
   */
  updateUserStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { isActive } = req.body;

    // ✅ Fix: Ensure id is a string
    const userId = Array.isArray(id) ? id[0] : id;

    if (!userId) {
      throw new ApiError(400, 'User ID is required');
    }

    if (typeof isActive !== 'boolean') {
      throw new ApiError(400, 'isActive must be a boolean');
    }

    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new ApiError(404, 'User not found');
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { isActive },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        updatedAt: true,
      },
    });

    ApiResponse.success(
      res, 
      200, 
      `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user
    );
  });

  /**
   * Delete user (hard delete)
   */
  deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    // ✅ Fix: Ensure id is a string
    const userId = Array.isArray(id) ? id[0] : id;

    if (!userId) {
      throw new ApiError(400, 'User ID is required');
    }

    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Prevent deleting yourself
    if (req.user?.id === userId) {
      throw new ApiError(403, 'You cannot delete your own account');
    }

    // Delete user
    await this.prisma.user.delete({
      where: { id: userId },
    });

    ApiResponse.success(res, 200, 'User deleted successfully');
  });

  /**
   * Get user statistics
   */
  getUserStats = asyncHandler(async (req: Request, res: Response) => {
    const [totalUsers, roleStats, verificationStats, activeStats] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.groupBy({
        by: ['role'],
        _count: { role: true },
      }),
      this.prisma.user.groupBy({
        by: ['isEmailVerified'],
        _count: { isEmailVerified: true },
      }),
      this.prisma.user.groupBy({
        by: ['isActive'],
        _count: { isActive: true },
      }),
    ]);

    const newUsers = await this.prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    ApiResponse.success(res, 200, 'User statistics fetched successfully', {
      totalUsers,
      newUsersLast30Days: newUsers,
      roleDistribution: roleStats,
      verificationStats: verificationStats,
      activeStats: activeStats,
    });
  });

  /**
   * Bulk update users
   */
  bulkUpdateUsers = asyncHandler(async (req: Request, res: Response) => {
    const { userIds, updates } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      throw new ApiError(400, 'userIds array is required');
    }

    if (!updates || typeof updates !== 'object') {
      throw new ApiError(400, 'updates object is required');
    }

    // Remove sensitive fields
    delete updates.passwordHash;
    delete updates.id;

    const result = await this.prisma.user.updateMany({
      where: {
        id: { in: userIds },
      },
      data: updates,
    });

    ApiResponse.success(res, 200, 'Users updated successfully', {
      updatedCount: result.count,
    });
  });

  /**
   * Get users by role
   */
  getUsersByRole = asyncHandler(async (req: Request, res: Response) => {
    const { role } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // ✅ Fix: Ensure role is a string
    const userRole = Array.isArray(role) ? role[0] : role;

    if (!userRole || !['BUYER', 'SELLER', 'ADMIN'].includes(userRole)) {
      throw new ApiError(400, 'Invalid role. Must be BUYER, SELLER, or ADMIN');
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where: { role: userRole as any },
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          phone: true,
          isEmailVerified: true,
          isActive: true,
          avatarUrl: true,
          createdAt: true,
        },
      }),
      this.prisma.user.count({
        where: { role: userRole as any },
      }),
    ]);

    ApiResponse.success(res, 200, 'Users fetched successfully', {
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  });

  /**
   * Search users
   */
  searchUsers = asyncHandler(async (req: Request, res: Response) => {
    const { query, page = 1, limit = 10 } = req.query;

    const searchQuery = Array.isArray(query) ? query[0] : query;

    if (!searchQuery || typeof searchQuery !== 'string') {
      throw new ApiError(400, 'Search query is required');
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: searchQuery, mode: 'insensitive' } },
            { email: { contains: searchQuery, mode: 'insensitive' } },
            { phone: { contains: searchQuery, mode: 'insensitive' } },
          ],
        },
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          phone: true,
          isEmailVerified: true,
          isActive: true,
          avatarUrl: true,
          createdAt: true,
        },
      }),
      this.prisma.user.count({
        where: {
          OR: [
            { name: { contains: searchQuery, mode: 'insensitive' } },
            { email: { contains: searchQuery, mode: 'insensitive' } },
            { phone: { contains: searchQuery, mode: 'insensitive' } },
          ],
        },
      }),
    ]);

    ApiResponse.success(res, 200, 'Users fetched successfully', {
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  });
}