// src/middleware/upload.middleware.ts

import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '@/utils/apiError';
import path from 'path';
import fs from 'fs';

// Ensure directories exist
const ensureDirectoryExists = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

['uploads/properties/images', 'uploads/properties/videos', 'uploads/profiles'].forEach(ensureDirectoryExists);

// File filters
const imageFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Invalid image type'));
};

const videoFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/webm'];
  allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Invalid video type'));
};

// Storage
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/properties/images'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'img-' + unique + path.extname(file.originalname));
  },
});

const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/properties/videos'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'vid-' + unique + path.extname(file.originalname));
  },
});

// Multer instances
export const uploadImages = multer({ storage: imageStorage, fileFilter: imageFilter, limits: { fileSize: 5 * 1024 * 1024 } });
export const uploadVideos = multer({ storage: videoStorage, fileFilter: videoFilter, limits: { fileSize: 50 * 1024 * 1024 } });

export const uploadPropertyImages = uploadImages.array('images', 10);
export const uploadPropertyVideos = uploadVideos.array('videos', 3);

export const uploadPropertyMedia = (req: Request, res: Response, next: NextFunction) => {
  uploadPropertyImages(req, res, (err: any) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') return next(new ApiError(400, 'Image too large. Max 5MB.'));
        return next(new ApiError(400, err.message));
      }
      return next(new ApiError(400, err.message || 'Image upload failed'));
    }
    uploadPropertyVideos(req, res, (err: any) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') return next(new ApiError(400, 'Video too large. Max 50MB.'));
          return next(new ApiError(400, err.message));
        }
        return next(new ApiError(400, err.message || 'Video upload failed'));
      }
      next();
    });
  });
};

export const uploadSingleImage = uploadImages.single('image');
export const uploadSingleVideo = uploadVideos.single('video');
export const uploadProfileImage = uploadImages.single('avatar');