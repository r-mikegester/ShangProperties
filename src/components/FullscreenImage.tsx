import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";

interface FullscreenImageProps {
  src: string;
  alt?: string;
  caption?: React.ReactNode;
  className?: string;
  iframeSrc?: string;
  tours360?: { url: string; label: string }[];
  gallery?: string[]; // Array of image URLs for gallery mode
  initialIndex?: number; // Index of the initially selected image in gallery
}

const FullscreenImage: React.FC<FullscreenImageProps> = ({ src, alt, caption, className, iframeSrc, tours360, gallery, initialIndex }) => {
  const [open, setOpen] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const tourLinks = tours360 && tours360.length > 0
    ? tours360
    : (iframeSrc ? [{ url: iframeSrc, label: '360° View' }] : []);
  const [selectedTourLabel, setSelectedTourLabel] = useState(tourLinks[0]?.label || "");
  const selectedTourIdx = tourLinks.findIndex(t => t.label === selectedTourLabel);
  const currentTour = tourLinks[selectedTourIdx] || tourLinks[0];

  // Gallery mode state
  const hasGallery = Array.isArray(gallery) && gallery.length > 0;
  const [selectedGalleryIdx, setSelectedGalleryIdx] = useState(initialIndex ?? 0);
  const currentGalleryImage = hasGallery ? gallery[selectedGalleryIdx] : src;

  // Optimize image URLs for different contexts
  const getOptimizedImageUrl = (url: string, maxWidth?: number) => {
    if (!url) return url;
    
    try {
      const optimizedUrl = new URL(url);
      if (maxWidth) {
        optimizedUrl.searchParams.set('w', maxWidth.toString());
      }
      optimizedUrl.searchParams.set('q', '85'); // Good quality for fullscreen
      optimizedUrl.searchParams.set('f', 'webp');
      return optimizedUrl.toString();
    } catch (e) {
      // If URL parsing fails, return original URL
      return url;
    }
  };

  // Debug: log iframe events
  const handleIframeError = () => {
    setIframeError(true);
    setIframeLoaded(false);
    // eslint-disable-next-line no-console
    console.error('Iframe failed to load or was blocked:', currentTour);
  };
  const handleIframeLoad = () => {
    setIframeLoaded(true);
    // eslint-disable-next-line no-console
    console.log('Iframe loaded:', currentTour);
  };

  return (
    <>
      {/* If 360 tours, show iframe gallery, else show image */}
      {tourLinks.length > 0 ? (
        <div className="relative w-full max-w-4xl mx-auto my-4">
          <div
            className="group cursor-pointer rounded-xl overflow-hidden relative"
            onClick={() => setOpen(true)}
            tabIndex={0}
            role="button"
            aria-label="Open 360 view fullscreen"
          >
            <iframe
              src={currentTour?.url}
              title={alt || '360 View'}
              allowFullScreen
              className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[500px] bg-black"
              style={{ minHeight: 200, background: '#111' }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-lg font-semibold bg-black/60 px-4 py-2 rounded">Click to enlarge 360° view</span>
            </div>
          </div>
          {/* Gallery strip for other 360 views */}
          {tourLinks.length > 1 && (
            <div className="flex flex-row gap-2 mt-4 overflow-x-auto pb-2 justify-center">
              {tourLinks.map((link, idx) => (
                <button
                  key={`${link.url}-${link.label}-${idx}`}
                  className={`border-2 rounded-lg px-2 py-1 text-xs whitespace-nowrap transition-all ${selectedTourLabel === link.label ? 'border-[#b08b2e] bg-[#b08b2e] text-white' : 'border-gray-300 bg-white text-gray-700 hover:border-[#b08b2e]'}`}
                  onClick={e => {
                    if (e.stopPropagation) e.stopPropagation();
                    if (selectedTourLabel !== link.label) setSelectedTourLabel(link.label);
                  }}
                >
                  {link.label}
                </button>
              ))}
            </div>
          )}
          {caption && (
            <figcaption className="mt-3 text-sm text-center text-gray-500">{caption}</figcaption>
          )}
        </div>
      ) : (
        <figure>
          <img
            className={className || "w-full object-cover rounded-xl cursor-pointer"}
            src={getOptimizedImageUrl(src, 800)} // Optimize for display
            alt={alt}
            loading="lazy"
            onClick={() => setOpen(true)}
          />
          {caption && (
            <figcaption className="mt-3 text-sm text-center text-gray-500">{caption}</figcaption>
          )}
        </figure>
      )}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2999] flex items-center justify-center bg-black/80"
            onClick={() => setOpen(false)}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 left-4 right-auto md:right-6 md:left-auto z-[3100] text-white text-4xl font-bold bg-black/40 hover:bg-black/70 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-[#b08b2e] transition"
              onClick={e => { e.stopPropagation(); setOpen(false); }}
              aria-label="Close fullscreen image"
              type="button"
            >
              <Icon icon="solar:close-circle-broken" className="w-8 h-8 md:w-10 md:h-10" />
            </button>
            {tourLinks.length > 0 ? (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="max-w-7xl w-full h-[90vh] flex flex-col items-center justify-center rounded-2xl bg-[#222] relative"
                onClick={e => e.stopPropagation()}
              >
                <iframe
                  src={currentTour?.url}
                  title={alt || '360 View'}
                  allowFullScreen
                  className="w-full h-full rounded-xl shadow-2xl border-0 relative z-[100]"
                  style={{ minHeight: 300, background: '#111' }}
                />
                {/* Gallery strip in modal */}
                {tourLinks.length > 1 && (
                  <div className="absolute top-4 left-4 flex flex-row gap-2 justify-start z-[120]">
                    {tourLinks.map((link, idx) => (
                      <button
                        key={`${link.url}-${link.label}-${idx}`}
                        className={`border-2 rounded-lg px-2 py-1 text-xs whitespace-nowrap transition-all ${selectedTourLabel === link.label ? 'border-[#b08b2e] bg-[#b08b2e] text-white' : 'border-gray-300 bg-white text-gray-700 hover:border-[#b08b2e]'}`}
                        onClick={e => {
                        if (e.stopPropagation) e.stopPropagation();
                        if (selectedTourLabel !== link.label) setSelectedTourLabel(link.label);
                        }}
                      >
                        {link.label}
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : hasGallery ? (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="max-w-4xl w-full flex flex-col items-center justify-center rounded-2xl bg-[#222] relative"
                onClick={e => e.stopPropagation()}
              >
                <img
                  src={getOptimizedImageUrl(currentGalleryImage)} // Full quality for fullscreen
                  alt={alt}
                  className="w-full h-[80vh] object-contain rounded-xl shadow-2xl"
                  style={{ background: '#222' }}
                  loading="lazy"
                />
                {/* Mini horizontal gallery */}
                <div className="w-full flex flex-row gap-2 mt-4 overflow-x-auto pb-2 justify-center">
                  {gallery!.map((img, idx) => (
                    <button
                      key={img + idx}
                      className={`border-2 rounded-lg p-1 transition-all ${selectedGalleryIdx === idx ? 'border-[#b08b2e]' : 'border-gray-300 hover:border-[#b08b2e]'}`}
                      onClick={e => { e.stopPropagation(); setSelectedGalleryIdx(idx); }}
                    >
                      <img
                        src={getOptimizedImageUrl(img, 128)} // Small thumbnails
                        alt={`Thumbnail ${idx + 1}`}
                        className={`w-16 h-16 object-cover rounded ${selectedGalleryIdx === idx ? 'ring-2 ring-[#b08b2e]' : ''}`}
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
                {caption && (
                  <div className="mt-3 text-sm text-center text-gray-300 w-full">{caption}</div>
                )}
              </motion.div>
            ) : (
              <motion.img
                src={getOptimizedImageUrl(src)} // Full quality for fullscreen
                alt={alt}
                loading="lazy"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="max-w-4xl w-full h-[80vh] object-contain rounded-xl shadow-2xl"
                style={{ background: '#222' }}
                onClick={e => e.stopPropagation()}
              />
            )}
            {caption && !iframeSrc && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className="absolute bottom-0 left-0 right-0 px-8 pb-4 z-[110] text-white text-center"
                onClick={e => e.stopPropagation()}
              >
                {caption}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FullscreenImage;
