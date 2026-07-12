"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { validateProfile, type ValidationWarning } from "@/lib/profile/profile-validator";
import { BookOpen, AlertTriangle, AlertCircle, Lightbulb, ChevronLeft, ChevronRight, Loader2, CheckCircle2 } from "lucide-react";

const WARNING_ICONS: Record<string, React.ReactNode> = {
  error: <AlertCircle className="h-5 w-5 text-red-500" />,
  risk: <AlertTriangle className="h-5 w-5 text-amber-500" />,
  suggestion: <Lightbulb className="h-5 w-5 text-blue-500" />,
};

const WARNING_STYLES: Record<string, string> = {
  error: "border-red-200 bg-red-50",
  risk: "border-amber-200 bg-amber-50",
  suggestion: "border-blue-200 bg-blue-50",
};

const WARNING_TEXT_STYLES: Record<string, string> = {
  error: "text-red-900",
  risk: "text-amber-900",
  suggestion: "text-blue-900",
};

const WARNING_SUB_TEXT: Record<string, string> = {
  error: "text-red-600",
  risk: "text-amber-600",
  suggestion: "text-blue-600",
};

export default function ProfileCheckPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(true);
  const [warnings, setWarnings] = useState<ValidationWarning[]>([]);
  const [confidence, setConfidence] = useState(100);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    async function loadAndCheck() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || cancelled) {
          router.push("/login");
          return;
        }

        const { data: profile } = await supabase
          .from("student_profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (!profile || cancelled) {
          router.push("/setup");
          return;
        }

        // 执行验证
        const result = validateProfile({
          target_school: profile.school,
          target_major: profile.major,
          exam_year: profile.exam_year,
          education_background: profile.level,
          weak_subjects: profile.weak_subjects || [],
          daily_hours: profile.daily_hours,
          subjects: profile.subjects || [],
        });

        if (!cancelled) {
          setWarnings(result.warnings);
          setConfidence(result.confidence);
          setValidating(false);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError("加载失败，请稍后重试");
          setLoading(false);
          setValidating(false);
        }
      }
    }

    loadAndCheck();
    return () => { cancelled = true; };
  }, [router]);

  async function handleConfirm() {
    setSubmitting(true);
    setError("");
    router.push("/plan-success");
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

      <main className="flex flex-1 items-start justify-center px-5 py-8">
        <div className="w-full max-w-lg">
          {/* 加载中 */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              <p className="mt-3 text-sm text-gray-500">AI正在分析你的信息...</p>
            </div>
          )}

          {/* 错误状态 */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
              <AlertCircle className="mx-auto h-10 w-10 text-red-400" />
              <p className="mt-3 text-sm text-red-600">{error}</p>
              <button
                onClick={() => router.push("/setup")}
                className="mt-4 inline-flex items-center gap-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                返回修改信息
              </button>
            </div>
          )}

          {/* 验证结果 */}
          {!loading && !error && (
            <>
              {/* 状态卡片 */}
              <div className={`rounded-xl border p-6 text-center ${
                warnings.length === 0
                  ? "border-green-200 bg-green-50"
                  : confidence >= 60
                  ? "border-amber-200 bg-amber-50"
                  : "border-red-200 bg-red-50"
              }`}>
                {warnings.length === 0 ? (
                  <>
                    <CheckCircle2 className="mx-auto h-10 w-10 text-green-500" />
                    <h1 className="mt-3 text-lg font-bold text-green-900">信息看起来没问题</h1>
                    <p className="mt-1 text-sm text-green-700">AI对你的考研规划有清晰的了解，可以开始生成计划了</p>
                  </>
                ) : (
                  <>
                    <AlertTriangle className={`mx-auto h-10 w-10 ${
                      confidence >= 60 ? "text-amber-500" : "text-red-500"
                    }`} />
                    <h1 className={`mt-3 text-lg font-bold ${
                      confidence >= 60 ? "text-amber-900" : "text-red-900"
                    }`}>
                      AI发现了{warnings.length}个需要关注的点
                    </h1>
                    <p className={`mt-1 text-sm ${
                      confidence >= 60 ? "text-amber-700" : "text-red-700"
                    }`}>
                      以下问题是AI根据你的信息分析出来的，请确认是否需要调整
                    </p>
                  </>
                )}
              </div>

              {/* 警告列表 */}
              {warnings.length > 0 && (
                <div className="mt-6 space-y-3">
                  {warnings.map((w, i) => (
                    <div key={i} className={`rounded-xl border p-4 ${WARNING_STYLES[w.type]}`}>
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 shrink-0">
                          {WARNING_ICONS[w.type]}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className={`text-sm font-semibold ${WARNING_TEXT_STYLES[w.type]}`}>
                            {w.title}
                          </h3>
                          <p className={`mt-0.5 text-sm ${WARNING_SUB_TEXT[w.type]}`}>
                            {w.message}
                          </p>
                          <div className={`mt-2 rounded-lg bg-white/50 px-3 py-2 text-xs ${WARNING_SUB_TEXT[w.type]}`}>
                            💡 {w.suggestion}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 可信度指示 */}
              {warnings.length > 0 && (
                <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-500">信息可信度</span>
                    <span className={`text-xs font-bold ${
                      confidence >= 80 ? "text-green-600" : confidence >= 60 ? "text-amber-600" : "text-red-600"
                    }`}>
                      {confidence}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full transition-all ${
                        confidence >= 80 ? "bg-green-500" : confidence >= 60 ? "bg-amber-500" : "bg-red-500"
                      }`}
                      style={{ width: `${confidence}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-400">
                    {confidence >= 80
                      ? "信息质量较高，AI可以生成较精确的计划"
                      : "信息存在不确定性，AI生成的计划可能会有所偏差"}
                  </p>
                </div>
              )}

              {/* 操作按钮 */}
              <div className="mt-8 flex items-center gap-3">
                <button
                  onClick={() => router.push("/setup")}
                  disabled={submitting}
                  className="flex items-center justify-center gap-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  重新修改
                </button>

                <button
                  onClick={handleConfirm}
                  disabled={submitting}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      处理中...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      确认无误，生成计划
                    </>
                  )}
                </button>
              </div>

              {!validating && warnings.length === 0 && (
                <button
                  onClick={handleConfirm}
                  disabled={submitting}
                  className="mt-8 flex w-full items-center justify-center gap-1.5 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  开始生成考研计划
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
