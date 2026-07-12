"use client";

import { ArrowRight, Target, Calendar, MessageCircle } from "lucide-react";

const steps = [
  {
    icon: Target,
    title: "告诉 AI 你的目标",
    description: "输入目标院校、专业和当前基础，AI 立刻了解你的情况。",
    preview: (
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 text-xs text-white/40">
          <div className="h-2 w-2 rounded-full bg-emerald-400" />
          AI 正在了解你
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-3">
          <div className="mb-2 text-xs font-medium text-white/70">目标院校</div>
          <div className="h-2.5 w-40 rounded-full bg-white/10" />
          <div className="mt-3 text-xs font-medium text-white/70">当前基础</div>
          <div className="mt-1.5 flex gap-2">
            <span className="rounded-md bg-amber-500/10 px-2 py-1 text-[11px] text-amber-400">
              数学零基础
            </span>
            <span className="rounded-md bg-blue-500/10 px-2 py-1 text-[11px] text-blue-400">
              英语四级
            </span>
          </div>
        </div>
        <div className="text-[11px] italic text-white/30">
          &ldquo;了解完你的情况，我才知道怎么帮你&rdquo;
        </div>
      </div>
    ),
  },
  {
    icon: Calendar,
    title: "AI 生成学习计划",
    description: "从今天到考研日，精确到每周的安排，覆盖所有考试科目。",
    preview: (
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 text-xs text-white/40">
          <div className="h-2 w-2 rounded-full bg-blue-400" />
          你的备考路线
        </div>
        <div className="space-y-1.5">
          {[
            { label: "基础阶段", date: "6月-8月", active: true },
            { label: "强化阶段", date: "9月-10月" },
            { label: "冲刺阶段", date: "11月-12月" },
          ].map((phase) => (
            <div
              key={phase.label}
              className={`flex items-center justify-between rounded-lg border px-3 py-2 ${
                phase.active
                  ? "border-blue-500/20 bg-blue-500/5"
                  : "border-white/5 bg-white/[0.02]"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    phase.active ? "bg-blue-400" : "bg-white/20"
                  }`}
                />
                <span
                  className={`text-xs font-medium ${
                    phase.active ? "text-blue-300" : "text-white/40"
                  }`}
                >
                  {phase.label}
                </span>
              </div>
              <span className="text-[11px] text-white/30">{phase.date}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: MessageCircle,
    title: "每日学习 + AI 陪伴",
    description: "每天打卡完成任务，AI 监督进度、发现问题、调整计划。",
    preview: (
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 text-xs text-white/40">
          <div className="h-2 w-2 rounded-full bg-emerald-400" />
          今日任务
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
            <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-emerald-400 bg-emerald-400">
              <div className="h-1.5 w-1.5 rounded-full bg-[#0F172A]" />
            </div>
            <span className="text-xs text-emerald-300 line-through">
              英语 · 背单词 30min
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <div className="h-4 w-4 rounded-full border-2 border-white/20" />
            <span className="text-xs text-white/60">数学 · 高数第一章 2h</span>
          </div>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-3">
          <div className="mb-1 text-[11px] font-medium text-white/40">
            AI 提醒
          </div>
          <div className="text-xs leading-relaxed text-white/60">
            &ldquo;数学已经连续 2 天没完成了，今天先做 30 分钟找找感觉？&rdquo;
          </div>
        </div>
      </div>
    ),
  },
];

export default function CoachFlow() {
  return (
    <section id="how-it-works" className="bg-[#0F172A] px-5 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            三步，让 AI 成为你的考研教练
          </h2>
          <p className="mt-3 text-sm text-white/40">
            从今天开始，每一步都有人陪你
          </p>
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((step, i) => (
            <div key={step.title} className="relative">
              {i < steps.length - 1 && (
                <div className="absolute left-5 top-10 hidden h-px w-[calc(100%-2.5rem)] bg-white/10 md:block" />
              )}
              <div className="flex flex-col gap-4 md:items-center md:text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white">
                  {`0${i + 1}`}
                </div>
                <div className="mt-1 flex items-center gap-2 md:justify-center">
                  <step.icon className="h-4 w-4 text-blue-400" />
                  <h3 className="text-[15px] font-semibold text-white">
                    {step.title}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-white/40">
                  {step.description}
                </p>
              </div>

              {/* 产品预览 mockup */}
              <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4 shadow-sm transition-shadow hover:shadow-md hover:shadow-white/5">
                {step.preview}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <span className="inline-flex items-center gap-1.5 text-xs text-white/30">
            从第一次填写到上岸
            <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </section>
  );
}
