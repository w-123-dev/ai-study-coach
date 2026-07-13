"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";

/* ──────────────── Floating Particles ──────────────── */

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  driftX: number;
}

function Particles({ count = 120 }: { count?: number }) {
  const items: Particle[] = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2.2 + 0.8,
    opacity: Math.random() * 0.25 + 0.05,
    duration: Math.random() * 40 + 25,
    delay: Math.random() * 20,
    driftX: (Math.random() - 0.5) * 60,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, p.driftX, 0],
            opacity: [p.opacity, p.opacity * 1.6, p.opacity],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

/* ──────────────── Breathing Central Glow ──────────────── */

function BreathingGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
      {/* Large blue glow */}
      <motion.div
        className="absolute h-[700px] w-[700px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(70,130,255,0.25) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {/* Warm gold accent */}
      <motion.div
        className="absolute h-[500px] w-[500px] translate-x-[15%] translate-y-[15%] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,200,80,0.15) 0%, transparent 60%)",
          filter: "blur(100px)",
        }}
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
      />
      {/* Central highlight */}
      <motion.div
        className="absolute h-[300px] w-[300px] -translate-x-[10%] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 60%)",
          filter: "blur(60px)",
        }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      />
    </div>
  );
}

/* ──────────────── Subtle Grid ──────────────── */

function SubtleGrid() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.04]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
      }}
    />
  );
}

/* ──────────────── Glass utility ──────────────── */

function GlassBox({
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
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        ...style,
      }}
    >
      {/* Subtle inner highlight */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 50%, rgba(255,255,255,0.02) 100%)",
        }}
      />
      {children}
    </div>
  );
}

/* ──────────────── Partner Companion ──────────────── */

