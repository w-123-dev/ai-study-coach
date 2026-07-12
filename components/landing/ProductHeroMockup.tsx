"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Circle, Clock, MessageSquare, Target, Calendar } from "lucide-react";

interface Task {
  subject: string;
  content: string;
  progress: number;
  time: string;
  done: boolean;
}

const NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

const INITIAL_TASKS: Task[] = [
  { subject: "数学", content: "高等数学：函数与极限", progress: 70, time: "2h", done: false },
  { subject: "英语", content: "核心词汇100个", progress: 40, time: "1h", done: false },
  { subject: "数据结构", content: "链表基础", progress: 100, time: "1.5h", done: true },
];

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let start = 0;
    const step = Math.max(1, Math.floor(value / 40));
    ref.current = setInterval(() => {
      start += step;
      if (start >= value) {
        setDisplay(value);
        if (ref.current) clearInterval(ref.current);
      } else {
        setDisplay(start);
      }
    }, 25);
    return () => {
      if (ref.current) clearInterval(ref.current);
    };
  }, [value]);

  return (
    <span>
      {display}
      {suffix}
    </span>
  );
}

function ProgressBar({ value, color = "bg-blue-500" }: { value: number; color?: string }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
      <div
        className={`h-full rounded-full transition-all duration-1000 ${color}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export default function ProductHeroMockup() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [mounted, setMounted] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  function toggleTask(index: number) {
    setTasks((prev) =>
      prev.map((t, i) =>
        i === index ? { ...t, done: !t.done, progress: t.done ? t.progress : t.progress === 100 ? t.progress : 100 } : t
      )
    );
  }

  if (!mounted) {
    return (
      <div className="h-[520px] w-full max-w-[520px] animate-pulse rounded-2xl bg-[#111827] md:h-[520px]" />
    );
  }

  return (
    <div
      className="group relative mx-auto w-full max-w-[520px]"
      style={{ perspective: "1200px" }}
    >
      {/* 蓝色光晕背景 */}
      <div className="pointer-events-none absolute -inset-4 opacity-30 blur-2xl transition-opacity duration-500 group-hover:opacity-50">
        <div className="h-full w-full rounded-3xl bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/10" />
      </div>

      {/* 窗口主体 */}
      <div
        className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111827] shadow-2xl shadow-black/50 transition-all duration-500 hover:shadow-blue-500/10"
        style={{ transform: "rotateY(-2deg) rotateX(1deg)" }}
      >
        {/* ===== 标题栏 ===== */}
        <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-[#FF5F56]" />
            <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
            <div className="h-3 w-3 rounded-full bg-[#27C93F]" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-xs font-medium text-white/30">AI考研教练 · 个人Dashboard</span>
          </div>
          <div className="flex items-center gap-1.5 text-white/20">
            <span className="text-[10px]">—</span>
            <span className="text-[10px]">□</span>
            <span className="text-[10px]">✕</span>
          </div>
        </div>

        {/* ===== Dashboard 内容 ===== */}
        <div className="p-5 space-y-4">
          {/* 顶部：倒计时 + 目标 */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-white/40 mb-1">
                <Calendar className="h-3 w-3" />
                距离考研
              </div>
              <div className="text-3xl font-bold tracking-tight text-white">
                <AnimatedNumber value={527} />
                <span className="ml-1 text-base font-normal text-white/40">天</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-white/40 mb-0.5">目标院校</div>
              <div className="text-sm font-semibold text-white">北京邮电大学</div>
              <div className="text-xs text-white/50">计算机科学与技术</div>
            </div>
          </div>

          {/* 本周完成率 */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.04] p-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-white/60">本周完成率</span>
              <span className="text-sm font-bold text-emerald-400">
                <AnimatedNumber value={78} suffix="%" />
              </span>
            </div>
            <ProgressBar value={78} color="bg-emerald-500" />
          </div>

          {/* 今日任务 */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-semibold text-white/80">今天要完成</span>
            </div>
            <div className="space-y-2">
              {tasks.map((task, i) => (
                <div
                  key={i}
                  className={`rounded-xl border bg-white/[0.03] p-3 transition-all duration-200 ${
                    hoveredCard === i ? "border-white/20 -translate-y-0.5" : "border-white/[0.06]"
                  }`}
                  onMouseEnter={() => setHoveredCard(i)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleTask(i)}
                      className="mt-0.5 shrink-0 transition-transform hover:scale-110"
                    >
                      {task.done ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Circle className="h-4 w-4 text-white/20" />
                      )}
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-white/[0.06] px-1.5 py-0.5 text-[10px] font-medium text-white/50">
                          {task.subject}
                        </span>
                        <span
                          className={`text-xs ${
                            task.done ? "text-white/30 line-through" : "text-white/70"
                          }`}
                        >
                          {task.content}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <ProgressBar
                          value={task.progress}
                          color={
                            task.progress === 100
                              ? "bg-emerald-500"
                              : task.progress > 50
                              ? "bg-blue-500"
                              : "bg-amber-500"
                          }
                        />
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1 text-[10px] text-white/30">
                      <Clock className="h-3 w-3" />
                      {task.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI 教练消息气泡 */}
          <div className="relative mt-1 rounded-xl border border-blue-500/20 bg-gradient-to-r from-blue-500/[0.08] to-blue-500/[0.03] p-3.5">
            <div className="absolute -top-1.5 left-4 h-3 w-3 rotate-45 bg-blue-500/[0.08]" />
            <div className="flex items-start gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-500/20">
                <MessageSquare className="h-3.5 w-3.5 text-blue-400" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-blue-300">AI 教练</span>
                  <span className="text-[10px] text-white/20">刚刚</span>
                </div>
                <p className="mt-0.5 text-xs leading-relaxed text-white/60">
                  我发现你数学连续3天完成率下降。
                  <br />
                  今天先降低目标，完成一道题找回状态。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
