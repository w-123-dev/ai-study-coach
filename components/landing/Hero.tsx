"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";

/* ──────────────── Aurora background blobs ──────────────── */

function AuroraBlobs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 30%, #172540 0%, #0B1426 45%, #070D17 100%)",
        }}
      />
      <motion.div
        className="absolute -top-1/4 -left-1/4 h-[700px] w-[700px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(76,145,255,0.22) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
        animate={{ x: [0, 60, -40, 30, 0], y: [0, -50, 30, -20, 0], scale: [1, 1.08, 0.95, 1.05, 1] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 -right-1/4 h-[600px] w-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(130,90,255,0.14) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
        animate={{ x: [0, -50, 40, -30, 0], y: [0, 40, -60, 20, 0], scale: [1, 0.92, 1.06, 0.97, 1] }}
        transition={{ duration: 32, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
      <motion.div
        className="absolute -bottom-1/4 left-1/3 h-[500px] w-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,215,106,0.10) 0%, transparent 60%)",
          filter: "blur(120px)",
        }}
        animate={{ x: [0, 30, -50, 20, 0], y: [0, -30, 20, -40, 0], scale: [1, 1.04, 0.96, 1.03, 1] }}
        transition={{ duration: 35, repeat: Infinity, ease: "easeInOut", delay: 6 }}
      />
    </div>
  );
}

/* ──────────────── Floating particles ──────────────── */

