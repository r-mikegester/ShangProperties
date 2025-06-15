import React, { useState } from 'react';
import Contact from './Contact';
import { Icon } from '@iconify/react';

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
      <button
        onClick={() => setOpen(true)}
        className="fixed right-6 bottom-6 z-[2999] bg-gradient-to-br from-[#AD8A19] to-[#686058] text-white border-none rounded-full w-16 h-16 shadow-lg cursor-pointer outline-none transition-transform duration-200 text-3xl flex items-center justify-center animate-float-bounce"
        aria-label="Contact"
        type="button"
      >
        <span role="img" aria-label="Contact"> <Icon icon="solar:call-chat-rounded-broken" className="size-10"/></span>

      </button>

      {/* Modal/Bottom Sheet Overlay */}
      {open && (
        <div
          className={`fixed inset-0 w-screen h-screen bg-black/40 z-[2999] flex transition-colors duration-300 ${mobile ? 'items-end' : 'items-center -4'} justify-center`}
          onClick={() => setOpen(false)}
        >
          <div
            className={`bg-white ${mobile ? 'rounded-t-3xl w-screen min-h-[320px] max-h-[80vh] animate-slide-up' : 'rounded-2xl w-full max-w-[95vw] max-h-[90vh] animate-fade-in'} shadow-2xl p-6 relative`}
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 bg-transparent border-none text-2xl cursor-pointer text-gray-400 hover:text-gray-600"
              aria-label="Close"
              type="button"
            >
              ×
            </button>
            <Contact />
          </div>
        </div>
      )}
      {/* Animations */}
      <style>{`
        @keyframes float-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px) scale(1.08); }
        }
        .animate-float-bounce {
          animation: float-bounce 1.5s infinite;
        }
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.3s;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s;
        }
      `}</style>
    </>
  );
};

export default FloatingContactButton;
