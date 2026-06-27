// src/app.ts

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { config } from '@/config';
import { router } from '@/router';  // ✅ Make sure this import is correct
import { errorHandler, notFoundHandler } from '@/middleware/error.middleware';

const app: Application = express();

// ============================================
// SECURITY & UTILITY MIDDLEWARE
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
// BODY PARSERS (MUST be before routes!)
// ============================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// API ROUTES
// ============================================
app.use('/api/v1', router);  // ✅ This mounts router at /api/v1

// ============================================
// ROOT ROUTE (optional)
// ============================================
app.get('/', (_req, res) => {
  res.status(200).json({
    name: 'Smart GharJagga API',
    version: '1.0.0',
    status: 'running',
  });
});

// ============================================
// HEALTH CHECK (at root level)
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
// ERROR HANDLING
// ============================================
app.use(notFoundHandler);
app.use(errorHandler);

export default app;