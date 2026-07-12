"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Users, TrendingUp, Award, Sparkles } from "lucide-react";
import ProductHeroMockup from "./ProductHeroMockup";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0F172A] px-5 pt-24 pb-28 md:pt-32 md:pb-36">
      {/* 背景装饰 */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 translate-x-1/3 translate-y-1/3 rounded-full bg-amber-500/5 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* 标签 */}
        <div className="mb-6 flex items-center justify-center gap-3 md:justify-start">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs font-medium text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            AI 长期陪伴型考研教练
          </span>
        </div>

        {/* 左右布局：左侧文字 + 右侧 Mockup */}
        <div className="flex flex-col items-center gap-12 md:flex-row md:items-start md:gap-16">
          {/* 左侧文字 */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold leading-[1.15] tracking-tight text-white md:text-5xl lg:text-6xl lg:leading-[1.1]">
              从今天到上岸那天，
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-amber-300 bg-clip-text text-transparent">
                AI 陪你走完每一步
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/50 md:mx-0 md:text-lg md:leading-8">
              不只是简单的计划生成工具。
              <br className="hidden sm:inline" />
              AI 了解你的目标、记住你的进度、发现你的问题、调整你的计划——
              <br className="hidden sm:inline" />
              像真正的教练一样，陪你几百天直到上岸。
            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row md:justify-start">
              <Link
                href="/signup"
                className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-8 text-sm font-semibold text-[#0F172A] transition-all hover:bg-white/90 sm:w-auto"
              >
                <Sparkles className="h-4 w-4" />
                免费开始备考
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 sm:w-auto"
              >
                <BookOpen className="h-4 w-4" />
                看看怎么用
              </Link>
            </div>

            {/* 社交证明 - 移动端隐藏，桌面端显示 */}
            <div className="mt-12 hidden border-t border-white/5 pt-8 md:block">
              <div className="flex gap-8">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <Users className="h-4 w-4 text-blue-400" />
                    <span className="text-2xl font-bold text-white">2,000+</span>
                  </div>
                  <p className="mt-1 text-xs text-white/40">考研学生正在使用</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                    <span className="text-2xl font-bold text-white">89%</span>
                  </div>
                  <p className="mt-1 text-xs text-white/40">用户完成率提升</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <Award className="h-4 w-4 text-amber-400" />
                    <span className="text-2xl font-bold text-white">186天</span>
                  </div>
                  <p className="mt-1 text-xs text-white/40">平均持续使用天数</p>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧 Mockup */}
          <div className="w-full max-w-[520px] shrink-0 md:w-auto">
            <ProductHeroMockup />
          </div>
        </div>

        {/* 社交证明 - 移动端显示 */}
        <div className="mt-12 border-t border-white/5 pt-8 md:hidden">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5">
                <Users className="h-4 w-4 text-blue-400" />
                <span className="text-2xl font-bold text-white">2,000+</span>
              </div>
              <p className="mt-1 text-xs text-white/40">考研学生正在使用</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <span className="text-2xl font-bold text-white">89%</span>
              </div>
              <p className="mt-1 text-xs text-white/40">用户完成率提升</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5">
                <Award className="h-4 w-4 text-amber-400" />
                <span className="text-2xl font-bold text-white">186天</span>
              </div>
              <p className="mt-1 text-xs text-white/40">平均持续使用天数</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
