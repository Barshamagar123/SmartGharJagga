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

[
  'uploads/properties/images',
  'uploads/properties/videos',
  'uploads/profiles',
].forEach(ensureDirectoryExists);

// ============================================
// STORAGE
// ============================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'images') {
      cb(null, 'uploads/properties/images');
    } else if (file.fieldname === 'videos') {
      cb(null, 'uploads/properties/videos');
    } else {
      cb(new Error('Invalid upload field'), '');
    }
  },

  filename: (req, file, cb) => {
    const uniqueSuffix =
      Date.now() + '-' + Math.round(Math.random() * 1e9);

    const ext = path.extname(file.originalname);

    if (file.fieldname === 'images') {
      cb(null, `img-${uniqueSuffix}${ext}`);
    } else {
      cb(null, `vid-${uniqueSuffix}${ext}`);
    }
  },
});

// ============================================
// FILE FILTER
// ============================================
const fileFilter: multer.Options['fileFilter'] = (
  req,
  file,
  cb
) => {
  const imageTypes = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/webp',
    'image/heic',
    'image/gif',
  ];

  const videoTypes = [
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'video/webm',
    'video/x-msvideo',
  ];

  if (file.fieldname === 'images') {
    if (imageTypes.includes(file.mimetype)) {
      return cb(null, true);
    }

    return cb(
      new Error(
        'Only JPG, JPEG, PNG, WEBP, GIF and HEIC images are allowed.'
      )
    );
  }

  if (file.fieldname === 'videos') {
    if (videoTypes.includes(file.mimetype)) {
      return cb(null, true);
    }

    return cb(
      new Error(
        'Only MP4, MPEG, MOV, WEBM and AVI videos are allowed.'
      )
    );
  }

  cb(new Error('Invalid upload field.'));
};

// ============================================
// MULTER INSTANCE
// ============================================
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

// ============================================
// PROPERTY MEDIA UPLOAD
// ============================================
export const uploadPropertyMedia = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  upload.fields([
    {
      name: 'images',
      maxCount: 10,
    },
    {
      name: 'videos',
      maxCount: 3,
    },
  ])(req, res, (err) => {
    if (!err) {
      return next();
    }

    if (err instanceof multer.MulterError) {
      switch (err.code) {
        case 'LIMIT_FILE_SIZE':
          return next(
            new ApiError(
              400,
              'One or more files exceed the maximum allowed size (50MB).'
            )
          );

        case 'LIMIT_UNEXPECTED_FILE':
          return next(
            new ApiError(
              400,
              'Unexpected file field.'
            )
          );

        default:
          return next(new ApiError(400, err.message));
      }
    }

    return next(
      new ApiError(
        400,
        err instanceof Error ? err.message : 'Upload failed.'
      )
    );
  });
};