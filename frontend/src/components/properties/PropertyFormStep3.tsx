// src/components/property/PropertyFormStep3.tsx

import React, { useRef } from 'react';
import { Upload, X, ImageIcon, Video, FolderOpen, CheckCircle } from 'lucide-react';

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
        <img src={file} alt={`${type} ${index}`} className="w-full h-32 object-cover rounded-xl border border-gray-200" />
      ) : (
        <div className="w-full h-32 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center group-hover:border-[#2D5A27] transition-colors duration-200">
          {type === 'images' ? (
            <ImageIcon className="w-10 h-10 text-gray-400" />
          ) : (
            <Video className="w-10 h-10 text-gray-400" />
          )}
          <span className="text-xs text-gray-400 mt-2 px-2 truncate max-w-full">{file.name}</span>
          <span className="text-[10px] text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
        </div>
      )}
      <button
        type="button"
        onClick={() => removeFile(index, type)}
        className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-lg transition-all duration-200 hover:scale-110"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FolderOpen className="w-6 h-6 text-[#2D5A27]" />
          Images & Media
        </h3>
        <p className="text-sm text-gray-500 mt-1">Upload photos and videos of your property</p>
      </div>

      {/* Images */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-medium text-gray-700">
            Property Images
            <span className="text-xs text-gray-400 ml-2">(Max 10, JPG/PNG)</span>
          </label>
          <span className="text-sm text-gray-500">{images.length}/10</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img: any, i: number) => renderFile(img, i, 'images'))}
          {images.length < 10 && (
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:border-[#2D5A27] hover:bg-[#EDF5EC] transition-all duration-200 group"
            >
              <Upload className="w-8 h-8 text-gray-400 group-hover:text-[#2D5A27] transition-colors" />
              <span className="text-sm text-gray-400 group-hover:text-[#2D5A27] mt-2 transition-colors">
                Upload Image
              </span>
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
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-medium text-gray-700">
            Property Videos
            <span className="text-xs text-gray-400 ml-2">(Optional, Max 3, MP4)</span>
          </label>
          <span className="text-sm text-gray-500">{videos.length}/3</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {videos.map((video: any, i: number) => renderFile(video, i, 'videos'))}
          {videos.length < 3 && (
            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:border-[#2D5A27] hover:bg-[#EDF5EC] transition-all duration-200 group"
            >
              <Upload className="w-8 h-8 text-gray-400 group-hover:text-[#2D5A27] transition-colors" />
              <span className="text-sm text-gray-400 group-hover:text-[#2D5A27] mt-2 transition-colors">
                Upload Video
              </span>
            </button>
          )}
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

      {/* Tips */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
        <p className="text-sm text-blue-700 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          Tips: Upload clear, well-lit images. First image will be the cover photo.
        </p>
      </div>
    </div>
  );
};

export default PropertyFormStep3;