import React from "react";
import shanglogo from "../../assets/imgs/logo/shang/ShangPureWhite.webp"

const LoadingScreen: React.FC = () => (
  <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#b08b2e] to-[#ad8a19]">
    {/* Shang Logo */}
    <div className="flex items-center justify-center mb-8 animate-pulse">
      <img
        src={shanglogo}
        alt="Shang Logo"
        className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-xl"
        style={{ filter: 'drop-shadow(0 4px 24px #b08b2e88)' }}
      />
    </div>
    {/* Animated Dots */}
    <div className="flex space-x-2 mb-6">
      <span className="block w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
      <span className="block w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
      <span className="block w-3 h-3 bg-white rounded-full animate-bounce"></span>
    </div>
    <div className="text-white text-xl md:text-2xl font-semibold tracking-widest text-center select-none">
      Loading please wait...
    </div>
    <style>{`
      @keyframes bounce {
        0%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-18px); }
      }
      .animate-bounce {
        animation: bounce 1.4s infinite both;
      }
    `}</style>
  </div>
);

export default LoadingScreen;
