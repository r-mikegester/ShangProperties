import React, { useState } from "react";

interface SkeletonImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
  style?: React.CSSProperties;
}

const SkeletonImage: React.FC<SkeletonImageProps> = ({ className = '', style = {}, ...props }) => {
  const [loading, setLoading] = useState(true);
  return (
    <div className="relative w-full h-full min-h-[140px]">
      {loading && (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse z-10" />
      )}
      <img
        {...props}
        className={`${className.replace('absolute', '')} transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
        style={style}
        onLoad={() => setLoading(false)}
      />
    </div>
  );
};

export default SkeletonImage;
