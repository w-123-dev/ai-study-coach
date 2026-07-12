"use client";

import { useEffect, useRef } from "react";
import {
  Target,
  Brain,
  HeartHandshake,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  BookOpen,
  MessageSquare,
  Zap,
} from "lucide-react";

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

function FlowLine({ steps, highlight = false, breakAt = -1 }: { steps: string[]; highlight?: boolean; breakAt?: number }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <span
            className={`rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
              highlight
                ? "bg-blue-500/[0.08] text-blue-300"
                : "bg-white/[0.04] text-white/50"
            }`}
          >
            {step}
          </span>
          {i < steps.length - 1 && (
            breakAt === i ? (
              <span className="text-sm text-red-400/60">✕</span>
            ) : (
              <ChevronRight className={`h-3.5 w-3.5 ${highlight ? "text-blue-400/50" : "text-white/15"}`} />
            )
          )}
        </div>
      ))}
    </div>
  );
}

export default function CoachDifference() {
  return (
    <section className="bg-[#0F172A] px-5 py-20 md:py-28">
      <div className="mx-auto max-w-4xl">
        {/* Section Header */}
        <FadeInSection delay={0}>
          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs font-medium text-white/50">
              为什么你需要一个专属 AI 教练
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
              你缺的不是一个计划，
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                而是一个陪你执行到底的人
              </span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/40 md:text-base">
              大多数考研失败，不是因为不会学习，而是没人帮你持续调整方向。
            </p>
          </div>
        </FadeInSection>

        {/* Cards */}
        <div className="mt-12 space-y-6 md:mt-16 md:space-y-8">

          {/* ───── Card 1: Plan Adjustment ───── */}
          <FadeInSection delay={100}>
            <div
              className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#111827] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30 hover:border-blue-500/30 md:p-7"
            >
              {/* Glow */}
              <div className="pointer-events-none absolute -inset-40 opacity-0 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

              {/* Header */}
              <div className="relative flex items-start gap-3 md:gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 md:h-12 md:w-12">
                  <Target className="h-5 w-5 text-blue-400 md:h-6 md:w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-white md:text-lg">
                    计划不是写出来的，是每天调整出来的
                  </h3>
                  <p className="mt-0.5 text-sm text-white/40">
                    静态计划注定失败，动态调整才是常态
                  </p>
                </div>
              </div>

              {/* Side-by-side flow */}
              <div className="relative mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                {/* Left: 普通计划 */}
                <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4 transition-all group-hover:bg-white/[0.03] md:p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
                    <span className="text-xs font-semibold text-white/40">普通计划</span>
                  </div>
                  <FlowLine steps={["制定计划", "执行几天", "遇到困难", "计划失效"]} breakAt={2} />
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-red-400/60">
                    <AlertCircle className="h-3 w-3" />
                    <span>计划一旦制定就无法调整</span>
                  </div>
                </div>

                {/* Right: AI教练 */}
                <div className="rounded-xl border border-blue-500/10 bg-gradient-to-br from-blue-500/[0.04] to-blue-500/[0.01] p-4 transition-all group-hover:border-blue-500/20 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.05)] md:p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                    <span className="text-xs font-semibold text-blue-400">AI考研教练</span>
                  </div>
                  <FlowLine steps={["记录学习状态", "发现数学停滞", "调整任务难度", "重新规划"]} highlight />
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-400/70">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>计划会随着你的状态持续进化</span>
                  </div>
                </div>
              </div>

              {/* Bottom tagline */}
              <div className="relative mt-4 flex items-center justify-end gap-1 text-xs text-white/20 transition-colors group-hover:text-white/40">
                你的计划，会随着你的状态变化
                <ArrowRight className="h-3 w-3" />
              </div>
            </div>
          </FadeInSection>

          {/* ───── Card 2: Memory ───── */}
          <FadeInSection delay={200}>
            <div
              className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#111827] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30 hover:border-purple-500/30 md:p-7"
            >
              {/* Glow */}
              <div className="pointer-events-none absolute -inset-40 opacity-0 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

              {/* Header */}
              <div className="relative flex items-start gap-3 md:gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 md:h-12 md:w-12">
                  <Brain className="h-5 w-5 text-purple-400 md:h-6 md:w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-white md:text-lg">
                    ChatGPT 聊完就忘，AI 教练记住你的整个考研周期
                  </h3>
                  <p className="mt-0.5 text-sm text-white/40">
                    每次对话都要重新解释？你的教练一直记得
                  </p>
                </div>
              </div>

              {/* Side-by-side chat comparison */}
              <div className="relative mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                {/* Left: ChatGPT */}
                <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4 transition-all group-hover:bg-white/[0.03] md:p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
                    <span className="text-xs font-semibold text-white/40">ChatGPT</span>
                  </div>
                  <div className="space-y-2">
                    <div className="rounded-lg bg-white/[0.04] px-3 py-2">
                      <div className="text-[10px] font-medium text-white/40">你</div>
                      <div className="mt-0.5 text-xs text-white/70">我要考北京邮电大学计算机</div>
                    </div>
                    <div className="rounded-lg bg-blue-500/10 px-3 py-2">
                      <div className="text-[10px] font-medium text-blue-400">AI</div>
                      <div className="mt-0.5 text-xs text-white/60">好的，我帮你制定一个计划。</div>
                    </div>
                    <div className="border-t border-white/[0.05] pt-2">
                      <div className="text-[10px] font-medium text-white/30">第二天...</div>
                      <div className="mt-1.5 rounded-lg bg-white/[0.04] px-3 py-2">
                        <div className="text-[10px] font-medium text-white/40">你</div>
                        <div className="mt-0.5 text-xs text-white/70">我数学最近学不会</div>
                      </div>
                      <div className="mt-1.5 rounded-lg bg-blue-500/10 px-3 py-2">
                        <div className="text-[10px] font-medium text-blue-400">AI</div>
                        <div className="mt-0.5 text-xs text-white/50">请告诉我你的目标和情况。</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-red-400/60">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      <span>每次都要重新开始</span>
                    </div>
                  </div>
                </div>

                {/* Right: AI教练 */}
                <div className="rounded-xl border border-purple-500/10 bg-gradient-to-br from-purple-500/[0.04] to-purple-500/[0.01] p-4 transition-all group-hover:border-purple-500/20 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.05)] md:p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                    <span className="text-xs font-semibold text-purple-400">AI考研教练</span>
                  </div>

                  {/* Memory card */}
                  <div className="mb-3 rounded-lg border border-purple-500/20 bg-purple-500/[0.04] p-3">
                    <div className="mb-2 flex items-center gap-1.5">
                      <Brain className="h-3 w-3 text-purple-400" />
                      <span className="text-[10px] font-semibold text-purple-400">长期记忆</span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-white/40">目标院校</span>
                        <span className="font-medium text-white/70">北京邮电大学</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-white/40">专业</span>
                        <span className="font-medium text-white/70">计算机</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-white/40">薄弱科目</span>
                        <span className="font-medium text-amber-300/80">高等数学</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-white/40">最近状态</span>
                        <span className="font-medium text-red-300/70">数学连续停滞3天</span>
                      </div>
                    </div>
                  </div>

                  {/* AI Reply with Memory */}
                  <div className="rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-500/[0.03] px-3 py-2.5">
                    <div className="text-[10px] font-medium text-purple-400">AI 教练回复</div>
                    <div className="mt-1 text-xs leading-relaxed text-white/70">
                      「我记得你的数学最近遇到困难。今天先降低任务难度，完成一道基础题恢复节奏。」
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom tagline */}
              <div className="relative mt-4 flex items-center justify-end gap-1 text-xs text-white/20 transition-colors group-hover:text-white/40">
                你的教练，从第一天就记住了你
                <ArrowRight className="h-3 w-3" />
              </div>
            </div>
          </FadeInSection>

          {/* ───── Card 3: Proactive ───── */}
          <FadeInSection delay={300}>
            <div
              className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#111827] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30 hover:border-emerald-500/30 md:p-7"
            >
              {/* Glow */}
              <div className="pointer-events-none absolute -inset-40 opacity-0 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

              {/* Header */}
              <div className="relative flex items-start gap-3 md:gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 md:h-12 md:w-12">
                  <HeartHandshake className="h-5 w-5 text-emerald-400 md:h-6 md:w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-white md:text-lg">
                    当你想放弃的时候，它会发现
                  </h3>
                  <p className="mt-0.5 text-sm text-white/40">
                    不需要你主动求助，教练比你先发现问题
                  </p>
                </div>
              </div>

              {/* Side-by-side */}
              <div className="relative mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                {/* Left: 普通App */}
                <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4 transition-all group-hover:bg-white/[0.03] md:p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
                    <span className="text-xs font-semibold text-white/40">普通学习 App</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 py-4">
                    <div className="flex items-center gap-2 text-white/30">
                      <BookOpen className="h-4 w-4" />
                      <span className="text-xs">没有打卡</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-white/10 rotate-90" />
                    <div className="flex items-center gap-2 text-white/30">
                      <MessageSquare className="h-4 w-4" />
                      <span className="text-xs">没有反馈</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-white/10 rotate-90" />
                    <div className="flex items-center gap-2 text-red-400/50">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-xs">慢慢遗忘</span>
                    </div>
                  </div>
                </div>

                {/* Right: AI教练 */}
                <div className="rounded-xl border border-emerald-500/10 bg-gradient-to-br from-emerald-500/[0.04] to-emerald-500/[0.01] p-4 transition-all group-hover:border-emerald-500/20 group-hover:shadow-[0_0_20px_rgba(52,211,153,0.05)] md:p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-400">AI考研教练</span>
                  </div>

                  {/* Detection Flow */}
                  <div className="mb-3 space-y-2">
                    <div className="flex items-center gap-2 rounded-lg bg-white/[0.03] px-3 py-2">
                      <Clock className="h-3.5 w-3.5 text-amber-400" />
                      <span className="text-xs text-white/70">连续 3 天未完成任务</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-white/[0.03] px-3 py-2">
                      <Zap className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-xs text-white/70">主动检测到异常</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-white/[0.03] px-3 py-2">
                      <HeartHandshake className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-xs text-white/70">生成调整建议</span>
                    </div>
                  </div>

                  {/* Coach message bubble */}
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-3">
                    <div className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-400">
                      <MessageSquare className="h-3 w-3" />
                      AI 教练主动消息
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-white/70">
                      「我发现你数学已经停滞3天，今晚先完成15分钟基础题，找回学习节奏。」
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom tagline */}
              <div className="relative mt-4 flex items-center justify-end gap-1 text-xs text-white/20 transition-colors group-hover:text-white/40">
                在你放弃之前，教练已经为你调整好了
                <ArrowRight className="h-3 w-3" />
              </div>
            </div>
          </FadeInSection>

        </div>
      </div>
    </section>
  );
}
