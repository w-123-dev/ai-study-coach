"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Sparkles, Target, CheckCircle2, ArrowRight, Loader2, Clock } from "lucide-react";
import type { PlanTask } from "@/lib/types";

export default function PlanSuccessPage() {
  const router = useRouter();
  const [started, setStarted] = useState(false); // 是否点击了"开始生成"
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState("");
  const [firstTask, setFirstTask] = useState<PlanTask | null>(null);
  const [stages, setStages] = useState<{ name: string; period: string; weeks: number; goal: string }[]>([]);

  async function handleGenerate() {
    setStarted(true);
    setGenerating(true);
    setError("");

    // 调用计划生成
    for (let retry = 0; retry < 5; retry++) {
      try {
        const res = await fetch("/api/plan/generate", { method: "POST" });
        if (res.ok) break;
      } catch {}
      await new Promise((r) => setTimeout(r, 1000));
    }

    // 获取生成的计划和第一个任务
    try {
      // 读取 student_profiles 中的 plan
      const profileRes = await fetch("/api/plan/tasks?week=1");
      if (profileRes.ok) {
        const data = await profileRes.json();
        if (data.tasks && data.tasks.length > 0) {
          setFirstTask(data.tasks[0]);
        }
      }

      // 读取阶段信息
      const supabase = (await import("@/lib/supabase")).createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profileData } = await supabase
          .from("student_profiles")
          .select("study_plan")
          .eq("user_id", user.id)
          .single();
        if (profileData?.study_plan) {
          const plan = profileData.study_plan as { stages?: typeof stages };
          if (plan.stages) setStages(plan.stages);
        }
      }

      setGenerated(true);
    } catch (e) {
      setError("生成失败，请稍后重试");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50">
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex h-14 max-w-5xl items-center px-5">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <span className="text-[15px] font-semibold text-gray-900">AI考研教练</span>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-5 py-10">
        {!started && (
          /* ====== 初始状态：未点击生成 ====== */
          <div className="w-full max-w-lg text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-200">
              <Target className="h-8 w-8 text-white" />
            </div>

            <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">
              准备开始制定你的考研计划
            </h1>
            <p className="mt-2 text-sm text-gray-500 leading-relaxed">
              AI 会根据你的目标院校、专业基础和学习时间，为你量身定制从今天到考前的完整备考路线。
            </p>

            <div className="mt-8 space-y-3 text-left">
              <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">定位你的目标</p>
                  <p className="text-xs text-gray-400">院校、专业、考试科目</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">评估当前基础</p>
                  <p className="text-xs text-gray-400">学习水平、每天可用时间</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-50">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">AI 生成备考路线</p>
                  <p className="text-xs text-gray-400">分阶段任务 + 每周学习计划</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              className="mt-8 inline-flex h-12 w-full items-center justify-center gap-1.5 rounded-lg bg-gray-900 px-6 text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
              <Sparkles className="h-4 w-4" />
              开始生成计划
            </button>

            <div className="mt-6 flex items-center justify-center gap-1.5">
              <span className="h-1.5 w-2 rounded-full bg-gray-200" />
              <span className="h-1.5 w-2 rounded-full bg-gray-200" />
              <span className="h-1.5 w-2 rounded-full bg-gray-200" />
              <span className="h-1.5 w-6 rounded-full bg-gray-900" />
            </div>
            <p className="mt-1.5 text-center text-xs text-gray-400">准备好了，开始吧</p>
          </div>
        )}

        {started && !generated && !error && (
          /* ====== 生成中 ====== */
          <div className="w-full max-w-lg text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-200">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
            <h2 className="mt-5 text-xl font-bold text-gray-900">AI 正在为你制定计划...</h2>
            <p className="mt-2 text-sm text-gray-500">根据你的目标和基础，生成专属备考路线</p>
            <div className="mt-8 flex justify-center">
              <div className="h-1.5 w-48 overflow-hidden rounded-full bg-gray-200">
                <div className="h-full w-1/2 animate-pulse rounded-full bg-gray-900" />
              </div>
            </div>
          </div>
        )}

        {error && (
          /* ====== 生成失败 ====== */
          <div className="w-full max-w-lg text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100">
              <span className="text-2xl">!</span>
            </div>
            <h2 className="mt-5 text-xl font-bold text-gray-900">生成失败</h2>
            <p className="mt-2 text-sm text-red-500">{error}</p>
            <button
              onClick={handleGenerate}
              className="mt-6 inline-flex h-12 w-full items-center justify-center gap-1.5 rounded-lg bg-gray-900 px-6 text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
              重新生成
            </button>
          </div>
        )}

        {generated && (
          /* ====== 生成成功：显示路线图 ====== */
          <div className="w-full max-w-lg">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-200">
                <CheckCircle2 className="h-8 w-8 text-white" />
              </div>
              <h1 className="mt-5 text-2xl font-bold tracking-tight text-gray-900">计划生成成功</h1>
              <p className="mt-1.5 text-sm text-gray-500">你的专属考研备考路线已就绪</p>
            </div>

            {stages.length > 0 && (
              <section className="mt-8">
                <h2 className="text-sm font-semibold text-gray-900 mb-3">你的备考路线</h2>
                <div className="space-y-3">
                  {stages.map((stage, i) => (
                    <div key={i} className="relative flex items-start gap-4">
                      {i < stages.length - 1 && (
                        <div className="absolute left-[11px] top-8 h-full w-px bg-gray-200" />
                      )}
                      <div
                        className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${
                          i === 0 ? "bg-gray-900" : i === stages.length - 1 ? "bg-blue-600" : "bg-gray-400"
                        }`}
                      >
                        {i + 1}
                      </div>
                      <div className="min-w-0 flex-1 pb-3">
                        <h3 className="text-sm font-semibold text-gray-900">{stage.name}</h3>
                        <p className="text-xs text-gray-500">{stage.period} · {stage.weeks}周</p>
                        <p className="mt-0.5 text-xs text-gray-400">
                          {stage.goal?.length > 60 ? stage.goal.slice(0, 60) + "..." : stage.goal}
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
                <span className="text-xs font-semibold text-gray-900">今天第一步</span>
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
                    <p className="mt-0.5 text-sm text-gray-900">{firstTask.content}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="h-3 w-3" />
                    {firstTask.planned_hours}h
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-400">计划已生成，去 Dashboard 查看全部任务</p>
              )}

              <p className="mt-3 text-xs text-gray-400">从一个小目标开始，你不需要一次性完成所有</p>
            </section>

            <button
              onClick={() => router.push("/dashboard")}
              className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
              开始今天任务
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="mt-6 flex items-center justify-center gap-1.5">
              <span className="h-1.5 w-2 rounded-full bg-gray-200" />
              <span className="h-1.5 w-2 rounded-full bg-gray-200" />
              <span className="h-1.5 w-2 rounded-full bg-gray-200" />
              <span className="h-1.5 w-6 rounded-full bg-gray-900" />
            </div>
            <p className="mt-1 text-center text-xs text-gray-400">准备好了，加油</p>
          </div>
        )}
      </main>
    </div>
  );
}