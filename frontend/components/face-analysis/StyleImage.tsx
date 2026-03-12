'use client';

import { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { fallbackStyleImages } from '@/styles/hairstyles';

interface StyleImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackText?: string;
}

export default function StyleImage({ src, alt, className = '', fallbackText = 'Style Image' }: StyleImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  // Get fallback SVG based on style ID
  const getFallbackImage = () => {
    const styleId = src.split('/').pop()?.split('.')[0] || '';
    return fallbackStyleImages[styleId as keyof typeof fallbackStyleImages] || fallbackStyleImages['hair_classic_professional'];
  };

  if (imageError) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <img 
          src={getFallbackImage()} 
          alt={alt}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
    </div>
  );
}
