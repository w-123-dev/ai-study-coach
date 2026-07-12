"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { BookOpen, ChevronLeft, ChevronRight, Loader2, Sparkles } from "lucide-react";
import type { StudentProfile } from "@/lib/types";

const levelOptions = [
  { value: "beginner", label: "零基础" },
  { value: "some_basis", label: "有一定基础" },
  { value: "good_basis", label: "基础较好" },
  { value: "advanced", label: "基础扎实" },
];

const currentYear = new Date().getFullYear();

const stepLabels = ["基础信息", "学习情况", "困难"];

export default function SetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [existing, setExisting] = useState<StudentProfile | null>(null);
  const [error, setError] = useState("");

  const [examYear, setExamYear] = useState(currentYear + 1);
  const [school, setSchool] = useState("");
  const [major, setMajor] = useState("");
  const [subjects, setSubjects] = useState("");
  const [level, setLevel] = useState("some_basis");
  const [dailyHours, setDailyHours] = useState(6);
  const [weakSubjects, setWeakSubjects] = useState("");
  const [biggestDifficulty, setBiggestDifficulty] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login");
        return;
      }
    });
    supabase
      .from("student_profiles")
      .select("*")
      .single()
      .then(({ data }) => {
        if (data) {
          setExisting(data);
          setExamYear(data.exam_year);
          setSchool(data.school);
          setMajor(data.major);
          setSubjects(data.subjects.join("、"));
          setLevel(data.level);
          setDailyHours(data.daily_hours);
          setWeakSubjects(data.weak_subjects.join("、"));
        }
        setLoading(false);
      });
  }, [router]);

  function canProceed(): boolean {
    if (step === 1) return school.trim() !== "" && major.trim() !== "" && subjects.trim() !== "";
    if (step === 2) return true;
    return true;
  }

  function nextStep() {
    if (step < 3 && canProceed()) {
      setStep(step + 1);
      setError("");
    }
  }

  function prevStep() {
    if (step > 1) {
      setStep(step - 1);
      setError("");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step < 3) {
      nextStep();
      return;
    }
    setError("");
    setSaving(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("请先登录");
      setSaving(false);
      return;
    }

    const subjectsArray = subjects.split(/[、,，]/).map(s => s.trim()).filter(Boolean);
    const weakArray = weakSubjects.split(/[、,，]/).map(s => s.trim()).filter(Boolean);

    const payload = {
      user_id: user.id,
      exam_year: examYear,
      school,
      major,
      subjects: subjectsArray,
      level,
      daily_hours: dailyHours,
      weak_subjects: weakArray,
    };

    if (existing) {
      const { error: updateError } = await supabase
        .from("student_profiles")
        .update(payload)
        .eq("user_id", user.id);
      if (updateError) {
        setError("保存失败：" + updateError.message);
        setSaving(false);
        return;
      }
    } else {
      const { error: insertError } = await supabase
        .from("student_profiles")
        .insert(payload);
      if (insertError) {
        setError("保存失败：" + insertError.message);
        setSaving(false);
        return;
      }
    }

    // 生成学习计划
    setGenerating(true);
    for (let retry = 0; retry < 5; retry++) {
      try {
        const res = await fetch("/api/plan/generate", { method: "POST" });
        if (res.ok) break;
      } catch {}
      await new Promise((r) => setTimeout(r, 1000));
    }

    router.push("/plan-success");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-gray-100">
        <div className="mx-auto flex h-14 max-w-5xl items-center px-5">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <span className="text-[15px] font-semibold text-gray-900">AI考研教练</span>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 justify-center px-5 py-8">
        <div className="w-full max-w-lg">
          {/* 返回 */}
          {existing && (
            <Link href="/dashboard" className="mb-4 inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600">
              <ChevronLeft className="h-4 w-4" />
              返回
            </Link>
          )}

          {/* 进度条 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-900">
                第 {step} 步 / 共 3 步
              </span>
              <span className="text-xs text-gray-400">{stepLabels[step - 1]}</span>
            </div>
            <div className="flex gap-1.5">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    s <= step ? "bg-gray-900" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* 标题 */}
          <h1 className="text-xl font-bold tracking-tight text-gray-900">
            {step === 1 && "先告诉我你的目标"}
            {step === 2 && "你的学习情况是怎样的"}
            {step === 3 && "你最大的困难是什么"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {step === 1 && "了解你的目标院校和专业，AI才能制定针对性计划"}
            {step === 2 && "让AI知道你的基础和学习时间，计划才能贴合实际"}
            {step === 3 && "说出来，AI会重点帮助你攻克这些难关"}
          </p>

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6">
            {/* ========== Step 1: 基础信息 ========== */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700">考研年份</label>
                  <select value={examYear} onChange={(e) => setExamYear(Number(e.target.value))}
                    className="mt-1.5 block w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 focus:border-gray-400 focus:outline-none">
                    <option value={currentYear}>{currentYear}年</option>
                    <option value={currentYear + 1}>{currentYear + 1}年</option>
                    <option value={currentYear + 2}>{currentYear + 2}年</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">目标学校</label>
                  <input type="text" required value={school} onChange={(e) => setSchool(e.target.value)}
                    className="mt-1.5 block w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:outline-none"
                    placeholder="例如：北京大学" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">目标专业</label>
                  <input type="text" required value={major} onChange={(e) => setMajor(e.target.value)}
                    className="mt-1.5 block w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:outline-none"
                    placeholder="例如：计算机科学与技术" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">考试科目</label>
                  <input type="text" required value={subjects} onChange={(e) => setSubjects(e.target.value)}
                    className="mt-1.5 block w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:outline-none"
                    placeholder="用顿号分隔，例如：政治、英语一、数学一" />
                  <p className="mt-1 text-xs text-gray-400">用顿号或逗号分隔多个科目</p>
                </div>

                <p className="pt-2 text-xs italic text-gray-400">
                  💡 了解你的目标后，我才能为你量身定制学习计划
                </p>
              </div>
            )}

            {/* ========== Step 2: 学习情况 ========== */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700">当前学习水平</label>
                  <select value={level} onChange={(e) => setLevel(e.target.value)}
                    className="mt-1.5 block w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 focus:border-gray-400 focus:outline-none">
                    {levelOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-400">如实填写，计划才能匹配你的真实水平</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">每天可学习时间（小时）</label>
                  <div className="mt-1.5 flex items-center gap-3">
                    <input type="range" min={1} max={16} step={0.5} value={dailyHours}
                      onChange={(e) => setDailyHours(Number(e.target.value))}
                      className="flex-1 accent-gray-900" />
                    <span className="w-12 text-sm font-medium text-gray-900">{dailyHours}h</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-400">不用高估，每天能稳定坚持的时间最重要</p>
                </div>

                <p className="pt-2 text-xs italic text-gray-400">
                  💡 知道你的基础和时间，我才能设计合理的每日任务量
                </p>
              </div>
            )}

            {/* ========== Step 3: 困难 ========== */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700">薄弱科目</label>
                  <input type="text" value={weakSubjects} onChange={(e) => setWeakSubjects(e.target.value)}
                    className="mt-1.5 block w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:outline-none"
                    placeholder="用顿号分隔，不知道可不填" />
                  <p className="mt-1 text-xs text-gray-400">哪些科目感觉比较薄弱，AI会重点关注</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">你最大的困难是什么</label>
                  <textarea value={biggestDifficulty} onChange={(e) => setBiggestDifficulty(e.target.value)}
                    rows={3}
                    className="mt-1.5 block w-full resize-none rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:outline-none"
                    placeholder="例如：数学基础差、英语单词记不住、不知道专业课从哪里开始..." />
                  <p className="mt-1 text-xs text-gray-400">说出来，AI教练会特别关注这些问题</p>
                </div>

                <p className="pt-2 text-xs italic text-gray-400">
                  💡 知道你的困难后，我会在每周总结中重点关注这些方面
                </p>
              </div>
            )}

            {/* 按钮组 */}
            <div className="mt-8 flex items-center gap-3">
              {step > 1 ? (
                <button type="button" onClick={prevStep}
                  className="flex items-center justify-center gap-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50">
                  <ChevronLeft className="h-4 w-4" />
                  上一步
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button type="button" onClick={nextStep}
                  disabled={!canProceed()}
                  className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50">
                  下一步
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button type="submit" disabled={saving || generating}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50">
                  {saving || generating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      AI正在为你规划中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      {existing ? "更新信息" : "生成我的考研计划"}
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
