import { AnimatePresence, motion } from "framer-motion";
import React from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[100] bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[2999] w-fit h-fit max-w-lg bg-white rounded-xl shadow-2xl p-6 flex flex-col max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
