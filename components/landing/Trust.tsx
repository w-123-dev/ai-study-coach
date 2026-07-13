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

const promises = [
  {
    title: "一直在这里",
    body: "不需要每天登录。隔了一天、一周、一个月再回来，小伴还在。你的记录、你的目标，都在那里。",
  },
  {
    title: "一直记得",
    body: "你第一天写下的目标、某天说数学好难、状态不好的时候——下次见面，小伴都还记得。不用重新介绍自己。",
  },
  {
    title: "不会催你",
    body: "累了就休息几天。小伴不会发消息催你、不会扣分、不会让等级下降。只在你准备好的时候，安静地陪你继续。",
  },
];

export default function Trust() {
  return (
    <section className="border-t border-white/[0.04] bg-[#0F172A] px-5 py-20 md:py-28">
      <div className="mx-auto max-w-3xl">
        <FadeInSection delay={0}>
          <h2 className="text-center text-xl font-bold tracking-tight text-white md:text-2xl">
            有些东西，不会因为你今天没学习就消失
          </h2>
          <p className="mx-auto mt-2 max-w-md text-center text-sm text-white/40">
            小伴不是绩效考核工具。它不会因为你中断就改变对你的态度。
          </p>
        </FadeInSection>

        <div className="mt-10 space-y-4">
          {promises.map((p, i) => (
            <FadeInSection key={p.title} delay={100 + i * 100}>
              <div className="group rounded-2xl border border-white/[0.06] bg-[#111827] p-5 transition-all duration-300 hover:border-white/[0.12] md:p-6">
                <h3 className="text-base font-semibold text-white">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/40">{p.body}</p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}
