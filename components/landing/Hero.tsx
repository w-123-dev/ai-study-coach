"use client";

import { useRef, useMemo } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useScroll, useTransform } from "framer-motion";

/* ── Helper: random particle positions ── */
const PARTICLES = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  r: Math.random() * 1.8 + 0.6,
  dur: 18 + Math.random() * 22,
  delay: Math.random() * 12,
}));

/* ── Chat bubble content ── */
const BUBBLES = [
  "嗨，我是小伴。\n从今天开始，我会一直在。",
  "记得你的目标、你的疲惫、\n你每一次想继续下去的念头。",
  "准备好了吗？我们开始吧。",
];

/* ── Companion Card ── */
function CompanionCard({ mouseX, mouseY }: { mouseX: any; mouseY: any }) {
  const cardX = useSpring(mouseX, { stiffness: 80, damping: 30 });
  const cardY = useSpring(mouseY, { stiffness: 80, damping: 30 });

  return (
    <motion.div
      className="w-full max-w-[420px] shrink-0 md:w-auto"
      initial={{ opacity: 0, y: 40, scale: 0.95, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 1.0, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
      style={{ x: cardX, y: cardY }}
    >
      <motion.div
        className="relative rounded-3xl border p-6 shadow-2xl"
        style={{
          borderColor: "rgba(255,255,255,0.06)",
          background: "rgba(17,24,39,0.55)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          boxShadow: "0 32px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* glow behind avatar */}
        <motion.div
          className="absolute -top-4 -left-4 h-20 w-20 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(94,168,255,0.12) 0%, transparent 60%)",
          }}
          animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* avatar row */}
        <div className="relative mb-5 flex items-center gap-3">
          <motion.div
            className="relative flex h-12 w-12 items-center justify-center rounded-full"
            style={{
              background: "linear-gradient(135deg, rgba(251,191,36,0.18) 0%, rgba(251,191,36,0.06) 100%)",
            }}
          >
            <svg className="h-7 w-7" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="13" stroke="currentColor" strokeWidth="0.8" className="text-amber-400/25" />
              <circle cx="14" cy="14" r="4" fill="currentColor" className="text-amber-300/50" />
              <motion.path
                d="M14 10v2M14 16v2"
                stroke="currentColor"
                strokeWidth="0.8"
                strokeLinecap="round"
                className="text-amber-300/40"
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              />
              <path d="M8 8l3 2M20 8l-3 2" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" className="text-amber-300/25" />
              <motion.circle
                cx="10" cy="11" r="1" fill="currentColor" className="text-amber-300/40"
                animate={{ scaleY: [1, 0.1, 1] }}
                transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 3.5, ease: "easeInOut" }}
              />
              <motion.circle
                cx="18" cy="11" r="1" fill="currentColor" className="text-amber-300/40"
                animate={{ scaleY: [1, 0.1, 1] }}
                transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 3.5, ease: "easeInOut" }}
              />
            </svg>
          </motion.div>
          <div>
            <div className="text-sm font-semibold text-white">小伴</div>
            <div className="flex items-center gap-1.5 text-xs text-white/40">
              <motion.span
                className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              在线 · 记住你的每一天
            </div>
          </div>
        </div>

        {/* chat bubbles */}
        <motion.div
          className="space-y-2.5"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: { staggerChildren: 0.35, delayChildren: 1.8 },
            },
          }}
        >
          {BUBBLES.map((text, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
                visible: {
                  opacity: 1, y: 0, filter: "blur(0px)",
                  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
                },
              }}
              className={"rounded-2xl rounded-tl-sm border px-4 py-3 " + (
                i === 1
                  ? "border-amber-500/8 bg-amber-500/[0.04]"
                  : "border-white/[0.06] bg-white/[0.03]"
              )}
              style={
                i === 1
                  ? { backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }
                  : {}
              }
            >
              <p className={"text-sm leading-relaxed " + (i === 2 ? "font-medium text-white/80" : "text-white/70")}>
                {text.split("\n").map((line, j) => (
                  <span key={j}>
                    {line}
                    {j === 0 && <br />}
                  </span>
                ))}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* bottom pulse */}
        <motion.div
          className="mt-5 flex items-center gap-2 border-t pt-4"
          style={{ borderColor: "rgba(255,255,255,0.04)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8, duration: 0.5 }}
        >
          <motion.div
            className="h-1.5 w-1.5 rounded-full bg-emerald-400"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="text-xs text-white/30">陪我走完这三百天</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ── Floating particles layer ── */
function Particles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{
            left: p.x + "%",
            top: p.y + "%",
            width: p.r + "px",
            height: p.r + "px",
          }}
          animate={{
            y: [0, -30, 0, 20, 0],
            x: [0, 15, -10, 5, 0],
            opacity: [0.12, 0.2, 0.08, 0.18, 0.12],
          }}
          transition={{
            duration: p.dur,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ── Aurora layers ── */
function Aurora() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute -top-[10%] -left-[10%] h-[70%] w-[60%] rounded-full"
        style={{
          background: "radial-gradient(ellipse, rgba(94,168,255,0.04) 0%, transparent 60%)",
        }}
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.08, 0.95, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[20%] -right-[5%] h-[50%] w-[50%] rounded-full"
        style={{
          background: "radial-gradient(ellipse, rgba(101,209,138,0.025) 0%, transparent 50%)",
        }}
        animate={{
          x: [0, -30, 20, 0],
          y: [0, 20, -30, 0],
          scale: [1, 0.95, 1.06, 1],
        }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />
      <motion.div
        className="absolute bottom-[10%] left-[30%] h-[40%] w-[40%] rounded-full"
        style={{
          background: "radial-gradient(ellipse, rgba(255,215,106,0.02) 0%, transparent 50%)",
        }}
        animate={{
          x: [0, 20, -30, 0],
          y: [0, -15, 10, 0],
          scale: [1, 1.04, 0.97, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 8 }}
      />
    </div>
  );
}

/* ── Subtle grid overlay ── */
function GridOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }}
      aria-hidden
    />
  );
}

