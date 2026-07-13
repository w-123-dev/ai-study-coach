"use client";

import { useEffect, useRef } from "react";

function FadeInSection({ children, delay }: { children: React.ReactNode; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("opacity-100", "translate-y-0");
          entry.target.classList.remove("opacity-0", "translate-y-4");
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="opacity-0 translate-y-4 transition-all duration-700 ease-out"
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

const milestones = [
  {
    day: "第 1 天",
    title: "写下目标",
    desc: "告诉 AI 你想考哪里。从这一天开始，小伴记住了你。",
  },
  {
    day: "第 7 天",
    title: "开始习惯",
    desc: "开始每天打开看一眼。小伴会记住你的学习时间、你的状态。",
  },
  {
    day: "第 30 天",
    title: "AI 开始了解你",
    desc: "小伴知道你什么科目容易拖延、什么时间效率最高。开始有针对性地调整任务。",
  },
  {
    day: "第 90 天",
    title: "形成节奏",
    desc: "你不再需要刻意坚持。学习变成了日常，小伴在旁边安静地陪你。",
  },
  {
    day: "上岸那天",
    title: "一起走完了",
    desc: "三百天的记录都在那里。小伴会说：'我们一起走完了。'",
  },
];

export default function GrowthTimeline() {
  return (
    <section className="bg-[#0F172A] px-5 py-20 md:py-28">
      <div className="mx-auto max-w-2xl">
        <FadeInSection delay={0}>
          <h2 className="text-center text-xl font-bold tracking-tight text-white md:text-2xl">
            用越久，它越懂你
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-center text-sm text-white/40">
            不是第一天最好用，而是第三百天最了解你
          </p>
        </FadeInSection>

        <div className="mt-12">
          {milestones.map((m, i) => (
            <FadeInSection key={m.day} delay={i * 100}>
              <div className="group relative flex gap-5 pb-10 last:pb-0">
                {/* 左侧时间线 */}
                <div className="flex flex-col items-center">
                  <div
                    className={`z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium transition-all duration-300 ${
                      i === milestones.length - 1
                        ? "border-amber-400/50 bg-amber-400/10 text-amber-400"
                        : "border-white/[0.08] bg-white/[0.03] text-white/40 group-hover:border-blue-400/40 group-hover:bg-blue-400/10 group-hover:text-blue-400"
                    }`}
                  >
                    {i + 1}
                  </div>
                  {i < milestones.length - 1 && (
                    <div className="h-full w-px bg-white/[0.04] group-hover:bg-blue-400/10 transition-colors" />
                  )}
                </div>

                {/* 右侧内容 */}
                <div className="min-w-0 flex-1 pb-4">
                  <span className="text-xs font-medium text-white/30">{m.day}</span>
                  <h3 className="mt-0.5 text-sm font-semibold text-white">{m.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/40">{m.desc}</p>
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}
