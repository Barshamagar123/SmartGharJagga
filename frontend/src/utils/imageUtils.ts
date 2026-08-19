// src/utils/imageUtils.ts

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';
const BASE_URL = API_URL.replace('/api/v1', '');

console.log('🔗 BASE_URL:', BASE_URL);

export const getImageUrl = (path: string | undefined | null): string => {
  console.log('🖼️ getImageUrl called with path:', path);
  
  if (!path) {
    console.log('❌ No path provided, using placeholder');
    return '/placeholder-property.jpg';
  }
  
  // If it's already a full URL
  if (path.startsWith('http://') || path.startsWith('https://')) {
    console.log('✅ Path is already a full URL:', path);
    return path;
  }
  
  // ✅ Check if the path already contains the full structure
  if (path.includes('uploads/properties/images')) {
    const url = `${BASE_URL}/${path}`;
    console.log('✅ Generated URL (with uploads):', url);
    return url;
  }
  
  // If it starts with /uploads/
  if (path.startsWith('/uploads/')) {
    const url = `${BASE_URL}${path}`;
    console.log('✅ Generated URL (starts with /uploads/):', url);
    return url;
  }
  
  // If it starts with uploads/
  if (path.startsWith('uploads/')) {
    const url = `${BASE_URL}/${path}`;
    console.log('✅ Generated URL (starts with uploads/):', url);
    return url;
  }
  
  // If it starts with / (but not uploads)
  if (path.startsWith('/')) {
    const url = `${BASE_URL}${path}`;
    console.log('✅ Generated URL (starts with /):', url);
    return url;
  }
  
  // Default: assume it's just the filename from your uploads
  const url = `${BASE_URL}/uploads/properties/images/${path}`;
  console.log('✅ Generated URL (default):', url);
  return url;
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