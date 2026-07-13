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
  Sparkles,
  Target,
  Flame,
  Clock,
  ChevronRight,
  ChevronDown,
  TrendingUp,
  MessageCircle,
  Zap,
  Bell,
  X,
  AlertTriangle,
  AlertCircle,
  Info,
} from "lucide-react";
import type { StudentProfile, StudyPlan, PlanTask, Emotion, Energy } from "@/lib/types";
import { EMOTION_LABELS, ENERGY_LABELS } from "@/lib/types";
import PartnerCard from "@/components/partner/PartnerCard";
import StudySpace from "@/components/partner/StudySpace";
import PartnerLogs from "@/components/partner/PartnerLogs";
import type { PartnerSpace } from "@/lib/partner/space";
import { generateGreeting, getSimpleGreeting, getEnvironmentLine, getTimePeriod } from "@/lib/dashboard/environment";


interface TodayCheckin {
  id: string;
  study_hours: number;
  tasks_completed: number;
  tasks_total: number;
  status: string;
  difficulties: string;
  ai_feedback: string | null;
}

interface CoachMessage {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  related_subject: string | null;
  severity: string;
  status: string;
  created_at: string;
  read_at: string | null;
}

const statusOptions = [
  { value: "energetic", label: "精力充沛", icon: Zap },
  { value: "normal", label: "状态一般", icon: Clock },
  { value: "tired", label: "比较疲惫", icon: Flame },
];

const subjectColors: Record<string, string> = {
  "数学": "bg-blue-50 text-blue-700 border-blue-200",
  "英语": "bg-green-50 text-green-700 border-green-200",
  "政治": "bg-red-50 text-red-700 border-red-200",
  "专业": "bg-purple-50 text-purple-700 border-purple-200",
};

function getSubjectColor(subject: string): string {
  for (const [key, color] of Object.entries(subjectColors)) {
    if (subject.includes(key)) return color;
  }
  return "bg-gray-50 text-gray-700 border-gray-200";
}

function getSeverityStyle(severity: string) {
  switch (severity) {
    case "critical":
      return "border-red-200 bg-red-50";
    case "warning":
      return "border-amber-200 bg-amber-50";
    default:
      return "border-blue-200 bg-blue-50";
  }
}

function getSeverityIcon(severity: string) {
  switch (severity) {
    case "critical":
      return AlertCircle;
    case "warning":
      return AlertTriangle;
    default:
      return Info;
  }
}

