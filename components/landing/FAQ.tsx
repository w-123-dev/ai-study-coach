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

const faqs = [
  {
    q: "需要付费吗？",
    a: "现在是完全免费的。未来可能会推出会员功能，但基础陪伴和计划功能会一直免费。",
  },
  {
    q: "AI 真的能记住我吗？",
    a: "每次对话，AI 都会读取你的学习记录、目标和最近状态。它知道你数学哪里薄弱、今天完成了什么、上次说了什么困难。",
  },
  {
    q: "如果我换目标学校或专业怎么办？",
    a: "随时可以修改。小伴会根据新目标重新生成计划，同时保留你的学习记录——走过的路不会白费。",
  },
  {
    q: "每天需要花多久？",
    a: "15 分钟也可以。关键在于持续，而不是一次学很久。小伴会根据你每天可用的时间安排合适的任务量。",
  },
  {
    q: "和 ChatGPT 有什么区别？",
    a: "ChatGPT 每次对话都是新的开始。小伴记得你的目标、你的困难、你最近的进展——它是在长期陪伴你，而不是回答一个问题就走。",
  },
  {
    q: "如果很多天没学，会怎样？",
    a: "不会怎样。没有惩罚、没有扣分、没有批评。回来的时候，小伴会问一句'这几天休息好了吗？'，然后继续陪你。",
  },
];

export default function FAQ() {
  return (
    <section className="bg-[#0F172A] px-5 py-20 md:py-28">
      <div className="mx-auto max-w-3xl">
        <FadeInSection delay={0}>
          <h2 className="text-center text-xl font-bold tracking-tight text-white md:text-2xl">
            一些你可能想问的
          </h2>
          <p className="mx-auto mt-2 max-w-xs text-center text-sm text-white/40">
            问的人多了，就写在这里
          </p>
        </FadeInSection>

        <div className="mt-10 space-y-3">
          {faqs.map((faq, i) => (
            <FadeInSection key={faq.q} delay={i * 80}>
              <div className="group rounded-2xl border border-white/[0.06] bg-[#111827] px-5 py-4 transition-all duration-300 hover:border-white/[0.12] md:px-6 md:py-5">
                <p className="text-sm font-medium text-white/80">{faq.q}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-white/40">{faq.a}</p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}
