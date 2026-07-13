"use client";

import { useRef, useMemo } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useScroll, useTransform } from "framer-motion";

/* ============================================ */

const BLOBS = [
  { x: 15, y: 10, w: 600, h: 600, c: "rgba(76,145,255,0.12)", dur: 28, dx: 40, dy: -25 },
  { x: 75, y: 20, w: 550, h: 550, c: "rgba(139,92,246,0.10)", dur: 34, dx: -35, dy: 30 },
  { x: 60, y: 65, w: 500, h: 500, c: "rgba(255,215,106,0.08)", dur: 30, dx: 25, dy: -20 },
  { x: 25, y: 55, w: 650, h: 650, c: "rgba(6,182,212,0.09)", dur: 38, dx: -30, dy: 20 },
];

const PARTICLES = Array.from({ length: 100 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  r: Math.random() * 2.5 + 0.5,
  dur: 25 + Math.random() * 40,
  delay: Math.random() * 20,
  driftX: (Math.random() - 0.5) * 40,
  driftY: (Math.random() - 0.5) * 40,
  baseOp: 0.15 + Math.random() * 0.35,
}));

const FLOATING_CARDS = [
  { id: "focus", label: "今日专注", value: "52 min", x: 82, y: 8, delay: 0 },
  { id: "rate", label: "完成率", value: "87%", x: 8, y: 14, delay: 0.5 },
  { id: "streak", label: "已连续学习", value: "14 天", x: 85, y: 42, delay: 1.0 },
  { id: "english", label: "英语状态", value: "提升中 ↑", x: 5, y: 55, delay: 1.5 },
  { id: "advice", label: "AI 建议", value: "调整数学进度", x: 83, y: 70, delay: 2.0 },
  { id: "rest", label: "休息提醒", value: "学习 45 分钟", x: 10, y: 78, delay: 2.5 },
];

/* ============================================ */

function GradientBlobs({ mouseX, mouseY }: { mouseX: any; mouseY: any }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {BLOBS.map((b, i) => {
        const sx = useTransform(mouseX, [-1, 1], [-b.dx * 0.15, b.dx * 0.15]);
        const sy = useTransform(mouseY, [-1, 1], [-b.dy * 0.15, b.dy * 0.15]);
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: b.x + "%",
              top: b.y + "%",
              width: b.w + "px",
              height: b.h + "px",
              background: "radial-gradient(circle, " + b.c + " 0%, transparent 70%)",
              x: sx,
              y: sy,
            }}
            animate={{
              x: [0, b.dx, -b.dx * 0.6, b.dx * 0.3, 0],
              y: [0, b.dy, -b.dy * 0.5, b.dy * 0.4, 0],
              scale: [1, 1.05, 0.96, 1.02, 1],
            }}
            transition={{
              duration: b.dur,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 3,
            }}
          />
        );
      })}
    </div>
  );
}

/* ============================================ */

function FloatingParticles({ mouseX, mouseY }: { mouseX: any; mouseY: any }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {PARTICLES.map((p) => {
        const px = useTransform(mouseX, [-1, 1], [-p.driftX * 0.1, p.driftX * 0.1]);
        const py = useTransform(mouseY, [-1, 1], [-p.driftY * 0.1, p.driftY * 0.1]);
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
              x: [0, p.driftX * 0.5, -p.driftX * 0.3, p.driftX * 0.2, 0],
              y: [0, p.driftY * 0.4, -p.driftY * 0.5, p.driftY * 0.3, 0],
              opacity: [p.baseOp, p.baseOp * 1.8, p.baseOp * 0.5, p.baseOp * 1.3, p.baseOp],
              scale: [1, 1.3, 0.8, 1.1, 1],
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

/* ============================================ */

function AnimatedGrid() {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      aria-hidden
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px)," +
          "linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
      }}
      animate={{ backgroundPosition: ["0px 0px", "64px 64px"] }}
      transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
    />
  );
}

/* ============================================ */

function NoiseTexture() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay"
      style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        backgroundSize: "200px 200px",
      }}
      aria-hidden
    />
  );
}

/* ============================================ */

