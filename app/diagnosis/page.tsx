"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import type { DiagnosisResult } from "@/app/api/diagnosis/route";
import {
  BookOpen,
  Loader2,
  Sparkles,
  Target,
  AlertTriangle,
  Lightbulb,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function DiagnosisPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [hasExisting, setHasExisting] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    async function load() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user || cancelled) {
          router.push("/login");
          return;
        }

        // 检查是否已有诊断结果
        const { data: profile } = await supabase
          .from("student_profiles")
          .select("diagnosis")
          .eq("user_id", user.id)
          .single();

        if (cancelled) return;

        if (profile?.diagnosis) {
          setDiagnosis(profile.diagnosis as unknown as DiagnosisResult);
          setHasExisting(true);
          setLoading(false);
        } else {
          setHasExisting(false);
          setLoading(false);
          // 自动开始生成诊断
          generateDiagnosis();
        }
      } catch {
        if (!cancelled) {
          setError("加载失败，请稍后重试");
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function generateDiagnosis() {
    setGenerating(true);
    setError("");

    try {
      const res = await fetch("/api/diagnosis", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "诊断失败");
      }

      setDiagnosis(data.diagnosis);
    } catch (e) {
      setError(e instanceof Error ? e.message : "诊断失败，请重试");
    } finally {
      setGenerating(false);
    }
  }

  function handleStartPlan() {
    router.push("/plan-success");
  }

  // ===== 加载中 =====
  if (loading || generating) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50/50">
        <header className="border-b border-gray-100 bg-white">
          <div className="mx-auto flex h-14 max-w-5xl items-center px-5">
            <Link href="/" className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <span className="text-[15px] font-semibold text-gray-900">
                AI考研教练
              </span>
            </Link>
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center px-5">
          <div className="w-full max-w-md text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-200">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
            <h2 className="mt-5 text-xl font-bold text-gray-900">
              AI 正在为你进行考研诊断...
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              分析你的目标、基础和薄弱环节
            </p>
            <div className="mt-8 flex justify-center">
              <div className="h-1.5 w-48 overflow-hidden rounded-full bg-gray-200">
                <div className="h-full w-1/2 animate-pulse rounded-full bg-gray-900" />
              </div>
            </div>
            <div className="mt-6 space-y-2 text-left">
              <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm text-gray-500">
                <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                分析目标院校和专业
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm text-gray-500">
                <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                评估当前基础和差距
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm text-gray-500">
                <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                生成个性化诊断报告
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ===== 错误 =====
  if (error) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50/50">
        <header className="border-b border-gray-100 bg-white">
          <div className="mx-auto flex h-14 max-w-5xl items-center px-5">
            <Link href="/" className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <span className="text-[15px] font-semibold text-gray-900">
                AI考研教练
              </span>
            </Link>
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center px-5">
          <div className="w-full max-w-md text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="mt-5 text-xl font-bold text-gray-900">诊断失败</h2>
            <p className="mt-2 text-sm text-red-500">{error}</p>
            <button
              onClick={generateDiagnosis}
              className="mt-6 inline-flex h-12 w-full items-center justify-center gap-1.5 rounded-lg bg-gray-900 px-6 text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
              <Sparkles className="h-4 w-4" />
              重新诊断
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ===== 诊断报告 =====
  if (!diagnosis) return null;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50">
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex h-14 max-w-5xl items-center px-5">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <span className="text-[15px] font-semibold text-gray-900">
              AI考研教练
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-1 px-5 py-8">
        <div className="mx-auto max-w-lg">
          {/* 标题区域 */}
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-purple-200">
              <Target className="h-8 w-8 text-white" />
            </div>
            <h1 className="mt-5 text-2xl font-bold tracking-tight text-gray-900">
              你的考研诊断报告
            </h1>
            <p className="mt-1.5 text-sm text-gray-500">
              AI 已分析你的目标和基础，以下是诊断结果
            </p>
          </div>

          {/* 画像摘要 */}
          <div className="mt-8 rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
                <span className="text-xs">📋</span>
              </div>
              <h2 className="text-sm font-semibold text-gray-900">
                用户画像
              </h2>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {diagnosis.profile_summary}
            </p>
          </div>

          {/* 优势 */}
          <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <h2 className="text-sm font-semibold text-green-900">优势</h2>
            </div>
            <ul className="space-y-2">
              {diagnosis.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-green-800">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* 风险 */}
          {diagnosis.risks.length > 0 && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <h2 className="text-sm font-semibold text-amber-900">
                  需要关注的风险
                </h2>
              </div>
              <ul className="space-y-2">
                {diagnosis.risks.map((r, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-amber-800">
                    <div className="mt-0.5 shrink-0">⚠️</div>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 核心问题 */}
          {diagnosis.biggest_problems.length > 0 && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <h2 className="text-sm font-semibold text-red-900">
                  核心问题
                </h2>
              </div>
              <ul className="space-y-2">
                {diagnosis.biggest_problems.map((p, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-red-800">
                    <div className="mt-0.5 shrink-0">🔴</div>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 备考建议 */}
          <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-5 w-5 text-blue-600" />
              <h2 className="text-sm font-semibold text-blue-900">
                备考建议
              </h2>
            </div>
            <ul className="space-y-2">
              {diagnosis.suggestions.map((s, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-blue-800">
                  <div className="mt-0.5 shrink-0">💡</div>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 备考路线 */}
          {diagnosis.predicted_stages.length > 0 && (
            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
                  <span className="text-xs">🗺️</span>
                </div>
                <h2 className="text-sm font-semibold text-gray-900">
                  建议备考路线
                </h2>
              </div>
              <div className="space-y-3">
                {diagnosis.predicted_stages.map((stage, i) => (
                  <div key={i} className="relative flex items-start gap-4">
                    {i < diagnosis.predicted_stages.length - 1 && (
                      <div className="absolute left-[11px] top-8 h-full w-px bg-gray-200" />
                    )}
                    <div
                      className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${
                        i === 0
                          ? "bg-gray-900"
                          : i === diagnosis.predicted_stages.length - 1
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
                      <p className="text-xs text-gray-500">{stage.period}</p>
                      <p className="mt-0.5 text-xs text-gray-400">
                        {stage.focus}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="mt-8">
            <button
              onClick={handleStartPlan}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
              <Sparkles className="h-4 w-4" />
              根据诊断生成计划
              <ChevronRight className="h-4 w-4" />
            </button>
            <p className="mt-2 text-center text-xs text-gray-400">
              AI 将根据诊断结果生成你的专属备考计划
            </p>
          </div>

          {/* 重新诊断 */}
          <div className="mt-6 text-center">
            <button
              onClick={generateDiagnosis}
              className="text-xs text-gray-400 underline underline-offset-2 hover:text-gray-600"
            >
              重新诊断
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
