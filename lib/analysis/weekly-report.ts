import type { SupabaseClient } from "@supabase/supabase-js";
import { callDeepSeek } from "@/lib/deepseek";
import type { DailySnapshot, PlanTask } from "@/lib/types";

// ============================================================
// 周报数据结构
// ============================================================

export interface WeeklyReportData {
  /** 周数 */
  weekNumber: number;
  /** 日期范围 */
  periodStart: string;
  periodEnd: string;
  /** 总学习时间 */
  totalHours: number;
  /** 日均学习时间 */
  avgDailyHours: number;
  /** 学习天数 */
  studyDays: number;
  /** 平均完成率 */
  avgCompletionRate: number;
  /** 各科数据 */
  subjects: SubjectWeekData[];
  /** 进步最多的科目 */
  mostImproved: string | null;
  /** 最薄弱的科目 */
  weakestSubject: string | null;
  /** 本周最好的一天 */
  bestDay: string | null;
  /** 连续学习天数 */
  streakDays: number;
  /** AI 生成的总结 */
  aiSummary: string | null;
  /** AI 发现的问题 */
  aiProblems: string[];
  /** AI 下周建议 */
  aiSuggestions: string[];
  /** 情绪统计 */
  moodStats: {
    happy: number;
    normal: number;
    anxious: number;
    tired: number;
  };
}

export interface SubjectWeekData {
  name: string;
  totalHours: number;
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  /** 与上周对比（正数=进步） */
  changeFromLastWeek: number | null;
}

// ============================================================
// 生成周报
// ============================================================