function PartnerAvatar() {
  const eyeVariants = {
    blink: { scaleY: 0.1 },
    open: { scaleY: 1 },
  };

  return (
    <motion.div
      className="relative flex h-10 w-10 items-center justify-center rounded-full"
      style={{
        background: "linear-gradient(135deg, rgba(251,191,36,0.25) 0%, rgba(251,191,36,0.08) 100%)",
      }}
      animate={{ scale: [1, 1.03, 1] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* orb body */}
      <svg className="relative h-6 w-6 z-10" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" fill="rgba(251,191,36,0.2)" stroke="rgba(251,191,36,0.3)" strokeWidth="0.5" />
        <motion.g
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <circle cx="9.5" cy="10.5" r="1.2" fill="rgba(251,191,36,0.6)" />
          <circle cx="14.5" cy="10.5" r="1.2" fill="rgba(251,191,36,0.6)" />
          {/* blink */}
          <motion.rect
            x="8.3" y="9.3" width="2.4" height="0.3" rx="0.15"
            fill="#0F172A"
            animate={{ scaleY: [0, 1, 1, 0] }}
            transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3.5, ease: "easeInOut" }}
          />
          <motion.rect
            x="13.3" y="9.3" width="2.4" height="0.3" rx="0.15"
            fill="#0F172A"
            animate={{ scaleY: [0, 1, 1, 0] }}
            transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3.5, ease: "easeInOut" }}
          />
        </motion.g>
        <motion.path
          d="M9 15c1.5 1 4 1 6 0"
          stroke="rgba(251,191,36,0.3)"
          strokeWidth="0.6"
          strokeLinecap="round"
          animate={{ d: ["M9 15c1.5 1 4 1 6 0", "M9 14.5c1.5 1.2 4 1.2 6 0"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </motion.div>
  );
}

/* ============================================ */

function MiniChat() {
  return (
    <div className="rounded-2xl rounded-tl-sm border px-3.5 py-2.5"
      style={{
        borderColor: "rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.03)",
      }}
    >
      <p className="text-xs leading-relaxed text-white/60">
        今天数学完成以后，
        <br />
        我们再一起复习英语。
      </p>
      <motion.span
        className="inline-block h-3 w-1.5 bg-blue-400/60 ml-0.5"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/* ============================================ */

function ProgressBar({ value = 68 }: { value?: number }) {
  return (
    <div className="h-1 w-full rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
      <motion.div
        className="h-full rounded-full"
        style={{ background: "linear-gradient(90deg, #5EA8FF, #7EC8E3)" }}
        initial={{ width: "0%" }}
        animate={{ width: value + "%" }}
        transition={{ duration: 2, ease: "easeOut", delay: 2.5 }}
      />
    </div>
  );
}

/* ============================================ */

function Countdown() {
  return (
    <div>
      <p className="text-[10px] font-medium tracking-wider text-white/30 uppercase">距离考试</p>
      <div className="flex items-baseline gap-1 mt-0.5">
        <motion.span
          className="text-2xl font-bold tracking-tight text-white"
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          182
        </motion.span>
        <span className="text-xs font-medium text-white/40">Days</span>
      </div>
    </div>
  );
}

/* ============================================ */

function DashboardMockup({ mouseX, mouseY }: { mouseX: any; mouseY: any }) {
  const cardX = useSpring(mouseX, { stiffness: 60, damping: 25 });
  const cardY = useSpring(mouseY, { stiffness: 60, damping: 25 });

  return (
    <motion.div
      className="w-full max-w-[380px] shrink-0 md:w-auto"
      initial={{ opacity: 0, y: 40, scale: 0.95, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 1.0, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
      style={{ x: cardX, y: cardY }}
    >
      <motion.div
        className="relative rounded-[32px] border p-5 shadow-2xl"
        style={{
          borderColor: "rgba(255,255,255,0.06)",
          background: "rgba(17,24,39,0.5)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          boxShadow:
            "0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Top: countdown + avatar */}
        <div className="flex items-start justify-between mb-4">
          <Countdown />
          <PartnerAvatar />
        </div>

        {/* Today's Tasks */}
        <div className="mb-4">
          <p className="text-[11px] font-medium text-white/40 mb-2 tracking-wide uppercase">
            今日任务
          </p>
          <div className="space-y-2">
            {[
              { s: "数学", t: "函数与极限复习", p: 70 },
              { s: "英语", t: "核心词汇 80 个", p: 45 },
              { s: "数据结构", t: "链表基础练习", p: 100 },
            ].map((task, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-2.5 rounded-xl border px-3 py-2"
                style={{
                  borderColor: "rgba(255,255,255,0.04)",
                  background: "rgba(255,255,255,0.02)",
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2 + i * 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.div
                  className={"h-4 w-4 shrink-0 rounded border flex items-center justify-center " +
                    (task.p === 100 ? "border-emerald-500/30 bg-emerald-500/10" : "border-white/10")
                  }
                  animate={task.p < 100 ? { scale: [1, 1.15, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
                >
                  {task.p === 100 && (
                    <motion.svg className="h-2.5 w-2.5 text-emerald-400" viewBox="0 0 12 12" fill="none"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ delay: 2.6, duration: 0.3 }}
                    >
                      <path d="M2.5 6l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>
                  )}
                </motion.div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="shrink-0 rounded bg-white/[0.06] px-1 py-0.5 text-[9px] font-medium text-white/40">
                      {task.s}
                    </span>
                    <span className={"truncate text-xs " + (task.p === 100 ? "text-white/30 line-through" : "text-white/70")}>
                      {task.t}
                    </span>
                  </div>
                  <div className="mt-1 h-0.5 w-full rounded-full" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: task.p === 100
                          ? "linear-gradient(90deg, #65D18A, #4ADE80)"
                          : "linear-gradient(90deg, #5EA8FF, rgba(94,168,255,0.4))",
                      }}
                      initial={{ width: "0%" }}
                      animate={{ width: task.p + "%" }}
                      transition={{ duration: 1.5, delay: 2.5 + i * 0.15, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-medium text-white/40 tracking-wide uppercase">
              本周进度
            </span>
            <span className="text-[11px] font-medium text-blue-400/60">68%</span>
          </div>
          <ProgressBar value={68} />
        </div>

        {/* Mini Chat */}
        <MiniChat />
      </motion.div>
    </motion.div>
  );
}

/* ============================================ */

function FloatingCards({ mouseX, mouseY }: { mouseX: any; mouseY: any }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden hidden lg:block" aria-hidden>
      {FLOATING_CARDS.map((card) => {
        const cx = useTransform(mouseX, [-1, 1], [-6, 6]);
        const cy = useTransform(mouseY, [-1, 1], [-6, 6]);
        return (
          <motion.div
            key={card.id}
            className="absolute rounded-2xl border px-3 py-2"
            style={{
              left: card.x + "%",
              top: card.y + "%",
              borderColor: "rgba(255,255,255,0.05)",
              background: "rgba(17,24,39,0.45)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              x: cx,
              y: cy,
            }}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: card.delay + 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -2, scale: 1.02, borderColor: "rgba(255,255,255,0.1)" }}
          >
            <p className="text-[10px] font-medium text-white/30 tracking-wide">{card.label}</p>
            <p className="text-sm font-semibold text-white/80 mt-0.5">{card.value}</p>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ============================================ */

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
        {/* mouse icon */}
        <svg className="h-5 w-5 text-white/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <rect x="7" y="3" width="10" height="18" rx="5" />
          <motion.line
            x1="12" y1="8" x2="12" y2="12"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
        <span className="text-[10px] font-medium text-white/20 tracking-widest">
          向下了解
        </span>
      </motion.div>
    </motion.div>
  );
}

/* ============================================ */

function GradientText({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="bg-clip-text text-transparent"
      style={{
        backgroundImage: "linear-gradient(135deg, #ffffff 0%, #5EA8FF 35%, #FFD76A 70%, #ffffff 100%)",
        backgroundSize: "300% 300%",
        animation: "heroGradient 8s ease-in-out infinite",
      }}
    >
      {children}
    </span>
  );
}

/* ============================================ */

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const textX = useTransform(smoothMouseX, [-1, 1], [-3, 3]);
  const textY = useTransform(smoothMouseY, [-1, 1], [-3, 3]);

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
  const heroOpacity = useTransform(scrollY, [0, 550], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 550], [1, 0.97]);

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      className="relative min-h-screen overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at top, #172540 0%, #0B1426 45%, #070D17 100%)",
      }}
    >
      {/* ---- Background layers ---- */}
      <GradientBlobs mouseX={smoothMouseX} mouseY={smoothMouseY} />
      <AnimatedGrid />
      <FloatingParticles mouseX={smoothMouseX} mouseY={smoothMouseY} />
      <NoiseTexture />

      {/* Ambient glow behind title */}
      <div className="pointer-events-none absolute top-[12%] left-1/2 -translate-x-1/2" aria-hidden>
        <motion.div
          className="h-[600px] w-[800px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(76,145,255,0.18) 0%, transparent 60%)",
            filter: "blur(80px)",
          }}
          animate={{ scale: [1, 1.04, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Floating decorative cards */}
      <FloatingCards mouseX={smoothMouseX} mouseY={smoothMouseY} />

      {/* ---- Main content ---- */}
      <motion.div
        className="relative z-10 mx-auto max-w-6xl px-6 pt-32 pb-24 md:pt-40 md:pb-28"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        <div className="flex flex-col items-center gap-14 md:flex-row md:items-start md:justify-between">
          {/* Left: text */}
          <motion.div className="flex-1 pt-4 text-center md:text-left max-w-xl" style={{ x: textX, y: textY }}>
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium tracking-wide text-amber-300/60 mb-8"
              style={{
                borderColor: "rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
              initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.03, borderColor: "rgba(255,255,255,0.15)" }}
            >
              <span>✦</span> AI 长期陪伴型考研教练
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="text-[clamp(2.2rem,6vw,4.2rem)] font-bold leading-[1.08] tracking-tight"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.12 } },
              }}
            >
              <motion.span
                className="block text-white"
                variants={{
                  hidden: { opacity: 0, y: 50, filter: "blur(10px)" },
                  visible: {
                    opacity: 1, y: 0, filter: "blur(0px)",
                    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
              >
                不是一个人
              </motion.span>
              <motion.span
                className="block mt-1"
                variants={{
                  hidden: { opacity: 0, y: 50, filter: "blur(10px)" },
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
                  hidden: { opacity: 0, y: 50, filter: "blur(10px)" },
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
              className="mt-6 mx-auto md:mx-0 max-w-[600px] text-base leading-relaxed text-white/60 md:text-[15px] md:leading-8"
              initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              从你写下目标那天起，小伴会记住你的目标、你的疲惫、你每一次想放弃的念头。
              它不是工具。是在这三百天里，一直陪着你走的人。
            </motion.p>

            {/* Buttons */}
            <motion.div
              className="mt-9 flex flex-col items-center gap-3 sm:flex-row md:justify-start"
              initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.6, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="group">
                <Link
                  href="/signup"
                  className="relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-xl px-8 text-sm font-semibold text-[#0F172A] shadow-lg transition-all duration-300"
                  style={{
                    background: "linear-gradient(135deg, #ffffff 0%, #e8edf5 100%)",
                    boxShadow: "0 8px 32px rgba(76,145,255,0.25), 0 2px 4px rgba(255,255,255,0.1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 12px 40px rgba(76,145,255,0.35), 0 4px 8px rgba(255,255,255,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 8px 32px rgba(76,145,255,0.25), 0 2px 4px rgba(255,255,255,0.1)";
                  }}
                >
                  <span className="relative z-10">开始备考</span>
                  <motion.span
                    className="relative z-10 inline-block"
                    initial={{ x: 0 }}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    →
                  </motion.span>
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="#"
                  className="inline-flex h-12 items-center justify-center rounded-xl border px-8 text-sm font-medium text-white/50 backdrop-blur-sm transition-all duration-300 sm:w-auto"
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

          {/* Right: dashboard mockup */}
          <DashboardMockup mouseX={smoothMouseX} mouseY={smoothMouseY} />
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <ScrollIndicator />

      {/* Bottom fade */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 z-10"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, #0F172A 100%)",
        }}
      />

      <style>{`
        @keyframes heroGradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </section>
  );
}
