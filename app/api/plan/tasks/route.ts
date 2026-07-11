import { NextRequest } from "next/server";
import { withAuth } from "@/lib/api-utils";
import { getWeekTasks, calculateCurrentWeek, updateTaskStatus } from "@/lib/plan/plan-task-service";
import { getStudentProfile } from "@/lib/api-utils";
import type { PlanTaskStatus } from "@/lib/types";

/**
 * GET /api/plan/tasks?week=1
 * 获取指定周的任务列表
 * week 参数可选，默认自动计算当前周
 */
export const GET = withAuth(async (request, { user, supabase }) => {
  const url = new URL(request.url);
  const weekParam = url.searchParams.get("week");

  // 读取用户资料（获取 plan JSON 用于计算当前周）
  const { data: profile } = await getStudentProfile(supabase, user.id);
  if (!profile) {
    return { tasks: [], currentWeek: 1 };
  }

  // 确定当前周
  let currentWeek: number;
  if (weekParam) {
    currentWeek = parseInt(weekParam, 10);
    if (isNaN(currentWeek) || currentWeek < 1) {
      currentWeek = 1;
    }
  } else {
    currentWeek = profile.study_plan
      ? calculateCurrentWeek(profile.study_plan)
      : 1;
  }

  // 从 plan_tasks 读取任务
  const tasks = await getWeekTasks(supabase, user.id, currentWeek);

  // 读取本周统计
  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const totalCount = tasks.length;

  return {
    tasks,
    currentWeek,
    stats: {
      total: totalCount,
      completed: completedCount,
      completionRate: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
    },
    hasPlan: !!profile.study_plan,
  };
});

/**
 * PATCH /api/plan/tasks
 * 更新任务状态
 * Body: { taskId, status, actualHours? }
 */
export const PATCH = withAuth(async (request, { user, supabase }) => {
  let body: { taskId?: string; status?: string; actualHours?: number };
  try {
    body = await request.json();
  } catch {
    return { error: "请求体格式错误", _status: 400 };
  }

  if (!body.taskId) {
    return { error: "缺少 taskId", _status: 400 };
  }

  const validStatuses: PlanTaskStatus[] = ["pending", "in_progress", "completed", "delayed"];
  const newStatus = body.status as PlanTaskStatus;
  if (!newStatus || !validStatuses.includes(newStatus)) {
    return { error: "无效的状态值", _status: 400 };
  }

  const success = await updateTaskStatus(
    supabase,
    body.taskId,
    newStatus,
    body.actualHours
  );

  if (!success) {
    return { error: "更新任务失败", _status: 500 };
  }

  return { success: true };
});
