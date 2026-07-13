"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";

/* ============================================================
   Layer 4 — Floating Particles (100 dots)
   ============================================================ */
const PARTICLE_COUNT = 100;
const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  r: 0.8 + Math.random() * 2.4,
  dur: 20 + Math.random() * 40,
  delay: Math.random() * -30,
  dx: (Math.random() - 0.5) * 50,
  dy: -10 - Math.random() * 30,
  baseOp: 0.1 + Math.random() * 0.35,
}));

/* ============================================================
   Layer 7 — Floating Glass Stat Cards
   ============================================================ */
const STAT_CARDS = [
  { id: "focus", label: "今日专注", value: "52 min", x: 82, y: 8, delay: 0 },
  { id: "rate", label: "完成率", value: "87%", x: 6, y: 16, delay: 0.6 },
  { id: "streak", label: "已连续学习", value: "14 天", x: 86, y: 44, delay: 1.2 },
  { id: "english", label: "英语状态", value: "提升中 \u2191", x: 4, y: 58, delay: 1.8 },
  { id: "advice", label: "AI 建议", value: "调整数学进度", x: 84, y: 73, delay: 2.4 },
  { id: "rest", label: "休息提醒", value: "学习 45 分钟", x: 8, y: 80, delay: 3.0 },
];

/* ============================================================
   Chat Bubble Pool (rotating messages)
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
   Layer 2 — Aurora Blobs
   ============================================================ */
const AURORA_BLOBS = [
  { color: "rgba(76,145,255,0.12)", x: 10, y: 5, w: 700, h: 700, dur: 22, dx: 50, dy: -30 },
  { color: "rgba(139,92,246,0.09)", x: 60, y: 15, w: 600, h: 600, dur: 25, dx: -40, dy: 35 },
  { color: "rgba(6,182,212,0.07)", x: 30, y: 50, w: 550, h: 550, dur: 28, dx: 35, dy: -25 },
  { color: "rgba(76,145,255,0.06)", x: 70, y: 60, w: 500, h: 500, dur: 24, dx: -30, dy: 20 },
];

/* ============================================================
   Layer 5 — Grid
   ============================================================ */
function GridLayer() {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      aria-hidden
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), " +
          "linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
      }}
      animate={{ backgroundPosition: ["0px 0px", "64px 64px"] }}
      transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
    />
  );
}

/* ============================================================
   Layer 6 — Noise
   ============================================================ */
function NoiseLayer() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
      style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        backgroundSize: "200px 200px",
      }}
      aria-hidden
    />
  );
}

/* ============================================================
   Partner Avatar — Breathing + Glow
   ============================================================ */
