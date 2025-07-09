import React, { useState } from 'react';
import Contact from './layout/client/Contact';
import InquireSheet from './InquireSheet';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';

const isMobile = () => window.innerWidth <= 768;

const FloatingContactButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(isMobile());

  React.useEffect(() => {
    const handleResize = () => setMobile(isMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="floating-contact-btn"
            initial={{ opacity: 0, scale: 0.7, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 22 } }}
            exit={{ opacity: 0, scale: 0.7, y: 30, transition: { duration: 0.2 } }}
            onClick={() => setOpen(true)}
            className="fixed right-6 bottom-6 z-[2999] bg-gradient-to-br from-[#AD8A19] to-[#686058] text-white border-none rounded-full w-16 h-16 shadow-lg cursor-pointer outline-none transition-transform duration-200 text-3xl flex items-center justify-center animate-float-bounce"
            aria-label="Contact"
            type="button"
          >
            <span role="img" aria-label="Contact"> <Icon icon="solar:call-chat-rounded-broken" className="size-10"/></span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* InquireSheet Modal/Sheet */}
      <InquireSheet open={open} onClose={() => setOpen(false)}>
        <Contact />
      </InquireSheet>
      {/* Animations */}
      <style>{`
        @keyframes float-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px) scale(1.08); }
        }
        .animate-float-bounce {
          animation: float-bounce 1.5s infinite;
        }
      `}</style>
    </>
  );
};

export default FloatingContactButton;
