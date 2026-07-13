"use client";

import { motion } from "framer-motion";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";

const promises = [
  { title: "一直在这里", body: "不需要每天登录。隔了一天、一周、一个月再回来，小伴还在。你的记录、你的目标，都在那里。" },
  { title: "一直记得", body: "你第一天写下的目标、某天说数学好难、状态不好的时候——下次见面，小伴都还记得。不用重新介绍自己。" },
  { title: "不会催你", body: "累了就休息几天。小伴不会发消息催你、不会扣分、不会让等级下降。只在你准备好的时候，安静地陪你继续。" },
];

export default function Trust() {
  return (
    <section className="border-t border-white/[0.04] bg-[#0F172A] px-5 py-20 md:py-28">
      <div className="mx-auto max-w-3xl">
        <ScrollReveal>
          <h2 className="text-center text-xl font-bold tracking-tight text-white md:text-2xl">有些东西，不会因为你今天没学习就消失</h2>
          <p className="mx-auto mt-2 max-w-md text-center text-sm text-white/40">小伴不是绩效考核工具。它不会因为你中断就改变对你的态度。</p>
        </ScrollReveal>

        <StaggerContainer className="mt-10 space-y-4" staggerDelay={0.12}>
          {promises.map((p) => (
            <StaggerItem key={p.title}>
              <motion.div className="rounded-2xl border border-white/[0.06] bg-[#111827] p-5 md:p-6" whileHover={{ y: -4, borderColor: "rgba(255,255,255,0.12)", boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}>
                <h3 className="text-base font-semibold text-white">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/40">{p.body}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
