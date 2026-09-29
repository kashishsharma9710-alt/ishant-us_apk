import React from "react";

interface TulipIconProps {
  className?: string;
  size?: number;
  variant?: "filled" | "outline" | "glowing";
}

export const TulipIcon: React.FC<TulipIconProps> = ({
  className = "w-6 h-6",
  size,
  variant = "filled",
}) => {
  const customStyle = size ? { width: `${size}px`, height: `${size}px` } : undefined;

  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={customStyle}
    >
      <defs>
        <linearGradient id="tulipStemGrad" x1="20" y1="20" x2="20" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#40916c" />
          <stop offset="100%" stopColor="#1b4332" />
        </linearGradient>
        <linearGradient id="tulipPetalGrad" x1="14" y1="6" x2="26" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#74c69d" />
          <stop offset="50%" stopColor="#52b788" />
          <stop offset="100%" stopColor="#2d6a4f" />
        </linearGradient>
        <linearGradient id="tulipCenterPetal" x1="20" y1="6" x2="20" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#95d5b2" />
          <stop offset="100%" stopColor="#40916c" />
        </linearGradient>
      </defs>

      {/* Stem */}
      <path
        d="M20 22 Q20.5 30 19.5 36"
        stroke="url(#tulipStemGrad)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* Subtle Leaf */}
      <path
        d="M19.5 30 Q14 28 12 23 Q17 24 19.5 28"
        fill="#2d6a4f"
        opacity="0.85"
      />

      {/* Center Petal */}
      <path
        d="M20 7 C16.5 12 15.5 19 20 25 C24.5 19 23.5 12 20 7 Z"
        fill="url(#tulipCenterPetal)"
      />

      {/* Left Petal */}
      <path
        d="M18 8 C12.5 11 10 17 12.5 22.5 C14.5 25.5 18 25.5 18.5 24.5 C16 19.5 16.5 14 18 8 Z"
        fill="url(#tulipPetalGrad)"
      />

      {/* Right Petal */}
      <path
        d="M22 8 C27.5 11 30 17 27.5 22.5 C25.5 25.5 22 25.5 21.5 24.5 C24 19.5 23.5 14 22 8 Z"
        fill="url(#tulipPetalGrad)"
      />
    </svg>
  );
};
