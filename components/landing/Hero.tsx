"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";

/* ============================================================
   Particles — Layer 4
   ============================================================ */
const PARTICLE_COUNT = 100;
const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  r: 0.6 + Math.random() * 2.2,
  dur: 25 + Math.random() * 40,
  delay: Math.random() * -25,
  dx: (Math.random() - 0.5) * 40,
  dy: -8 - Math.random() * 25,
  baseOp: 0.08 + Math.random() * 0.3,
}));

/* ============================================================
   Chat Bubble Pool
   ============================================================ */
const CHAT_BUBBLES = [
  "今天数学完成后，我们继续英语。",
  "你昨天学得不错，继续加油。",
  "数学连续三天完成了，很棒。",
  "先做最简单的题，找回节奏。",
  "知识点总结了吗？我帮你复习。",
  "累了就休息，不差这十分钟。",
];

/* ============================================================
   Aurora Blobs — Layer 2
   ============================================================ */
const AURORA_BLOBS = [
  { color: "rgba(76,145,255,0.10)", x: 10, y: 5, w: 700, h: 700, dur: 22, dx: 45, dy: -25 },
  { color: "rgba(139,92,246,0.08)", x: 65, y: 18, w: 600, h: 600, dur: 26, dx: -35, dy: 30 },
  { color: "rgba(6,182,212,0.06)", x: 25, y: 52, w: 550, h: 550, dur: 29, dx: 30, dy: -20 },
  { color: "rgba(76,145,255,0.05)", x: 72, y: 62, w: 500, h: 500, dur: 23, dx: -25, dy: 18 },
];

/* ============================================================
   Grid — Layer 5
   ============================================================ */
function GridLayer() {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      aria-hidden
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), " +
          "linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
      }}
      animate={{ backgroundPosition: ["0px 0px", "64px 64px"] }}
      transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
    />
  );
}

/* ============================================================
   Noise — Layer 6
   ============================================================ */
function NoiseLayer() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-overlay"
      style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        backgroundSize: "200px 200px",
      }}
      aria-hidden
    />
  );
}

/* ============================================================
   Aurora — Layer 2
   ============================================================ */
function AuroraLayer({ mouseX, mouseY }: { mouseX: any; mouseY: any }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {AURORA_BLOBS.map((b, i) => {
        const sx = useTransform(mouseX, [-1, 1], [-b.dx * 0.1, b.dx * 0.1]);
        const sy = useTransform(mouseY, [-1, 1], [-b.dy * 0.1, b.dy * 0.1]);
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: b.x + "%",
              top: b.y + "%",
              width: b.w + "px",
              height: b.h + "px",
              background: "radial-gradient(circle, " + b.color + " 0%, transparent 70%)",
              x: sx,
              y: sy,
            }}
            animate={{
              x: [0, b.dx * 0.6, -b.dx * 0.4, b.dx * 0.2, 0],
              y: [0, b.dy * 0.5, -b.dy * 0.3, b.dy * 0.25, 0],
              scale: [1, 1.06, 0.94, 1.03, 1],
            }}
            transition={{
              duration: b.dur, repeat: Infinity, ease: "easeInOut", delay: i * 2,
            }}
          />
        );
      })}
    </div>
  );
}

/* ============================================================
   Particles — Layer 4
   ============================================================ */
function ParticlesLayer({ mouseX, mouseY }: { mouseX: any; mouseY: any }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {particles.map((p) => {
        const px = useTransform(mouseX, [-1, 1], [-p.dx * 0.08, p.dx * 0.08]);
        const py = useTransform(mouseY, [-1, 1], [-p.dy * 0.08, p.dy * 0.08]);
        return (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-white"
            style={{
              left: p.x + "%", top: p.y + "%",
              width: p.r + "px", height: p.r + "px",
              x: px, y: py,
            }}
            animate={{
              y: [0, p.dy * 0.6, p.dy * 0.3, p.dy * 0.8, 0],
              x: [0, p.dx * 0.4, -p.dx * 0.2, p.dx * 0.3, 0],
              opacity: [p.baseOp, p.baseOp * 2, p.baseOp * 0.4, p.baseOp * 1.5, p.baseOp],
              scale: [1, 1.4, 0.7, 1.2, 1],
            }}
            transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
          />
        );
      })}
    </div>
  );
}

