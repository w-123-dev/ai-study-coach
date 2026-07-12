"use client";

import { Target, Calendar, LineChart, Trophy } from "lucide-react";

const phases = [
  {
    icon: Target,
    title: "第 1 天",
    subtitle: "熟悉与规划",
    description: "填写目标信息，AI 生成专属备考路线。了解自己的起点和终点。",
    color: "bg-blue-500",
    dot: "bg-blue-400",
  },
  {
    icon: Calendar,
    title: "第 1-30 天",
    subtitle: "建立习惯",
    description: "每天登录打卡、完成任务。AI 观察你的学习模式，开始记住你的习惯。",
    color: "bg-emerald-500",
    dot: "bg-emerald-400",
  },
  {
    icon: LineChart,
    title: "第 30-90 天",
    subtitle: "稳定提升",
    description: "AI 通过数据发现薄弱环节，主动提醒调整。学习效率逐步提升。",
    color: "bg-amber-500",
    dot: "bg-amber-400",
  },
  {
    icon: Trophy,
    title: "第 90 天 +",
    subtitle: "冲刺与上岸",
    description: "AI 全程陪伴，心态波动时有鼓励，进度落后时有调整。直到走进考场那天。",
    color: "bg-purple-500",
    dot: "bg-purple-400",
  },
];

export default function GrowthTimeline() {
  return (
    <section className="bg-[#0F172A] px-5 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            用越久，AI 越懂你
          </h2>
          <p className="mt-3 text-sm text-white/40">
            这不是一个用完就扔的工具，而是一个陪你成长的教练
          </p>
        </div>

        <div className="relative mt-14">
          {/* 中间连接线 */}
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-blue-500/30 via-emerald-500/30 via-amber-500/30 to-purple-500/30 md:block" />

          <div className="space-y-10 md:space-y-16">
            {phases.map((phase, i) => (
              <div
                key={phase.title}
                className={`relative flex flex-col gap-4 md:flex-row md:items-start ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div className={`flex-1 ${i % 2 === 0 ? "md:text-right md:pr-12" : "md:pl-12"}`}>
                  <div
                    className={`rounded-xl border border-white/10 bg-white/[0.03] p-5 ${
                      i % 2 === 0 ? "md:text-right" : ""
                    }`}
                  >
                    <div className={`mb-2 flex items-center gap-2 ${i % 2 === 0 ? "md:justify-end" : ""}`}>
                      <phase.icon className={`h-4 w-4 ${phase.color.replace("bg-", "text-")}`} />
                      <span className={`text-xs font-semibold ${phase.color.replace("bg-", "text-")}`}>
                        {phase.subtitle}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-white">
                      {phase.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/50">
                      {phase.description}
                    </p>
                  </div>
                </div>

                {/* 时间轴节点 */}
                <div className="absolute left-0 top-0 z-10 md:left-1/2 md:-translate-x-1/2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${phase.color} text-xs font-bold text-white shadow-lg shadow-black/20`}
                  >
                    {i + 1}
                  </div>
                </div>

                <div className="hidden flex-1 md:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
