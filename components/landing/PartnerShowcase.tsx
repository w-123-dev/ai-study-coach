"use client";

import { useEffect, useRef } from "react";
import { Sparkles, Timer, BookOpen, Heart } from "lucide-react";

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

export default function PartnerShowcase() {
  return (
    <section className="bg-[#0F172A] px-5 py-20 md:py-28">
      <div className="mx-auto max-w-4xl">
        {/* 标题 */}
        <FadeInSection delay={0}>
          <h2 className="text-center text-xl font-bold tracking-tight text-white md:text-2xl">
            不只是教练，还有一个陪着你的人
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-center text-sm text-white/40">
            它不会催你、不会批评你。只是每天在那里，陪你走完这三百天
          </p>
        </FadeInSection>

        <div className="mt-12 space-y-5 md:space-y-6">
          {/* ───── 小伴状态卡片 ───── */}
          <FadeInSection delay={100}>
            <div className="rounded-2xl border border-white/[0.06] bg-[#111827] p-5 md:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400/20">
                  <Heart className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">小伴 · 你的考研伙伴</h3>
                  <p className="text-sm text-white/40">打开就能看到它，安静地陪着你</p>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {/* 状态 1 */}
                <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.04]">
                      <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="0.6" className="text-amber-400/40" />
                        <circle cx="8" cy="8" r="2" fill="currentColor" className="text-amber-300/70" />
                        <path d="M8 5v2M8 9v2" stroke="currentColor" strokeWidth="0.6" strokeLinecap="round" className="text-amber-400/30" />
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-white/70">状态会变化</span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-white/40">
                    你学习时它在看书，休息时对你笑，你离开时它会休息。不是静态图标，是活的陪伴。
                  </p>
                </div>

                {/* 状态 2 */}
                <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.04]">
                      <BookOpen className="h-3.5 w-3.5 text-blue-400" />
                    </div>
                    <span className="text-xs font-medium text-white/70">会记得你说过的话</span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-white/40">
                    你说过今天很累、数学很难、感冒了——下次见面它会问你恢复了没。像朋友一样。
                  </p>
                </div>

                {/* 状态 3 */}
                <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.04]">
                      <Timer className="h-3.5 w-3.5 text-emerald-400" />
                    </div>
                    <span className="text-xs font-medium text-white/70">专注时不打扰你</span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-white/40">
                    你开启专注模式，它就安静地在旁边陪你。结束时会说一句："做得很好，休息一下吧。"
                  </p>
                </div>
              </div>
            </div>
          </FadeInSection>

          {/* ───── 小伴的观察日志 ───── */}
          <FadeInSection delay={200}>
            <div className="rounded-2xl border border-white/[0.06] bg-[#111827] p-5 md:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-400/20">
                  <Sparkles className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">每天记录一两句话</h3>
                  <p className="text-sm text-white/40">不是学习报告，是小伴眼中的你</p>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  { icon: "🌱", text: "今天笑了一次。", time: "早上" },
                  { icon: "📖", text: "终于开始数学了。", time: "下午" },
                  { icon: "☕", text: "今天看起来有点累。", time: "晚上" },
                ].map((log, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-3"
                  >
                    <span className="text-base">{log.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/70">{log.text}</p>
                    </div>
                    <span className="shrink-0 text-xs text-white/20">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeInSection>
        </div>
      </div>
    </section>
  );
}