function Particles({ count = 100 }: { count?: number }) {
  const items = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 2 + 0.8,
    x: Math.random() * 100,
    y: Math.random() * 100,
    opacity: Math.random() * 0.2 + 0.04,
    duration: Math.random() * 35 + 20,
    delay: Math.random() * 15,
    driftX: (Math.random() - 0.5) * 50,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%`, opacity: p.opacity }}
          animate={{ y: [0, -35, 0], x: [0, p.driftX, 0], opacity: [p.opacity, p.opacity * 1.5, p.opacity] }}
          transition={{ duration: p.duration, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
        />
      ))}
    </div>
  );
}

/* ──────────────── Subtle animated grid ──────────────── */

function SubtleGrid() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.035]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
      }}
    />
  );
}

/* ──────────────── Noise texture ──────────────── */

function NoiseTexture() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.025] mix-blend-overlay"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        backgroundSize: "256px 256px",
      }}
    />
  );
}

/* ──────────────── Breathing center glow ──────────────── */

function CenterGlow() {
  return (
    <motion.div
      className="pointer-events-none absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        background: "radial-gradient(circle, rgba(76,145,255,0.20) 0%, transparent 70%)",
        filter: "blur(80px)",
      }}
      animate={{ scale: [0.95, 1.10, 0.95] }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/* ──────────────── Glass membrane overlay (train-bob) ──────────────── */

function GlassOverlay() {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-[1]"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 35%, transparent 65%, rgba(255,255,255,0.01) 100%)",
        backdropFilter: "blur(1.5px)",
        WebkitBackdropFilter: "blur(1.5px)",
        transform: "scale(1.03)",
      }}
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/* ──────────────── Liquid Glass (gradient border via inline styles) ──────────────── */

function LiquidGlass({
  children,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
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
        ...style,
      }}
    >
      {/* Gradient border via pseudo layer */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          padding: "1.2px",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.40) 0%, rgba(255,255,255,0.12) 20%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.12) 80%, rgba(255,255,255,0.40) 100%)",
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

/* ──────────────── Abstract partner avatar ──────────────── */

function PartnerAvatar() {
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 120);
    }, 3500 + Math.random() * 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        className="absolute h-24 w-24 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(76,145,255,0.12) 0%, transparent 70%)",
          filter: "blur(24px)",
        }}
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="relative z-10"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
          {/* Glow core */}
          <circle cx="36" cy="36" r="28" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.6" />
          {/* Body capsule */}
          <rect x="18" y="28" width="36" height="28" rx="14" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6" />
          {/* Head */}
          <circle cx="36" cy="20" r="12" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6" />
          {/* Eyes */}
          <motion.g animate={blink ? { scaleY: 0.1, translateY: 2 } : { scaleY: 1, translateY: 0 }} transition={{ duration: 0.08 }}>
            <ellipse cx="30" cy="19" rx="2" ry="2.5" fill="rgba(255,255,255,0.55)" />
            <ellipse cx="42" cy="19" rx="2" ry="2.5" fill="rgba(255,255,255,0.55)" />
          </motion.g>
          {/* Gentle smile */}
          <path d="M30 26c0 0 2.5 3 6 3s6-3 6-3" stroke="rgba(255,255,255,0.2)" strokeWidth="0.6" strokeLinecap="round" />
          {/* Core pulse */}
          <circle cx="36" cy="42" r="6" fill="rgba(76,145,255,0.06)" />
          <motion.circle cx="36" cy="42" r="3" fill="rgba(76,145,255,0.10)" animate={{ opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
          <motion.circle cx="36" cy="42" r="1.5" fill="rgba(76,145,255,0.25)" animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
          {/* Floating dots */}
          <motion.circle cx="20" cy="38" r="1" fill="rgba(255,255,255,0.12)" animate={{ y: [-2, -6, -2], opacity: [0.12, 0.25, 0.12] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }} />
          <motion.circle cx="54" cy="40" r="0.8" fill="rgba(255,255,255,0.08)" animate={{ y: [-3, -7, -3], opacity: [0.08, 0.2, 0.08] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2.5 }} />
        </svg>
      </motion.div>
    </div>
  );
}

/* ──────────────── Floating cards ──────────────── */

const STAT_CARDS = [
  { label: "今日专注", value: "87%" },
  { label: "已连续学习", value: "14天" },
  { label: "英语状态", value: "提升中" },
];

function FloatingStats() {
  return (
    <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 hidden lg:block">
      <div className="mx-auto flex max-w-5xl items-center justify-center gap-4 pb-6">
        {STAT_CARDS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.8 + i * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
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

/* ──────────────── Main Hero ──────────────── */

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const handleMouse = useCallback(
    (e: React.MouseEvent) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width);
      mouseY.set((e.clientY - rect.top) / rect.height);
    },
    [mouseX, mouseY],
  );

  useEffect(() => { setMounted(true); }, []);

  const springX = useSpring(mouseX, { stiffness: 80, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 25 });

  const bgOffsetX = useSpring(mouseX, { stiffness: 40, damping: 30 });
  const bgOffsetY = useSpring(mouseY, { stiffness: 40, damping: 30 });

  if (!mounted) {
    return <section className="relative h-screen bg-[#070D17]" />;
  }

  return (
    <section
      className="relative flex min-h-screen flex-col overflow-hidden bg-[#070D17]"
      onMouseMove={handleMouse}
    >
      {/* ── Background layers ── */}
      <AuroraBlobs />
      <CenterGlow />
      <Particles count={120} />
      <SubtleGrid />
      <NoiseTexture />
      <GlassOverlay />

      {/* ── Navigation ── */}
      <nav className="relative z-20 flex items-center justify-between px-6 pt-5 md:px-10 md:pt-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight text-white">AI考研教练</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-white/50 transition-colors hover:text-white/80">
            登录
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-9 items-center rounded-full bg-white/10 px-5 text-sm font-medium text-white/80 backdrop-blur-md transition-all duration-200 hover:bg-white/20 hover:text-white"
          >
            免费注册
          </Link>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 md:flex-row md:px-10">
        {/* Left: Text */}
        <div className="flex w-full flex-col items-center text-center md:w-[55%] md:items-start md:text-left">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <LiquidGlass className="mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5">
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="text-xs font-medium tracking-wide text-white/60">
                AI 长期陪伴型考研教练
              </span>
            </LiquidGlass>
          </motion.div>

          {/* Heading */}
          <h1 className="mb-4">
            <motion.span
              className="block text-[clamp(2.5rem,5.5vw,4.5rem)] font-black leading-[1.05] tracking-[-0.04em] text-white"
              initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            >
              不是一个人
            </motion.span>
            <motion.span
              className="block text-[clamp(2.5rem,5.5vw,4.5rem)] font-black leading-[1.05] tracking-[-0.04em]"
              style={{
                background: "linear-gradient(135deg, #60A5FA 0%, #60A5FA 30%, #FACC15 65%, #FACC15)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                backgroundSize: "200% 100%",
                animation: "gradientShift 8s ease infinite",
              }}
              initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, delay: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
            >
              是陪你走完三百天的人
            </motion.span>
          </h1>

          {/* Subtitle */}
          <motion.p
            className="mb-10 max-w-[520px] text-base leading-relaxed text-white/50 sm:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            从你写下目标那天起，小伴会记住你的目标、你的疲惫、你的每一次坚持。
            它不是工具。是在这三百天里，一直陪着你走的人。
          </motion.p>

          {/* Buttons */}
          <motion.div
            className="flex flex-col items-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Link href="/signup">
              <motion.button
                className="group relative inline-flex h-12 items-center gap-2 rounded-2xl bg-white px-8 text-sm font-semibold text-[#070D17] shadow-lg shadow-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-white/20"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                开始备考
                <motion.span
                  className="inline-block"
                  initial={{ x: 0 }}
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.2 }}
                >
                  →
                </motion.span>
              </motion.button>
            </Link>
            <Link href="#">
              <LiquidGlass className="inline-flex h-12 items-center rounded-2xl px-8">
                <span className="text-sm font-medium text-white/60 transition-all duration-200 hover:text-white/80">
                  了解更多
                </span>
              </LiquidGlass>
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.p
            className="mt-8 text-xs text-white/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            已经有越来越多考研同学开始使用 AI 教练陪伴学习
          </motion.p>
        </div>

        {/* Right: Partner space */}
        <motion.div
          className="mt-16 w-full md:mt-0 md:w-[45%]"
          initial={{ opacity: 0, y: 40, scale: 0.96, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <LiquidGlass className="mx-auto max-w-[360px] rounded-3xl p-8 shadow-2xl shadow-black/40 md:ml-auto md:mr-0">
            {/* Partner */}
            <div className="mb-6 flex justify-center">
              <PartnerAvatar />
            </div>

            {/* Name */}
            <div className="mb-6 text-center">
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg font-semibold text-white">小伴</span>
                <motion.span
                  className="h-2 w-2 rounded-full bg-emerald-400"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
              <p className="mt-1 text-sm text-white/40">陪你完成考研</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "今天陪伴", value: "52分钟" },
                { label: "当前状态", value: "专注" },
                { label: "心情", value: "平静" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="rounded-xl py-3 text-center transition-all duration-200 hover:bg-white/[0.04]"
                  style={{ background: "rgba(255,255,255,0.02)" }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + i * 0.12, duration: 0.5 }}
                >
                  <div className="text-[10px] font-medium tracking-wide text-white/30">
                    {stat.label}
                  </div>
                  <div className="mt-1 text-sm font-medium text-white/70">{stat.value}</div>
                </motion.div>
              ))}
            </div>

            {/* Bottom */}
            <motion.div
              className="mt-6 flex items-center justify-center gap-2 border-t border-white/[0.04] pt-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 0.6 }}
            >
              <span className="text-xs text-white/25">我一直都在</span>
            </motion.div>
          </LiquidGlass>
        </motion.div>
      </div>

      {/* ── Bottom trust bar ── */}
      <motion.div
        className="relative z-10 mx-auto w-full max-w-3xl px-6 pb-8 md:px-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.8, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <LiquidGlass className="flex items-center justify-center gap-8 rounded-2xl px-6 py-3 md:gap-12">
          {[
            { value: "2000+", label: "考研用户正在使用" },
            { value: "89%", label: "用户保持学习习惯" },
            { value: "180+", label: "陪伴天数" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-center">
              <span className="text-sm font-semibold text-white/70">{item.value}</span>
              <span className="text-xs text-white/30">{item.label}</span>
            </div>
          ))}
        </LiquidGlass>
      </motion.div>

      {/* ── Floating stats cards ── */}
      <FloatingStats />

      {/* ── Scroll indicator ── */}
      <motion.div
        className="absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-1 lg:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 2.5 }}
      >
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none" className="text-white/15">
            <rect x="0.5" y="0.5" width="15" height="23" rx="7.5" stroke="currentColor" strokeWidth="1" />
            <motion.circle
              cx="8" cy="7" r="2" fill="currentColor"
              animate={{ y: [0, 8, 0], opacity: [1, 0.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        </motion.div>
        <span className="text-[10px] text-white/15">向下了解</span>
      </motion.div>

      {/* ── Bottom fade ── */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-32"
        style={{ background: "linear-gradient(to bottom, transparent 0%, #070D17 100%)" }}
      />

      {/* Gradient keyframes */}
      <style>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </section>
  );
}
