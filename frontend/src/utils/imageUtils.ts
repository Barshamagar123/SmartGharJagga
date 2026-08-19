// src/utils/imageUtils.ts

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';
const BASE_URL = API_URL.replace('/api/v1', '');

console.log('🔗 BASE_URL:', BASE_URL);

/**
 * Get the full URL for an image
 * Handles various path formats and removes double slashes
 */
export const getImageUrl = (path: string | undefined | null): string => {
  console.log('🖼️ getImageUrl called with path:', path);
  
  // ✅ Handle null/undefined
  if (!path) {
    console.log('❌ No path provided, using placeholder');
    return '/placeholder-property.jpg';
  }
  
  // ✅ If it's already a full URL, return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    console.log('✅ Path is already a full URL:', path);
    return path;
  }
  
  // ✅ Remove leading slash to avoid double slashes
  let cleanPath = path;
  
  // Remove leading slash if present
  if (cleanPath.startsWith('/')) {
    cleanPath = cleanPath.substring(1);
  }
  
  // ✅ Handle different path formats
  let url: string;
  
  // If it's a full uploads path (starts with uploads/)
  if (cleanPath.startsWith('uploads/')) {
    url = `${BASE_URL}/${cleanPath}`;
  }
  // If it's just a filename
  else if (!cleanPath.includes('/')) {
    url = `${BASE_URL}/uploads/properties/images/${cleanPath}`;
  }
  // Default: just join with BASE_URL
  else {
    url = `${BASE_URL}/${cleanPath}`;
  }
  
  console.log('✅ Generated URL:', url);
  return url;
};

/**
 * Get the full URL for a video
 */
export const getVideoUrl = (path: string | undefined | null): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  
  let cleanPath = path.startsWith('/') ? path.substring(1) : path;
  
  if (cleanPath.startsWith('uploads/')) {
    return `${BASE_URL}/${cleanPath}`;
  }
  
  return `${BASE_URL}/uploads/properties/videos/${cleanPath}`;
};

/**
 * Get the full URL for an avatar
 */
export const getAvatarUrl = (path: string | undefined | null): string => {
  if (!path) return '/default-avatar.png';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  
  let cleanPath = path.startsWith('/') ? path.substring(1) : path;
  
  if (cleanPath.startsWith('uploads/')) {
    return `${BASE_URL}/${cleanPath}`;
  }
  
  return `${BASE_URL}/uploads/profiles/${cleanPath}`;
};

/**
 * Check if an image URL is valid
 */
export const isValidImageUrl = (url: string): boolean => {
  if (!url) return false;
  if (url === '/placeholder-property.jpg') return true;
  if (url.startsWith('http://') || url.startsWith('https://')) return true;
  return false;
};

/**
 * Get a fallback image URL
 */
export const getFallbackImageUrl = (): string => {
  return '/placeholder-property.jpg';
};

/**
 * Process an array of image paths
 */
export const processImagePaths = (paths: string[] | undefined | null): string[] => {
  if (!paths || !Array.isArray(paths)) return [];
  return paths.map(path => getImageUrl(path)).filter(url => url !== '/placeholder-property.jpg');
};

/**
 * Get the main image from a property
 */
export const getMainImage = (
  mainImage: string | undefined | null,
  images: string[] | undefined | null
): string => {
  if (mainImage) {
    return getImageUrl(mainImage);
  }
  if (images && images.length > 0) {
    return getImageUrl(images[0]);
  }
  return '/placeholder-property.jpg';
};