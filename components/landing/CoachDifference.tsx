"use client";

import { useEffect, useRef } from "react";

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

export default function CoachDifference() {
  return (
    <section id="how-it-works" className="bg-[#0F172A] px-5 py-20 md:py-28">
      <div className="mx-auto max-w-3xl">
        {/* 标题 — 一句就够了，不要标签和渐变 */}
        <FadeInSection delay={0}>
          <h2 className="text-center text-xl font-bold leading-snug tracking-tight text-white md:text-2xl">
            你缺的不是一个计划，
            <br />
            而是一个陪你执行到底的人
          </h2>
        </FadeInSection>

        {/* 三个故事 — 简洁、有力、不说教 */}
        <div className="mt-12 space-y-5 md:mt-16 md:space-y-6">
          {/* ───── 故事 1: 动态调整 ───── */}
          <FadeInSection delay={100}>
            <div className="group rounded-2xl border border-white/[0.06] bg-[#111827] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.12] hover:shadow-xl hover:shadow-black/30 md:p-6">
              <h3 className="text-base font-bold text-white md:text-lg">
                计划不是写出来的，是每天调整出来的
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-white/40">
                大多数计划在第一周就失效了，不是因为目标不对，是因为没有人根据你的状态帮你调整。
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-3">
                  <p className="text-xs font-medium text-white/30">普通计划</p>
                  <p className="mt-1 text-xs text-white/50">制定后就不再变化，遇到困难只能自己扛</p>
                </div>
                <div className="rounded-xl border border-blue-500/10 bg-blue-500/[0.04] p-3">
                  <p className="text-xs font-medium text-blue-400">AI 教练</p>
                  <p className="mt-1 text-xs text-white/50">每天记录、每周复盘、自动调整难度和节奏</p>
                </div>
              </div>
            </div>
          </FadeInSection>

          {/* ───── 故事 2: 记忆 ───── */}
          <FadeInSection delay={200}>
            <div className="group rounded-2xl border border-white/[0.06] bg-[#111827] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.12] hover:shadow-xl hover:shadow-black/30 md:p-6">
              <h3 className="text-base font-bold text-white md:text-lg">
                ChatGPT 聊完就忘，AI 教练记得你的一切
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-white/40">
                每次对话都要重新解释你的情况？你的教练从第一天就记住了你。知道你考什么学校、薄弱在哪、最近状态如何。
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-3">
                  <p className="text-xs font-medium text-white/30">普通 AI 聊天</p>
                  <p className="mt-1 text-xs text-white/50">每次都是陌生人，需要重新介绍自己</p>
                </div>
                <div className="rounded-xl border border-purple-500/10 bg-purple-500/[0.04] p-3">
                  <p className="text-xs font-medium text-purple-400">AI 教练</p>
                  <p className="mt-1 text-xs text-white/50">记得你的目标、薄弱、最近状态和每一次进步</p>
                </div>
              </div>
            </div>
          </FadeInSection>

          {/* ───── 故事 3: 主动发现 ───── */}
          <FadeInSection delay={300}>
            <div className="group rounded-2xl border border-white/[0.06] bg-[#111827] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.12] hover:shadow-xl hover:shadow-black/30 md:p-6">
              <h3 className="text-base font-bold text-white md:text-lg">
                当你想放弃的时候，它会先发现
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-white/40">
                不需要你主动求助。连续几天没完成、某科长期停滞、状态明显下滑——教练比你先注意到。
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-3">
                  <p className="text-xs font-medium text-white/30">普通 App</p>
                  <p className="mt-1 text-xs text-white/50">你不打卡就沉默，一切靠自觉</p>
                </div>
                <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/[0.04] p-3">
                  <p className="text-xs font-medium text-emerald-400">AI 教练</p>
                  <p className="mt-1 text-xs text-white/50">发现异常后主动提醒，帮你调整节奏</p>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </div>
    </section>
  );
}
