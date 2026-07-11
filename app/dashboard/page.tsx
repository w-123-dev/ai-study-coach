"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Loader2,
  CalendarDays,
  Sparkles,
  LogOut,
  Flame,
  Brain,
  Clock,
  Zap,
  ChevronLeft,
  ChevronRight,
  SmilePlus,
  BatteryFull,
  BatteryLow,
  Frown,
  Edit3
} from "lucide-react";
import type { StudentProfile, StudyPlan, PlanTask, Emotion, Energy } from "@/lib/types";
import { EMOTION_LABELS, ENERGY_LABELS } from "@/lib/types";

interface TodayCheckin {
  id: string;
  study_hours: number;
  tasks_completed: number;
  tasks_total: number;
  status: string;
  difficulties: string;
  ai_feedback: string | null;
}

const statusOptions = [
  { value: "energetic", label: "精力充沛", icon: Zap },
  { value: "normal", label: "状态一般", icon: Brain },
  { value: "tired", label: "比较疲惫", icon: Clock },
];

/** 科目颜色映射 */
const subjectColors: Record<string, string> = {
  "数学": "bg-blue-50 text-blue-700 border-blue-200",
  "英语": "bg-green-50 text-green-700 border-green-200",
  "政治": "bg-red-50 text-red-700 border-red-200",
  "专业课": "bg-purple-50 text-purple-700 border-purple-200",
};

