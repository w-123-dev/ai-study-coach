"use client";

import { useEffect, useState } from "react";
import { getTimeOfDay, type TimeOfDay, type PartnerSpace } from "@/lib/partner/space";

interface StudySpaceProps {
  space: PartnerSpace | null;
}

// ===== 时间对应的颜色 =====
const TIME_SKY: Record<TimeOfDay, { top: string; bottom: string; windowGlow: string }> = {
  morning: { top: "#FBBF24", bottom: "#FEF3C7", windowGlow: "rgba(251,191,36,0.12)" },
  afternoon: { top: "#93C5FD", bottom: "#DBEAFE", windowGlow: "rgba(147,197,253,0.10)" },
  evening: { top: "#C084FC", bottom: "#FED7AA", windowGlow: "rgba(192,132,252,0.12)" },
  night: { top: "#1E1B4B", bottom: "#312E81", windowGlow: "rgba(30,27,75,0.20)" },
};

// ===== 书籍颜色调色板 =====
const BOOK_COLORS = [
  "#4A5568", "#6B46C1", "#2B6CB0", "#C53030", "#276749",
  "#B7791F", "#9B2C2C", "#553C9A", "#2C7A7B", "#C05621",
];

// ===== 便利贴颜色 =====
const NOTE_COLORS = ["#FEF3C7", "#FCE7F3", "#DBEAFE", "#D1FAE5", "#EDE9FE", "#FFE4E6"];

// ===== 书籍渲染 =====

function renderBooks(count: number, deskY: number): any[] {
  const elements: any[] = [];
  // 预定义书堆位置（x 坐标，避免重叠）
  const positions = [30, 52, 74, 96, 118, 20, 42, 64, 86, 108, 130, 142, 36, 58, 80];
  const maxBooks = Math.min(count, positions.length);

  for (let i = 0; i < maxBooks; i++) {
    const x = positions[i];
    const yBase = deskY + 26 - (i % 4) * 4;
    const h = 18 + (i % 3) * 4;
    const w = 10 + (i % 5) * 2;
    const color = BOOK_COLORS[i % BOOK_COLORS.length];
    const tilt = (i % 3 - 1) * 0.04; // slight tilt
    const isStacked = i > 0 && i % 4 === 0;

    elements.push(
      <g
        key={`book-${i}`}
        transform={`translate(${x}, ${isStacked ? yBase - 6 : yBase}) rotate(${tilt})`}
        opacity={0.85}
        className="transition-all duration-1000"
      >
        {/* Book spine */}
        <rect x={0} y={0} width={w} height={h} rx={1} fill={color} opacity={0.9} />
        {/* Spine line */}
        <line x1={w * 0.2} y1={2} x2={w * 0.2} y2={h - 2} stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} />
        {/* Pages edge (top) */}
        <rect x={0.5} y={0} width={w - 1} height={1.5} rx={0.3} fill="rgba(255,255,255,0.08)" />
        {/* If even index, show as open book */}
        {i % 2 === 0 && (
          <path
            d={`M ${w * 0.3},${h * 0.4} Q ${w * 0.5},${h * 0.35} ${w * 0.7},${h * 0.4}`}
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={0.6}
          />
        )}
      </g>
    );
  }
  return elements;
}

// ===== 咖啡杯渲染 =====

function renderCoffeeCups(count: number, deskY: number): any[] {
  const elements: any[] = [];
  const positions = [180, 192, 204];

  for (let i = 0; i < count; i++) {
    const x = positions[i];
    const y = deskY + 28;
    elements.push(
      <g key={`coffee-${i}`} transform={`translate(${x}, ${y})`} opacity={0.75} className="transition-all duration-1000">
        {/* Stain ring behind */}
        <circle cx={0} cy={10} r={10} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
        {/* Cup body */}
        <path d="M-7,0 L-6,14 L6,14 L7,0 Z" fill="#2D3748" stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} />
        {/* Coffee surface */}
        <rect x={-6.5} y={1} width={13} height={3} rx={0.5} fill="#4A5568" />
        {/* Handle */}
        <path d="M7,3 Q12,3 12,8 Q12,13 7,13" fill="none" stroke="#2D3748" strokeWidth={1.5} />
        {/* Steam */}
        <path d="M-2,-2 Q-3,-6 -1,-8" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={0.6} />
        <path d="M2,-1 Q3,-7 1,-10" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={0.5} />
      </g>
    );
  }
  return elements;
}