export async function generateWeeklyReport(
  supabase: SupabaseClient,
  userId: string
): Promise<WeeklyReportData | null> {
  try {
    // 1. 计算当前周数
    const now = new Date();
    const { weekNumber, weekStart, weekEnd } = getCurrentWeekInfo(now);

    // 2. 获取本周快照数据
    const { data: snapshots } = await supabase
      .from("daily_snapshots")
      .select("*")
      .eq("user_id", userId)
      .gte("date", weekStart)
      .lte("date", weekEnd)
      .order("date", { ascending: true });

    // 3. 获取上周快照（用于对比）
    const lastWeekStart = new Date(weekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    const lastWeekEnd = new Date(weekEnd);
    lastWeekEnd.setDate(lastWeekEnd.getDate() - 7);

    const { data: lastSnapshots } = await supabase
      .from("daily_snapshots")
      .select("date, total_hours, completion_rate, subject_hours")
      .eq("user_id", userId)
      .gte("date", lastWeekStart.toISOString().split("T")[0])
      .lte("date", lastWeekEnd.toISOString().split("T")[0])
      .order("date", { ascending: true });

    // 4. 获取本周任务
    const { data: tasks } = await supabase
      .from("plan_tasks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(100);

    // 5. 获取用户画像（context）
    const { data: profile } = await supabase
      .from("student_profiles")
      .select("school, major, level, weak_subjects")
      .eq("user_id", userId)
      .single();

    // 计算基本统计
    const snaps = (snapshots ?? []) as DailySnapshot[];
    const lastSnaps = (lastSnapshots ?? []) as DailySnapshot[];
    const allTasks = (tasks ?? []) as PlanTask[];

    if (snaps.length === 0 && allTasks.length === 0) {
      return null; // 没有数据
    }

    // --- 时间统计 ---
    const totalHours = snaps.reduce((s, r) => s + (r.total_hours ?? 0), 0);
    const studyDays = snaps.length;
    const avgDailyHours = studyDays > 0 ? Math.round((totalHours / studyDays) * 10) / 10 : 0;

    // --- 任务统计 ---
    const weekTasks = allTasks.filter((t) => {
      if (!t.created_at) return false;
      const d = new Date(t.created_at);
      const ds = d.toISOString().split("T")[0];
      return ds >= weekStart && ds <= weekEnd;
    });

    const totalTasks = weekTasks.length;
    const completedTasks = weekTasks.filter((t) => t.status === "completed").length;
    const avgCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // --- 各科数据 ---
    const subjectMap = new Map<string, SubjectWeekData>();
    for (const task of weekTasks) {
      if (!subjectMap.has(task.subject)) {
        const lastCompletion = computeLastWeekCompletion(lastSnaps, task.subject);
        subjectMap.set(task.subject, {
          name: task.subject,
          totalHours: 0,
          totalTasks: 0,
          completedTasks: 0,
          completionRate: 0,
          changeFromLastWeek: lastCompletion !== null ? 0 : null,
        });
      }
      const entry = subjectMap.get(task.subject)!;
      entry.totalTasks += 1;
      if (task.status === "completed") {
        entry.completedTasks += 1;
        entry.totalHours += task.actual_hours ?? task.planned_hours ?? 0;
      }
    }

    // 合并 subject_hours 中的时间
    for (const snap of snaps) {
      const subHours = snap.subject_hours as Record<string, number> | undefined;
      if (subHours) {
        for (const [subject, hours] of Object.entries(subHours)) {
          if (!subjectMap.has(subject)) {
            subjectMap.set(subject, {
              name: subject,
              totalHours: 0,
              totalTasks: 0,
              completedTasks: 0,
              completionRate: 0,
              changeFromLastWeek: null,
            });
          }
          const entry = subjectMap.get(subject)!;
          entry.totalHours += hours ?? 0;
        }
      }
    }

    // 计算完成率和变化
    for (const [key, entry] of subjectMap.entries()) {
      entry.completionRate =
        entry.totalTasks > 0
          ? Math.round((entry.completedTasks / entry.totalTasks) * 100)
          : 0;
      if (entry.changeFromLastWeek !== null) {
        const lastComp = computeLastWeekCompletion(lastSnaps, key);
        entry.changeFromLastWeek = lastComp !== null ? entry.completionRate - lastComp : null;
      }
    }

    const subjects = Array.from(subjectMap.values());

    // --- 最好/最差科目 ---
    const sortedByCompletion = [...subjects].sort((a, b) => b.completionRate - a.completionRate);
    const mostImproved = sortedByCompletion.length > 0 ? sortedByCompletion[0].name : null;
    const weakestSubject =
      subjects.length > 1 ? sortedByCompletion[sortedByCompletion.length - 1].name : null;

    // --- 最好的一天 ---
    const bestDay =
      snaps.length > 0
        ? [...snaps].sort((a, b) => (b.completion_rate ?? 0) - (a.completion_rate ?? 0))[0].date
        : null;

    // --- 情绪统计 ---
    const moodStats = { happy: 0, normal: 0, anxious: 0, tired: 0 };
    for (const snap of snaps) {
      const emo = (snap.emotion ?? "normal") as keyof typeof moodStats;
      if (emo in moodStats) moodStats[emo] += 1;
    }

    // --- streak ---
    const streakDays = snaps.filter((s) => (s.completion_rate ?? 0) >= 50).length;

    // --- AI 总结 ---
    let aiSummary: string | null = null;
    let aiProblems: string[] = [];
    let aiSuggestions: string[] = [];

    try {
      const prompt = buildWeeklyReportPrompt({
        weekNumber,
        subjects,
        totalHours,
        avgDailyHours,
        studyDays,
        avgCompletionRate,
        mostImproved,
        weakestSubject,
        moodStats,
        profile: profile
          ? {
              school: (profile as any).school ?? "",
              major: (profile as any).major ?? "",
              level: (profile as any).level ?? "",
              weak_subjects: (profile as any).weak_subjects ?? [],
            }
          : null,
      });

      const aiResult = await callDeepSeek(prompt, {
        systemPrompt:
          "你是一位专业的考研教练，擅长用数据说话，给出精准的周报分析。请严格按照 JSON 格式返回，不要包含 Markdown 或额外文字。",
        temperature: 0.6,
        maxTokens: 1500,
      });

      try {
        const parsed = JSON.parse(aiResult.trim().replace(/```json|```/g, ""));
        aiSummary = parsed.summary ?? null;
        aiProblems = parsed.problems ?? [];
        aiSuggestions = parsed.suggestions ?? [];
      } catch {
        // JSON 解析失败，把原始内容作为 summary
        aiSummary = aiResult.trim();
        aiProblems = [];
        aiSuggestions = [];
      }
    } catch (e) {
      console.warn("[WeeklyReport] AI 生成失败:", e);
    }

    return {
      weekNumber,
      periodStart: weekStart,
      periodEnd: weekEnd,
      totalHours: Math.round(totalHours * 10) / 10,
      avgDailyHours,
      studyDays,
      avgCompletionRate,
      subjects,
      mostImproved,
      weakestSubject,
      bestDay,
      streakDays,
      aiSummary,
      aiProblems,
      aiSuggestions,
      moodStats,
    };
  } catch (error) {
    console.error("[WeeklyReport] 生成失败:", error);
    return null;
  }
}

// ============================================================
// 辅助函数
// ============================================================

function getCurrentWeekInfo(now: Date): {
  weekNumber: number;
  weekStart: string;
  weekEnd: string;
} {
  // 计算按周一的周
  const day = now.getDay();
  const diff = day === 0 ? 6 : day - 1; // Monday = 0
  const monday = new Date(now);
  monday.setDate(now.getDate() - diff);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  // 计算一年中的第几周
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const diffDays = Math.floor(
    (monday.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)
  );
  const weekNumber = Math.ceil((diffDays + startOfYear.getDay() + 1) / 7);

  return {
    weekNumber,
    weekStart: monday.toISOString().split("T")[0],
    weekEnd: sunday.toISOString().split("T")[0],
  };
}

function computeLastWeekCompletion(
  lastSnaps: DailySnapshot[],
  subject: string
): number | null {
  // 从上周的 subject_hours 或 subject_completion 估计
  let total = 0;
  let count = 0;
  for (const snap of lastSnaps) {
    const comp = (snap.subject_completion as Record<string, number> | null)?.[subject];
    if (comp !== undefined && comp !== null) {
      total += comp;
      count++;
    }
  }
  return count > 0 ? Math.round(total / count) : null;
}

// ============================================================
// AI Prompt 构建
// ============================================================

interface PromptInput {
  weekNumber: number;
  subjects: SubjectWeekData[];
  totalHours: number;
  avgDailyHours: number;
  studyDays: number;
  avgCompletionRate: number;
  mostImproved: string | null;
  weakestSubject: string | null;
  moodStats: { happy: number; normal: number; anxious: number; tired: number };
  profile: {
    school: string;
    major: string;
    level: string;
    weak_subjects: string[];
  } | null;
}

function buildWeeklyReportPrompt(input: PromptInput): string {
  const subjectLines = input.subjects
    .map(
      (s) =>
        `- ${s.name}：${s.totalHours}h，完成率 ${s.completionRate}%${
          s.changeFromLastWeek !== null
            ? `（较上周 ${s.changeFromLastWeek >= 0 ? "+" : ""}${s.changeFromLastWeek}%）`
            : ""
        }`
    )
    .join("\n");

  const moodLines = Object.entries(input.moodStats)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => `- ${k}：${v}天`)
    .join("\n");

  return `请根据以下考研学习数据，生成一份第${input.weekNumber}周的学习周报。

## 用户信息
${input.profile ? `目标：${input.profile.school} ${input.profile.major}\n水平：${input.profile.level}\n薄弱科目：${input.profile.weak_subjects.join("、") || "无"}` : "未知"}

## 本周数据
- 学习天数：${input.studyDays}天
- 总学习时间：${input.totalHours}小时
- 日均学习时间：${input.avgDailyHours}小时
- 平均任务完成率：${input.avgCompletionRate}%
- 进步最多科目：${input.mostImproved || "无"}
- 最薄弱科目：${input.weakestSubject || "无"}

## 各科情况
${subjectLines || "暂无数据"}

## 情绪状态
${moodLines || "暂无数据"}

## 要求
请按以下 JSON 格式返回，不要包含其他内容：
{
  "summary": "一段 80-150 字的周报总结，语气温暖鼓励，指出进步和问题",
  "problems": ["问题1", "问题2"],
  "suggestions": ["具体的下周建议1", "具体的下周建议2"]
}

注意：
- summary 要体现数据，不要泛泛而谈
- problems 最多 3 条，要有数据支撑
- suggestions 最多 3 条，要可操作，结合用户的目标院校和专业水平`;
}

/**
 * 获取当前周序号（用于日历显示）
 */
export function getWeekDateLabel(weekStart: string, weekEnd: string): string {
  const start = new Date(weekStart);
  const end = new Date(weekEnd);
  const fmt = (d: Date) =>
    `${d.getMonth() + 1}/${d.getDate()}`;
  return `${fmt(start)} - ${fmt(end)}`;
}