function getSubjectColor(subject: string): string {
  for (const [key, color] of Object.entries(subjectColors)) {
    if (subject.includes(key)) return color;
  }
  return "bg-gray-50 text-gray-700 border-gray-200";
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [tasks, setTasks] = useState<PlanTask[]>([]);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [hasPlan, setHasPlan] = useState(false);
  const [todayStr, setTodayStr] = useState("");
  const [streak, setStreak] = useState(0);

  // 打卡状态
  const [checkin, setCheckin] = useState<TodayCheckin | null>(null);
  const [showCheckin, setShowCheckin] = useState(false);
  const [studyHours, setStudyHours] = useState(6);
  const [checkinStatus, setCheckinStatus] = useState("normal");
  const [difficulties, setDifficulties] = useState("");
  const [emotion, setEmotion] = useState("normal");
  const [energy, setEnergy] = useState("medium");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // 已打卡任务记录（用于今日打卡弹窗）
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [taskUpdates, setTaskUpdates] = useState<Record<string, {completed: boolean; actualHours: number}>>({});

  const loadTasks = useCallback(async (week: number) => {
    try {
      const res = await fetch(`/api/plan/tasks?week=${week}`);
      if (!res.ok) return;
      const data = await res.json();
      setTasks(data.tasks ?? []);
      setCurrentWeek(data.currentWeek ?? week);
      setHasPlan(data.hasPlan ?? false);

      // 记录已完成的任务 ID
      setCompletedTaskIds(
        (data.tasks ?? [])
          .filter((t: PlanTask) => t.status === "completed")
          .map((t: PlanTask) => t.id)
      );
    } catch (e) {
      console.warn("[Dashboard] 加载任务失败:", e);
    }
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { data: profileData } = await supabase
      .from("student_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!profileData) {
      router.push("/setup");
      return;
    }

    setProfile(profileData);
    setPlan(profileData.study_plan);

    if (todayStr) {
      // 读取今日打卡
      const { data: checkinData } = await supabase
        .from("daily_checkins")
        .select("*")
        .eq("user_id", user.id)
        .eq("checkin_date", todayStr)
        .single();

      if (checkinData) {
        setCheckin(checkinData);
        setFeedback(checkinData.ai_feedback);
        setStudyHours(checkinData.study_hours);
        setCheckinStatus(checkinData.status);
        setDifficulties(checkinData.difficulties || "");
      }

      // 计算连续打卡
      const { data: allCheckins } = await supabase
        .from("daily_checkins")
        .select("checkin_date")
        .eq("user_id", user.id)
        .order("checkin_date", { ascending: false });

      if (allCheckins && allCheckins.length > 0) {
        let count = 0;
        const today = new Date(todayStr);
        for (let i = 0; i < allCheckins.length; i++) {
          const expected = new Date(today);
          expected.setDate(expected.getDate() - i);
          const expectedStr = expected.toISOString().split("T")[0];
          if (allCheckins[i].checkin_date === expectedStr) {
            count++;
          } else {
            break;
          }
        }
        setStreak(count);
      }
    }

    setLoading(false);
  }, [router, todayStr]);

  // 加载本周任务
  useEffect(() => {
    if (todayStr && profile) {
      // 先从 profile 拿到 currentWeek，再加载
      const week = profile.study_plan
        ? calculateClientWeek(profile.study_plan)
        : 1;
      setCurrentWeek(week);
      loadTasks(week);
    }
  }, [todayStr, profile, loadTasks]);

  useEffect(() => {
    const today = new Date();
    setTodayStr(today.toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    if (todayStr) {
      loadData();
    }
  }, [todayStr, loadData]);

  /** 客户端版周计算（与服务端一致） */
  function calculateClientWeek(plan: StudyPlan): number {
    const firstWeek = plan.weekly_plan?.[0];
    if (!firstWeek?.period) return 1;
    const startDateStr = firstWeek.period.split("~")[0]?.trim();
    if (!startDateStr) return 1;
    const startDate = new Date(startDateStr);
    const today = new Date();
    const diffMs = today.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return Math.max(1, Math.min(Math.floor(diffDays / 7) + 1, plan.weekly_plan.length));
  }

  async function toggleTask(taskId: string, currentStatus: string) {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";

    // 乐观更新 UI
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: newStatus as PlanTask["status"] } : t
      )
    );

    // 调 API 更新数据库
    try {
      const res = await fetch("/api/plan/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, status: newStatus }),
      });
      if (!res.ok) {
        // 失败时回滚
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId ? { ...t, status: currentStatus as PlanTask["status"] } : t
          )
        );
      }
    } catch {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, status: currentStatus as PlanTask["status"] } : t
        )
      );
    }
  }

  async function handleCheckin(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const completedCount = tasks.filter((t) => t.status === "completed").length;
    const totalCount = tasks.length;

    try {
      const res = await fetch("/api/checkin/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studyHours,
          tasksCompleted: completedCount,
          tasksTotal: totalCount,
          status: checkinStatus,
          difficulties,
          emotion,
          energy,
          memo: difficulties,
          energyLevel: energy === "high" ? 5 : energy === "medium" ? 3 : 1,
          taskUpdates: Object.entries(taskUpdates)
            .filter(([, v]) => v.completed)
            .map(([taskId, v]) => ({ taskId, status: "completed", actualHours: v.actualHours })),
        }),
      });

      const data = await res.json();

      if (data.feedback) {
        setFeedback(data.feedback);
      }

      setShowCheckin(false);
      setCheckin({
        id: "",
        study_hours: studyHours,
        tasks_completed: completedCount,
        tasks_total: totalCount,
        status: checkinStatus,
        difficulties,
        ai_feedback: data.feedback || null,
      });

      // 刷新连续打卡
      loadData();
    } catch (e) {
      console.warn("[Dashboard] 打卡失败:", e);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const totalWeeks = plan?.weekly_plan?.length ?? 1;

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "早上好" : currentHour < 18 ? "下午好" : "晚上好";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <span className="text-[15px] font-semibold text-gray-900">AI考研教练</span>
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600">
            <LogOut className="h-4 w-4" />
            退出
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-6 pb-28">
        {/* 顶部问候 + 连续打卡 */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {greeting}{profile ? `，${profile.major}考研中` : ""}
            </h1>
            <p className="mt-0.5 text-sm text-gray-500">{profile?.school}</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium text-orange-600">连续 {streak} 天</span>
          </div>
        </div>

        {!hasPlan ? (
          <div className="flex flex-col items-center gap-4 py-12">
            <p className="text-sm text-gray-500">还没有学习计划</p>
            <Link
              href="/setup"
              className="rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-medium text-white"
            >
              去填写考研信息
            </Link>
          </div>
        ) : (
          <>
            {/* AI反馈卡片 */}
            {feedback && (
              <section className="mb-6 animate-fadeIn">
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                  <div className="mb-2 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-medium text-blue-700">AI 今日反馈</span>
                  </div>
                  <p className="text-sm leading-relaxed text-blue-900">{feedback}</p>
                </div>
              </section>
            )}

            {/* 今日进度 */}
            <section className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">本周进度</span>
                </div>
                <span className="text-sm text-gray-500">
                  {completedCount}/{totalCount} 完成
                </span>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-gray-900 transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {totalCount > 0 && (
                <p className="mt-2 text-xs text-gray-400">
                  {progress === 100 ? "本周任务全部完成！" : `已完成 ${progress}%`}
                </p>
              )}
              {totalCount === 0 && <p className="mt-2 text-xs text-gray-400">暂无本周任务</p>}
            </section>

            {/* 周导航 */}
            <section className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-900">
                第 {currentWeek} 周 / 共 {totalWeeks} 周
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const prev = Math.max(1, currentWeek - 1);
                    loadTasks(prev);
                  }}
                  disabled={currentWeek <= 1}
                  className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:border-gray-300 hover:text-gray-600 disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    const next = Math.min(totalWeeks, currentWeek + 1);
                    loadTasks(next);
                  }}
                  disabled={currentWeek >= totalWeeks}
                  className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:border-gray-300 hover:text-gray-600 disabled:opacity-30"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </section>

            {/* 本周任务 */}
            <section className="mb-6">
              <div className="space-y-2">
                {tasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => toggleTask(task.id, task.status)}
                    className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all duration-200 ${
                      task.status === "completed"
                        ? "border-gray-100 bg-white opacity-60"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                    }`}
                  >
                    {task.status === "completed" ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500 transition-all duration-200" />
                    ) : (
                      <Circle className="h-5 w-5 shrink-0 text-gray-300 transition-all duration-200 hover:text-gray-400" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex rounded-md border px-2 py-0.5 text-[11px] font-medium ${getSubjectColor(task.subject)}`}>
                          {task.subject}
                        </span>
                        {task.priority === "high" && (
                          <span className="text-[11px] font-medium text-red-500">重要</span>
                        )}
                      </div>
                      <p
                        className={`mt-1 text-sm transition-all duration-200 ${
                          task.status === "completed" ? "line-through text-gray-400" : "text-gray-900"
                        }`}
                      >
                        {task.content}
                      </p>
                      <div className="mt-1 flex items-center gap-3 text-[11px] text-gray-400">
                        <span>预计 {task.planned_hours}h</span>
                        <span>
                          {"●".repeat(task.difficulty)}
                          {"○".repeat(5 - task.difficulty)}
                        </span>
                        <span className="text-gray-300">{task.difficulty === 5 ? "难" : task.difficulty >= 3 ? "中" : "易"}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* 打卡入口 */}
            <section className="mb-6">
              {!checkin ? (
                <button
                  onClick={() => setShowCheckin(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-white py-3.5 text-sm font-medium text-gray-600 transition-all hover:border-gray-400 hover:text-gray-800"
                >
                  <Sparkles className="h-4 w-4" />
                  完成打卡，获取AI反馈
                </button>
              ) : (
                <button
                  onClick={() => setShowCheckin(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 py-3.5 text-sm font-medium text-green-700 transition-all hover:bg-green-100"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  已打卡 · 再记录一次
                </button>
              )}
            </section>

            {/* 打卡弹窗 */}
            {showCheckin && (
              <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30">
                <div className="w-full max-w-lg animate-fadeIn rounded-t-2xl bg-white px-6 pb-10 pt-6 shadow-2xl">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-base font-semibold text-gray-900">记录今日学习</h3>
                    <button
                      onClick={() => setShowCheckin(false)}
                      className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleCheckin} className="space-y-5">
                    <div>
                      <label className="block text-xs font-medium text-gray-600">今天学习了多久？</label>
                      <div className="mt-1.5 flex items-center gap-3">
                        <input
                          type="range"
                          min={0}
                          max={16}
                          step={0.5}
                          value={studyHours}
                          onChange={(e) => setStudyHours(Number(e.target.value))}
                          className="flex-1 accent-gray-900"
                        />
                        <span className="w-12 text-sm font-medium text-gray-900">{studyHours}h</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600">今天的心情</label>
                      <div className="mt-1.5 flex gap-2">
                        {(["happy","normal","anxious","tired"] as Emotion[]).map((key) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setEmotion(key)}
                            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2 text-sm transition-colors ${
                              emotion === key
                                ? "border-gray-900 bg-gray-900 text-white"
                                : "border-gray-200 text-gray-600 hover:border-gray-300"
                            }`}
                          >
                            {EMOTION_LABELS[key]}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600">今天的精力</label>
                      <div className="mt-1.5 flex gap-2">
                        {(["high","medium","low"] as Energy[]).map((key) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setEnergy(key)}
                            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2 text-sm transition-colors ${
                              energy === key
                                ? "border-gray-900 bg-gray-900 text-white"
                                : "border-gray-200 text-gray-600 hover:border-gray-300"
                            }`}
                          >
                            {key === "high" ? <BatteryFull className="h-4 w-4" /> : key === "low" ? <BatteryLow className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
                            {ENERGY_LABELS[key]}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600">今天的学习状态</label>
                      <div className="mt-1.5 flex gap-2">
                        {statusOptions.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setCheckinStatus(opt.value)}
                            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2 text-sm transition-colors ${
                              checkinStatus === opt.value
                                ? "border-gray-900 bg-gray-900 text-white"
                                : "border-gray-200 text-gray-600 hover:border-gray-300"
                            }`}
                          >
                            <opt.icon className="h-4 w-4" />
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600">遇到的困难（选填）</label>
                      <textarea
                        value={difficulties}
                        onChange={(e) => setDifficulties(e.target.value)}
                        placeholder="今天学习遇到什么困难？"
                        rows={2}
                        className="mt-1.5 w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">今日任务完成情况</label>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {tasks.map((task) => {
                          const update = taskUpdates[task.id] || { completed: false, actualHours: 0 };
                          return (
                            <div key={task.id} className="flex items-center gap-2 rounded-lg border border-gray-200 p-2.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setTaskUpdates((prev) => ({
                                    ...prev,
                                    [task.id]: {
                                      completed: !(prev[task.id]?.completed ?? false),
                                      actualHours: prev[task.id]?.actualHours || task.planned_hours,
                                    },
                                  }));
                                }}
                                className={`shrink-0 rounded-full border-2 p-0.5 ${
                                  update.completed
                                    ? "border-green-500 bg-green-500 text-white"
                                    : "border-gray-300"
                                }`}
                              >
                                {update.completed ? (
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                ) : (
                                  <Circle className="h-3.5 w-3.5 text-gray-300" />
                                )}
                              </button>
                              <div className="min-w-0 flex-1">
                                <span className="text-xs font-medium text-gray-700">{task.subject} · {task.content}</span>
                                <div className="text-[11px] text-gray-400">计划 {task.planned_hours}h</div>
                              </div>
                              {update.completed && (
                                <input
                                  type="number"
                                  min={0}
                                  max={16}
                                  step={0.5}
                                  value={update.actualHours}
                                  onChange={(e) => {
                                    setTaskUpdates((prev) => ({
                                      ...prev,
                                      [task.id]: { ...prev[task.id], actualHours: Number(e.target.value) },
                                    }));
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-16 rounded-md border border-gray-200 px-2 py-1 text-center text-xs text-gray-700 focus:border-gray-400 focus:outline-none"
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          AI分析中...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          提交并获取AI反馈
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* 阶段计划 */}
            {plan?.stages && plan.stages.length > 0 && (
              <section className="mb-6">
                <h2 className="mb-3 text-sm font-medium text-gray-900">备考阶段</h2>
                <div className="space-y-3">
                  {plan.stages.map((stage, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-gray-300"
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-[11px] font-medium text-white">
                          {idx + 1}
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900">{stage.name}</h3>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-gray-600">{stage.goal}</p>
                      <p className="mt-1 text-xs text-gray-400">{stage.focus}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-around px-5">
          <Link
            href="/dashboard"
            className="flex flex-col items-center gap-0.5 text-xs font-medium text-gray-900"
          >
            <CheckCircle2 className="h-5 w-5" />
            学习
          </Link>
          <Link href="/setup" className="flex flex-col items-center gap-0.5 text-xs text-gray-400">
            <BookOpen className="h-5 w-5" />
            资料
          </Link>
          <Link href="/chat" className="flex flex-col items-center gap-0.5 text-xs text-gray-400">
            <Sparkles className="h-5 w-5" />
            AI陪伴
          </Link>
        </div>
      </nav>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
