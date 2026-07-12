"use client";

import type { PartnerState, PartnerSkin } from "@/lib/partner/types";
import { SKIN_CONFIGS } from "@/lib/partner/types";

interface PartnerAvatarProps {
  state: PartnerState;
  skin?: PartnerSkin;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onClick?: () => void;
}

export default function PartnerAvatar({
  state,
  skin = "default",
  size = "md",
  interactive = false,
  onClick,
}: PartnerAvatarProps) {
  const config = SKIN_CONFIGS[skin] || SKIN_CONFIGS.default;
  const color = config.primaryColor;
  const dimension = size === "sm" ? 40 : size === "md" ? 56 : 80;
  const strokeW = size === "sm" ? 2 : size === "md" ? 3 : 4;

  // Eye expression based on state
  const renderEyes = () => {
    if (state === "resting") {
      return (
        <>
          <line x1="18" y1="24" x2="21" y2="24" stroke={color} strokeWidth="2" strokeLinecap="round" opacity={0.6} />
          <line x1="27" y1="24" x2="30" y2="24" stroke={color} strokeWidth="2" strokeLinecap="round" opacity={0.6} />
          <path d="M16,30 Q24,34 32,30" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity={0.4} />
        </>
      );
    }
    if (state === "happy") {
      return (
        <>
          <circle cx="19" cy="22" r="2.5" fill={color} opacity={0.8} />
          <circle cx="29" cy="22" r="2.5" fill={color} opacity={0.8} />
          <path d="M17,30 Q24,37 31,30" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" opacity={0.7} />
        </>
      );
    }
    if (state === "studying") {
      return (
        <>
          <circle cx="19" cy="22" r="2" fill={color} opacity={0.8} />
          <circle cx="29" cy="22" r="2" fill={color} opacity={0.8} />
          <rect x="23" y="28" width="2" height="5" rx="1" fill={color} opacity={0.5} />
        </>
      );
    }
    // calm — default
    return (
      <>
        <circle cx="19" cy="22" r="2" fill={color} opacity={0.7} />
        <circle cx="29" cy="22" r="2" fill={color} opacity={0.7} />
        <path d="M18,29 Q24,33 30,29" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity={0.5} />
      </>
    );
  };

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center ${interactive ? "cursor-pointer" : ""}`}
      style={{ width: dimension, height: dimension }}
      onClick={onClick}
    >
      {/* Outer glow */}
      <div
        className="absolute inset-0 rounded-full opacity-20 blur-md transition-all duration-500"
        style={{ backgroundColor: color }}
      />

      {/* SVG Avatar */}
      <svg
        width={dimension}
        height={dimension}
        viewBox="0 0 48 48"
        className="relative"
      >
        {/* Background circle */}
        <circle
          cx="24"
          cy="24"
          r="22"
          fill={config.bgColor}
          stroke={color}
          strokeWidth={strokeW}
          className="transition-all duration-500"
          opacity={0.9}
        />
        {/* Star / companion shape */}
        <g transform="translate(24,16)">
          <path
            d="M0,-8 L2,-2.5 L8,-2.5 L3.5,1 L5,7 L0,3.5 L-5,7 L-3.5,1 L-8,-2.5 L-2,-2.5 Z"
            fill={color}
            className="transition-colors duration-500"
            opacity={0.9}
          />
        </g>
        {/* Expression */}
        {renderEyes()}
      </svg>
    </div>
  );
}