function PartnerAvatar() {
  return (
    <motion.div
      className="relative flex h-10 w-10 items-center justify-center"
      animate={{ scale: [1, 1.04, 1] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(251,191,36,0.13) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.35, 1], opacity: [0.4, 0.85, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* orb */}
      <svg className="relative h-6 w-6 z-10" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" fill="rgba(251,191,36,0.15)" stroke="rgba(251,191,36,0.25)" strokeWidth="0.5" />
        <motion.g
          animate={{ rotate: [0, 4, -4, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
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
          stroke="rgba(251,191,36,0.25)"
          strokeWidth="0.5"
          strokeLinecap="round"
          animate={{ d: ["M9.5 15c1.5 0.8 3.5 0.8 5 0", "M9.5 14.5c1.5 1 3.5 1 5 0"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </motion.div>
  );
}

/* ============================================================
   Countdown — Ticking Number
   ============================================================ */
function CountdownBlock() {
  const [count, setCount] = useState(183);
  useEffect(() => {
    const t = setInterval(() => setCount((c) => (c > 150 ? c - 1 : 182)), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div>
      <p className="text-[10px] font-medium tracking-wider text-white/30 uppercase">距离考研</p>
      <div className="flex items-baseline gap-1.5 mt-0.5">
        <motion.span
          key={count}
          className="text-2xl font-bold tracking-tight text-white"
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
    <div
      className="rounded-2xl rounded-tl-sm border px-4 py-3"
      style={{
        borderColor: "rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.03)",
      }}
    >
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
   Dashboard Mockup
   ============================================================ */
function DashboardMockup({ mouseX, mouseY }: { mouseX: any; mouseY: any }) {
  const rotateX = useTransform(mouseY, [-1, 1], [3, -3]);
  const rotateY = useTransform(mouseX, [-1, 1], [-3, 3]);
  const cardX = useSpring(mouseX, { stiffness: 40, damping: 25 });
  const cardY = useSpring(mouseY, { stiffness: 40, damping: 25 });

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
        className="relative rounded-[32px] border p-5 shadow-2xl"
        style={{
          borderColor: "rgba(255,255,255,0.07)",
          background: "rgba(15,23,42,0.55)",
          backdropFilter: "blur(30px)",
          WebkitBackdropFilter: "blur(30px)",
          boxShadow:
            "0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 0 1px rgba(255,255,255,0.03)",
          transformStyle: "preserve-3d",
        }}
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Top: countdown + partner */}
        <div className="flex items-start justify-between mb-5">
          <CountdownBlock />
          <PartnerAvatar />
        </div>

        {/* Today's Tasks */}
        <div className="mb-4">
          <p className="text-[11px] font-medium text-white/40 mb-3 tracking-wide uppercase">
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
                {/* Checkbox */}
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
                      className="h-2.5 w-2.5 text-emerald-400"
                      viewBox="0 0 12 12" fill="none"
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
                        background:
                          task.p === 100
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

        {/* Weekly Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-medium text-white/40 tracking-wide uppercase">
              本周进度
            </span>
            <motion.span
              className="text-[11px] font-medium text-blue-400/60 tabular-nums"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.2 }}
            >
              68%
            </motion.span>
          </div>
          <ProgressBarAnimated value={68} delay={3.0} />
        </div>

        {/* Rotating Chat */}
        <ChatRotator />
      </motion.div>
    </motion.div>
  );
}

/* ============================================================
   Layer 2 — Aurora
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
              duration: b.dur,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2,
            }}
          />
        );
      })}
    </div>
  );
}

/* ============================================================
   Layer 4 — Particles
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
              left: p.x + "%",
              top: p.y + "%",
              width: p.r + "px",
              height: p.r + "px",
              x: px,
              y: py,
            }}
            animate={{
              y: [0, p.dy * 0.6, p.dy * 0.3, p.dy * 0.8, 0],
              x: [0, p.dx * 0.4, -p.dx * 0.2, p.dx * 0.3, 0],
              opacity: [p.baseOp, p.baseOp * 2, p.baseOp * 0.4, p.baseOp * 1.5, p.baseOp],
              scale: [1, 1.4, 0.7, 1.2, 1],
            }}
            transition={{
              duration: p.dur,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
}

/* ============================================================
   Layer 7 — Floating Glass Stat Cards
   ============================================================ */
function FloatingStatCards({ mouseX, mouseY }: { mouseX: any; mouseY: any }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden hidden xl:block" aria-hidden>
      {STAT_CARDS.map((card) => {
        const cx = useTransform(mouseX, [-1, 1], [-4, 4]);
        const cy = useTransform(mouseY, [-1, 1], [-4, 4]);
        return (
          <motion.div
            key={card.id}
            className="absolute rounded-xl border backdrop-blur-md"
            style={{
              left: card.x + "%",
              top: card.y + "%",
              borderColor: "rgba(255,255,255,0.05)",
              background: "rgba(15,23,42,0.4)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              x: cx,
              y: cy,
              padding: "8px 14px",
            }}
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: card.delay + 0.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -2, scale: 1.03, borderColor: "rgba(255,255,255,0.12)" }}
          >
            <p className="text-[9px] font-medium text-white/30 tracking-wide">{card.label}</p>
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
  const smoothMouseX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 40, damping: 20 });

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
    () => () => {
      mouseX.set(0);
      mouseY.set(0);
    },
    [mouseX, mouseY],
  );

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 500], [1, 0.97]);

  return (
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
      {/* ======== Layer Order ======== */}

      {/* Layer 2 — Aurora */}
      <AuroraLayer mouseX={smoothMouseX} mouseY={smoothMouseY} />

      {/* Layer 5 — Grid */}
      <GridLayer />

      {/* Layer 4 — Particles */}
      <ParticlesLayer mouseX={smoothMouseX} mouseY={smoothMouseY} />

      {/* Layer 6 — Noise */}
      <NoiseLayer />

      {/* Layer 3 — Breathing Radial Light (behind heading) */}
      <div className="pointer-events-none absolute top-[15%] left-1/2 -translate-x-1/2" aria-hidden>
        <motion.div
          className="h-[700px] w-[900px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(76,145,255,0.15) 0%, transparent 55%)",
            filter: "blur(80px)",
          }}
          animate={{ scale: [0.95, 1.08, 0.95], opacity: [0.15, 0.22, 0.15] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Layer 7 — Floating Stat Cards */}
      <FloatingStatCards mouseX={smoothMouseX} mouseY={smoothMouseY} />

      {/* Layer 8 — Main Content */}
      <motion.div
        className="relative z-10 mx-auto max-w-6xl px-6 pt-32 pb-24 md:pt-40 md:pb-28"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        <div className="flex flex-col items-center gap-14 md:flex-row md:items-start md:justify-between">
          {/* Left: Text */}
          <motion.div
            className="flex-1 pt-4 text-center md:text-left max-w-xl"
            style={{ x: textX, y: textY }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium tracking-wide text-amber-300/60 mb-8"
              style={{
                borderColor: "rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
              initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.03, borderColor: "rgba(255,255,255,0.15)" }}
            >
              <span>{'\u2726'}</span> AI 长期陪伴型考研教练
            </motion.div>

            {/* Headline with stagger */}
            <motion.h1
              className="text-[clamp(2rem,5.5vw,4rem)] font-bold leading-[1.08] tracking-tight"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.12 } },
              }}
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
              从你写下目标那天起，小伴会记住你的目标、你的疲惫、你每一次想放弃的念头。
              它不是工具。是在这三百天里，一直陪着你走的人。
            </motion.p>

            {/* Buttons */}
            <motion.div
              className="mt-9 flex flex-col items-center gap-3 sm:flex-row md:justify-start"
              initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }} className="group">
                <Link
                  href="/signup"
                  className="relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-xl px-8 text-sm font-semibold text-[#0F172A] shadow-lg transition-shadow duration-300"
                  style={{
                    background: "linear-gradient(135deg, #ffffff 0%, #e0e8f5 100%)",
                    boxShadow: "0 8px 32px rgba(76,145,255,0.25)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 12px 44px rgba(76,145,255,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 8px 32px rgba(76,145,255,0.25)";
                  }}
                >
                  <span className="relative z-10">开始备考</span>
                  <motion.span
                    className="relative z-10 inline-block"
                    initial={{ x: 0 }}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {'\u2192'}
                  </motion.span>
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="#"
                  className="inline-flex h-12 items-center justify-center rounded-xl border px-8 text-sm font-medium text-white/50 transition-all duration-300"
                  style={{
                    borderColor: "rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.03)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                  }}
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

      {/* Bottom fade to next section */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 z-10"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, #0F172A 100%)",
        }}
      />

      <style>{`
        @keyframes heroGrad {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </section>
  );
}