/* ============================================================
   Breathing Radial Light — Layer 3
   ============================================================ */
function BreathingLight() {
  return (
    <div className="pointer-events-none absolute top-[12%] left-1/2 -translate-x-1/2" aria-hidden>
      <motion.div
        className="h-[700px] w-[900px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(76,145,255,0.12) 0%, transparent 55%)",
          filter: "blur(80px)",
        }}
        animate={{ scale: [0.95, 1.08, 0.95], opacity: [0.12, 0.20, 0.12] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/* ============================================================
   Overlay — train-bob animation (like Lumora PNG overlay)
   ============================================================ */
function DriftOverlay() {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 opacity-[0.06]"
      aria-hidden
      style={{
        background:
          "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.03) 0%, transparent 50%), " +
          "radial-gradient(ellipse at 70% 80%, rgba(76,145,255,0.03) 0%, transparent 50%)",
      }}
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/* ============================================================
   Partner Avatar
   ============================================================ */
function PartnerAvatar() {
  return (
    <motion.div
      className="relative flex h-10 w-10 items-center justify-center"
      animate={{ scale: [1, 1.04, 1] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(251,191,36,0.13) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.35, 1], opacity: [0.4, 0.85, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <svg className="relative h-6 w-6 z-10" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" fill="rgba(251,191,36,0.15)" stroke="rgba(251,191,36,0.25)" strokeWidth="0.5" />
        <motion.g animate={{ rotate: [0, 4, -4, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
          <circle cx="9.5" cy="10.5" r="1.1" fill="rgba(251,191,36,0.5)" />
          <circle cx="14.5" cy="10.5" r="1.1" fill="rgba(251,191,36,0.5)" />
          <motion.rect
            x="8.3" y="9.3" width="2.4" height="0.25" rx="0.12"
            fill="#0b1220"
            animate={{ scaleY: [0, 1, 1, 0] }}
            transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
          />
          <motion.rect
            x="13.3" y="9.3" width="2.4" height="0.25" rx="0.12"
            fill="#0b1220"
            animate={{ scaleY: [0, 1, 1, 0] }}
            transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
          />
        </motion.g>
        <motion.path
          d="M9.5 15c1.5 0.8 3.5 0.8 5 0"
          stroke="rgba(251,191,36,0.25)" strokeWidth="0.5" strokeLinecap="round"
          animate={{ d: ["M9.5 15c1.5 0.8 3.5 0.8 5 0", "M9.5 14.5c1.5 1 3.5 1 5 0"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </motion.div>
  );
}

/* ============================================================
   Countdown
   ============================================================ */
function CountdownBlock() {
  const [count, setCount] = useState(183);
  useEffect(() => {
    const t = setInterval(() => setCount((c) => (c > 150 ? c - 1 : 182)), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div>
      <p className="text-[10px] font-medium tracking-widest text-white/30 uppercase">距离考研</p>
      <div className="flex items-baseline gap-1.5 mt-0.5">
        <motion.span
          key={count}
          className="text-2xl font-bold tracking-tight text-white tabular-nums"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {count}
        </motion.span>
        <span className="text-xs font-medium text-white/40">Days</span>
      </div>
    </div>
  );
}

/* ============================================================
   Progress Bar
   ============================================================ */
function ProgressBarAnimated({ value, delay = 2.5 }: { value: number; delay?: number }) {
  return (
    <div className="h-1 w-full rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
      <motion.div
        className="h-full rounded-full"
        style={{ background: "linear-gradient(90deg, #5EA8FF, #7EC8E3)" }}
        initial={{ width: "0%" }}
        animate={{ width: value + "%" }}
        transition={{ duration: 2, ease: "easeOut", delay }}
      />
    </div>
  );
}

/* ============================================================
   Rotating Chat Bubble
   ============================================================ */
function ChatRotator() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % CHAT_BUBBLES.length), 5500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="rounded-2xl rounded-tl-sm border px-4 py-3 liquid-glass-subtle">
      <motion.p
        key={index}
        className="text-xs leading-relaxed text-white/60"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {CHAT_BUBBLES[index]}
      </motion.p>
      <motion.span
        className="inline-block h-3 w-1 bg-blue-400/50 ml-0.5 align-middle"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/* ============================================================
   Dashboard Mockup (Liquid Glass)
   ============================================================ */
function DashboardMockup({ mouseX, mouseY }: { mouseX: any; mouseY: any }) {
  const rotateX = useTransform(mouseY, [-1, 1], [2.5, -2.5]);
  const rotateY = useTransform(mouseX, [-1, 1], [-2.5, 2.5]);
  const cardX = useSpring(mouseX, { stiffness: 35, damping: 25 });
  const cardY = useSpring(mouseY, { stiffness: 35, damping: 25 });

  const tasks = [
    { s: "数学", t: "函数与极限复习", p: 70, delay: 2.0 },
    { s: "英语", t: "核心词汇 80 个", p: 45, delay: 2.3 },
    { s: "数据结构", t: "链表基础练习", p: 100, delay: 2.6 },
  ];

  return (
    <motion.div
      className="w-full max-w-[380px] shrink-0 md:w-auto perspective-[1200px]"
      initial={{ opacity: 0, y: 50, scale: 0.93, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 1.0, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
      style={{ x: cardX, y: cardY, rotateX, rotateY }}
    >
      <motion.div
        className="relative rounded-[32px] p-5 shadow-2xl liquid-glass"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex items-start justify-between mb-5">
          <CountdownBlock />
          <PartnerAvatar />
        </div>

        <div className="mb-4">
          <p className="text-[11px] font-medium text-white/40 mb-3 tracking-widest uppercase">
            今日任务
          </p>
          <div className="space-y-2.5">
            {tasks.map((task, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3 rounded-xl border px-3 py-2.5"
                style={{
                  borderColor: "rgba(255,255,255,0.04)",
                  background: "rgba(255,255,255,0.02)",
                }}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: task.delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.div
                  className={
                    "h-4 w-4 shrink-0 rounded border flex items-center justify-center " +
                    (task.p === 100 ? "border-emerald-500/30 bg-emerald-500/10" : "border-white/10")
                  }
                  animate={task.p < 100 ? { scale: [1, 1.12, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
                >
                  {task.p === 100 && (
                    <motion.svg
                      className="h-2.5 w-2.5 text-emerald-400" viewBox="0 0 12 12" fill="none"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ delay: 2.8, duration: 0.3 }}
                    >
                      <path d="M2.5 6l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>
                  )}
                </motion.div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="shrink-0 rounded bg-white/[0.06] px-1.5 py-0.5 text-[9px] font-medium text-white/40">
                      {task.s}
                    </span>
                    <span className={"truncate text-xs " + (task.p === 100 ? "text-white/30 line-through" : "text-white/70")}>
                      {task.t}
                    </span>
                  </div>
                  <div className="mt-1.5 h-0.5 w-full rounded-full" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: task.p === 100
                          ? "linear-gradient(90deg, #65D18A, #4ADE80)"
                          : "linear-gradient(90deg, #5EA8FF, rgba(94,168,255,0.4))",
                      }}
                      initial={{ width: "0%" }}
                      animate={{ width: task.p + "%" }}
                      transition={{ duration: 1.5, delay: task.delay + 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-medium text-white/40 tracking-widest uppercase">本周进度</span>
            <motion.span
              className="text-[11px] font-medium text-blue-400/60 tabular-nums"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.2 }}
            >
              68%
            </motion.span>
          </div>
          <ProgressBarAnimated value={68} delay={3.0} />
        </div>

        <ChatRotator />
      </motion.div>
    </motion.div>
  );
}

/* ============================================================
   Floating Glass Stat Cards
   ============================================================ */
const STAT_CARDS = [
  { id: "focus", label: "今日专注", value: "52 min", x: 85, y: 10, delay: 0 },
  { id: "rate", label: "完成率", value: "87%", x: 5, y: 18, delay: 0.6 },
  { id: "streak", label: "已连续学习", value: "14 天", x: 87, y: 46, delay: 1.2 },
  { id: "english", label: "英语状态", value: "提升中 \u2191", x: 3, y: 60, delay: 1.8 },
  { id: "advice", label: "AI 建议", value: "调整数学进度", x: 85, y: 75, delay: 2.4 },
  { id: "rest", label: "休息提醒", value: "学习 45 分钟", x: 7, y: 82, delay: 3.0 },
];

function FloatingStatCards({ mouseX, mouseY }: { mouseX: any; mouseY: any }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden hidden xl:block" aria-hidden>
      {STAT_CARDS.map((card) => {
        const cx = useTransform(mouseX, [-1, 1], [-4, 4]);
        const cy = useTransform(mouseY, [-1, 1], [-4, 4]);
        return (
          <motion.div
            key={card.id}
            className="absolute rounded-xl liquid-glass-card px-3 py-2"
            style={{
              left: card.x + "%",
              top: card.y + "%",
              x: cx,
              y: cy,
            }}
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: card.delay + 0.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[9px] font-medium text-white/30 tracking-wider">{card.label}</p>
            <p className="text-sm font-semibold text-white/80 mt-0.5">{card.value}</p>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ============================================================
   Gradient Text
   ============================================================ */
function GradientText({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="bg-clip-text text-transparent"
      style={{
        backgroundImage: "linear-gradient(135deg, #ffffff 0%, #5EA8FF 30%, #FFD76A 65%, #ffffff 100%)",
        backgroundSize: "400% 400%",
        animation: "heroGrad 8s ease-in-out infinite",
      }}
    >
      {children}
    </span>
  );
}

/* ============================================================
   Scroll Indicator
   ============================================================ */
function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3.5, duration: 1 }}
    >
      <motion.div
        className="flex flex-col items-center gap-1"
        animate={{ y: [0, 4, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg className="h-5 w-5 text-white/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <rect x="7" y="3" width="10" height="18" rx="5" />
          <motion.line
            x1="12" y1="8" x2="12" y2="12"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
        <span className="text-[10px] font-medium text-white/20 tracking-widest">向下了解</span>
      </motion.div>
    </motion.div>
  );
}

/* ============================================================
   Hero — Main Component
   ============================================================ */
export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 35, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 35, damping: 20 });

  const textX = useTransform(smoothMouseX, [-1, 1], [-2, 2]);
  const textY = useTransform(smoothMouseY, [-1, 1], [-2, 2]);

  const handleMouse = useMemo(
    () => (e: React.MouseEvent) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      mouseX.set((e.clientX - cx) / rect.width);
      mouseY.set((e.clientY - cy) / rect.height);
    },
    [mouseX, mouseY],
  );

  const handleLeave = useMemo(
    () => () => { mouseX.set(0); mouseY.set(0); },
    [mouseX, mouseY],
  );

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 500], [1, 0.97]);

  return (
    <>
      <style>{`
        /* ======== Liquid Glass ======== */
        .liquid-glass {
          background: rgba(255, 255, 255, 0.02);
          background-blend-mode: luminosity;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: none;
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.08);
          position: relative;
          overflow: hidden;
        }
        .liquid-glass::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1.2px;
          background: linear-gradient(180deg,
            rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.10) 25%,
            rgba(255,255,255,0) 45%, rgba(255,255,255,0) 55%,
            rgba(255,255,255,0.10) 75%, rgba(255,255,255,0.35) 100%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }

        .liquid-glass-card {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: none;
          box-shadow: inset 0 1px 0.5px rgba(255, 255, 255, 0.08);
          position: relative;
          overflow: hidden;
        }
        .liquid-glass-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(180deg,
            rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.08) 30%,
            rgba(255,255,255,0) 50%, rgba(255,255,255,0.08) 70%,
            rgba(255,255,255,0.30) 100%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }

        .liquid-glass-subtle {
          background: rgba(255, 255, 255, 0.015);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        @keyframes heroGrad {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>

      <section
        ref={sectionRef}
        onMouseMove={handleMouse}
        onMouseLeave={handleLeave}
        className="relative min-h-screen overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, #18284a 0%, #0e1930 40%, #0b1220 70%, #070d17 100%)",
        }}
      >
        {/* Layer 2 — Aurora */}
        <AuroraLayer mouseX={smoothMouseX} mouseY={smoothMouseY} />

        {/* Layer 5 — Grid */}
        <GridLayer />

        {/* Layer 4 — Particles */}
        <ParticlesLayer mouseX={smoothMouseX} mouseY={smoothMouseY} />

        {/* Layer 6 — Noise */}
        <NoiseLayer />

        {/* Layer 3 — Breathing Light */}
        <BreathingLight />

        {/* Overlay — Like Lumora PNG train-bob */}
        <DriftOverlay />

        {/* Layer 7 — Floating Stat Cards */}
        <FloatingStatCards mouseX={smoothMouseX} mouseY={smoothMouseY} />

        {/* Layer 8 — Main Content */}
        <motion.div
          className="relative z-10 mx-auto max-w-6xl px-6 pt-32 pb-24 md:pt-40 md:pb-28"
          style={{ opacity: heroOpacity, scale: heroScale }}
        >
          <div className="flex flex-col items-center gap-14 md:flex-row md:items-start md:justify-between">
            {/* Left */}
            <motion.div
              className="flex-1 pt-4 text-center md:text-left max-w-xl"
              style={{ x: textX, y: textY }}
            >
              {/* Badge */}
              <motion.div
                className="inline-flex items-center gap-1.5 rounded-full text-xs font-medium tracking-wide text-amber-300/60 mb-8 liquid-glass px-3.5 py-1.5"
                initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <span>{'✦'}</span> AI 长期陪伴型考研教练
              </motion.div>

              {/* Headline */}
              <motion.h1
                className="text-[clamp(2rem,5.5vw,4rem)] font-bold leading-[1.08] tracking-tight"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
              >
                <motion.span
                  className="block text-white"
                  variants={{
                    hidden: { opacity: 0, y: 50, filter: "blur(12px)" },
                    visible: {
                      opacity: 1, y: 0, filter: "blur(0px)",
                      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
                    },
                  }}
                >
                  不是一个人
                </motion.span>
                <motion.span
                  className="block mt-1 text-white"
                  variants={{
                    hidden: { opacity: 0, y: 50, filter: "blur(12px)" },
                    visible: {
                      opacity: 1, y: 0, filter: "blur(0px)",
                      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
                    },
                  }}
                >
                  是陪你走完
                </motion.span>
                <motion.span
                  className="block mt-1"
                  variants={{
                    hidden: { opacity: 0, y: 50, filter: "blur(12px)" },
                    visible: {
                      opacity: 1, y: 0, filter: "blur(0px)",
                      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
                    },
                  }}
                >
                  <GradientText>三百天</GradientText>的人。
                </motion.span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className="mt-6 mx-auto md:mx-0 max-w-[560px] text-base leading-relaxed text-white/60 md:text-[15px] md:leading-8"
                initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                \u4ECE\u4F60\u5199\u4E0B\u76EE\u6807\u90A3\u5929\u8D77\uFF0C\u5C0F\u4F34\u4F1A\u8BB0\u4F4F\u4F60\u7684\u76EE\u6807\u3001\u4F60\u7684\u75B2\u60EB\u3001\u4F60\u6BCF\u4E00\u6B21\u60F3\u653E\u5F03\u7684\u5FF5\u5934\u3002
                \u5B83\u4E0D\u662F\u5DE5\u5177\u3002\u662F\u5728\u8FD9三百天\u91CC\uFF0C\u4E00\u76F4\u966A\u7740\u4F60\u8D70的人。
              </motion.p>

              {/* Buttons */}
              <motion.div
                className="mt-9 flex flex-col items-center gap-3 sm:flex-row md:justify-start"
                initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/signup"
                    className="relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-xl px-8 text-sm font-semibold text-[#0F172A] shadow-lg transition-shadow duration-300"
                    style={{
                      background: "linear-gradient(135deg, #ffffff 0%, #e0e8f5 100%)",
                      boxShadow: "0 8px 32px rgba(76,145,255,0.25)",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 12px 44px rgba(76,145,255,0.4)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(76,145,255,0.25)"; }}
                  >
                    <span className="relative z-10">开始备考</span>
                    <motion.span
                      className="relative z-10 inline-block"
                      initial={{ x: 0 }}
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {'→'}
                    </motion.span>
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="#"
                    className="inline-flex h-12 items-center justify-center rounded-xl text-sm font-medium text-white/50 transition-all duration-300 liquid-glass px-8"
                  >
                    了解更多
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Right: Dashboard */}
            <DashboardMockup mouseX={smoothMouseX} mouseY={smoothMouseY} />
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <ScrollIndicator />

        {/* Bottom fade */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 z-10"
          style={{ background: "linear-gradient(to bottom, transparent 0%, #0F172A 100%)" }}
        />
      </section>
    </>
  );
}
