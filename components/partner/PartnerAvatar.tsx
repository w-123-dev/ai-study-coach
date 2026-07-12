"use client";

import type { PartnerState, PartnerSkin } from "@/lib/partner/types";
import { SKIN_CONFIGS } from "@/lib/partner/types";
import type { PartnerBehavior } from "@/lib/partner/behavior";
import { BEHAVIOR_LABELS } from "@/lib/partner/behavior";

interface PartnerAvatarProps {
  state: PartnerState;
  behavior?: PartnerBehavior;
  skin?: PartnerSkin;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onClick?: () => void;
}

export default function PartnerAvatar({
  state,
  behavior,
  skin = "default",
  size = "md",
  interactive = false,
  onClick,
}: PartnerAvatarProps) {
  const config = SKIN_CONFIGS[skin] || SKIN_CONFIGS.default;
  const color = config.primaryColor;
  const dimension = size === "sm" ? 40 : size === "md" ? 56 : 80;
  const strokeW = size === "sm" ? 2 : size === "md" ? 3 : 4;

  const showBehavior = behavior || "idle";

  // Container animation class based on behavior
  const containerAnim =
    showBehavior === "idle"
      ? "partner-float"
      : showBehavior === "stretching"
      ? "partner-stretch"
      : showBehavior === "sleeping"
      ? "partner-sleep"
      : "";

  // Eye expression based on state + behavior
  const renderEyes = () => {
    // If sleeping, always closed eyes
    if (showBehavior === "sleeping" || state === "resting") {
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
    // calm — default, with behavior modifiers
    if (showBehavior === "thinking") {
      return (
        <>
          <circle cx="19" cy="21" r="2" fill={color} opacity={0.7} />
          <circle cx="29" cy="21" r="2" fill={color} opacity={0.7} />
          <path d="M18,28 Q24,32 30,28" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity={0.5} />
        </>
      );
    }
    if (showBehavior === "lookingAround") {
      return (
        <>
          <circle cx="18" cy="22" r="1.5" fill={color} opacity={0.7} />
          <circle cx="30" cy="22" r="1.5" fill={color} opacity={0.7} />
          <path d="M18,29 Q24,33 30,29" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity={0.5} />
        </>
      );
    }
    if (showBehavior === "stretching") {
      return (
        <>
          <circle cx="19" cy="22" r="2" fill={color} opacity={0.6} />
          <circle cx="29" cy="22" r="2" fill={color} opacity={0.6} />
          <path d="M18,30 Q24,34 30,30" fill="none" stroke={color} strokeWidth="1" strokeLinecap="round" opacity={0.4} />
        </>
      );
    }
    // idle, reading
    return (
      <>
        <circle cx="19" cy="22" r="2" fill={color} opacity={0.7} />
        <circle cx="29" cy="22" r="2" fill={color} opacity={0.7} />
        <path d="M18,29 Q24,33 30,29" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity={0.5} />
      </>
    );
  };

  // Behavior decorations
  const renderBehavior = () => {
    switch (showBehavior) {
      case "reading": {
        // Book below the star
        return (
          <g transform="translate(24, 28)">
            <rect x="-6" y="-4" width="12" height="9" rx="1" fill="none" stroke={color} strokeWidth="1.2" opacity={0.5} />
            <line x1="0" y1="-4" x2="0" y2="5" stroke={color} strokeWidth="0.8" opacity={0.3} />
            <rect x="-4" y="-2" width="3.5" height="5" rx="0.5" fill={color} opacity={0.15} />
            <rect x="0.5" y="-2" width="3.5" height="5" rx="0.5" fill={color} opacity={0.1} />
          </g>
        );
      }
      case "thinking": {
        // Three dots above-right
        return (
          <g>
            <circle cx="36" cy="14" r="1.5" fill={color} opacity={0.4} className="partner-dot-1" />
            <circle cx="36" cy="10" r="1.5" fill={color} opacity={0.5} className="partner-dot-2" />
            <circle cx="36" cy="6" r="1.5" fill={color} opacity={0.6} className="partner-dot-3" />
          </g>
        );
      }
      case "lookingAround": {
        // Small directional indicator
        return (
          <g opacity={0.3}>
            <line x1="36" y1="20" x2="40" y2="20" stroke={color} strokeWidth="1.5" strokeLinecap="round" className="partner-look" />
            <line x1="40" y1="20" x2="37" y2="17" stroke={color} strokeWidth="1" strokeLinecap="round" className="partner-look" />
          </g>
        );
      }
      case "stretching": {
        // Arm lines stretching up
        return (
          <g opacity={0.4}>
            <line x1="10" y1="26" x2="6" y2="18" stroke={color} strokeWidth="1.5" strokeLinecap="round" className="partner-stretch-arm-left" />
            <line x1="38" y1="26" x2="42" y2="18" stroke={color} strokeWidth="1.5" strokeLinecap="round" className="partner-stretch-arm-right" />
          </g>
        );
      }
      case "sleeping": {
        // Zzz text
        return (
          <g opacity={0.5}>
            <text x="34" y="12" fill={color} fontSize="6" fontFamily="sans-serif" className="partner-zzz-1">z</text>
            <text x="38" y="8" fill={color} fontSize="5" fontFamily="sans-serif" className="partner-zzz-2">z</text>
            <text x="41" y="4" fill={color} fontSize="4" fontFamily="sans-serif" className="partner-zzz-3">z</text>
          </g>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center ${interactive ? "cursor-pointer" : ""} ${containerAnim}`}
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
        <g transform="translate(24,16)" className={showBehavior === "stretching" ? "partner-star-stretch" : ""}>
          <path
            d="M0,-8 L2,-2.5 L8,-2.5 L3.5,1 L5,7 L0,3.5 L-5,7 L-3.5,1 L-8,-2.5 L-2,-2.5 Z"
            fill={color}
            className="transition-colors duration-500"
            opacity={0.9}
          />
        </g>
        {/* Expression */}
        {renderEyes()}
        {/* Behavior decorations */}
        {renderBehavior()}
      </svg>

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes partnerFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes partnerStretch {
          0%, 100% { transform: scaleY(1) scaleX(1); }
          30% { transform: scaleY(1.08) scaleX(0.95) translateY(-2px); }
          60% { transform: scaleY(1.12) scaleX(0.92) translateY(-3px); }
        }
        @keyframes partnerSleep {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(0.97); }
        }
        @keyframes dotPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes lookSlide {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(3px); }
          75% { transform: translateX(-3px); }
        }
        @keyframes stretchArmLeft {
          0%, 100% { transform: rotate(0deg); transform-origin: 10px 26px; }
          50% { transform: rotate(-15deg); transform-origin: 10px 26px; }
        }
        @keyframes stretchArmRight {
          0%, 100% { transform: rotate(0deg); transform-origin: 38px 26px; }
          50% { transform: rotate(15deg); transform-origin: 38px 26px; }
        }
        @keyframes zzzFloat {
          0% { opacity: 0; transform: translate(0, 0); }
          30% { opacity: 0.6; }
          100% { opacity: 0; transform: translate(6px, -8px); }
        }
        @keyframes starStretch {
          0%, 100% { transform: scaleY(1); }
          30% { transform: scaleY(1.15); }
          60% { transform: scaleY(1.2); }
        }

        .partner-float {
          animation: partnerFloat 4s ease-in-out infinite;
        }
        .partner-stretch {
          animation: partnerStretch 2.5s ease-in-out infinite;
        }
        .partner-sleep {
          animation: partnerSleep 3s ease-in-out infinite;
        }
        .partner-dot-1 { animation: dotPulse 2s ease-in-out 0s infinite; }
        .partner-dot-2 { animation: dotPulse 2s ease-in-out 0.3s infinite; }
        .partner-dot-3 { animation: dotPulse 2s ease-in-out 0.6s infinite; }
        .partner-look { animation: lookSlide 3s ease-in-out infinite; }
        .partner-stretch-arm-left { animation: stretchArmLeft 2.5s ease-in-out infinite; }
        .partner-stretch-arm-right { animation: stretchArmRight 2.5s ease-in-out infinite; }
        .partner-zzz-1 { animation: zzzFloat 2.5s ease-in-out infinite; }
        .partner-zzz-2 { animation: zzzFloat 2.5s ease-in-out 0.4s infinite; }
        .partner-zzz-3 { animation: zzzFloat 2.5s ease-in-out 0.8s infinite; }
        .partner-star-stretch { animation: starStretch 2.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
