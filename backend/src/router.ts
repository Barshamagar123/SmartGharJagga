// src/router.ts

import { Router } from 'express';
import authRoutes from '@/modules/auth/auth.routes';
import propertyRoutes from '@/modules/property/property.routes';

const router = Router();

router.get('/', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Smart GharJagga API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/properties', propertyRoutes);

router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
  });
});

export { router };