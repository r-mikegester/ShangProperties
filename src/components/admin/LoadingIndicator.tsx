import React from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

interface LoadingIndicatorProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  message = "Loading...", 
  size = "md" 
}) => {
  // Define sizes
  const sizeClasses = {
    sm: {
      spinner: "w-6 h-6",
      text: "text-sm",
      icon: "w-6 h-6"
    },
    md: {
      spinner: "w-10 h-10",
      text: "text-base",
      icon: "w-8 h-8"
    },
    lg: {
      spinner: "w-16 h-16",
      text: "text-lg",
      icon: "w-12 h-12"
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className="flex flex-col items-center justify-center h-full py-12">
      <motion.div
        className="flex flex-col items-center justify-center space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated spinner */}
        <motion.div
          className={`${currentSize.spinner} relative`}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <Icon 
            icon="mdi:loading" 
            className={`text-[#b08b2e] ${currentSize.spinner}`} 
          />
        </motion.div>
        
        {/* Loading message with icon */}
        <motion.div 
          className="flex items-center space-x-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Icon 
            icon="mdi:information-outline" 
            className={`${currentSize.icon} text-[#b08b2e]`} 
          />
          <span className={`${currentSize.text} text-gray-600 font-medium`}>
            {message}
          </span>
        </motion.div>
        
        {/* Animated dots */}
        <motion.div 
          className="flex space-x-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-[#b08b2e] rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoadingIndicator;