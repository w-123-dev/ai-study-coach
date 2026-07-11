import type { SupabaseClient } from "@supabase/supabase-js";
import type { StudyPlan, PlanTask, PlanTaskStatus } from "@/lib/types";

// ============================================================
// 计划任务分解
// 将 AI 生成的 StudyPlan JSON 拆分为 plan_tasks 记录
// ============================================================

export interface PlanTaskInput {
  user_id: string;
  week_number: number;
  subject: string;
  content: string;
  planned_hours: number;
  priority: "high" | "medium" | "low";
  difficulty: number;
  period?: string;
}

/**
 * 将 StudyPlan 拆解为 plan_tasks 输入数组
 * 不修改原有计划 JSON
 */
export function decomposePlan(
  userId: string,
  plan: StudyPlan
): PlanTaskInput[] {
  const tasks: PlanTaskInput[] = [];

  for (const week of plan.weekly_plan) {
    for (const task of week.tasks) {
      // 根据科目自动推断优先级和难度
      const { priority, difficulty } = inferTaskMeta(
        task.subject,
        task.hours,
        week.week
      );

      tasks.push({
        user_id: userId,
        week_number: week.week,
        subject: task.subject,
        content: task.content,
        planned_hours: task.hours,
        priority,
        difficulty,
        period: week.period,
      });
    }
  }

  return tasks;
}

/**
 * 根据科目和计划时长推断优先级和难度
 */
function inferTaskMeta(
  subject: string,
  hours: number,
  _weekNumber: number
): { priority: "high" | "medium" | "low"; difficulty: number } {
  // 薄弱科目或投入时间多的科目 -> 高优先级
  const highPriorityKeywords = [
    "数学", "高数", "线代", "概率",
    "数据结构", "算法",
    "专业课", "专业基础",
  ];

  const isHighPriority = highPriorityKeywords.some((kw) => subject.includes(kw));
  const isHeavy = hours >= 3;

  const priority: "high" | "medium" | "low" =
    isHighPriority && isHeavy
      ? "high"
      : isHeavy
        ? "high"
        : isHighPriority
          ? "high"
          : "medium";

  // 根据科目大致推断难度（1-5）
  const difficultSubjects = [
    "数学", "高数", "线代", "概率",
    "数据结构", "算法", "计组", "操作系统",
  ];
  const isDifficult = difficultSubjects.some((kw) => subject.includes(kw));
  const difficulty = isDifficult
    ? hours >= 3
      ? 5
      : 4
    : hours >= 2
      ? 3
      : 2;

  return { priority, difficulty };
}

// ============================================================
// 批量插入 plan_tasks
// ============================================================

/**
 * 将分解后的任务批量插入 plan_tasks 表
 * 调用前会清除该用户已有的 plan_tasks（重新生成时用）
 */
export async function insertPlanTasks(
  supabase: SupabaseClient,
  tasks: PlanTaskInput[],
  options?: { clearExisting?: boolean }
): Promise<{ count: number; error: string | null }> {
  if (tasks.length === 0) {
    return { count: 0, error: "没有任务需要插入" };
  }

  const userId = tasks[0].user_id;

  // 如果需要清除旧数据
  if (options?.clearExisting) {
    const { error: clearError } = await supabase
      .from("plan_tasks")
      .delete()
      .eq("user_id", userId);

    if (clearError) {
      console.error("[PlanTaskService] 清除旧任务失败:", clearError);
      return { count: 0, error: clearError.message };
    }
  }

  const { error } = await supabase.from("plan_tasks").insert(tasks);

  if (error) {
    console.error("[PlanTaskService] 插入任务失败:", error);
    return { count: 0, error: error.message };
  }

  return { count: tasks.length, error: null };
}

// ============================================================
// 查询本周/指定周任务
// ============================================================

/**
 * 获取指定用户、指定周的任务
 */
export async function getWeekTasks(
  supabase: SupabaseClient,
  userId: string,
  weekNumber: number
): Promise<PlanTask[]> {
  const { data, error } = await supabase
    .from("plan_tasks")
    .select("*")
    .eq("user_id", userId)
    .eq("week_number", weekNumber)
    .order("subject")
    .order("priority", { ascending: false });

  if (error) {
    console.error("[PlanTaskService] 获取周任务失败:", error);
    return [];
  }

  return (data ?? []) as PlanTask[];
}

/**
 * 计算当前是第几周（基于计划开始时）
 */
export function calculateCurrentWeek(plan: StudyPlan): number {
  const firstWeek = plan.weekly_plan?.[0];
  if (!firstWeek?.period) return 1;

  // period 格式: "2026-01-01 ~ 2026-01-07"
  const startDateStr = firstWeek.period.split("~")[0]?.trim();
  if (!startDateStr) return 1;

  const startDate = new Date(startDateStr);
  const today = new Date();

  // 计算从计划开始到现在的天数，转为周数
  const diffMs = today.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const currentWeek = Math.max(1, Math.min(
    Math.floor(diffDays / 7) + 1,
    plan.weekly_plan.length
  ));

  return currentWeek;
}

// ============================================================
// 更新任务状态
// ============================================================

/**
 * 更新单个任务的状态和实际时长
 */
export async function updateTaskStatus(
  supabase: SupabaseClient,
  taskId: string,
  status: PlanTaskStatus,
  actualHours?: number
): Promise<boolean> {
  const updateData: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (actualHours !== undefined) {
    updateData.actual_hours = actualHours;
  }

  // 如果标记为完成，确保有实际时长
  if (status === "completed" && actualHours === undefined) {
    // 读取原有 planned_hours 作为默认 actual_hours
    const { data: task } = await supabase
      .from("plan_tasks")
      .select("planned_hours")
      .eq("id", taskId)
      .single();

    if (task) {
      updateData.actual_hours = (task as { planned_hours: number }).planned_hours;
    }
  }

  const { error } = await supabase
    .from("plan_tasks")
    .update(updateData)
    .eq("id", taskId);

  if (error) {
    console.error("[PlanTaskService] 更新任务失败:", error);
    return false;
  }

  return true;
}

// ============================================================
// 统计数据
// ============================================================

/**
 * 获取某周的完成统计数据
 */
export async function getWeekStats(
  supabase: SupabaseClient,
  userId: string,
  weekNumber: number
): Promise<{
  total: number;
  completed: number;
  pending: number;
  delayed: number;
  completionRate: number;
  totalPlannedHours: number;
  totalActualHours: number;
}> {
  const tasks = await getWeekTasks(supabase, userId, weekNumber);

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending = tasks.filter((t) => t.status === "pending").length;
  const delayed = tasks.filter((t) => t.status === "delayed").length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const totalPlannedHours = tasks.reduce((s, t) => s + t.planned_hours, 0);
  const totalActualHours = tasks.reduce((s, t) => s + t.actual_hours, 0);

  return {
    total,
    completed,
    pending,
    delayed,
    completionRate,
    totalPlannedHours,
    totalActualHours,
  };
}
