"use client";

import type { PartnerMood } from "@/lib/partner/types";

const moodColors: Record<PartnerMood, string> = {
  calm: "#60A5FA",
  focused: "#818CF8",
  happy: "#FBBF24",
  sleepy: "#A78BFA",
};

interface PartnerAvatarProps {
  mood: PartnerMood;
  level: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onClick?: () => void;
}

export default function PartnerAvatar({
  mood,
  level,
  size = "md",
  interactive = false,
  onClick,
}: PartnerAvatarProps) {
  const color = moodColors[mood] || "#60A5FA";
  const dimension = size === "sm" ? 40 : size === "md" ? 56 : 80;
  const ringWidth = size === "sm" ? 2 : size === "md" ? 3 : 4;
  const dotSize = size === "sm" ? 8 : size === "md" ? 10 : 14;

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center ${interactive ? "cursor-pointer" : ""}`}
      style={{ width: dimension, height: dimension }}
      onClick={onClick}
    >
      {/* 外发光 */}
      <div
        className="absolute inset-0 rounded-full opacity-20 blur-md transition-all duration-500"
        style={{ backgroundColor: color }}
      />

      {/* SVG 头像 */}
      <svg
        width={dimension}
        height={dimension}
        viewBox="0 0 48 48"
        className="relative"
      >
        {/* 背景圆 */}
        <circle
          cx="24"
          cy="24"
          r="22"
          fill="#1E293B"
          stroke={color}
          strokeWidth={ringWidth}
          className="transition-all duration-500"
        />
        {/* 抽象伙伴形象 - 一个小星星 */}
        <g transform="translate(24,22)">
          <path
            d="M0,-8 L2,-2.5 L8,-2.5 L3.5,1 L5,7 L0,3.5 L-5,7 L-3.5,1 L-8,-2.5 L-2,-2.5 Z"
            fill={color}
            className="transition-colors duration-500"
            opacity={0.9}
          />
        </g>
        {/* 表情 - 根据 mood 变化 */}
        {mood === "happy" && (
          <path
            d="M17,28 Q24,35 31,28"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            opacity={0.8}
          />
        )}
        {mood === "focused" && (
          <>
            <circle cx="20" cy="24" r="2" fill={color} opacity={0.8} />
            <circle cx="28" cy="24" r="2" fill={color} opacity={0.8} />
          </>
        )}
        {(mood === "calm" || mood === "sleepy") && (
          <>
            <circle cx="20" cy="24" r="1.5" fill={color} opacity={0.7} />
            <circle cx="28" cy="24" r="1.5" fill={color} opacity={0.7} />
          </>
        )}
        {mood === "sleepy" && (
          <path
            d="M16,20 Q16,17 19,17"
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity={0.6}
          />
        )}
      </svg>

      {/* 等级角标 */}
      <div
        className="absolute -bottom-0.5 -right-0.5 flex items-center justify-center rounded-full bg-[#0F172A] text-[10px] font-bold text-white shadow-md"
        style={{
          width: dotSize + 4,
          height: dotSize + 4,
          border: "1.5px solid rgba(255,255,255,0.15)",
        }}
      >
        {level}
      </div>
    </div>
  );
}
