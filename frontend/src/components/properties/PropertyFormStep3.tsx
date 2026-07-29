// src/components/property/PropertyFormStep3.tsx

import React, { useRef } from 'react';
import { Upload, X, Image as ImageIcon, Video } from 'lucide-react';

interface PropertyFormStep3Props {
  formData: any;
  updateField: (field: string, value: any) => void;
}

const PropertyFormStep3: React.FC<PropertyFormStep3Props> = ({
  formData,
  updateField,
}) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const images = formData.images || [];
  const videos = formData.videos || [];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    // Here you would upload to Cloudinary/S3 and get URLs
    // For now, we'll just store the file objects
    const newImages = [...images, ...files];
    updateField('images', newImages);
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newVideos = [...videos, ...files];
    updateField('videos', newVideos);
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    updateField('images', newImages);
  };

  const removeVideo = (index: number) => {
    const newVideos = [...videos];
    newVideos.splice(index, 1);
    updateField('videos', newVideos);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">📸 Images & Media</h3>
      <p className="text-sm text-gray-500">Upload photos and videos of your property</p>

      {/* Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Images
          <span className="text-xs text-gray-400 ml-2">(Max 10 images)</span>
        </label>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image: any, index: number) => (
            <div key={index} className="relative group">
              {typeof image === 'string' ? (
                <img
                  src={image}
                  alt={`Property ${index + 1}`}
                  className="w-full h-28 object-cover rounded-lg border border-gray-200"
                />
              ) : (
                <div className="w-full h-28 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                  <span className="text-xs text-gray-400 block mt-1">{image.name}</span>
                </div>
              )}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          {images.length < 10 && (
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="w-full h-28 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-[#2D5A27] transition-colors"
            >
              <Upload className="w-6 h-6 text-gray-400" />
              <span className="text-xs text-gray-400 mt-1">Upload Image</span>
            </button>
          )}
        </div>

        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>

      {/* Videos */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Videos
          <span className="text-xs text-gray-400 ml-2">(Optional)</span>
        </label>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {videos.map((video: any, index: number) => (
            <div key={index} className="relative group">
              <div className="w-full h-28 bg-gray-900 rounded-lg border border-gray-200 flex items-center justify-center">
                <Video className="w-8 h-8 text-white" />
                <span className="text-xs text-gray-400 block mt-1">{video.name}</span>
              </div>
              <button
                type="button"
                onClick={() => removeVideo(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => videoInputRef.current?.click()}
            className="w-full h-28 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-[#2D5A27] transition-colors"
          >
            <Upload className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400 mt-1">Upload Video</span>
          </button>
        </div>

        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          multiple
          className="hidden"
          onChange={handleVideoUpload}
        />
      </div>
    </div>
  );
};

export default PropertyFormStep3;