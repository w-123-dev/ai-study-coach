"use client";

import { Target, Calendar, LineChart, Trophy } from "lucide-react";

const phases = [
  {
    icon: Target,
    title: "第 1 天",
    subtitle: "熟悉与规划",
    description: "填写目标信息，AI 生成专属备考路线。了解自己的起点和终点。",
    color: "bg-blue-500",
    light: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
  },
  {
    icon: Calendar,
    title: "第 1-30 天",
    subtitle: "建立习惯",
    description: "每天登录打卡、完成任务。AI 观察你的学习模式，开始记住你的习惯。",
    color: "bg-emerald-500",
    light: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
  },
  {
    icon: LineChart,
    title: "第 30-90 天",
    subtitle: "稳定提升",
    description: "AI 通过数据发现薄弱环节，主动提醒调整。学习效率逐步提升。",
    color: "bg-amber-500",
    light: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
  },
  {
    icon: Trophy,
    title: "第 90 天 +",
    subtitle: "冲刺与上岸",
    description: "AI 全程陪伴，心态波动时有鼓励，进度落后时有调整。直到走进考场那天。",
    color: "bg-purple-500",
    light: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-700",
  },
];

export default function GrowthTimeline() {
  return (
    <section className="border-t border-gray-100 bg-white px-5 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
            用越久，AI 越懂你
          </h2>
          <p className="mt-3 text-sm text-gray-500">
            这不是一个用完就扔的工具，而是一个陪你成长的教练
          </p>
        </div>

        <div className="relative mt-14">
          {/* 中间连接线（桌面端） */}
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-blue-200 via-emerald-200 via-amber-200 to-purple-200 md:block" />

          <div className="space-y-10 md:space-y-16">
            {phases.map((phase, i) => (
              <div
                key={phase.title}
                className={`relative flex flex-col gap-4 md:flex-row md:items-start ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* 内容卡片 */}
                <div className={`flex-1 ${i % 2 === 0 ? "md:text-right md:pr-12" : "md:pl-12"}`}>
                  <div
                    className={`rounded-xl border ${phase.border} ${phase.light} p-5 ${
                      i % 2 === 0 ? "md:text-right" : ""
                    }`}
                  >
                    <div className={`mb-2 flex items-center gap-2 ${i % 2 === 0 ? "md:justify-end" : ""}`}>
                      <phase.icon className={`h-4 w-4 ${phase.text}`} />
                      <span className={`text-xs font-semibold ${phase.text}`}>
                        {phase.subtitle}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">
                      {phase.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
                      {phase.description}
                    </p>
                  </div>
                </div>

                {/* 时间轴节点 */}
                <div className="absolute left-0 top-0 z-10 md:left-1/2 md:-translate-x-1/2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${phase.color} text-xs font-bold text-white shadow-md`}
                  >
                    {i + 1}
                  </div>
                </div>

                {/* 占位（保持对称） */}
                <div className="hidden flex-1 md:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
