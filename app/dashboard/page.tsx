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
} from "lucide-react";
import type { StudentProfile, StudyPlan } from "@/lib/types";

interface DailyTask {
  id: string;
  task: string;
  subject: string;
  date: string;
  status: "pending" | "completed";
}

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

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [todayStr, setTodayStr] = useState("");
  const [streak, setStreak] = useState(0);

  // 打卡状态
  const [checkin, setCheckin] = useState<TodayCheckin | null>(null);
  const [showCheckin, setShowCheckin] = useState(false);
  const [studyHours, setStudyHours] = useState(6);
  const [checkinStatus, setCheckinStatus] = useState("normal");
  const [difficulties, setDifficulties] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    setTodayStr(`${y}-${m}-${d}`);
  }, []);

  const loadData = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

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

      // 读取今日任务
      const { data: taskData } = await supabase
        .from("study_tasks")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", todayStr)
        .order("subject");

      if (taskData && taskData.length > 0) {
        setTasks(taskData);
      } else if (profileData.study_plan) {
        await generateTodayTasks(supabase, user.id, profileData.study_plan);
      }
    }

    setLoading(false);
  }, [router, todayStr]);

  useEffect(() => {
    if (todayStr) {
      loadData();
    }
  }, [todayStr, loadData]);

  async function generateTodayTasks(
    supabase: ReturnType<typeof createClient>,
    userId: string,
    studyPlan: StudyPlan
  ) {
    try {
      const firstWeek = studyPlan.weekly_plan?.[0];
      if (!firstWeek?.tasks) return;

      const newTasks = firstWeek.tasks.map((t) => ({
        user_id: userId,
        task: t.content,
        subject: t.subject,
        date: todayStr,
        status: "pending" as const,
      }));

      const { data } = await supabase
        .from("study_tasks")
        .insert(newTasks)
        .select();

      if (data) {
        setTasks(data);
      }
    } catch (e) {
      console.warn("生成今日任务失败:", e);
    }
  }

  async function toggleTask(taskId: string, currentStatus: string) {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";
    const supabase = createClient();

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: newStatus as "pending" | "completed" } : t
      )
    );

    await supabase.from("study_tasks").update({ status: newStatus }).eq("id", taskId);
  }

  async function handleCheckin(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const completedCount = tasks.filter((t) => t.status === "completed").length;

    try {
      const res = await fetch("/api/checkin/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studyHours,
          tasksCompleted: completedCount,
          tasksTotal: tasks.length,
          status: checkinStatus,
          difficulties,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.warn("打卡失败:", data.error);
      } else {
        setFeedback(data.feedback);
      }

      setCheckin({
        id: "",
        study_hours: studyHours,
        tasks_completed: completedCount,
        tasks_total: tasks.length,
        status: checkinStatus,
        difficulties,
        ai_feedback: data.feedback || null,
      });
    } catch (e) {
      console.warn("打卡请求失败:", e);
    }

    setSubmitting(false);
    setShowCheckin(false);
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
  const currentWeek = plan?.weekly_plan?.[0];

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
              {greeting} 👋
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {profile?.school ? `目标：${profile.school} · ${profile.major}` : "继续加油"}
            </p>
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1.5">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-600">连续 {streak} 天</span>
            </div>
          )}
        </div>

        {!plan ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
            <Sparkles className="mx-auto h-8 w-8 text-blue-500" />
            <h2 className="mt-4 text-lg font-semibold text-gray-900">AI计划尚未生成</h2>
            <p className="mt-2 text-sm text-gray-500">
              请在填写考研信息后，系统会自动生成你的个性化学习计划。
            </p>
            <Link
              href="/setup"
              className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-gray-900 px-5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
              填写考研信息
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
                  <span className="text-sm font-medium text-gray-900">今日进度</span>
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
                  {progress === 100 ? "今日任务全部完成！" : `已完成 ${progress}%`}
                </p>
              )}
              {totalCount === 0 && <p className="mt-2 text-xs text-gray-400">暂无今日任务</p>}
            </section>

            {/* 今日任务 */}
            <section className="mb-6">
              <h2 className="mb-3 text-sm font-medium text-gray-900">今日任务</h2>
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
                      <p
                        className={`text-sm transition-all duration-200 ${
                          task.status === "completed"
                            ? "text-gray-400 line-through"
                            : "text-gray-900"
                        }`}
                      >
                        {task.task}
                      </p>
                      <span className="mt-0.5 inline-block rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">
                        {task.subject}
                      </span>
                    </div>
                  </button>
                ))}
                {tasks.length === 0 && (
                  <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-400">
                    暂无今日任务
                  </div>
                )}
              </div>
            </section>

            {/* 每日打卡 */}
            <section className="mb-6">
              {checkin ? (
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-gray-900">今日已打卡</span>
                  </div>
                  <div className="mt-2 flex gap-4 text-xs text-gray-500">
                    <span>学习 {checkin.study_hours}h</span>
                    <span>完成 {checkin.tasks_completed}/{checkin.tasks_total} 任务</span>
                  </div>
                </div>
              ) : showCheckin ? (
                <form onSubmit={handleCheckin} className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
                  <h3 className="text-sm font-medium text-gray-900">今日打卡</h3>

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
                    <label className="block text-xs font-medium text-gray-600">今天遇到了什么困难？</label>
                    <input
                      type="text"
                      value={difficulties}
                      onChange={(e) => setDifficulties(e.target.value)}
                      className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:outline-none"
                      placeholder="例如：数学做题速度慢"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowCheckin(false)}
                      className="flex-1 rounded-lg border border-gray-200 py-2 text-sm text-gray-600 hover:bg-gray-50"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 rounded-lg bg-gray-900 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
                    >
                      {submitting ? "分析中..." : "提交打卡"}
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setShowCheckin(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-white p-4 text-sm text-gray-500 transition-colors hover:border-gray-400 hover:text-gray-700"
                >
                  <Sparkles className="h-4 w-4" />
                  记录今天的学习情况，获取AI反馈
                </button>
              )}
            </section>

            {/* 本周计划 */}
            {currentWeek && (
              <section className="mb-6">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-medium text-gray-900">
                    本周计划 · 第 {currentWeek.week} 周
                  </h2>
                  <span className="text-xs text-gray-400">{currentWeek.period}</span>
                </div>
                <div className="space-y-2">
                  {currentWeek.tasks.map((task, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3.5">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-50 text-xs font-medium text-blue-600">
                        {task.hours}h
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-900">{task.content}</p>
                        <span className="mt-0.5 inline-block rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">
                          {task.subject}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 阶段目标 */}
            {plan.stages && plan.stages.length > 0 && (
              <section>
                <h2 className="mb-3 text-sm font-medium text-gray-900">阶段目标</h2>
                <div className="space-y-3">
                  {plan.stages.map((stage, i) => (
                    <div key={i} className="rounded-xl border border-gray-200 bg-white p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white">
                              {i + 1}
                            </span>
                            <h3 className="text-sm font-semibold text-gray-900">{stage.name}</h3>
                          </div>
                          <p className="mt-2 text-sm leading-relaxed text-gray-600">{stage.goal}</p>
                          <p className="mt-1 text-xs text-gray-400">{stage.focus}</p>
                        </div>
                      </div>
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
