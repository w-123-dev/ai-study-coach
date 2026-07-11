"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { BookOpen, ChevronLeft, Loader2 } from "lucide-react";
import type { StudentProfile } from "@/lib/types";

const levelOptions = [
  { value: "beginner", label: "零基础" },
  { value: "some_basis", label: "有一定基础" },
  { value: "good_basis", label: "基础较好" },
  { value: "advanced", label: "基础扎实" },
];

const currentYear = new Date().getFullYear();

export default function SetupPage() {
  const router = useRouter();
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
      .then(({ data, error: queryError }) => {
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

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("请先登录");
      setSaving(false);
      return;
    }

    const subjectsArray = subjects
      .split(/[、,，]/)
      .map((s) => s.trim())
      .filter(Boolean);
    const weakArray = weakSubjects
      .split(/[、,，]/)
      .map((s) => s.trim())
      .filter(Boolean);

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

    // 生成学习计划（最多重试5次，每次间隔1秒）
    setGenerating(true);
    for (let retry = 0; retry < 5; retry++) {
      try {
        const res = await fetch("/api/plan/generate", { method: "POST" });
        if (res.ok) break;
      } catch {}
      await new Promise((r) => setTimeout(r, 1000));
    }

    router.push("/dashboard");
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
            <span className="text-[15px] font-semibold text-gray-900">
              AI考研教练
            </span>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 justify-center px-5 py-10">
        <div className="w-full max-w-lg">
          {/* 只有编辑已有资料时才显示返回按钮 */}
          {existing && (
            <Link
              href="/dashboard"
              className="mb-6 inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600"
            >
              <ChevronLeft className="h-4 w-4" />
              返回
            </Link>
          )}

          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {existing ? "修改考研信息" : "填写考研信息"}
          </h1>
          <p className="mt-1.5 text-sm text-gray-500">
            AI将根据这些信息为你生成个性化学习计划
          </p>

          <form onSubmit={handleSave} className="mt-8 space-y-5">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
                {error}
              </div>
            )}

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
                placeholder="用顿号分隔，例如：政治、英语一、数学一、408计算机" />
              <p className="mt-1 text-xs text-gray-400">用顿号或逗号分隔多个科目</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">当前学习水平</label>
              <select value={level} onChange={(e) => setLevel(e.target.value)}
                className="mt-1.5 block w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 focus:border-gray-400 focus:outline-none">
                {levelOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">每天可学习时间（小时）</label>
              <div className="mt-1.5 flex items-center gap-3">
                <input type="range" min={1} max={16} step={0.5} value={dailyHours}
                  onChange={(e) => setDailyHours(Number(e.target.value))} className="flex-1 accent-gray-900" />
                <span className="w-12 text-sm font-medium text-gray-900">{dailyHours}h</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">薄弱科目</label>
              <input type="text" value={weakSubjects} onChange={(e) => setWeakSubjects(e.target.value)}
                className="mt-1.5 block w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:outline-none"
                placeholder="用顿号分隔，不知道可不填" />
              <p className="mt-1 text-xs text-gray-400">哪些科目感觉自己比较薄弱，AI会重点关注</p>
            </div>

            <button type="submit" disabled={saving || generating}
              className="flex w-full items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
            >
              {saving || generating ? "AI正在为你规划中..." : existing ? "更新信息" : "保存并前往仪表盘"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
