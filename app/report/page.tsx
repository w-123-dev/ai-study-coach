"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import {
  Loader2,
  ArrowLeft,
  BookOpen,
  Clock,
  Target,
  TrendingUp,
  Flame,
  Sparkles,
  Brain,
  AlertTriangle,
  Lightbulb,
  ChevronRight,
  Smile,
  Meh,
  Frown,
  AlertCircle,
} from "lucide-react";
import type { WeeklyReportData, SubjectWeekData } from "@/lib/analysis/weekly-report";
import { getWeekDateLabel } from "@/lib/analysis/weekly-report";

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

const moodIcons: Record<string, typeof Smile> = {
  happy: Smile,
  normal: Meh,
  anxious: Frown,
  tired: AlertCircle,
};

const moodLabels: Record<string, string> = {
  happy: "开心",
  normal: "正常",
  anxious: "焦虑",
  tired: "疲惫",
};

export default function WeeklyReportPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<WeeklyReportData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadReport = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/analysis/weekly-report");
      if (!res.ok) {
        setError("加载周报失败");
        return;
      }
      const data = await res.json();
      if (data.report) {
        setReport(data.report);
      } else {
        setReport(null);
      }
    } catch (e) {
      console.warn("[WeeklyReport] 加载失败:", e);
      setError("网络错误");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-gray-400" />
          <p className="mt-2 text-sm text-gray-400">生成周报中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-3xl items-center gap-3 px-5">
          <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <BookOpen className="h-5 w-5 text-blue-600" />
          <span className="text-[15px] font-semibold tracking-tight text-gray-900">学习周报</span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 pb-24 pt-5">
        {!report ? (
          /* 无数据状态 */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <BookOpen className="h-8 w-8 text-gray-300" />
            </div>
            <h2 className="mt-4 text-base font-semibold text-gray-900">本周暂无学习数据</h2>
            <p className="mt-1 text-sm text-gray-400">完成每日打卡后，周报会自动生成</p>
            <Link
              href="/dashboard"
              className="mt-6 inline-flex items-center gap-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              去学习
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* 周报头部 */}
            <section className="rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-300">第 {report.weekNumber} 周</p>
                  <p className="text-lg font-bold tracking-tight">
                    {getWeekDateLabel(report.periodStart, report.periodEnd)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1.5">
                    <Flame className="h-4 w-4 text-orange-400" />
                    <span className="text-sm font-semibold">{report.streakDays} 天</span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-gray-400">连续学习</p>
                </div>
              </div>
            </section>

            {/* 核心数据卡片 */}
            <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <Clock className="h-4 w-4 text-blue-500" />
                <p className="mt-2 text-lg font-bold text-gray-900">{report.totalHours}h</p>
                <p className="text-[11px] text-gray-400">总学习时间</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <p className="mt-2 text-lg font-bold text-gray-900">{report.avgCompletionRate}%</p>
                <p className="text-[11px] text-gray-400">平均完成率</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <Target className="h-4 w-4 text-purple-500" />
                <p className="mt-2 text-lg font-bold text-gray-900">{report.studyDays} 天</p>
                <p className="text-[11px] text-gray-400">学习天数</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <Clock className="h-4 w-4 text-amber-500" />
                <p className="mt-2 text-lg font-bold text-gray-900">{report.avgDailyHours}h</p>
                <p className="text-[11px] text-gray-400">日均学习</p>
              </div>
            </section>

            {/* AI 教练总结 */}
            {report.aiSummary && (
              <section className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                    <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                  </div>
                  <span className="text-xs font-semibold text-blue-800">AI 教练周报总结</span>
                </div>
                <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{report.aiSummary}</p>
              </section>
            )}

            {/* 各科情况 */}
            <section>
              <h2 className="mb-3 text-sm font-semibold text-gray-900">各科完成情况</h2>
              <div className="space-y-2">
                {report.subjects.map((subject) => (
                  <SubjectCard key={subject.name} subject={subject} />
                ))}
              </div>
            </section>

            {/* 发现的问题 */}
            {report.aiProblems.length > 0 && (
              <section className="rounded-xl border border-amber-100 bg-amber-50/50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span className="text-xs font-semibold text-amber-800">本周发现问题</span>
                </div>
                <ul className="space-y-2">
                  {report.aiProblems.map((problem, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                      {problem}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* 下周建议 */}
            {report.aiSuggestions.length > 0 && (
              <section className="rounded-xl border border-green-100 bg-green-50/50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="h-4 w-4 text-green-600" />
                  <span className="text-xs font-semibold text-green-800">下周建议</span>
                </div>
                <ul className="space-y-2">
                  {report.aiSuggestions.map((suggestion, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-400" />
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* 情绪状态 */}
            <section>
              <h2 className="mb-3 text-sm font-semibold text-gray-900">本周情绪状态</h2>
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="grid grid-cols-4 gap-3">
                  {Object.entries(report.moodStats).map(([mood, count]) => {
                    const total = Object.values(report.moodStats).reduce((a, b) => a + b, 0);
                    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                    const MoodIcon = moodIcons[mood] || Meh;
                    return (
                      <div key={mood} className="text-center">
                        <div className="flex justify-center">
                          <MoodIcon className={`h-6 w-6 ${count > 0 ? "text-gray-700" : "text-gray-200"}`} />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">{moodLabels[mood] || mood}</p>
                        <p className="text-sm font-semibold text-gray-900">{count} 天</p>
                        <div className="mt-1 h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gray-900 transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* 链接到 AI 对话 */}
            <section>
              <Link
                href="/chat"
                className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-gray-300"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                    <Brain className="h-4 w-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">和 AI 教练聊聊</p>
                    <p className="text-xs text-gray-400">分析本周问题，制定下周计划</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-300" />
              </Link>
            </section>
          </div>
        )}
      </main>

      {/* 底部导航 */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-around px-5">
          <Link href="/dashboard" className="flex flex-col items-center gap-0.5 text-xs text-gray-400">
            <BookOpen className="h-5 w-5" />
            学习
          </Link>
          <Link href="/report" className="flex flex-col items-center gap-0.5 text-xs font-medium text-gray-900">
            <TrendingUp className="h-5 w-5" />
            周报
          </Link>
          <Link href="/chat" className="flex flex-col items-center gap-0.5 text-xs text-gray-400">
            <Sparkles className="h-5 w-5" />
            AI陪伴
          </Link>
        </div>
      </nav>
    </div>
  );
}

function SubjectCard({ subject }: { subject: SubjectWeekData }) {
  const rateColor =
    subject.completionRate >= 80
      ? "bg-green-500"
      : subject.completionRate >= 50
      ? "bg-yellow-500"
      : "bg-red-400";

  const changeText =
    subject.changeFromLastWeek !== null
      ? subject.changeFromLastWeek >= 0
        ? `↑ ${subject.changeFromLastWeek}%`
        : `↓ ${Math.abs(subject.changeFromLastWeek)}%`
      : null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`rounded-md border px-2 py-0.5 text-xs font-medium ${getSubjectColor(subject.name)}`}>
            {subject.name}
          </span>
          <span className="text-xs text-gray-400">
            {subject.totalHours}h
          </span>
        </div>
        <div className="flex items-center gap-2">
          {changeText && (
            <span className={`text-xs font-medium ${subject.changeFromLastWeek! >= 0 ? "text-green-600" : "text-red-500"}`}>
              {changeText}
            </span>
          )}
          <span className="text-sm font-semibold text-gray-900">{subject.completionRate}%</span>
        </div>
      </div>
      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${rateColor}`}
          style={{ width: `${subject.completionRate}%` }}
        />
      </div>
      <div className="mt-1.5 flex justify-between text-[11px] text-gray-400">
        <span>已完成 {subject.completedTasks}/{subject.totalTasks} 个任务</span>
      </div>
    </div>
  );
}