function PartnerAvatar() {
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 4000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex items-center justify-center">
      {/* Breathing halo */}
      <motion.div
        className="absolute h-24 w-24 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(70,130,255,0.15) 0%, transparent 70%)",
          filter: "blur(20px)",
        }}
        animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Partner SVG - abstract geometric being */}
      <motion.div
        className="relative z-10"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          {/* Body - soft rounded form */}
          <motion.rect
            x="16" y="24" width="48" height="40" rx="20"
            fill="rgba(255,255,255,0.06)"
            stroke="rgba(255,255,255,0.10)"
            strokeWidth="0.8"
            animate={{ y: [0, -1, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Head */}
          <circle
            cx="40" cy="18" r="14"
            fill="rgba(255,255,255,0.08)"
            stroke="rgba(255,255,255,0.10)"
            strokeWidth="0.8"
          />
          {/* Eyes */}
          <motion.g animate={blink ? { scaleY: 0.1, translateY: 3 } : { scaleY: 1, translateY: 0 }} transition={{ duration: 0.1 }}>
            <circle cx="34" cy="17" r="2.5" fill="rgba(255,255,255,0.6)" />
            <circle cx="46" cy="17" r="2.5" fill="rgba(255,255,255,0.6)" />
          </motion.g>
          {/* Gentle smile */}
          <motion.path
            d="M34 24c0 0 3 4 6 4s6-4 6-4"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="0.8"
            strokeLinecap="round"
            animate={{ d: ["M34 24c0 0 3 4 6 4s6-4 6-4", "M34 23c0 0 3 4 6 4s6-4 6-4"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Core light */}
          <circle cx="40" cy="44" r="8" fill="rgba(70,130,255,0.08)" />
          <circle cx="40" cy="44" r="4" fill="rgba(70,130,255,0.15)" />
          <motion.circle
            cx="40" cy="44" r="2"
            fill="rgba(70,130,255,0.3)"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Floating particles around partner */}
          <motion.circle
            cx="20" cy="36" r="1.5" fill="rgba(255,255,255,0.15)"
            animate={{ y: [-2, -6, -2], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          <motion.circle
            cx="62" cy="40" r="1" fill="rgba(255,255,255,0.12)"
            animate={{ y: [-3, -7, -3], opacity: [0.12, 0.25, 0.12] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
          <motion.circle
            cx="28" cy="58" r="1.2" fill="rgba(70,130,255,0.15)"
            animate={{ y: [0, -4, 0], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </svg>
      </motion.div>
    </div>
  );
}

/* ──────────────── Main Hero ──────────────── */

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

const fadeUpBlur = {
  hidden: { opacity: 0, y: 40, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export default function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden bg-[#070B18]">
      {/* ── Background layers ── */}
      <BreathingGlow />
      <Particles count={160} />
      <SubtleGrid />

      {/* ── Navigation ── */}
      <nav className="relative z-20 flex items-center justify-between px-6 pt-5 md:px-10 md:pt-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight text-white">AI考研教练</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm text-white/50 transition-colors hover:text-white/80"
          >
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
      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-6 md:flex-row md:px-10"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        {/* ── Left: Text (55%) ── */}
        <div className="flex w-full flex-col items-center text-center md:w-[55%] md:items-start md:text-left">
          {/* Badge */}
          <motion.div variants={fadeUp} className="mb-6">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium tracking-wide text-white/60"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(12px)",
              }}
            >
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              AI 长期陪伴型考研教练
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={fadeUpBlur} className="mb-4">
            <span className="block text-[clamp(2.5rem,6vw,5rem)] font-black leading-[1.05] tracking-[-0.04em] text-white">
              你不是一个人
            </span>
            <span
              className="block text-[clamp(2.5rem,6vw,5rem)] font-black leading-[1.05] tracking-[-0.04em]"
              style={{
                background: "linear-gradient(135deg, #60A5FA, #60A5FA 30%, #FACC15 70%, #FACC15)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              在走这条路
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            className="mb-10 max-w-[520px] text-base leading-relaxed text-white/50 sm:text-lg"
          >
            从你写下目标那天起，小伴会记住你的目标、你的疲惫、你的每一次坚持。
            <br />
            它不是工具，而是在漫长考研路上陪你走下去的人。
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={fadeUp} className="flex flex-col items-center gap-4 sm:flex-row">
            <Link href="/signup">
              <motion.button
                className="inline-flex h-12 items-center gap-2 rounded-2xl bg-white px-8 text-sm font-semibold text-[#070B18] shadow-xl shadow-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-white/20"
                whileHover={{ scale: 1.04 }}
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
              <motion.button
                className="inline-flex h-12 items-center rounded-2xl px-8 text-sm font-medium text-white/60 transition-all duration-200 hover:text-white/80"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                了解更多
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* ── Right: Partner Space (45%) ── */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 50, scale: 0.95, filter: "blur(4px)" },
            visible: {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              transition: { duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: 0.6 },
            },
          }}
          className="mt-16 w-full md:mt-0 md:w-[45%]"
        >
          <GlassBox className="mx-auto max-w-[360px] rounded-3xl p-8 md:ml-auto md:mr-0">
            {/* Partner Avatar */}
            <div className="mb-6 flex justify-center">
              <PartnerAvatar />
            </div>

            {/* Name & Tagline */}
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

            {/* Gentle Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "今天陪伴", value: "52分钟" },
                { label: "当前状态", value: "专注" },
                { label: "心情", value: "平静" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="rounded-xl py-3 text-center transition-all duration-200"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + i * 0.1, duration: 0.5 }}
                  whileHover={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <div className="text-[10px] font-medium tracking-wide text-white/30">
                    {stat.label}
                  </div>
                  <div className="mt-1 text-sm font-medium text-white/70">{stat.value}</div>
                </motion.div>
              ))}
            </div>

            {/* Bottom message */}
            <motion.div
              className="mt-6 flex items-center justify-center gap-2 border-t border-white/[0.04] pt-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 0.6 }}
            >
              <span className="text-xs text-white/25">我一直都在</span>
            </motion.div>
          </GlassBox>
        </motion.div>
      </motion.div>

      {/* ── Bottom Trust Bar ── */}
      <motion.div
        className="relative z-10 mx-auto w-full max-w-3xl px-6 pb-8 md:px-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.8, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div
          className="flex items-center justify-center gap-8 rounded-2xl px-6 py-3 md:gap-12"
          style={{
            background: "rgba(255,255,255,0.02)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.04)",
          }}
        >
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
        </div>
      </motion.div>

      {/* ── Bottom fade transition ── */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-32"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, #070B18 100%)",
        }}
      />
    </section>
  );
}
