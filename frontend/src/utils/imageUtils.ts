// src/utils/imageUtils.ts

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';
const BASE_URL = API_URL.replace('/api/v1', '');

export const getImageUrl = (path: string | undefined | null): string => {
  if (!path) return '/placeholder-property.jpg';
  
  // If it's already a full URL
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // If it starts with /uploads/
  if (path.startsWith('/uploads/')) {
    return `${BASE_URL}${path}`;
  }
  
  // If it starts with uploads/
  if (path.startsWith('uploads/')) {
    return `${BASE_URL}/${path}`;
  }
  
  // If it starts with / (but not uploads)
  if (path.startsWith('/')) {
    return `${BASE_URL}${path}`;
  }
  
  // Default: assume it's just the filename from your uploads
  return `${BASE_URL}/uploads/properties/images/${path}`;
};

// ✅ For video URLs
export const getVideoUrl = (path: string | undefined | null): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/uploads/')) return `${BASE_URL}${path}`;
  if (path.startsWith('uploads/')) return `${BASE_URL}/${path}`;
  return `${BASE_URL}/uploads/properties/videos/${path}`;
};

// ✅ Get avatar URL
export const getAvatarUrl = (path: string | undefined | null): string => {
  if (!path) return '/default-avatar.png';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/uploads/')) return `${BASE_URL}${path}`;
  if (path.startsWith('uploads/')) return `${BASE_URL}/${path}`;
  return `${BASE_URL}/uploads/profiles/${path}`;
};

// ✅ For map image markers (if you need to display property images on map)
export const getMapMarkerImage = (path: string | undefined | null): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/uploads/')) return `${BASE_URL}${path}`;
  if (path.startsWith('uploads/')) return `${BASE_URL}/${path}`;
  return `${BASE_URL}/uploads/properties/images/${path}`;
};