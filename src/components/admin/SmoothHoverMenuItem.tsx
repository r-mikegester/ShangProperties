import React, { ReactNode, useState } from "react";

export const SmoothHoverMenuItem = ({
  children,
  transitionDelayInMs = 300,
  onClick,
}: {
  children: ReactNode;
  transitionDelayInMs?: number;
  onClick?: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`rounded-lg border overflow-hidden cursor-pointer select-none transition-transform ${
        isHovered ? "border-neutral-400/30 scale-105" : "border-neutral-400/0 scale-100"
      }`}
      style={{
        transitionProperty: "border-color, transform",
        transitionDuration: isHovered ? "0ms" : `${transitionDelayInMs + 300}ms`,
      }}
    >
      <div
        className={`px-3 py-1.5 transition-colors ${isHovered ? "bg-neutral-400/20" : ""}`}
        style={{
          transitionProperty: "background-color",
          transitionDuration: isHovered ? "0ms" : `${transitionDelayInMs + 300}ms`,
        }}
      >
        <span className="text-sm font-medium">{children}</span>
      </div>
    </div>
  );
};
