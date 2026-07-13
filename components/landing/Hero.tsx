"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import {
  Calendar,
  Target,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

/* ──────────────── Liquid Glass CSS ──────────────── */

function LiquidGlass({ children, className = "", style = {} }: any) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background: "rgba(255,255,255,0.01)",
        backgroundBlendMode: "luminosity",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        border: "none",
        boxShadow: "inset 0 1px 1px rgba(255,255,255,0.1)",
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
      {/* ::before gradient border */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          padding: "1.4px",
          background: "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 20%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.15) 80%, rgba(255,255,255,0.45) 100%)",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          pointerEvents: "none",
          borderRadius: "inherit",
        }}
      />
      {children}
    </div>
  );
}

/* ──────────────── Glass Overlay (Lumora PNG membrane effect) ──────────────── */

function GlassOverlay() {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-[1]"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.01) 100%)",
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
        transform: "scale(1.03)",
      }}
      animate={{ y: [0, -6, 0] }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

/* ──────────────── Aurora Background ──────────────── */

function AuroraBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 80% 60% at 50% 30%, #172540 0%, #0B1426 45%, #070D17 100%)",
      }} />

      <motion.div
        className="absolute -top-1/4 -left-1/4 h-[800px] w-[800px] rounded-full opacity-[0.15]"
        style={{ background: "radial-gradient(circle, rgba(76,145,255,0.35) 0%, transparent 70%)", filter: "blur(100px)" }}
        animate={{ x: [0, 60, -40, 30, 0], y: [0, -50, 30, -20, 0], scale: [1, 1.08, 0.95, 1.05, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 -right-1/4 h-[600px] w-[600px] rounded-full opacity-[0.10]"
        style={{ background: "radial-gradient(circle, rgba(130,90,255,0.25) 0%, transparent 70%)", filter: "blur(100px)" }}
        animate={{ x: [0, -50, 40, -30, 0], y: [0, 40, -60, 20, 0], scale: [1, 0.92, 1.06, 0.97, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="absolute -bottom-1/4 left-1/3 h-[500px] w-[500px] rounded-full opacity-[0.08]"
        style={{ background: "radial-gradient(circle, rgba(255,215,106,0.2) 0%, transparent 70%)", filter: "blur(120px)" }}
        animate={{ x: [0, 30, -50, 20, 0], y: [0, -30, 20, -40, 0], scale: [1, 1.04, 0.96, 1.03, 1] }}
        transition={{ duration: 35, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      />

      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
      }} />

      <motion.div
        className="absolute top-1/4 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.12]"
        style={{ background: "radial-gradient(circle, rgba(76,145,255,0.30) 0%, transparent 70%)", filter: "blur(80px)" }}
        animate={{ scale: [0.95, 1.08, 0.95] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="absolute inset-0 opacity-[0.025]" style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        backgroundSize: "256px 256px",
      }} />
    </div>
  );
}

/* ──────────────── Particles ──────────────── */

function Particles() {
  const items = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    size: Math.random() * 2 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    opacity: Math.random() * 0.25 + 0.05,
    duration: Math.random() * 30 + 20,
    delay: Math.random() * 15,
    driftX: (Math.random() - 0.5) * 40,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
      {items.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%`, opacity: p.opacity }}
          animate={{ y: [0, -30, 0], x: [0, p.driftX, 0], opacity: [p.opacity, p.opacity * 1.5, p.opacity] }}
          transition={{ duration: p.duration, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
        />
      ))}
    </div>
  );
}

/* ──────────────── Dashboard Mockup ──────────────── */

interface Task {
  subject: string;
  content: string;
  progress: number;
  time: string;
  done: boolean;
}

const TASKS: Task[] = [
  { subject: "数学", content: "函数与极限复习", progress: 70, time: "2h", done: false },
  { subject: "英语", content: "核心词汇 80 个", progress: 40, time: "1h", done: false },
  { subject: "数据结构", content: "链表基础练习", progress: 100, time: "1.5h", done: true },
];

const CHATS = [
  "今天数学完成后，我们继续英语。",
  "先做最简单的题，找回节奏。",
  "连续学习3天，状态不错。",
  "函数极限是基础，慢慢来。",
];

function DashboardMockup({ mouseX, mouseY }: { mouseX: any; mouseY: any }) {
  const [tasks, setTasks] = useState(TASKS);
  const [mounted, setMounted] = useState(false);
  const [chatIdx, setChatIdx] = useState(0);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => setChatIdx((i) => (i + 1) % CHATS.length), 5500);
    return () => clearInterval(interval);
  }, []);

  const ry = useSpring(mouseX.get() * -0.15, { stiffness: 150, damping: 20 });
  const rx = useSpring(mouseY.get() * 0.15, { stiffness: 150, damping: 20 });

  useEffect(() => {
    const ux = mouseX.on("change", (v: number) => ry.set(v * -0.15));
    const uy = mouseY.on("change", (v: number) => rx.set(v * 0.15));
    return () => { ux(); uy(); };
  }, [mouseX, mouseY, ry, rx]);

  if (!mounted) return <div className="h-[520px] w-full max-w-[480px] animate-pulse rounded-3xl bg-white/[0.03]" />;

  return (
    <motion.div className="group relative w-full max-w-[480px]" style={{ perspective: "1000px" }}>
      <div className="pointer-events-none absolute -inset-4 opacity-20 blur-3xl transition-all duration-1000 group-hover:opacity-40">
        <div className="h-full w-full animate-pulse rounded-3xl bg-gradient-to-br from-blue-500/30 via-purple-500/10 to-transparent" />
      </div>

      <LiquidGlass className="rounded-3xl shadow-2xl shadow-black/50">
        <motion.div style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}>
          {/* Window bar */}
          <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-[#FF5F56]" />
              <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
              <div className="h-3 w-3 rounded-full bg-[#27C93F]" />
            </div>
            <div className="flex-1 text-center">
              <span className="text-xs font-medium tracking-wide text-white/30">小伴 · 今天的学习</span>
            </div>
          </div>

          <div className="space-y-4 p-5">
            {/* Countdown + Goal */}
            <motion.div className="flex items-start justify-between" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }}>
              <div>
                <div className="mb-1 flex items-center gap-1.5 text-xs text-white/40">
                  <Calendar className="h-3 w-3" />
                  距离考研
                </div>
                <div className="text-3xl font-bold tracking-tight text-white">
                  <AnimatedNumber value={166} />
                  <span className="ml-1 text-base font-normal text-white/40">天</span>
                </div>
              </div>
              <div className="text-right">
                <div className="mb-0.5 text-xs text-white/40">目标院校</div>
                <div className="text-sm font-semibold text-white">北京邮电大学</div>
                <div className="text-xs text-white/50">计算机科学与技术</div>
              </div>
            </motion.div>

            {/* Weekly Progress */}
            <motion.div className="rounded-xl border border-white/[0.06] p-3.5" style={{ background: "rgba(255,255,255,0.03)" }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.8 }}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-white/60">本周进度</span>
                <motion.span className="text-sm font-bold text-emerald-400" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 1.2 }}>
                  <AnimatedNumber value={68} suffix="%" />
                </motion.span>
              </div>
              <ProgressBar value={68} color="bg-emerald-500" />
            </motion.div>

            {/* Tasks */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.0 }}>
              <div className="mb-3 flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-semibold text-white/80">今日任务</span>
              </div>
              <div className="space-y-2">
                {tasks.map((task, i) => (
                  <motion.div
                    key={i}
                    className="cursor-pointer rounded-xl border border-white/[0.06] p-3 transition-all duration-200"
                    style={{ background: "rgba(255,255,255,0.02)" }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 1.2 + i * 0.15 }}
                    whileHover={{ y: -2, borderColor: "rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)" }}
                    onClick={() => setTasks((prev) => prev.map((t, j) => j === i ? { ...t, done: !t.done, progress: t.done ? t.progress : 100 } : t))}
                  >
                    <div className="flex items-start gap-3">
                      <button className="mt-0.5 shrink-0 transition-all hover:scale-110 active:scale-90">
                        {task.done ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 drop-shadow-[0_0_4px_rgba(52,211,153,0.3)]" />
                        ) : (
                          <Circle className="h-4 w-4 text-white/20 hover:text-white/40" />
                        )}
                      </button>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${task.done ? "bg-emerald-500/20 text-emerald-300" : "bg-white/[0.06] text-white/50"}`}>{task.subject}</span>
                          <span className={`text-xs ${task.done ? "text-white/30 line-through" : "text-white/70"}`}>{task.content}</span>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <ProgressBar value={task.progress} color={task.progress === 100 ? "bg-emerald-500" : task.progress > 50 ? "bg-blue-500" : "bg-amber-500"} />
                          <span className="shrink-0 text-[10px] text-white/30">{task.progress}%</span>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-1 text-[10px] text-white/30">
                        <Clock className="h-3 w-3" />
                        {task.time}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* AI Coach Chat Bubble */}
            <motion.div
              className="relative rounded-xl border border-blue-500/20 p-3.5 transition-all duration-300 hover:border-blue-500/30 hover:shadow-[0_0_12px_rgba(59,130,246,0.1)]"
              style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(59,130,246,0.02) 100%)" }}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.8 }}
            >
              <div className="absolute -top-1.5 left-4 h-3 w-3 rotate-45" style={{ background: "rgba(59,130,246,0.08)" }} />
              <div className="flex items-start gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-500/20">
                  <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-blue-300">AI 教练</span>
                    <motion.span className="text-[10px] text-white/20" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>刚刚</motion.span>
                  </div>
                  <div className="relative mt-0.5 h-10 overflow-hidden">
                    {CHATS.map((msg, i) => (
                      <motion.p key={i} className="absolute left-0 right-0 text-xs leading-relaxed text-white/60" initial={{ opacity: 0, y: 10 }} animate={i === chatIdx ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }} transition={{ duration: 0.5 }}>
                        {msg}
                      </motion.p>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      </LiquidGlass>
    </motion.div>
  );
}

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    let start = 0;
    const step = Math.max(1, Math.floor(value / 40));
    ref.current = setInterval(() => {
      start += step;
      if (start >= value) { setDisplay(value); if (ref.current) clearInterval(ref.current); }
      else setDisplay(start);
    }, 25);
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [value]);
  return <span>{display}{suffix}</span>;
}

function ProgressBar({ value, color = "bg-blue-500" }: { value: number; color?: string }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
      <motion.div className={`h-full rounded-full ${color}`} initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 1.5, ease: "easeOut", delay: 0.8 }} />
    </div>
  );
}

