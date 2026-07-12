"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Users, TrendingUp, Award } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0F172A] px-5 pt-20 pb-28 md:pt-28 md:pb-36">
      {/* 背景装饰 */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 translate-x-1/3 translate-y-1/3 rounded-full bg-amber-500/5 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        {/* 标签 */}
        <div className="mb-6 flex items-center justify-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs font-medium text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            AI 长期陪伴型考研教练
          </span>
        </div>

        {/* 主标题 */}
        <div className="text-center">
          <h1 className="text-4xl font-bold leading-[1.15] tracking-tight text-white md:text-5xl lg:text-6xl lg:leading-[1.1]">
            从今天到上岸那天，
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-amber-300 bg-clip-text text-transparent">
              AI 陪你走完每一步
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/50 md:text-lg md:leading-8">
            不是简单的计划生成工具。AI 知道你的目标、记住你的进度、
            <br className="hidden sm:inline" />
            发现你的问题、调整你的计划——陪你几百天直到上岸。
          </p>
        </div>

        {/* CTA */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/signup"
            className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-8 text-sm font-semibold text-[#0F172A] transition-all hover:bg-white/90 sm:w-auto"
          >
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

        {/* 社会证明 */}
        <div className="mt-12 grid grid-cols-2 gap-4 border-t border-white/5 pt-8 md:grid-cols-3 md:gap-8">
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
          <div className="col-span-2 text-center md:col-span-1">
            <div className="flex items-center justify-center gap-1.5">
              <Award className="h-4 w-4 text-amber-400" />
              <span className="text-2xl font-bold text-white">186天</span>
            </div>
            <p className="mt-1 text-xs text-white/40">平均持续使用天数</p>
          </div>
        </div>
      </div>
    </section>
  );
}
