"use client";

import { motion } from "framer-motion";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";

const stories = [
  {
    title: "计划不是写出来的，是每天调整出来的",
    desc: "大多数计划在第一周就失效了，不是因为目标不对，是因为没有人根据你的状态帮你调整。",
    left: { label: "普通计划", text: "制定后就不再变化，遇到困难只能自己扛" },
    right: { label: "AI 教练", text: "每天记录、每周复盘、自动调整难度和节奏", accent: "blue-400" },
  },
  {
    title: "ChatGPT 聊完就忘，AI 教练记得你的一切",
    desc: "每次对话都要重新解释你的情况？你的教练从第一天就记住了你。",
    left: { label: "普通 AI 聊天", text: "每次都是陌生人，需要重新介绍自己" },
    right: { label: "AI 教练", text: "记得你的目标、薄弱、最近状态和每一次进步", accent: "purple-400" },
  },
  {
    title: "当你想放弃的时候，它会先发现",
    desc: "不需要你主动求助。连续几天没完成、某科长期停滞、状态明显下滑——教练比你先注意到。",
    left: { label: "普通 App", text: "你不打卡就沉默，一切靠自觉" },
    right: { label: "AI 教练", text: "发现异常后主动提醒，帮你调整节奏", accent: "emerald-400" },
  },
];

export default function CoachDifference() {
  return (
    <section id="how-it-works" className="bg-[#0F172A] px-5 py-20 md:py-28">
      <div className="mx-auto max-w-3xl">
        <ScrollReveal>
          <h2 className="text-center text-xl font-bold leading-snug tracking-tight text-white md:text-2xl">
            你缺的不是一个计划，
            <br />
            而是一个陪你执行到底的人
          </h2>
        </ScrollReveal>

        <StaggerContainer className="mt-12 space-y-5 md:mt-16 md:space-y-6" staggerDelay={0.15}>
          {stories.map((story, i) => (
            <StaggerItem key={i}>
              <motion.div
                className="group rounded-2xl border border-white/[0.06] bg-[#111827] p-5 transition-all duration-500 md:p-6"
                whileHover={{
                  y: -4,
                  borderColor: "rgba(255,255,255,0.12)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                }}
              >
                <h3 className="text-base font-bold text-white md:text-lg">
                  {story.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/40">
                  {story.desc}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-3">
                    <p className="text-xs font-medium text-white/30">{story.left.label}</p>
                    <p className="mt-1 text-xs text-white/50">{story.left.text}</p>
                  </div>
                  <motion.div
                    className="rounded-xl border bg-white/[0.02] p-3"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className={`text-xs font-medium text-${story.right.accent}`}>
                      {story.right.label}
                    </p>
                    <p className="mt-1 text-xs text-white/50">{story.right.text}</p>
                  </motion.div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
