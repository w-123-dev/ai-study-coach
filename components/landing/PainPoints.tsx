"use client";

import { useEffect, useRef } from "react";
import {
  ArrowRight,
  RotateCcw,
  AlertCircle,
  Target,
  Brain,
  HeartHandshake,
  ChevronRight,
  MessageSquare,
  RefreshCw,
  Bell,
} from "lucide-react";

function StepArrow() {
  return (
    <div className="flex shrink-0 items-center text-white/15">
      <ChevronRight className="h-4 w-4" />
    </div>
  );
}

function BreakArrow() {
  return (
    <div className="flex shrink-0 items-center">
      <span className="text-lg text-red-400/60">✕</span>
    </div>
  );
}

function FadeInSection({ children, delay }: { children: React.ReactNode; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("opacity-100", "translate-y-0");
          entry.target.classList.remove("opacity-0", "translate-y-6");
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="opacity-0 translate-y-6 transition-all duration-700 ease-out"
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function PainPoints() {
  const cards = [
    {
      id: "plan",
      icon: Target,
      iconBg: "from-blue-500/20 to-blue-600/10",
      iconColor: "text-blue-400",
      title: "计划不是写出来的，是调整出来的",
      subtitle: "静态计划注定失败，动态调整才是常态",
      leftLabel: "普通计划",
      leftSteps: ["制定计划", "执行几天", "放弃"],
      leftBreak: true,
      rightLabel: "AI教练",
      rightSteps: ["检测完成率", "发现问题", "自动调整"],
      gradient: "from-blue-500/10 via-blue-500/5 to-transparent",
      borderGlow: "hover:border-blue-500/30",
    },
    {
      id: "memory",
      icon: Brain,
      iconBg: "from-purple-500/20 to-purple-600/10",
      iconColor: "text-purple-400",
      title: "ChatGPT 聊完就忘，AI教练记住你的300天",
      subtitle: "每次对话都要重新解释？你的教练一直记得",
      leftLabel: "普通AI聊天",
      leftChat: [
        { speaker: "用户", text: "我想考北邮计算机" },
        { speaker: "AI", text: "好的，你的目标是什么？" },
        { speaker: "用户", text: "我刚说了啊..." },
      ],
      rightLabel: "AI教练",
      rightMemory: [
        { label: "目标院校", value: "北京邮电大学" },
        { label: "专业", value: "计算机科学与技术" },
        { label: "薄弱科目", value: "数学、数据结构" },
        { label: "最近状态", value: "连续学习12天，完成率78%" },
      ],
      gradient: "from-purple-500/10 via-purple-500/5 to-transparent",
      borderGlow: "hover:border-purple-500/30",
    },
    {
      id: "proactive",
      icon: HeartHandshake,
      iconBg: "from-emerald-500/20 to-emerald-600/10",
      iconColor: "text-emerald-400",
      title: "你想放弃的时候，它会发现",
      subtitle: "不需要你主动求助，教练比你先发现问题",
      leftLabel: "普通App",
      leftSteps: ["打开App", "没有提醒", "慢慢忘记"],
      leftBreak: true,
      rightLabel: "AI教练",
      rightSteps: ["连续3天未完成", "主动提醒", "调整今日任务"],
      gradient: "from-emerald-500/10 via-emerald-500/5 to-transparent",
      borderGlow: "hover:border-emerald-500/30",
    },
  ];

  return (
    <section className="bg-[#0F172A] px-5 py-20 md:py-28" id="how-it-works">
      <div className="mx-auto max-w-4xl">
        {/* 标题 */}
        <FadeInSection delay={0}>
          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs font-medium text-white/50">
              为什么需要一个专属 AI 教练
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
              别人的工具只是工具，
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                你的教练真的在乎
              </span>
            </h2>
          </div>
        </FadeInSection>

        {/* 三个故事卡片 */}
        <div className="mt-12 space-y-6 md:mt-16 md:space-y-8">
          {cards.map((card, i) => (
            <FadeInSection key={card.id} delay={100 + i * 150}>
              <div
                className={`group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#111827] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30 ${card.borderGlow} md:p-7`}
              >
                {/* 装饰光效 */}
                <div
                  className={`pointer-events-none absolute -inset-40 opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${card.gradient} blur-2xl`}
                />

                {/* 标题区 */}
                <div className="relative flex items-start gap-3 md:gap-4">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${card.iconBg} md:h-12 md:w-12`}
                  >
                    <card.icon className={`h-5 w-5 ${card.iconColor} md:h-6 md:w-6`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold text-white md:text-lg">
                      {card.title}
                    </h3>
                    <p className="mt-0.5 text-sm text-white/40">{card.subtitle}</p>
                  </div>
                </div>

                {/* 对比内容区 */}
                <div className="relative mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                  {/* 左侧：普通方案 */}
                  <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4 transition-all group-hover:bg-white/[0.03] md:p-5">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
                      <span className="text-xs font-semibold text-white/40">
                        {card.leftLabel}
                      </span>
                    </div>

                    {/* Steps 类型 */}
                    {card.leftSteps && (
                      <div className="flex items-center gap-1.5">
                        {card.leftSteps.map((step, j) => (
                          <div key={j} className="flex items-center gap-1.5">
                            <span className="rounded-lg bg-white/[0.04] px-2.5 py-1.5 text-xs text-white/50">
                              {step}
                            </span>
                            {j < card.leftSteps.length - 1 &&
                              (card.leftBreak ? <BreakArrow /> : <StepArrow />)}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Chat 类型 */}
                    {card.leftChat && (
                      <div className="space-y-2">
                        {card.leftChat.map((msg, j) => (
                          <div key={j} className="flex items-start gap-2">
                            <span
                              className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-medium ${
                                msg.speaker === "用户"
                                  ? "bg-white/10 text-white/60"
                                  : "bg-blue-500/10 text-blue-400"
                              }`}
                            >
                              {msg.speaker}
                            </span>
                            <span className="text-xs text-white/50">{msg.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 右侧：AI教练方案 */}
                  <div className="rounded-xl border border-blue-500/10 bg-gradient-to-br from-blue-500/[0.04] to-blue-500/[0.01] p-4 transition-all group-hover:border-blue-500/20 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.05)] md:p-5">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                      <span className="text-xs font-semibold text-blue-400">
                        {card.rightLabel}
                      </span>
                    </div>

                    {/* Steps 类型 */}
                    {card.rightSteps && (
                      <div className="flex items-center gap-1.5">
                        {card.rightSteps.map((step, j) => (
                          <div key={j} className="flex items-center gap-1.5">
                            <span className="rounded-lg bg-blue-500/[0.08] px-2.5 py-1.5 text-xs text-blue-300">
                              {step}
                            </span>
                            {j < card.rightSteps.length - 1 && (
                              <ArrowRight className="h-3.5 w-3.5 text-blue-400/50" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Memory 类型 */}
                    {card.rightMemory && (
                      <div className="space-y-2">
                        {card.rightMemory.map((item, j) => (
                          <div
                            key={j}
                            className="flex items-start justify-between gap-3 rounded-lg bg-white/[0.03] px-3 py-2"
                          >
                            <span className="text-xs text-white/40">{item.label}</span>
                            <span className="text-xs font-medium text-white/70 text-right">
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* 底部 CTA 文本 */}
                <div className="relative mt-4 flex items-center justify-end gap-1 text-xs text-white/20 transition-colors group-hover:text-white/40">
                  这就是为什么你需要 AI 教练
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}
