import { Router } from 'express';
import authRoutes from '@/modules/auth/auth.routes';

const router = Router();

router.use('/auth', authRoutes);

// Health check for API
router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

export { router };