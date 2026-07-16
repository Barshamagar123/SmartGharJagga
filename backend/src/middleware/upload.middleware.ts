// src/middleware/upload.middleware.ts

import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '@/utils/apiError';
import path from 'path';
import fs from 'fs';

// ============================================
// ENSURE UPLOAD DIRECTORIES EXIST
// ============================================
const ensureDirectoryExists = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Create all needed directories
const dirs = [
  'uploads/properties/images',
  'uploads/properties/videos',
  'uploads/profiles',
];
dirs.forEach(ensureDirectoryExists);

// ============================================
// FILE FILTERS
// ============================================
const imageFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/heic', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid image type. Only JPEG, PNG, JPG, WEBP, HEIC, and GIF are allowed.'));
  }
};

const videoFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/webm', 'video/avi'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid video type. Only MP4, MPEG, MOV, WEBM, and AVI are allowed.'));
  }
};

// ============================================
// STORAGE CONFIGURATION
// ============================================
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/properties/images');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'img-' + uniqueSuffix + ext);
  },
});

const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/properties/videos');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'vid-' + uniqueSuffix + ext);
  },
});

// ============================================
// MULTER INSTANCES
// ============================================
export const uploadImages = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export const uploadVideos = multer({
  storage: videoStorage,
  fileFilter: videoFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

// ============================================
// MIDDLEWARE FOR BOTH IMAGES AND VIDEOS
// ============================================
export const uploadPropertyMedia = (req: Request, res: Response, next: NextFunction) => {
  // First upload images
  uploadImages.array('images', 10)(req, res, (err: any) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new ApiError(400, 'Image too large. Maximum size is 5MB.'));
        }
        return next(new ApiError(400, err.message));
      }
      return next(new ApiError(400, err.message || 'Image upload failed'));
    }

    // Then upload videos
    uploadVideos.array('videos', 3)(req, res, (err: any) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return next(new ApiError(400, 'Video too large. Maximum size is 50MB.'));
          }
          return next(new ApiError(400, err.message));
        }
        return next(new ApiError(400, err.message || 'Video upload failed'));
      }
      next();
    });
  });
};