import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FullscreenImageProps {
  src: string;
  alt?: string;
  caption?: React.ReactNode;
  className?: string;
}

const FullscreenImage: React.FC<FullscreenImageProps> = ({ src, alt, caption, className }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <figure>
        <img
          className={className || "w-full object-cover rounded-xl cursor-pointer"}
          src={src}
          alt={alt}
          onClick={() => setOpen(true)}
        />
        {caption && (
          <figcaption className="mt-3 text-sm text-center text-gray-500">{caption}</figcaption>
        )}
      </figure>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2999] flex items-center justify-center bg-black/80"
            onClick={() => setOpen(false)}
          >
            <motion.img
              src={src}
              alt={alt}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="max-w-4xl w-full h-[80vh] object-contain rounded-xl shadow-2xl"
              style={{ background: '#222' }}
              onClick={e => e.stopPropagation()}
            />
            {caption && (
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
