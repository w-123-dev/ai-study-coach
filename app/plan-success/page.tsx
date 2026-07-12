"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import {
  BookOpen,
  Sparkles,
  Target,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Clock,
  Flame,
} from "lucide-react";
import type { StudentProfile, StudyPlan, PlanTask } from "@/lib/types";

export default function PlanSuccessPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [firstTask, setFirstTask] = useState<PlanTask | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.push("/login");
        return;
      }

      const { data: profileData } = await supabase
        .from("student_profiles")
        .select("*")
        .eq("user_id", data.user.id)
        .single();

      if (!profileData || !profileData.study_plan) {
        router.push("/setup");
        return;
      }

      setProfile(profileData);
      setLoading(false);

      // 获取第一个任务
      try {
        const res = await fetch("/api/plan/tasks?week=1");
        if (res.ok) {
          const data = await res.json();
          if (data.tasks && data.tasks.length > 0) {
            setFirstTask(data.tasks[0]);
          }
        }
      } catch {}
    });
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  const plan = profile?.study_plan as StudyPlan | null;
  const stages = plan?.stages ?? [];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-gray-100">
        <div className="mx-auto flex h-14 max-w-5xl items-center px-5">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <span className="text-[15px] font-semibold text-gray-900">
              AI考研教练
            </span>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 justify-center px-5 py-8">
        <div className="w-full max-w-lg">
          {/* 成功标识 */}
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-200">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="mt-5 text-2xl font-bold tracking-tight text-gray-900">
              计划已生成
            </h1>
            <p className="mt-1.5 text-sm text-gray-500">
              {profile?.school || "目标院校"} · {profile?.major || "目标专业"}
            </p>
          </div>

          {/* 你的考研路线 */}
          {stages.length > 0 && (
            <section className="mt-8">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">
                你的考研路线
              </h2>
              <div className="space-y-3">
                {stages.map((stage, i) => (
                  <div key={i} className="relative flex items-start gap-4">
                    {/* 连接线 */}
                    {i < stages.length - 1 && (
                      <div className="absolute left-[11px] top-8 h-full w-px bg-gray-200" />
                    )}
                    {/* 圆点 */}
                    <div
                      className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${
                        i === 0
                          ? "bg-gray-900"
                          : i === stages.length - 1
                          ? "bg-blue-600"
                          : "bg-gray-400"
                      }`}
                    >
                      {i + 1}
                    </div>
                    <div className="min-w-0 flex-1 pb-3">
                      <h3 className="text-sm font-semibold text-gray-900">
                        {stage.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {stage.period} · {stage.weeks}周
                      </p>
                      <p className="mt-0.5 text-xs text-gray-400">
                        {stage.goal?.length > 60
                          ? stage.goal.slice(0, 60) + "..."
                          : stage.goal}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 今天第一步 */}
          <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-semibold text-gray-900">
                今天第一步
              </span>
            </div>

            {firstTask ? (
              <div className="flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50/50 px-4 py-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md border border-blue-200 bg-white px-1.5 py-0.5 text-[11px] font-medium text-blue-700">
                      {firstTask.subject}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-900">
                    {firstTask.content}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="h-3 w-3" />
                  {firstTask.planned_hours}h
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400">
                任务已准备就绪，去看看吧
              </p>
            )}

            <p className="mt-3 text-xs text-gray-400">
              从一个小任务开始，不需要一下子完成所有
            </p>
          </section>

          {/* 按钮 */}
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            开始今天任务
            <ArrowRight className="h-4 w-4" />
          </button>

          {/* 步骤指示 */}
          <div className="mt-6 flex items-center justify-center gap-1.5">
            <span className="h-1.5 w-2 rounded-full bg-gray-200" />
            <span className="h-1.5 w-2 rounded-full bg-gray-200" />
            <span className="h-1.5 w-2 rounded-full bg-gray-200" />
            <span className="h-1.5 w-6 rounded-full bg-gray-900" />
          </div>
          <p className="mt-1 text-center text-xs text-gray-400">
            准备好了，考研人
          </p>
        </div>
      </main>
    </div>
  );
}
