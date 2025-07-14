import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// Import DragCloseDrawer (assume it's in the same directory or adjust path as needed)
import { DragCloseDrawer } from "./DragCloseDrawer";

interface InquireSheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const modalVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
  exit: { scale: 0.95, opacity: 0, transition: { duration: 0.2 } },
};

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [breakpoint]);
  return isMobile;
}

const InquireSheet: React.FC<InquireSheetProps> = ({ open, onClose, children }) => {
  const isMobile = useIsMobile();

  // For DragCloseDrawer, we need a setOpen function compatible with Dispatch<SetStateAction<boolean>>
  const setOpen: React.Dispatch<React.SetStateAction<boolean>> = (v) => {
    if (typeof v === 'function') {
      // v is a function: (prev: boolean) => boolean
      // We call it with 'true' (open) and if it returns false, we close
      if (!v(true)) onClose();
    } else {
      // v is a boolean
      if (!v) onClose();
    }
  };

  useEffect(() => {
    if (open) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
      };
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop for desktop only, DragCloseDrawer handles its own backdrop */}
          {!isMobile && (
            <motion.div
              className="fixed inset-0 z-[2999] bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              onTouchMove={e => e.preventDefault()}
            />
          )}
          {/* Sheet or Modal */}
          {isMobile ? (
            <DragCloseDrawer open={open} setOpen={setOpen} onClose={onClose}>
              <div className="w-full pb-4 flex-1 overflow-y-auto">{children}</div>
            </DragCloseDrawer>
          ) : (
            <motion.div
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[2999] w-[90vw] max-w-5xl bg-white rounded-xl shadow-2xl p-6 flex flex-col max-h-[90vh] overflow-y-auto md:overflow-y-hidden"
              style={{ WebkitOverflowScrolling: "touch" }}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-4 text-gray-400 hover:text-[#AD8A19] text-4xl font-bold focus:outline-none"
                onClick={onClose}
                aria-label="Close"
                style={{ zIndex: 120 }}
              >
                ×
              </button>
              <div className="w-full">{children}</div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default InquireSheet;