/* ──────────────── Floating Stats ──────────────── */

const STATS = [
  { label: "今日专注", value: "87%" },
  { label: "已连续学习", value: "14 天" },
  { label: "英语状态", value: "提升中" },
];

function FloatingStats() {
  return (
    <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 hidden lg:block">
      <div className="mx-auto flex max-w-5xl items-center justify-center gap-4 pb-6">
        {STATS.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 2.5 + i * 0.15 }}
            whileHover={{ y: -2, background: "rgba(255,255,255,0.06)" }}
          >
            <LiquidGlass className="rounded-xl px-4 py-2.5">
              <div className="text-[10px] text-white/40">{s.label}</div>
              <div className="text-sm font-semibold text-white">{s.value}</div>
            </LiquidGlass>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ──────────────── Nav ──────────────── */

function HeroNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 right-0 z-20 px-5 pt-4">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight text-white">AI教练</span>
        </Link>

        <div className="hidden items-center gap-4 md:flex">
          <LiquidGlass className="flex items-center gap-4 rounded-full px-5 py-1.5">
            <Link href="/login" className="text-sm text-white/70 transition-colors hover:text-white">登录</Link>
            <Link href="/signup">
              <motion.span
                className="inline-flex h-7 items-center rounded-full bg-white px-4 text-xs font-semibold text-[#0F172A] transition-all duration-300 hover:shadow-lg"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                免费注册
              </motion.span>
            </Link>
          </LiquidGlass>
        </div>

        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          <LiquidGlass className="flex h-9 w-9 items-center justify-center rounded-full">
            <motion.div animate={{ rotate: mobileOpen ? 90 : 0, scale: mobileOpen ? 0.75 : 1 }} transition={{ duration: 0.3 }}>
              {mobileOpen ? <X className="h-4 w-4 text-white" /> : <Menu className="h-4 w-4 text-white" />}
            </motion.div>
          </LiquidGlass>
        </button>
      </div>

      {mobileOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setMobileOpen(false)}
        >
          {["登录", "免费注册", "功能介绍", "关于我们"].map((text, i) => (
            <motion.div
              key={text}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.05, ease: [0.4, 0, 0.2, 1] }}
            >
              <Link
                href={text === "免费注册" ? "/signup" : text === "登录" ? "/login" : "#"}
                className={`text-3xl text-white ${text === "免费注册" ? "font-bold" : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                {text}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </header>
  );
}

/* ──────────────── Main Hero ──────────────── */

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
      mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [mouseX, mouseY]
  );

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <section className="relative h-screen bg-[#08111f]" />;

  return (
    <section className="relative h-screen overflow-hidden bg-[#08111f]" onMouseMove={handleMouseMove}>
      <AuroraBackground />
      <Particles />

      {/* Glass membrane overlay — train-bob animation */}
      <GlassOverlay />

      <HeroNav />

      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col px-5 pt-20 lg:pt-0">
        <div className="flex flex-1 flex-col items-center justify-center gap-8 lg:flex-row lg:gap-16">
          {/* Left: Text */}
          <motion.div className="flex max-w-xl flex-col items-center text-center lg:items-start lg:text-left" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              whileHover={{ scale: 1.03, borderColor: "rgba(255,255,255,0.15)" }}
            >
              <LiquidGlass className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5">
                <span className="text-xs font-medium tracking-wide text-white/70">
                  <span className="text-blue-300">✦</span> AI 长期陪伴型考研教练
                </span>
              </LiquidGlass>
            </motion.div>

            {/* Heading */}
            <h1 className="mb-4 text-4xl font-bold leading-[1.15] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              {["不是一个人", "是陪你走完", "三百天的人。"].map((line, i) => (
                <motion.span
                  key={i}
                  className={`block ${i === 2 ? "bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-200 bg-clip-text text-transparent" : ""}`}
                  style={i === 2 ? { backgroundSize: "200% 100%", animation: "gradientShift 8s ease infinite" } : {}}
                  initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.8, delay: 0.1 + i * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  {line}
                </motion.span>
              ))}
            </h1>

            {/* Subtitle */}
            <motion.p
              className="mb-8 max-w-lg text-sm leading-relaxed text-white/60 sm:text-base"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            >
              从你写下目标那天起，小伴会记住你的目标、你的疲惫、你每一次想放弃的念头。它不是工具。是在这三百天里，一直陪着你走的人。
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Link href="/signup">
                <motion.button
                  className="group relative inline-flex h-11 items-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-[#0F172A] shadow-lg shadow-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-white/20"
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  开始备考
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </motion.button>
              </Link>
              <Link href="#learn-more">
                <LiquidGlass className="inline-flex h-11 items-center rounded-xl px-5">
                  <span className="text-sm font-medium text-white/70 transition-all duration-300 hover:text-white/90">了解更多</span>
                </LiquidGlass>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right: Dashboard Mockup */}
          <motion.div
            className="w-full max-w-[480px] shrink-0"
            initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <DashboardMockup mouseX={mouseX} mouseY={mouseY} />
          </motion.div>
        </div>

        <div className="flex-1" />
      </div>

      <FloatingStats />

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-32" style={{ background: "linear-gradient(to bottom, transparent 0%, #08111f 100%)" }} />

      <motion.div className="absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-1 lg:flex" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 2.5 }}>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
          <ChevronDown className="h-4 w-4 text-white/20" />
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </section>
  );
}