// ===== 植物渲染 =====

function renderPlant(stage: number, deskY: number): any {
  const x = 155;
  const y = deskY + 28;

  const leaves = (n: number, small: boolean) => {
    const els: any[] = [];
    const angles = [0, 90, 180, 270, 45, 135, 225, 315];
    const leafSize = small ? 3 : 5;
    for (let i = 0; i < n; i++) {
      const a = (angles[i] * Math.PI) / 180;
      const lx = Math.cos(a) * (small ? 5 : 7);
      const ly = Math.sin(a) * (small ? 5 : 7) - (small ? 2 : 3);
      els.push(
        <ellipse
          key={`leaf-${i}`}
          cx={lx}
          cy={ly}
          rx={leafSize}
          ry={leafSize * 0.6}
          fill={small ? "#34D399" : "#10B981"}
          opacity={0.7}
          transform={`rotate(${angles[i] + 30})`}
        />
      );
    }
    return els;
  };

  return (
    <g key="plant" transform={`translate(${x}, ${y})`} className="transition-all duration-1000">
      {/* Empty pot */}
      <path d="M-8,0 L-6,14 L6,14 L8,0 Z" fill="#1E293B" stroke="rgba(255,255,255,0.08)" strokeWidth={0.5} />
      {/* Pot rim */}
      <rect x={-9} y={-1} width={18} height={3} rx={1} fill="#1E293B" stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} />
      {/* Soil */}
      <ellipse cx={0} cy={0} rx={6.5} ry={1.5} fill="#3D2B1F" opacity={0.6} />

      {stage >= 1 && (
        <g>
          <line x1={0} y1={-1} x2={0} y2={-8} stroke="#34D399" strokeWidth={1.5} opacity={0.7} />
          {/* Stage 1: 2 small leaves */}
          <ellipse cx={-3} cy={-7} rx={3} ry={1.5} fill="#34D399" opacity={0.7} transform="rotate(-30, -3, -7)" />
          <ellipse cx={3} cy={-7} rx={3} ry={1.5} fill="#34D399" opacity={0.7} transform="rotate(30, 3, -7)" />
        </g>
      )}

      {stage >= 2 && (
        <g>
          <line x1={0} y1={-8} x2={0} y2={-16} stroke="#10B981" strokeWidth={1.5} opacity={0.7} />
          {leaves(4, false)}
        </g>
      )}

      {stage >= 3 && (
        <g>
          <line x1={0} y1={-16} x2={0} y2={-24} stroke="#059669" strokeWidth={1.5} opacity={0.7} />
          {leaves(6, false)}
        </g>
      )}

      {stage >= 4 && (
        <g>
          {/* Flowers */}
          <circle cx={-4} cy={-20} r={1.5} fill="#FBBF24" opacity={0.8} />
          <circle cx={4} cy={-22} r={1.5} fill="#FBBF24" opacity={0.8} />
          <circle cx={0} cy={-26} r={2} fill="#FCD34D" opacity={0.8} />
        </g>
      )}
    </g>
  );
}

// ===== 便利贴渲染 =====

