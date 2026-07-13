"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0F172A] px-5 pt-28 pb-28 md:pt-36 md:pb-36">
      {/* 暖色光晕，不只是蓝色 */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/[0.03] blur-[160px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] translate-x-1/3 translate-y-1/4 rounded-full bg-blue-500/[0.04] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        <div className="flex flex-col items-center gap-16 md:flex-row md:items-start md:gap-24">
          {/* 左侧 — 情绪入口 */}
          <div className="flex-1 pt-4 text-center md:text-left">
            <p className="mb-5 text-sm font-medium tracking-wide text-amber-300/60">
              你的 AI 考研私人教练 · 小伴
            </p>

            <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-tight text-white">
              你不是一个人
              <br />
              在走这条路
            </h1>

            <p className="mx-auto mt-5 max-w-sm text-base leading-relaxed text-white/40 md:mx-0 md:text-[15px] md:leading-8">
              从你写下目标那天起，小伴会记住你的目标、你的疲惫、你每一次想放弃的念头。
              它不是工具。是在这三百天里，一直陪着你走的人。
            </p>

            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row md:justify-start">
              <Link
                href="/signup"
                className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-white px-7 text-sm font-semibold text-[#0F172A] transition-all hover:bg-white/90 sm:w-auto"
              >
                开始备考
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-white/10 px-7 text-sm font-medium text-white/50 transition-colors hover:bg-white/5 hover:text-white/70 sm:w-auto"
              >
                了解更多
              </Link>
            </div>
          </div>

          {/* 右侧 — 小伴在等你 */}
          <div className="w-full max-w-[420px] shrink-0 md:w-auto">
            <div className="rounded-2xl border border-white/[0.06] bg-[#111827] p-6 shadow-2xl">
              {/* 小伴头像 */}
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-400/20 to-amber-500/10">
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
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">小伴</div>
                  <div className="text-xs text-white/40">在线 · 记住你的每一天</div>
                </div>
              </div>

              {/* 第一次对话 */}
              <div className="space-y-3">
                <div className="rounded-2xl rounded-tl-sm border border-white/[0.06] bg-white/[0.03] px-4 py-3">
                  <p className="text-sm leading-relaxed text-white/70">
                    嘿，我是小伴。
                    <br />
                    从今天开始，我会一直在。
                  </p>
                </div>
                <div className="rounded-2xl rounded-tl-sm border border-amber-500/10 bg-amber-500/[0.04] px-4 py-3">
                  <p className="text-sm leading-relaxed text-white/70">
                    记得你的目标、你的疲惫、
                    <br />
                    你每一次想继续下去的念头。
                  </p>
                </div>
                <div className="rounded-2xl rounded-tl-sm border border-white/[0.06] bg-white/[0.03] px-4 py-3">
                  <p className="text-sm font-medium text-white/80">
                    准备好了吗？我们开始吧。
                  </p>
                </div>
              </div>

              {/* 底部 — 一个温柔的提示 */}
              <div className="mt-5 flex items-center gap-2 border-t border-white/[0.04] pt-4">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                <span className="text-xs text-white/30">陪我走完这三百天</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
