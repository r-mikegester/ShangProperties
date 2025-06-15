import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface InquireSheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const sheetVariants = {
  hidden: { y: "100%", opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
  exit: { y: "100%", opacity: 0, transition: { duration: 0.2 } },
};

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
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[100] bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          {/* Sheet or Modal */}
          {isMobile ? (
            <motion.div
              className="fixed left-0 right-0 bottom-0 z-[110] w-full bg-white rounded-t-2xl shadow-2xl p-4 sm:p-8 flex flex-col max-h-[90vh] overflow-y-auto"
              style={{ WebkitOverflowScrolling: "touch" }}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={sheetVariants}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-center mb-2">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
              </div>
              <button
                className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
                onClick={onClose}
                aria-label="Close"
                style={{ zIndex: 120 }}
              >
                ×
              </button>
              <div className="w-full">{children}</div>
            </motion.div>
          ) : (
            <motion.div
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[2999] w-[90vw] max-w-5xl bg-white rounded-xl shadow-2xl p-6 flex flex-col max-h-[90vh] overflow-y-auto"
              style={{ WebkitOverflowScrolling: "touch" }}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
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
