// src/components/property/PropertyFormStep3.tsx

import React, { useRef } from 'react';
import { Upload, X, ImageIcon, Video } from 'lucide-react';

interface Step3Props {
  formData: any;
  updateField: (field: string, value: any) => void;
}

const PropertyFormStep3: React.FC<Step3Props> = ({ formData, updateField }) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const images = formData.images || [];
  const videos = formData.videos || [];

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'images' | 'videos') => {
    const files = Array.from(e.target.files || []);
    const current = type === 'images' ? images : videos;
    updateField(type, [...current, ...files]);
    // allow re-selecting the same file after removing it
    e.target.value = '';
  };

  const removeFile = (index: number, type: 'images' | 'videos') => {
    const current = type === 'images' ? images : videos;
    const updated = [...current];
    updated.splice(index, 1);
    updateField(type, updated);
  };

  const renderFile = (file: any, index: number, type: 'images' | 'videos') => (
    <div key={index} className="relative group">
      {typeof file === 'string' ? (
        <img src={file} alt={`${type} ${index}`} className="w-full h-28 object-cover rounded-lg border" />
      ) : (
        <div className="w-full h-28 bg-gray-100 rounded-lg border flex flex-col items-center justify-center">
          {type === 'images' ? (
            <ImageIcon className="w-8 h-8 text-gray-400" />
          ) : (
            <Video className="w-8 h-8 text-gray-400" />
          )}
          <span className="text-xs text-gray-400 mt-1 px-1 truncate max-w-full">{file.name}</span>
        </div>
      )}
      <button
        type="button"
        onClick={() => removeFile(index, type)}
        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-md"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">📸 Images & Media</h3>
      <p className="text-sm text-gray-500">Upload photos and videos of your property</p>

      {/* Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Images <span className="text-xs text-gray-400 ml-2">(Max 10)</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img: any, i: number) => renderFile(img, i, 'images'))}
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
          onChange={(e) => handleUpload(e, 'images')}
        />
      </div>

      {/* Videos */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Videos <span className="text-xs text-gray-400 ml-2">(Optional)</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {videos.map((video: any, i: number) => renderFile(video, i, 'videos'))}
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
          onChange={(e) => handleUpload(e, 'videos')}
        />
      </div>
    </div>
  );
};

export default PropertyFormStep3;
