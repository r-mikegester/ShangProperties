import React, { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  width?: string;
  height?: string;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { y: "-40px", opacity: 0, scale: 0.95 },
  visible: { y: 0, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
  exit: { y: "-40px", opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

export const Modal: React.FC<ModalProps> = ({ open, onClose, children, width = "100%", height = "auto" }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/40"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
          onClick={onClose}
        >
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl p-0 overflow-hidden"
            style={{ width, height, maxWidth: "95vw", maxHeight: "90vh" }}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none z-10"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
            <div className="p-6 overflow-y-auto" style={{ maxHeight: "80vh" }}>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
