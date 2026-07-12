import type { SupabaseClient } from "@supabase/supabase-js";
import { callDeepSeekChat } from "@/lib/deepseek";
import { buildReviewPrompt } from "@/lib/prompts";
import { getLatestStudentState } from "@/lib/analysis/student-state";
import { getWeekTasks, insertPlanTasks } from "@/lib/plan/plan-task-service";
import type {
  PlanReview,
  AIReviewResult,
  AdjustmentSuggestion,
  SubjectBreakdown,
  PlanTask,
} from "@/lib/types";

/**
 * 动态计划调整引擎
 *
 * 流程：
 * 1. 读取本周数据（plan_tasks + daily_snapshots + student_state）
 * 2. 调用 DeepSeek 分析
 * 3. AI 返回调整建议（JSON）
 * 4. 系统验证建议的合理性
 * 5. 生成新的 plan_tasks（version + 1）
 * 6. 记录复盘结果
 */

// ============================================================
// 触发完整复盘流程
// ============================================================

/**
 * 执行每周复盘
 * @param weekNumber 可选，默认当前周
 * @param autoApply 是否自动应用调整（默认 false，只生成建议）
 */
export async function runWeeklyReview(
  supabase: SupabaseClient,
  userId: string,
  weekNumber?: number,
  autoApply: boolean = false
): Promise<{ review: PlanReview | null; applied: boolean }> {
  try {
    // 1. 收集数据
    const data = await gatherReviewData(supabase, userId, weekNumber);
    if (!data) return { review: null, applied: false };

    // 2. AI 分析
    const aiResult = await aiAnalyzeWeek(data);

    // 3. 系统验证
    const validated = validateSuggestions(aiResult, data);

    // 4. 保存复盘记录
    const review = await saveReview(supabase, userId, data, aiResult, validated);

    // 5. 如果验证通过且 autoApply，生成新任务
    let applied = false;
    if (autoApply && validated && aiResult.suggestions.length > 0) {
      applied = await applyAdjustments(supabase, userId, data, aiResult);
      if (applied) {
        await markReviewApplied(supabase, review.id!, data.planVersion + 1);
      }
    }

    return { review, applied };
  } catch (error) {
    console.error("[PlanReview] 复盘失败:", error);
    return { review: null, applied: false };
  }
}

// ============================================================
// 数据采集
// ============================================================

interface ReviewData {
  weekNumber: number;
  periodStart: string;
  periodEnd: string;
  tasks: PlanTask[];
  completionRate: number;
  totalTasks: number;
  completedTasks: number;
  delayedTasks: number;
  avgDailyHours: number;
  subjectBreakdown: Record<string, SubjectBreakdown>;
  studentState: string;
  planVersion: number;
}

