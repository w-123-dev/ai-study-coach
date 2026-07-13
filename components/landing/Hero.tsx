"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0F172A] px-5 pt-28 pb-28 md:pt-36 md:pb-36">
      <div className="relative mx-auto max-w-5xl">
        <div className="flex flex-col items-center gap-16 md:flex-row md:items-start md:gap-24">
          {/* 左侧 — 情绪入口 */}
          <div className="flex-1 pt-4 text-center md:text-left">
            {/* 标签 */}
            <motion.p
              className="mb-5 text-sm font-medium tracking-wide text-amber-300/60"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            >
              你的 AI 考研私人教练 · 小伴
            </motion.p>

            {/* 标题 - 逐行动画 */}
            <motion.h1
              className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-tight text-white"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.15,
                  },
                },
              }}
            >
              {["你不是一个人", "在走这条路"].map((line, i) => (
                <motion.span
                  key={i}
                  className="block"
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1] },
                    },
                  }}
                >
                  {line}
                </motion.span>
              ))}
            </motion.h1>

            {/* 副标题 */}
            <motion.p
              className="mx-auto mt-5 max-w-sm text-base leading-relaxed text-white/40 md:mx-0 md:text-[15px] md:leading-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            >
              从你写下目标那天起，小伴会记住你的目标、你的疲惫、你每一次想放弃的念头。
              它不是工具。是在这三百天里，一直陪着你走的人。
            </motion.p>

            {/* 按钮 */}
            <motion.div
              className="mt-9 flex flex-col items-center gap-3 sm:flex-row md:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/signup"
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-7 text-sm font-semibold text-[#0F172A] shadow-lg shadow-white/10 transition-all duration-300 hover:bg-white/90 hover:shadow-xl sm:w-auto"
                >
                  开始备考
                  <motion.span
                    className="inline-block"
                    initial={{ x: 0 }}
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.3 }}
                  >
                    →
                  </motion.span>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="#"
                  className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] px-7 text-sm font-medium text-white/50 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05] hover:text-white/70 sm:w-auto"
                >
                  了解更多
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* 右侧 — 小伴在等你 */}
          <motion.div
            className="w-full max-w-[420px] shrink-0 md:w-auto"
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <motion.div
              className="rounded-2xl border border-white/[0.06] bg-[#111827] p-6 shadow-2xl"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* 小伴头像 */}
              <div className="mb-5 flex items-center gap-3">
                <motion.div
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-400/20 to-amber-500/10"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <svg className="h-7 w-7" viewBox="0 0 28 28" fill="none">
                    <circle cx="14" cy="14" r="13" stroke="currentColor" strokeWidth="0.8" className="text-amber-400/30" />
                    <circle cx="14" cy="14" r="4" fill="currentColor" className="text-amber-300/60" />
                    <path
                      d="M14 10v2M14 16v2"
                      stroke="currentColor"
                      strokeWidth="0.8"
                      strokeLinecap="round"
                      className="text-amber-300/40"
                    />
                    <path
                      d="M8 8l3 2M20 8l-3 2"
                      stroke="currentColor"
                      strokeWidth="0.8"
                      strokeLinecap="round"
                      className="text-amber-300/30"
                    />
                    <circle cx="10" cy="11" r="1" fill="currentColor" className="text-amber-300/40" />
                    <circle cx="18" cy="11" r="1" fill="currentColor" className="text-amber-300/40" />
                  </svg>
                </motion.div>
                <div>
                  <div className="text-sm font-semibold text-white">小伴</div>
                  <div className="text-xs text-white/40">在线 · 记住你的每一天</div>
                </div>
              </div>

              {/* 对话气泡 - 逐个出现 */}
              <motion.div
                className="space-y-3"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.25,
                      delayChildren: 1.0,
                    },
                  },
                }}
              >
                {[
                  "嘿，我是小伴。\n从今天开始，我会一直在。",
                  "记得你的目标、你的疲惫、\n你每一次想继续下去的念头。",
                  "准备好了吗？我们开始吧。",
                ].map((text, i) => (
                  <motion.div
                    key={i}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
                      },
                    }}
                    className={`rounded-2xl rounded-tl-sm border px-4 py-3 ${
                      i === 1
                        ? "border-amber-500/10 bg-amber-500/[0.04]"
                        : "border-white/[0.06] bg-white/[0.03]"
                    }`}
                  >
                    <p className={`text-sm leading-relaxed ${i === 2 ? "font-medium text-white/80" : "text-white/70"}`}>
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

              {/* 底部 — 一个温柔的提示 */}
              <motion.div
                className="mt-5 flex items-center gap-2 border-t border-white/[0.04] pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.0, duration: 0.5 }}
              >
                <motion.div
                  className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <span className="text-xs text-white/30">陪我走完这三百天</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