/* ── Animated gradient text ── */
function GradientText({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={"bg-clip-text text-transparent " + (className || "")}
      style={{
        backgroundImage: "linear-gradient(135deg, #5EA8FF 0%, #7EC8E3 30%, #FFD76A 65%, #f0f0f0 100%)",
        backgroundSize: "200% 200%",
        animation: "gradientShift 8s ease-in-out infinite",
      }}
    >
      {children}
    </span>
  );
}

/* ── Main Hero ── */
export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 60, damping: 25 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 60, damping: 25 });

  /* parallax for background glow */
  const glowX = useTransform(smoothMouseX, [-1, 1], [-8, 8]);
  const glowY = useTransform(smoothMouseY, [-1, 1], [-8, 8]);

  /* text parallax */
  const textX = useTransform(smoothMouseX, [-1, 1], [-4, 4]);
  const textY = useTransform(smoothMouseY, [-1, 1], [-4, 4]);

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

  /* scroll-driven section fade */
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const scale = useTransform(scrollY, [0, 500], [1, 0.97]);

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      className="relative min-h-screen overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #08111f 0%, #0d1728 40%, #13203b 100%)",
      }}
    >
      {/* ---- Background layers ---- */}
      <div className="pointer-events-none absolute inset-0">
        {/* large radial glow top center */}
        <motion.div
          className="absolute top-0 left-1/2 h-[80vh] w-[80vw] -translate-x-1/2 rounded-full opacity-[0.15]"
          style={{
            background: "radial-gradient(ellipse, rgba(94,168,255,0.06) 0%, transparent 60%)",
            x: glowX,
            y: glowY,
          }}
        />

        {/* behind-headline glow */}
        <motion.div
          className="absolute top-[15%] left-1/2 h-[50vh] w-[60vw] -translate-x-1/2 rounded-full"
          style={{
            background: "radial-gradient(ellipse, rgba(94,168,255,0.04) 0%, transparent 50%)",
            x: glowX,
            y: glowY,
          }}
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <Aurora />
      <GridOverlay />
      <Particles />

      {/* ---- Hero content ---- */}
      <motion.div
        className="relative z-10 mx-auto max-w-5xl px-5 pt-28 pb-28 md:pt-40 md:pb-40"
        style={{ opacity, scale }}
      >
        <div className="flex flex-col items-center gap-16 md:flex-row md:items-start md:gap-24">
          {/* Left: emotional entry */}
          <motion.div
            className="flex-1 pt-4 text-center md:text-left"
            style={{ x: textX, y: textY }}
          >
            {/* Badge */}
            <motion.p
              className="mb-5 text-sm font-medium tracking-wide text-amber-300/60"
              initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.span
                className="inline-block"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                ✦
              </motion.span>{" "}
              你的 AI 考研私人教练 · 小伴
            </motion.p>

            {/* Headline */}
            <motion.h1
              className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-tight"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: { staggerChildren: 0.08 },
                },
              }}
            >
              <motion.span
                className="block text-white"
                variants={{
                  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
                  visible: {
                    opacity: 1, y: 0, filter: "blur(0px)",
                    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
              >
                你不是一个人
              </motion.span>
              <motion.span
                className="block mt-1"
                variants={{
                  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
                  visible: {
                    opacity: 1, y: 0, filter: "blur(0px)",
                    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
              >
                在走这条路
              </motion.span>
            </motion.h1>

            {/* Description */}
            <motion.p
              className="mx-auto mt-5 max-w-sm text-base leading-relaxed text-white/40 md:mx-0 md:text-[15px] md:leading-8"
              initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              从你写下目标那天起，<GradientText>小伴</GradientText>会记住你的目标、你的疲惫、你每一次想放弃的念头。
              它不是工具。是在这三百天里，一直陪着你走的人。
            </motion.p>

            {/* Buttons */}
            <motion.div
              className="mt-9 flex flex-col items-center gap-3 sm:flex-row md:justify-start"
              initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="group"
              >
                <Link
                  href="/signup"
                  className="relative inline-flex h-11 items-center justify-center gap-2 overflow-hidden rounded-xl px-7 text-sm font-semibold text-[#0F172A] shadow-lg transition-all duration-300"
                  style={{
                    background: "linear-gradient(135deg, #ffffff 0%, #e8edf5 100%)",
                    boxShadow: "0 8px 24px rgba(94,168,255,0.2), 0 2px 4px rgba(255,255,255,0.1)",
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
                  <motion.div
                    className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background: "linear-gradient(135deg, #f0f5ff 0%, #d0d8e8 100%)",
                    }}
                  />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="#"
                  className="inline-flex h-11 items-center justify-center rounded-xl border px-7 text-sm font-medium text-white/50 backdrop-blur-sm transition-all duration-300 sm:w-auto"
                  style={{
                    borderColor: "rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.03)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                  }}
                >
                  了解更多
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right: companion card */}
          <CompanionCard mouseX={smoothMouseX} mouseY={smoothMouseY} />
        </div>
      </motion.div>

      {/* ---- fade to next section ---- */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 z-10"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, #0F172A 100%)",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 100%)",
        }}
      />

      {/* ---- keyframes ---- */}
      <style>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </section>
  );
}