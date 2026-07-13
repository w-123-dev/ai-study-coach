"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, Heart, MessageSquare, TrendingUp } from "lucide-react";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";

const scenes = [
  {
    icon: (cn: string) => <Heart className={cn} />,
    iconBg: "bg-amber-400/20",
    title: "打开首页，小伴先跟你打招呼",
    desc: "不是欢迎回来，而是能感受到温度的问候。根据时间、学习状态、连续天数，每次都不一样。",
    preview: (
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-400/20 text-sm">🧑</div>
          <div>
            <p className="text-sm font-medium text-white/80">下午好，今天看起来比昨天轻松一点</p>
            <p className="mt-0.5 text-xs text-white/30">北京邮电大学 · 计算机 · 距离考研 527 天</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-orange-400/60">
          <TrendingUp className="h-3 w-3" />
          连续学习了 5 天
        </div>
      </div>
    ),
    reverse: false,
  },
  {
    icon: (cn: string) => <CheckCircle2 className={cn} />,
    iconBg: "bg-blue-400/20",
    title: "任务不多，今天只做最重要的",
    desc: "不看长长的计划表。一天只看几个任务，完成一个划掉一个。",
    preview: (
      <div className="space-y-2">
        {[
          { subject: "数学", content: "函数与极限复习", done: false },
          { subject: "英语", content: "核心词汇 50 个", done: false },
          { subject: "数据结构", content: "链表基础练习", done: true },
        ].map((task, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3">
            {task.done ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" /> : <Circle className="h-4 w-4 shrink-0 text-white/20" />}
            <div className="flex items-center gap-2 min-w-0">
              <span className="shrink-0 rounded bg-white/[0.06] px-1.5 py-0.5 text-[10px] font-medium text-white/40">{task.subject}</span>
              <span className={'text-sm ' + (task.done ? "text-white/30 line-through" : "text-white/70")}>{task.content}</span>
            </div>
          </div>
        ))}
      </div>
    ),
    reverse: true,
  },
  {
    icon: (cn: string) => <MessageSquare className={cn} />,
    iconBg: "bg-purple-400/20",
    title: "每次对话，AI 知道你是谁",
    desc: "不用重新介绍自己。AI 记得你的目标、薄弱科目、最近状态。",
    preview: (
      <div className="space-y-3">
        <div className="flex justify-end">
          <div className="rounded-2xl rounded-tr-sm bg-blue-500/20 px-4 py-2.5">
            <p className="text-sm text-white/80">数学最近学不进去怎么办</p>
          </div>
        </div>
        <div className="flex justify-start">
          <div className="rounded-2xl rounded-tl-sm border border-white/[0.06] bg-white/[0.03] px-4 py-2.5">
            <p className="text-sm leading-relaxed text-white/70">我记得你数学最近确实有点停滞。今天先降低难度，只做 3 道基础题恢复感觉？</p>
          </div>
        </div>
      </div>
    ),
    reverse: false,
  },
];

export default function ProductDemo() {
  return (
    <section className="bg-[#0F172A] px-5 py-20 md:py-28">
      <div className="mx-auto max-w-4xl">
        <ScrollReveal>
          <h2 className="text-center text-xl font-bold tracking-tight text-white md:text-2xl">每一天，打开就能看到的一切</h2>
          <p className="mx-auto mt-2 max-w-sm text-center text-sm text-white/40">不是复杂的后台，打开就知道今天该做什么、状态如何</p>
        </ScrollReveal>

        <StaggerContainer className="mt-12 space-y-6" staggerDelay={0.15}>
          {scenes.map((scene, i) => (
            <StaggerItem key={i}>
              <motion.div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#111827]" whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}>
                <div className={'grid md:grid-cols-5'}>
                  <div className={'p-5 md:col-span-2 md:p-7 ' + (scene.reverse ? "md:order-last" : "")}>
                    <div className={'flex h-8 w-8 items-center justify-center rounded-full ' + scene.iconBg}>{scene.icon("h-4 w-4")}</div>
                    <h3 className="mt-3 text-base font-bold text-white">{scene.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/40">{scene.desc}</p>
                  </div>
                  <div className="border-t border-white/[0.06] bg-white/[0.02] p-5 md:col-span-3 md:border-t-0 md:border-l">{scene.preview}</div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}