function getSeverityIconColor(severity: string) {
  switch (severity) {
    case "critical":
      return "text-red-500";
    case "warning":
      return "text-amber-500";
    default:
      return "text-blue-500";
  }
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
  const [daysUntilExam, setDaysUntilExam] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [space, setSpace] = useState<PartnerSpace | null>(null);

  // 任务折叠状态：首次进入默认折叠
  const [taskCollapsed, setTaskCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const visited = sessionStorage.getItem('dashboard_visited');
      if (!visited) {
        sessionStorage.setItem('dashboard_visited', 'true');
        return true;
      }
      return false;
    }
    return false;
  });

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

  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [taskUpdates, setTaskUpdates] = useState<Record<string, {completed: boolean; actualHours: number}>>({});

  const [weeklyStats, setWeeklyStats] = useState<{
    total: number;
    completed: number;
    bySubject: Record<string, { total: number; completed: number }>;
  }>({ total: 0, completed: 0, bySubject: {} });

  // AI教练消息
  const [coachMessages, setCoachMessages] = useState<CoachMessage[]>([]);
  const [loadingCoach, setLoadingCoach] = useState(false);

  const loadTasks = useCallback(async (week: number) => {
    try {
      const res = await fetch(`/api/plan/tasks?week=${week}`);
      if (!res.ok) return;
      const data = await res.json();
      const allTasks = data.tasks ?? [];
      setTasks(allTasks);
      setCurrentWeek(data.currentWeek ?? week);
      setHasPlan(data.hasPlan ?? false);

      setCompletedTaskIds(
        allTasks.filter((t: PlanTask) => t.status === "completed").map((t: PlanTask) => t.id)
      );

      const bySubject: Record<string, { total: number; completed: number }> = {};
      let totalCount = 0;
      let completedCount = 0;

      allTasks.forEach((t: PlanTask) => {
        totalCount++;
        if (t.status === "completed") completedCount++;
        if (!bySubject[t.subject]) {
          bySubject[t.subject] = { total: 0, completed: 0 };
        }
        bySubject[t.subject].total++;
        if (t.status === "completed") bySubject[t.subject].completed++;
      });

      setWeeklyStats({ total: totalCount, completed: completedCount, bySubject });
    } catch (e) {
      console.warn("[Dashboard] 加载任务失败:", e);
    }
  }, []);

  const loadCoachMessages = useCallback(async () => {
    try {
      setLoadingCoach(true);
      const res = await fetch("/api/coach/detect");
      if (!res.ok) return;
      const data = await res.json();
      if (data.success && data.data?.messages) {
        setCoachMessages(data.data.messages);
      }
    } catch (e) {
      console.warn("[Dashboard] 加载教练消息失败:", e);
    } finally {
      setLoadingCoach(false);
    }
  }, []);

  const triggerDetection = useCallback(async () => {
    try {
      await fetch("/api/coach/detect", { method: "POST" });
      // 检测后重新加载
      await loadCoachMessages();
    } catch (e) {
      console.warn("[Dashboard] 触发检测失败:", e);
    }
  }, [loadCoachMessages]);

  const dismissCoachMessage = useCallback(async (messageId: string) => {
    try {
      const res = await fetch("/api/coach/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId, status: "read" }),
      });
      if (res.ok) {
        setCoachMessages((prev) => prev.filter((m) => m.id !== messageId));
      }
    } catch (e) {
      console.warn("[Dashboard] 忽略消息失败:", e);
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
    setUserId(user.id);

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

    if (profileData.exam_year) {
      const examDate = new Date(profileData.exam_year, 11, 21);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const diff = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      setDaysUntilExam(Math.max(0, diff));
    }

    if (todayStr) {
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

    // 加载学习空间
    try {
      const spaceRes = await fetch("/api/partner/space");
      if (spaceRes.ok) {
        const spaceData = await spaceRes.json();
        setSpace(spaceData.space);
      }
    } catch {}

    setLoading(false);
  }, [router, todayStr]);

  useEffect(() => {
    if (todayStr && profile) {
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

  // 加载教练消息并在加载完成后触发检测
  useEffect(() => {
    if (!loading && profile) {
      loadCoachMessages().then(() => {
        // 延迟触发检测，避免阻塞页面加载
        setTimeout(() => triggerDetection(), 2000);
      });
    }
  }, [loading, profile, loadCoachMessages, triggerDetection]);

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

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: newStatus as PlanTask["status"] } : t
      )
    );

    try {
      const res = await fetch("/api/plan/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, status: newStatus }),
      });
      if (!res.ok) {
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

      // 打卡后触发教练检测
      setTimeout(() => triggerDetection(), 1000);

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
  const welcomeMessage = generateGreeting({
    timePeriod: getTimePeriod(),
    daysUntilExam,
    streak,
    hasCheckedIn: !!checkin,
    hasPlan,
  });
  const simpleGreeting = getSimpleGreeting();
  const environmentLine = getEnvironmentLine(daysUntilExam, streak);
  const totalWeeks = plan?.weekly_plan?.length ?? 1;


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
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <span className="text-[15px] font-semibold tracking-tight text-gray-900">
              AI考研教练
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/chat"
              className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              <Sparkles className="h-3.5 w-3.5" />
              AI对话
            </Link>
            <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-gray-600">
              退出
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 pb-24 pt-5">
        {/* ========== AI教练主动消息 ========== */}
        {coachMessages.length > 0 && (
          <section className="mb-4 space-y-2">
            {coachMessages.map((msg) => {
              const SeverityIcon = getSeverityIcon(msg.severity);
              return (
                <div
                  key={msg.id}
                  className={`relative rounded-xl border p-4 animate-slideDown ${getSeverityStyle(msg.severity)}`}
                >
                  <button
                    onClick={() => dismissCoachMessage(msg.id)}
                    className="absolute right-3 top-3 rounded-full p-0.5 text-gray-400 hover:text-gray-600 hover:bg-white/50 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 shrink-0 ${getSeverityIconColor(msg.severity)}`}>
                      <SeverityIcon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-900">{msg.title}</span>
                        {msg.related_subject && (
                          <span className={`rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${getSubjectColor(msg.related_subject)}`}>
                            {msg.related_subject}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-gray-700">{msg.message}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <Link
                          href="/chat"
                          className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-[11px] font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
                        >
                          <MessageCircle className="h-3 w-3" />
                          和教练聊聊
                        </Link>
                        <button
                          onClick={() => dismissCoachMessage(msg.id)}
                          className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          我知道了
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        )}


        {/* ========== 伙伴模块 ========== */}
        {userId && (
          <section className="mb-5">
            <PartnerCard userId={userId} />
          </section>
        )}

        {/* ========== 学习空间 ========== */}

        {/* ========== 伙伴观察日志 ========== */}
        {userId && (
          <section className="mb-5">
            <PartnerLogs />
          </section>
        )}
        {userId && (
          <section className="mb-5">
            <StudySpace space={space} />
          </section>
        )}

        {/* ========== 顶部：倒计时 + 连续打卡 ========== */}
        <section className="mb-5">
          <div className="rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-5 text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">{simpleGreeting}</p>
                <p className="mt-0.5 text-sm text-white/80">{welcomeMessage}</p>
                <h1 className="mt-1 text-lg font-bold tracking-tight">
                  {profile?.school || "目标院校"} · {profile?.major || "目标专业"}
                  <p className="mt-1 text-xs text-gray-400">{environmentLine}</p>
                </h1>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1.5">
                  <Flame className="h-4 w-4 text-orange-400" />
                  <span className="text-sm font-semibold">{streak}天</span>
                </div>
                <p className="mt-0.5 text-[11px] text-gray-400">连续打卡</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[11px] text-gray-400">距离考研</p>
                <p className="text-2xl font-bold tracking-tight">{daysUntilExam}<span className="ml-1 text-sm font-normal text-gray-300">天</span></p>
              </div>
              <div className="ml-auto flex items-center gap-1 text-xs text-gray-300">
                <span>第 {currentWeek}/{totalWeeks} 周</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========== 核心区：今日任务 ========== */}
        <section className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">
              今日任务
              {totalCount > 0 && (
                <span className="ml-2 text-xs font-normal text-gray-400">
                  {completedCount}/{totalCount} 已完成
                </span>
              )}
            </h2>
            {!checkin && totalCount > 0 && (
              <button
                onClick={() => setShowCheckin(true)}
                className="flex items-center gap-1 rounded-full bg-gray-900 px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-gray-800"
              >
                <Sparkles className="h-3 w-3" />
                打卡
              </button>
            )}
          </div>
          <div className="space-y-2">
            {tasks.length === 0 && hasPlan && (
              <div className="rounded-xl border border-gray-200 bg-white px-5 py-8 text-center">
                <CheckCircle2 className="mx-auto h-6 w-6 text-green-400" />
                <p className="mt-2 text-sm text-gray-500">本周任务已全部完成，休息一下吧</p>
              </div>
            )}
            {tasks.length === 0 && !hasPlan && (
              <div className="rounded-xl border border-gray-200 bg-white px-5 py-8 text-center">
                <BookOpen className="mx-auto h-6 w-6 text-gray-300" />
                <p className="mt-2 text-sm text-gray-500">还没有学习计划，先去填写考研信息</p>
                <Link
                  href="/setup"
                  className="mt-3 inline-flex items-center gap-1 rounded-lg bg-gray-900 px-4 py-2 text-xs font-medium text-white hover:bg-gray-800"
                >
                  去填写
                </Link>
              </div>
            )}
            {(taskCollapsed ? tasks.slice(0, 3) : tasks).map((task) => (
              <button
                key={task.id}
                onClick={() => toggleTask(task.id, task.status)}
                className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
                  task.status === "completed"
                    ? "border-green-100 bg-green-50/50"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                }`}
              >
                <div
                  className={`shrink-0 rounded-full border-2 p-0.5 transition-colors ${
                    task.status === "completed"
                      ? "border-green-500 bg-green-500 text-white"
                      : "border-gray-300"
                  }`}
                >
                  {task.status === "completed" ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Circle className="h-4 w-4 text-gray-300" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-md border px-1.5 py-0.5 text-[11px] font-medium ${getSubjectColor(task.subject)}`}>
                      {task.subject}
                    </span>
                    {task.status === "completed" && (
                      <span className="text-[11px] text-green-600 font-medium">已完成</span>
                    )}
                  </div>
                  <p className={`mt-0.5 text-sm ${
                    task.status === "completed" ? "text-gray-400 line-through" : "text-gray-900"
                  }`}>
                    {task.content}
                  </p>
                </div>
                <div className="shrink-0 text-xs text-gray-400">
                  {task.planned_hours}h
                </div>
              </button>
            ))}
            {/* 折叠展开按钮 */}
            {tasks.length > 3 && (
              <button
                onClick={() => setTaskCollapsed(!taskCollapsed)}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-gray-200 bg-white px-4 py-2.5 text-xs text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700"
              >
                <ChevronDown className={`h-4 w-4 transition-transform ${taskCollapsed ? "" : "rotate-180"}`} />
                {taskCollapsed ? `展开全部 (共${tasks.length}个任务)` : "收起"}
              </button>
            )}

          </div>
        </section>

        {/* ========== AI 教练建议 ========== */}
        {feedback && (
          <section className="mb-4 animate-fadeIn">
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                  <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                </div>
                <span className="text-xs font-semibold text-blue-800">AI教练反馈</span>
              </div>
              <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{feedback}</p>
              <Link
                href="/chat"
                className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                和AI教练聊聊
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </section>
        )}

        {!feedback && hasPlan && (
          <section className="mb-4">
            <Link
              href="/chat"
              className="flex items-center justify-between rounded-xl border border-dashed border-gray-300 bg-white p-4 transition-colors hover:border-gray-400"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                  <MessageCircle className="h-4 w-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">和AI教练聊聊</p>
                  <p className="text-xs text-gray-400">学习计划、备考策略、心理调节...</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-300" />
            </Link>
          </section>
        )}

        {/* ========== 本周进度 ========== */}
        {hasPlan && (
          <section>
            <h2 className="mb-3 text-sm font-semibold text-gray-900">本周进度</h2>
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-gray-500">总完成率</span>
                  <span className="text-xs font-semibold text-gray-900">{weeklyStats.total > 0 ? Math.round((weeklyStats.completed / weeklyStats.total) * 100) : 0}%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gray-900 transition-all duration-500"
                    style={{ width: `${weeklyStats.total > 0 ? (weeklyStats.completed / weeklyStats.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2.5">
                {Object.entries(weeklyStats.bySubject).map(([subject, stats]) => {
                  const rate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
                  return (
                    <div key={subject}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`rounded-md border px-1.5 py-0.5 text-[11px] font-medium ${getSubjectColor(subject)}`}>
                          {subject}
                        </span>
                        <span className="text-[11px] text-gray-500">
                          {stats.completed}/{stats.total}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${rate >= 80 ? "bg-green-500" : rate >= 50 ? "bg-yellow-500" : "bg-red-400"}`}
                          style={{ width: `${rate}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                <span className="text-xs text-gray-400">第 {currentWeek} 周</span>
                <Link
                  href="/chat"
                  className="flex items-center gap-0.5 text-xs font-medium text-gray-600 hover:text-gray-900"
                >
                  <TrendingUp className="h-3 w-3" />
                  查看分析
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ========== 打卡弹窗 ========== */}
        {showCheckin && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-4 pb-0 sm:items-center sm:pb-4">
            <div className="w-full max-w-md rounded-t-2xl bg-white p-5 sm:rounded-2xl animate-slideUp">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-900">今日学习打卡</h2>
                <button onClick={() => setShowCheckin(false)} className="text-xs text-gray-400 hover:text-gray-600">
                  取消
                </button>
              </div>
              <form onSubmit={handleCheckin} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600">今日学习时间（小时）</label>
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
                    <span className="w-10 text-center text-sm font-semibold text-gray-900">{studyHours}h</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600">今天的情绪</label>
                  <div className="mt-1.5 flex gap-2">
                    {(["happy", "normal", "anxious", "tired"] as Emotion[]).map((key) => (
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
                        {ENERGY_LABELS[key]}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600">今天遇到的问题（选填）</label>
                  <textarea
                    value={difficulties}
                    onChange={(e) => setDifficulties(e.target.value)}
                    placeholder="今天学习遇到什么困难？"
                    rows={2}
                    className="mt-1.5 w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:outline-none"
                  />
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
      </main>

      {/* ========== 底部导航 ========== */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-around px-5">
          <Link
            href="/dashboard"
            className="flex flex-col items-center gap-0.5 text-xs font-medium text-gray-900"
          >
            <CheckCircle2 className="h-5 w-5" />
            学习
          </Link>
          <Link href="/report" className="flex flex-col items-center gap-0.5 text-xs text-gray-400">
            <TrendingUp className="h-5 w-5" />
            周报
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
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.25s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.35s ease-out;
        }
      `}</style>
    </div>
  );
}