async function gatherReviewData(
  supabase: SupabaseClient,
  userId: string,
  weekNumber?: number
): Promise<ReviewData | null> {
  const today = new Date();
  const currentYear = today.getFullYear();

  // 计算当前是第几周
  if (!weekNumber) {
    const startOfYear = new Date(currentYear, 0, 1);
    const diff = today.getTime() - startOfYear.getTime();
    weekNumber = Math.ceil(diff / (7 * 24 * 60 * 60 * 1000));
  }

  // 计算周区间
  const startOfYear = new Date(currentYear, 0, 1);
  const weekStart = new Date(startOfYear);
  weekStart.setDate(weekStart.getDate() + (weekNumber - 1) * 7);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const periodStart = weekStart.toISOString().split("T")[0];
  const periodEnd = weekEnd.toISOString().split("T")[0];

  // 1. 获取本周任务
  const tasks = await getWeekTasks(supabase, userId, weekNumber);

  // 如果没有任务，无法复盘
  if (!tasks || tasks.length === 0) return null;

  // 2. 统计数据
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const delayedTasks = tasks.filter((t) => t.status === "delayed").length;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // 3. 各科目完成情况
  const subjectMap = new Map<string, { total: number; completed: number; hours: number }>();
  for (const task of tasks) {
    const entry = subjectMap.get(task.subject) ?? { total: 0, completed: 0, hours: 0 };
    entry.total++;
    if (task.status === "completed") entry.completed++;
    entry.hours += task.actual_hours ?? 0;
    subjectMap.set(task.subject, entry);
  }

  const subjectBreakdown: Record<string, SubjectBreakdown> = {};
  for (const [subject, stats] of subjectMap) {
    subjectBreakdown[subject] = {
      subject,
      total: stats.total,
      completed: stats.completed,
      completionRate:
        stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
      avgHours: stats.total > 0 ? Math.round((stats.hours / stats.total) * 10) / 10 : 0,
    };
  }

  // 4. 获取快照计算日均学习时间
  const { data: snapshots } = await supabase
    .from("daily_snapshots")
    .select("total_hours")
    .eq("user_id", userId)
    .gte("date", periodStart)
    .lte("date", periodEnd);

  const totalHours =
    snapshots?.reduce((s, r) => s + (r.total_hours ?? 0), 0) ?? 0;
  const snapshotDays = snapshots?.length ?? 1;
  const avgDailyHours = Math.round((totalHours / Math.max(snapshotDays, 1)) * 10) / 10;

  // 5. 获取学生状态
  const studentState = await getLatestStudentState(supabase, userId);
  const stateSummary = studentState
    ? [
        `学习动力：${studentState.motivation}`,
        `完成趋势：${studentState.completion_trend}`,
        `风险等级：${studentState.risk_level}`,
        `压力状态：${studentState.stress_level}`,
        `连续学习：${studentState.streak_days} 天`,
        `薄弱科目：${studentState.weak_subjects.join("、") || "无"}`,
      ].join("\n")
    : "暂无状态数据";

  // 6. 当前 plan_version
  const maxVersion = Math.max(...tasks.map((t) => (t as unknown as Record<string, number>).plan_version ?? 1));

  return {
    weekNumber,
    periodStart,
    periodEnd,
    tasks,
    completionRate,
    totalTasks,
    completedTasks,
    delayedTasks,
    avgDailyHours,
    subjectBreakdown,
    studentState: stateSummary,
    planVersion: maxVersion,
  };
}

// ============================================================
// AI 分析
// ============================================================

async function aiAnalyzeWeek(data: ReviewData): Promise<AIReviewResult> {
  const subjectText = Object.values(data.subjectBreakdown)
    .map(
      (s) =>
        `${s.subject}：${s.completed}/${s.total} 完成 ${s.completionRate}% 均时 ${s.avgHours}h`
    )
    .join("\n");

  const taskText = data.tasks
    .map(
      (t) =>
        `[${t.status}] ${t.subject} - ${t.content}（计划${t.planned_hours}h，实际${t.actual_hours ?? 0}h）`
    )
    .join("\n");

  const prompt = buildReviewPrompt({
    weekNumber: data.weekNumber,
    completionRate: data.completionRate,
    totalTasks: data.totalTasks,
    completedTasks: data.completedTasks,
    delayedTasks: data.delayedTasks,
    avgDailyHours: data.avgDailyHours,
    subjectBreakdown: subjectText,
    studentState: data.studentState,
    originalPlanTasks: taskText,
  });

  const result = await callDeepSeekChat(
    [
      {
        role: "system",
        content:
          "你是考研教练的复盘分析系统。只输出 JSON，不要 markdown 包裹。",
      },
      { role: "user", content: prompt },
    ],
    { temperature: 0.4, maxTokens: 2048 }
  );

  try {
    const cleaned = result.replace(/^`{1,3}json?\s*/i, "").replace(/`{1,3}\s*$/, "").trim();
    const parsed = JSON.parse(cleaned) as AIReviewResult;

    return {
      analysis_summary: parsed.analysis_summary ?? "分析完成",
      problems_found: Array.isArray(parsed.problems_found) ? parsed.problems_found.slice(0, 5) : [],
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions.slice(0, 10) : [],
    };
  } catch {
    console.warn("[PlanReview] AI 返回解析失败，使用默认分析");
    return {
      analysis_summary: `完成率 ${data.completionRate}%，共 ${data.completedTasks}/${data.totalTasks} 个任务`,
      problems_found: ["AI 分析解析失败，请手动检查"],
      suggestions: [],
    };
  }
}

