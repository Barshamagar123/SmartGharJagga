import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { config } from '@/config';
import { router } from '@/router';
import { errorHandler, notFoundHandler } from '@/middleware/error.middleware';

const app: Application = express();

// ============================================
// SECURITY MIDDLEWARES
// ============================================
app.use(helmet());
app.use(cors({ origin: config.CORS_ORIGIN }));
app.use(compression());

// ============================================
// LOGGING
// ============================================
if (config.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ============================================
// RATE LIMITING
// ============================================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.',
});
app.use(limiter);

// ============================================
// BODY PARSERS
// ============================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// HEALTH CHECK
// ============================================
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.NODE_ENV,
  });
});

// ============================================
// API ROUTES
// ============================================
app.use('/api/v1', router);

// ============================================
// ERROR HANDLING
// ============================================
app.use(notFoundHandler);
app.use(errorHandler);

export default app;