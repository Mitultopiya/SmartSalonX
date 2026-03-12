'use client';

import { useRef, useState } from 'react';
import { Upload, X, Camera } from 'lucide-react';

interface ImageUploadProps {
  onUpload: (imageData: string, view: 'front' | 'left' | 'right') => void;
  currentView: 'front' | 'left' | 'right';
  onViewChange: (view: 'front' | 'left' | 'right') => void;
  capturedImages: Record<string, string>;
}

export default function ImageUpload({ onUpload, currentView, onViewChange, capturedImages }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        onUpload(imageData, currentView);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeImage = (view: 'front' | 'left' | 'right') => {
    // This would be handled by parent component
    console.log('Remove image for view:', view);
  };

  const getViewInstructions = () => {
    switch (currentView) {
      case 'front':
        return 'Upload a clear front-facing photo';
      case 'left':
        return 'Upload your left side profile photo';
      case 'right':
        return 'Upload your right side profile photo';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Image Upload - {currentView.charAt(0).toUpperCase() + currentView.slice(1)} View
        </h3>
        <p className="text-gray-600 text-sm">{getViewInstructions()}</p>
      </div>

      <div className="mb-6">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {capturedImages[currentView] ? (
            <div className="relative">
              <img
                src={capturedImages[currentView]}
                alt={`${currentView} view`}
                className="max-w-full h-64 mx-auto object-contain rounded-lg"
              />
              <button
                onClick={() => removeImage(currentView)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-2">
                Drag and drop an image here, or click to select
              </p>
              <p className="text-gray-500 text-sm">
                Supports JPG, PNG, WebP (Max 10MB)
              </p>
            </>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      <div className="flex gap-3 justify-center">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Upload className="w-5 h-5" />
          Choose Image
        </button>

        {capturedImages[currentView] && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Camera className="w-5 h-5" />
            Change Image
          </button>
        )}
      </div>

      <div className="mt-6">
        <div className="flex justify-center gap-2 mb-4">
          {(['front', 'left', 'right'] as const).map((view) => (
            <button
              key={view}
              onClick={() => onViewChange(view)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === view
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {(['front', 'left', 'right'] as const).map((view) => (
            <div key={view} className="text-center">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                capturedImages[view] ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                {capturedImages[view] ? (
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                ) : (
                  <Camera className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <p className="text-xs text-gray-600 mt-1 capitalize">{view}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