// ============================================================
// 系统验证
// ============================================================

function validateSuggestions(
  result: AIReviewResult,
  data: ReviewData
): boolean {
  if (!result.suggestions || result.suggestions.length === 0) return false;

  const validTypes = new Set(["add", "remove", "modify", "reschedule"]);
  const validPriorities = new Set(["high", "medium", "low"]);

  for (const s of result.suggestions) {
    // 验证类型
    if (!validTypes.has(s.type)) return false;
    // 验证优先级
    if (!validPriorities.has(s.priority)) s.priority = "medium";
    // 验证字段完整性
    if (!s.subject || !s.suggestion || !s.reason) return false;
    // 不允许删除超过 exist 的任务
    if (s.type === "remove" && data.totalTasks <= 1) return false;
  }

  return true;
}

// ============================================================
// 保存复盘记录
// ============================================================

async function saveReview(
  supabase: SupabaseClient,
  userId: string,
  data: ReviewData,
  aiResult: AIReviewResult,
  validated: boolean
): Promise<PlanReview> {
  const record = {
    user_id: userId,
    week_number: data.weekNumber,
    period_start: data.periodStart,
    period_end: data.periodEnd,
    completion_rate: data.completionRate,
    total_tasks: data.totalTasks,
    completed_tasks: data.completedTasks,
    delayed_tasks: data.delayedTasks,
    avg_daily_hours: data.avgDailyHours,
    subject_breakdown: data.subjectBreakdown,
    analysis_summary: aiResult.analysis_summary,
    problems_found: aiResult.problems_found,
    adjustment_suggestions: aiResult.suggestions,
    validation_status: validated ? "approved" : "rejected",
    validation_notes: validated ? "" : "AI 建议未通过系统验证",
    new_version: validated ? data.planVersion + 1 : null,
  };

  const { data: saved, error } = await supabase
    .from("plan_reviews")
    .insert(record)
    .select()
    .single();

  if (error) {
    console.error("[PlanReview] 保存失败:", error);
    throw error;
  }

  return {
    id: saved.id,
    user_id: saved.user_id,
    week_number: saved.week_number,
    period_start: saved.period_start,
    period_end: saved.period_end,
    completion_rate: saved.completion_rate,
    total_tasks: saved.total_tasks,
    completed_tasks: saved.completed_tasks,
    delayed_tasks: saved.delayed_tasks,
    avg_daily_hours: saved.avg_daily_hours,
    subject_breakdown: saved.subject_breakdown,
    analysis_summary: saved.analysis_summary,
    problems_found: saved.problems_found ?? [],
    adjustment_suggestions: saved.adjustment_suggestions ?? [],
    validation_status: saved.validation_status,
    validation_notes: saved.validation_notes,
    new_version: saved.new_version,
    applied_at: saved.applied_at,
    created_at: saved.created_at,
    updated_at: saved.updated_at,
  };
}

// ============================================================
// 应用调整（生成新的 plan_tasks）
// ============================================================

async function applyAdjustments(
  supabase: SupabaseClient,
  userId: string,
  data: ReviewData,
  aiResult: AIReviewResult
): Promise<boolean> {
  const newVersion = data.planVersion + 1;

  // 基于原始任务 + 调整建议生成新任务
  const newTasks = buildAdjustedTasks(userId, data, aiResult.suggestions, newVersion);

  if (newTasks.length === 0) return false;

  try {
    await insertPlanTasks(supabase, newTasks, { clearExisting: false });
    return true;
  } catch (error) {
    console.error("[PlanReview] 生成新任务失败:", error);
    return false;
  }
}

