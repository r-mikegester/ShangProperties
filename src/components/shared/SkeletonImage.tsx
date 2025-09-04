import React, { useState, useCallback } from 'react';

interface SkeletonImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  size?: { width: number; height?: number };
}

const SkeletonImage: React.FC<SkeletonImageProps> = ({ 
  className = '', 
  style = {}, 
  size,
  src,
  ...props 
}) => {
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Validate if src is a valid URL
  const isValidUrl = useCallback((url: string) => {
    try {
      if (!url || typeof url !== 'string') return false;
      
      // Check if it's a data URL
      if (url.startsWith('data:')) return true;
      
      // Check if it's a blob URL
      if (url.startsWith('blob:')) return true;
      
      // Check if it's a relative URL
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        // If it's a relative path, consider it valid for now
        return true;
      }
      
      // For absolute URLs, try to parse with URL constructor
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  }, []);
  
  // Generate optimized image URL with appropriate sizing
  const getOptimizedImageUrl = useCallback(() => {
    if (!src || !size || !isValidUrl(src)) return src;
    
    try {
      // For Vercel Blob URLs, add query parameters for optimization
      const url = new URL(src);
      url.searchParams.set('w', size.width.toString());
      if (size.height) {
        url.searchParams.set('h', size.height.toString());
      }
      // Set quality to 80 for good balance between quality and file size
      url.searchParams.set('q', '80');
      // Ensure we're using WebP format
      url.searchParams.set('f', 'webp');
      
      return url.toString();
    } catch (error) {
      // If URL construction fails, return the original src
      console.warn('Invalid URL provided to SkeletonImage:', src);
      return src;
    }
  }, [src, size, isValidUrl]);
  
  const optimizedSrc = size ? getOptimizedImageUrl() : src;

  const handleLoad = useCallback(() => {
    setLoading(false);
  }, []);

  const handleError = useCallback(() => {
    setLoading(false);
    setHasError(true);
  }, []);

  // Show fallback UI if there's an error or invalid src
  if (hasError || !src || src.trim() === '' || !isValidUrl(src)) {
    return (
      <div 
        className={`bg-gray-200 border-2 border-dashed border-gray-300 rounded flex items-center justify-center ${className}`} 
        style={style}
      >
        <svg 
          className="w-8 h-8 text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 w-full h-22 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse z-10" />
      )}
      <img
        {...props}
        src={optimizedSrc}
        className={`${className.replace('absolute', '')} transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
        style={style}
        onLoad={handleLoad}
        onError={handleError}
        alt=""
      />
    </div>
  );
};

export default SkeletonImage;