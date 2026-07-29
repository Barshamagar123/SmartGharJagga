// src/app.ts

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import passport from 'passport'; // ✅ ADD THIS IMPORT

import { router } from '@/router';
import { errorHandler, notFoundHandler } from '@/middleware/error.middleware';
import { languageMiddleware } from '@/middleware/language.middleware';

// ✅ IMPORT PASSPORT CONFIG (this runs the passport setup)
import './config/passport.config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Application = express();

// ============================================
// ✅ CORS CONFIGURATION - Using process.env
// ============================================
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  process.env.FRONTEND_URL || 'http://localhost:3000',
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Authorization'],
  maxAge: 86400,
}));

// ✅ Handle preflight requests
app.options('*', cors());

// ✅ Cookie parser
app.use(cookieParser());

// ✅ Language middleware
app.use(languageMiddleware);

// ✅ Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

app.use(compression());

// ✅ Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ✅ Rate limiting
const limiter = rateLimit({
  windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW || '15') || 15) * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX || '100') || 100,
  message: 'Too many requests, please try again later.',
});
app.use(limiter);

// ✅ Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ✅ Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ============================================
// ✅ PASSPORT INITIALIZATION - ADD THIS
// ============================================
app.use(passport.initialize());

// ============================================
// ✅ API ROUTES
// ============================================
app.use('/api/v1', router);

// ============================================
// ✅ HEALTH CHECK
// ============================================
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ============================================
// ✅ ERROR HANDLING
// ============================================
app.use(notFoundHandler);
app.use(errorHandler);

export default app;