function buildAdjustedTasks(
  userId: string,
  data: ReviewData,
  suggestions: AdjustmentSuggestion[],
  newVersion: number
): Array<{
  user_id: string;
  week_number: number;
  subject: string;
  content: string;
  planned_hours: number;
  priority: "high" | "medium" | "low";
  difficulty: number;
  period?: string;
  plan_version: number;
}> {
  // 复制原始任务（pending/delayed 的保留）
  const tasks = data.tasks
    .filter((t) => t.status === "pending" || t.status === "delayed" || t.status === "in_progress")
    .map((t) => ({
      user_id: userId,
      week_number: data.weekNumber,
      subject: t.subject,
      content: t.content,
      planned_hours: t.planned_hours,
      priority: t.priority as "high" | "medium" | "low",
      difficulty: t.difficulty ?? 3,
      period: t.period ?? undefined,
      plan_version: newVersion,
    }));

  // 应用建议
  for (const s of suggestions) {
    switch (s.type) {
      case "add":
        tasks.push({
          user_id: userId,
          week_number: data.weekNumber,
          subject: s.subject,
          content: s.suggestion,
          planned_hours: 1,
          priority: s.priority,
          period: undefined,
          difficulty: 3,
          plan_version: newVersion,
        });
        break;

      case "modify": {
        const target = tasks.find(
          (t) => t.subject === s.subject && t.content.includes(s.original ?? "")
        );
        if (target) {
          target.content = s.suggestion;
          if (s.priority === "high") target.priority = "high";
        }
        break;
      }

      case "remove": {
        const idx = tasks.findIndex(
          (t) => t.subject === s.subject && t.content.includes(s.original ?? "")
        );
        if (idx >= 0) tasks.splice(idx, 1);
        break;
      }

      case "reschedule": {
        const target = tasks.find(
          (t) => t.subject === s.subject && t.content.includes(s.original ?? "")
        );
        if (target) {
          target.content = s.suggestion;
        }
        break;
      }
    }
  }

  return tasks;
}

async function markReviewApplied(
  supabase: SupabaseClient,
  reviewId: string,
  newVersion: number
): Promise<void> {
  await supabase
    .from("plan_reviews")
    .update({
      validation_status: "applied",
      new_version: newVersion,
      applied_at: new Date().toISOString(),
    })
    .eq("id", reviewId);
}

// ============================================================
// 查询接口
// ============================================================

export async function getLatestReview(
  supabase: SupabaseClient,
  userId: string
): Promise<PlanReview | null> {
  const { data } = await supabase
    .from("plan_reviews")
    .select("*")
    .eq("user_id", userId)
    .order("week_number", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return null;

  return {
    id: data.id,
    user_id: data.user_id,
    week_number: data.week_number,
    period_start: data.period_start,
    period_end: data.period_end,
    completion_rate: data.completion_rate,
    total_tasks: data.total_tasks,
    completed_tasks: data.completed_tasks,
    delayed_tasks: data.delayed_tasks,
    avg_daily_hours: data.avg_daily_hours,
    subject_breakdown: data.subject_breakdown ?? {},
    analysis_summary: data.analysis_summary ?? "",
    problems_found: data.problems_found ?? [],
    adjustment_suggestions: data.adjustment_suggestions ?? [],
    validation_status: data.validation_status,
    validation_notes: data.validation_notes,
    new_version: data.new_version,
    applied_at: data.applied_at,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

export async function getWeekReview(
  supabase: SupabaseClient,
  userId: string,
  weekNumber: number
): Promise<PlanReview | null> {
  const { data } = await supabase
    .from("plan_reviews")
    .select("*")
    .eq("user_id", userId)
    .eq("week_number", weekNumber)
    .maybeSingle();

  if (!data) return null;

  return {
    id: data.id,
    user_id: data.user_id,
    week_number: data.week_number,
    period_start: data.period_start,
    period_end: data.period_end,
    completion_rate: data.completion_rate,
    total_tasks: data.total_tasks,
    completed_tasks: data.completed_tasks,
    delayed_tasks: data.delayed_tasks,
    avg_daily_hours: data.avg_daily_hours,
    subject_breakdown: data.subject_breakdown ?? {},
    analysis_summary: data.analysis_summary ?? "",
    problems_found: data.problems_found ?? [],
    adjustment_suggestions: data.adjustment_suggestions ?? [],
    validation_status: data.validation_status,
    validation_notes: data.validation_notes,
    new_version: data.new_version,
    applied_at: data.applied_at,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}




