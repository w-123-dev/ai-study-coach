"use client";

import Link from "next/link";
import ProductHeroMockup from "./ProductHeroMockup";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0F172A] px-5 pt-28 pb-28 md:pt-36 md:pb-36">
      {/* 只有一个柔和的光源，不抢视线 */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/[0.04] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-14 md:flex-row md:items-start md:gap-20">
          {/* 左侧文字 — 干净、直接、像在对话 */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-[clamp(2rem,5vw,3.25rem)] font-bold leading-[1.15] tracking-tight text-white">
              你不是一个人在走这条路
            </h1>

            <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-white/40 md:mx-0 md:text-[15px] md:leading-8">
              从你写下目标那天起，AI 会记住你的目标、你的疲惫、你每一次想放弃的念头。
              <br className="hidden sm:inline" />
              它不是工具。是在这三百天里，一直陪着你走的人。
            </p>

            {/* CTA — 只有主按钮，没有多余的选项 */}
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row md:justify-start">
              <Link
                href="/signup"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-7 text-sm font-semibold text-[#0F172A] transition-all hover:bg-white/90"
              >
                开始备考
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-white/10 px-7 text-sm font-medium text-white/50 transition-colors hover:bg-white/5 hover:text-white/70"
              >
                了解更多
              </Link>
            </div>
          </div>

          {/* 右侧 Mockup — 窗口 title 去掉产品名，更自然 */}
          <div className="w-full max-w-[500px] shrink-0 md:w-auto">
            <ProductHeroMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
