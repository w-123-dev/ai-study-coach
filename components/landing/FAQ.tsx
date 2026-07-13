"use client";

import { motion } from "framer-motion";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";

const faqs = [
  { q: "需要付费吗？", a: "现在是完全免费的。未来可能会推出会员功能，但基础陪伴和计划功能会一直免费。" },
  { q: "AI 真的能记住我吗？", a: "每次对话，AI 都会读取你的学习记录、目标和最近状态。它知道你数学哪里薄弱、今天完成了什么、上次说了什么困难。" },
  { q: "如果我换目标学校或专业怎么办？", a: "随时可以修改。小伴会根据新目标重新生成计划，同时保留你的学习记录——走过的路不会白费。" },
  { q: "每天需要花多久？", a: "15 分钟也可以。关键在于持续，而不是一次学很久。" },
  { q: "和 ChatGPT 有什么区别？", a: "ChatGPT 每次对话都是新的开始。小伴记得你的目标、你的困难、你最近的进展。" },
  { q: "如果很多天没学，会怎样？", a: "没有惩罚、没有扣分、没有批评。回来的时候，小伴会问一句：这几天休息好了吗？然后继续陪你。" },
];

export default function FAQ() {
  return (
    <section className="bg-[#0F172A] px-5 py-20 md:py-28">
      <div className="mx-auto max-w-3xl">
        <ScrollReveal>
          <h2 className="text-center text-xl font-bold tracking-tight text-white md:text-2xl">一些你可能想问的</h2>
          <p className="mx-auto mt-2 max-w-xs text-center text-sm text-white/40">问的人多了，就写在这里</p>
        </ScrollReveal>

        <StaggerContainer className="mt-10 space-y-3" staggerDelay={0.08}>
          {faqs.map((faq) => (
            <StaggerItem key={faq.q}>
              <motion.div className="rounded-2xl border border-white/[0.06] bg-[#111827] px-5 py-4 md:px-6 md:py-5" whileHover={{ y: -2, borderColor: "rgba(255,255,255,0.12)", boxShadow: "0 12px 28px rgba(0,0,0,0.2)" }}>
                <p className="text-sm font-medium text-white/80">{faq.q}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-white/40">{faq.a}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
