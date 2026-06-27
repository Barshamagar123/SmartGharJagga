// src/router.ts

import { Router } from 'express';
import authRoutes from '@/modules/auth/auth.routes';

const router = Router();

// ✅ FIX: Use '/' instead of '/health' for root of this router
// Since this is mounted at /api/v1, '/' becomes /api/v1
router.get('/', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Smart GharJagga API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Auth routes
router.use('/auth', authRoutes);

// Health check at /api/v1/health
router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
  });
});

export { router };