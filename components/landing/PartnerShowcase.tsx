"use client";

import { motion } from "framer-motion";
import { Sparkles, Timer, BookOpen, Heart } from "lucide-react";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";

const features = [
  {
    icon: (className: string) => (
      <svg className={className} viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="0.6" className="text-amber-400/40" />
        <circle cx="8" cy="8" r="2" fill="currentColor" className="text-amber-300/70" />
        <path d="M8 5v2M8 9v2" stroke="currentColor" strokeWidth="0.6" strokeLinecap="round" className="text-amber-400/30" />
      </svg>
    ),
    title: "状态会变化",
    desc: "你学习时它在看书，休息时对你笑，你离开时它会休息。不是静态图标，是活的陪伴。",
  },
  {
    icon: (className: string) => <BookOpen className={className} />,
    title: "会记得你说过的话",
    desc: "你说过今天很累、数学很难、感冒了——下次见面它会问你恢复了没。像朋友一样。",
  },
  {
    icon: (className: string) => <Timer className={className} />,
    title: "专注时不打扰你",
    desc: "你开启专注模式，它就安静地在旁边陪你。结束时会说一句：做得很好，休息一下吧。",
  },
];

const logs = [
  { icon: "🌱", text: "今天笑了一次。", time: "早上" },
  { icon: "📖", text: "终于开始数学了。", time: "下午" },
  { icon: "☕", text: "今天看起来有点累。", time: "晚上" },
];

export default function PartnerShowcase() {
  return (
    <section className="bg-[#0F172A] px-5 py-20 md:py-28">
      <div className="mx-auto max-w-4xl">
        <ScrollReveal>
          <h2 className="text-center text-xl font-bold tracking-tight text-white md:text-2xl">
            不只是教练，还有一个陪着你的人
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-center text-sm text-white/40">
            它不会催你、不会批评你。只是每天在那里，陪你走完这三百天
          </p>
        </ScrollReveal>

        <div className="mt-12 space-y-5 md:space-y-6">
          {/* 小伴状态卡片 */}
          <ScrollReveal delay={0.1}>
            <motion.div
              className="rounded-2xl border border-white/[0.06] bg-[#111827] p-5 md:p-6"
              whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400/20">
                  <Heart className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">小伴 · 你的考研伙伴</h3>
                  <p className="text-sm text-white/40">打开就能看到它，安静地陪着你</p>
                </div>
              </div>

              <StaggerContainer className="grid gap-3 md:grid-cols-3" staggerDelay={0.08}>
                {features.map((f, i) => (
                  <StaggerItem key={i}>
                    <motion.div
                      className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4"
                      whileHover={{ scale: 1.02, borderColor: "rgba(255,255,255,0.1)" }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.04]">
                          {f.icon("h-4 w-4")}
                        </div>
                        <span className="text-xs font-medium text-white/70">{f.title}</span>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-white/40">{f.desc}</p>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </motion.div>
          </ScrollReveal>

          {/* 小伴的观察日志 */}
          <ScrollReveal delay={0.2}>
            <motion.div
              className="rounded-2xl border border-white/[0.06] bg-[#111827] p-5 md:p-6"
              whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
              transition={{ duration: 0.4 }}
            >
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
                {logs.map((log, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-3"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                  >
                    <span className="text-base">{log.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/70">{log.text}</p>
                    </div>
                    <span className="shrink-0 text-xs text-white/20">{log.time}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