function renderNotes(count: number, deskY: number): any[] {
  const elements: any[] = [];
  const positions = [
    { x: 210, y: deskY + 8, angle: -0.08 },
    { x: 230, y: deskY + 12, angle: 0.06 },
    { x: 215, y: deskY + 24, angle: -0.05 },
    { x: 235, y: deskY + 28, angle: 0.03 },
    { x: 220, y: deskY + 38, angle: -0.07 },
    { x: 240, y: deskY + 16, angle: 0.04 },
    { x: 225, y: deskY + 44, angle: -0.03 },
    { x: 245, y: deskY + 34, angle: 0.05 },
    { x: 210, y: deskY + 42, angle: -0.06 },
    { x: 230, y: deskY + 46, angle: 0.02 },
  ];

  for (let i = 0; i < Math.min(count, positions.length); i++) {
    const p = positions[i];
    const color = NOTE_COLORS[i % NOTE_COLORS.length];
    elements.push(
      <g
        key={`note-${i}`}
        transform={`translate(${p.x}, ${p.y}) rotate(${p.angle})`}
        opacity={0.8}
        className="transition-all duration-1000"
      >
        <rect x={-6} y={-5} width={12} height={10} rx={1} fill={color} stroke="rgba(0,0,0,0.06)" strokeWidth={0.3} />
        {/* Subtle fold corner */}
        <path d="M6,-3 L3,-5 L6,-5 Z" fill="rgba(0,0,0,0.04)" />
        {/* Faint line (simulating handwriting) */}
        <line x1={-4} y1={-1} x2={4} y2={-1} stroke="rgba(0,0,0,0.08)" strokeWidth={0.5} />
      </g>
    );
  }
  return elements;
}

// ===== 台灯渲染 =====

function renderLamp(deskY: number, timeOfDay: TimeOfDay): any {
  const x = 70;
  const y = deskY + 28;
  const isOn = timeOfDay === "evening" || timeOfDay === "night";

  return (
    <g key="lamp" transform={`translate(${x}, ${y})`}>
      {/* Glow (when on) */}
      {isOn && (
        <defs>
          <radialGradient id="lamp-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FDE68A" stopOpacity={0.2} />
            <stop offset="60%" stopColor="#FDE68A" stopOpacity={0.08} />
            <stop offset="100%" stopColor="#FDE68A" stopOpacity={0} />
          </radialGradient>
        </defs>
      )}
      {isOn && <circle cx={0} cy={-20} r={40} fill="url(#lamp-glow)" />}
      {/* Base */}
      <rect x={-6} y={10} width={12} height={3} rx={1} fill="#334155" />
      {/* Stem */}
      <line x1={0} y1={10} x2={0} y2={-2} stroke="#475569" strokeWidth={1.5} />
      {/* Shade */}
      <path d="M-8,-2 L8,-2 L5,-10 L-5,-10 Z" fill="#334155" stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} />
      {/* Light bulb */}
      {isOn && <circle cx={0} cy={-2} r={2} fill="#FDE68A" opacity={0.6} />}
    </g>
  );
}

// ===== 窗户渲染 =====

function renderWindow(timeOfDay: TimeOfDay): any {
  const sky = TIME_SKY[timeOfDay];
  const isNight = timeOfDay === "night";

  const stars = isNight
    ? Array.from({ length: 8 }, (_, i) => (
        <circle
          key={`star-${i}`}
          cx={10 + Math.sin(i * 1.7) * 30}
          cy={10 + Math.cos(i * 2.3) * 18}
          r={0.8}
          fill="white"
          opacity={0.3 + Math.random() * 0.4}
        />
      ))
    : null;

  const sunOrMoon =
    timeOfDay === "night" ? (
      <circle cx={65} cy={15} r={5} fill="white" opacity={0.3} />
    ) : (
      <circle cx={65} cy={15} r={5} fill={sky.top} opacity={0.6} />
    );

  return (
    <g className="transition-all duration-1000">
      {/* Outer glow */}
      <rect x={6} y={6} width={78} height={58} rx={5} fill={sky.windowGlow} />
      {/* Window frame */}
      <rect x={8} y={8} width={74} height={54} rx={4} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
      {/* Sky */}
      <defs>
        <linearGradient id="sky-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={sky.top} stopOpacity={0.25} />
          <stop offset="100%" stopColor={sky.bottom} stopOpacity={0.12} />
        </linearGradient>
      </defs>
      <rect x={9} y={9} width={72} height={52} rx={3} fill="url(#sky-grad)" />
      {/* Stars */}
      {stars}
      {/* Sun/Moon */}
      {sunOrMoon}
      {/* Window cross */}
      <line x1={45} y1={9} x2={45} y2={61} stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} />
      <line x1={9} y1={35} x2={81} y2={35} stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} />
      {/* Window sill */}
      <rect x={6} y={62} width={78} height={3} rx={1} fill="rgba(255,255,255,0.04)" />
    </g>
  );
}

// ===== 主组件 =====

export default function StudySpace({ space }: StudySpaceProps) {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("afternoon");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeOfDay(getTimeOfDay());
    setMounted(true);

    // 每 10 分钟刷新一次时间
    const interval = setInterval(() => {
      setTimeOfDay(getTimeOfDay());
    }, 600000);

    return () => clearInterval(interval);
  }, []);

  const deskY = 82;
  const bookCount = space?.book_count ?? 0;
  const coffeeCount = space?.coffee_count ?? 0;
  const plantStage = space?.plant_stage ?? 0;
  const noteCount = space?.note_count ?? 0;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#111827] transition-all">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 260 160"
        preserveAspectRatio="xMidYMid meet"
        className="block"
        style={{ opacity: mounted ? 1 : 0, transition: "opacity 1s ease-in" }}
      >
        {/* Back wall */}
        <rect x={0} y={0} width={260} height={deskY} fill="#0F172A" />

        {/* Window */}
        {renderWindow(timeOfDay)}

        {/* Desk surface */}
        <rect x={0} y={deskY} width={260} height={160 - deskY} fill="#1E293B" />
        {/* Desk top edge */}
        <line x1={0} y1={deskY} x2={260} y2={deskY} stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} />
        {/* Wood grain hints */}
        <line x1={0} y1={deskY + 25} x2={260} y2={deskY + 25} stroke="rgba(255,255,255,0.015)" strokeWidth={0.5} />
        <line x1={0} y1={deskY + 50} x2={260} y2={deskY + 50} stroke="rgba(255,255,255,0.015)" strokeWidth={0.5} />

        {/* Objects (render order: back to front) */}

        {/* Lamp (on desk, back-right) */}
        {renderLamp(deskY, timeOfDay)}

        {/* Books (on desk, left side) */}
        {bookCount > 0 && renderBooks(bookCount, deskY)}

        {/* Plant (on desk, middle) */}
        {renderPlant(plantStage, deskY)}

        {/* Coffee cups (on desk, right) */}
        {coffeeCount > 0 && renderCoffeeCups(coffeeCount, deskY)}

        {/* Sticky notes (on desk, far-right) */}
        {noteCount > 0 && renderNotes(noteCount, deskY)}

        {/* Time indicator text */}
        {mounted && (
          <text
            x={248}
            y={72}
            textAnchor="end"
            fill="rgba(255,255,255,0.12)"
            fontSize={6}
            fontFamily="sans-serif"
          >
            {timeOfDay === "morning" ? "早上" : timeOfDay === "afternoon" ? "午后" : timeOfDay === "evening" ? "黄昏" : "夜晚"}
          </text>
        )}
      </svg>

      {/* Empty state hint */}
      {bookCount === 0 && coffeeCount === 0 && plantStage === 0 && noteCount === 0 && (
        <div className="absolute bottom-2 left-0 right-0 text-center">
          <span className="text-[9px] text-white/15">学习后，这里会慢慢有生活痕迹</span>
        </div>
      )}
    </div>
  );
}
