import { NextRequest } from "next/server";
import { withAuth, getStudentProfile, safeParseJSON, requireFields } from "@/lib/api-utils";
import { callDeepSeek } from "@/lib/deepseek";
import { buildCheckinPrompt } from "@/lib/prompts";
import { createOrUpdateSnapshot } from "@/lib/profile/snapshot-service";
import { buildStatusSummary } from "@/lib/memory/context-builder";
import { updateTaskStatus } from "@/lib/plan/plan-task-service";
import { analyzeAndSaveState } from "@/lib/analysis/student-state";

export const POST = withAuth(async (request, { user, supabase }) => {
  const body = await safeParseJSON<{
    studyHours?: number;
    tasksCompleted?: number;
    tasksTotal?: number;
    status?: string;
    difficulties?: string;
    subjectHours?: Record<string, number>;
    subjectCompletion?: Record<string, number>;
    energyLevel?: number;
    emotion?: string;
    energy?: string;
    memo?: string;
    taskUpdates?: { taskId: string; status: string; actualHours?: number }[];
  }>(request, {});

  const missing = requireFields(body, ["studyHours", "tasksCompleted"]);
  if (missing) {
    return { error: missing, _status: 400 };
  }

  // 读取用户资料
  const { data: profile } = await getStudentProfile(supabase, user.id);
  if (!profile) {
    return { error: "请先填写考研信息", _status: 400 };
  }

  // ===== 更新 plan_tasks 任务状态 =====
  const taskUpdates = body.taskUpdates ?? [];
  for (const update of taskUpdates) {
    await updateTaskStatus(
      supabase,
      update.taskId,
      update.status as "pending" | "in_progress" | "completed" | "delayed",
      update.actualHours
    );
  }

  // 构建计划摘要
  let planSummary = "备考中";
  if (profile.study_plan?.stages?.[0]) {
    const first = profile.study_plan.stages[0];
    planSummary = `${first.name}：${first.focus}`;
  }

  // 加载用户近期状态上下文（用于注入 checkin prompt）
  const statusContext = await buildStatusSummary(supabase, user.id);

  // 生成 AI 反馈（带状态上下文）
  const prompt = buildCheckinPrompt(
    profile,
    {
      studyHours: body.studyHours!,
      tasksCompleted: body.tasksCompleted!,
      tasksTotal: body.tasksTotal ?? 0,
      status: body.status ?? "normal",
      difficulties: body.difficulties ?? "",
    },
    planSummary,
    statusContext || undefined
  );

  const feedback = await callDeepSeek(prompt);

  // 保存打卡记录
  const today = new Date().toISOString().split("T")[0];
  const { error: upsertError } = await supabase.from("daily_checkins").upsert(
    {
      user_id: user.id,
      checkin_date: today,
      study_hours: body.studyHours!,
      tasks_completed: body.tasksCompleted!,
      tasks_total: body.tasksTotal ?? 0,
      status: body.status ?? "normal",
      difficulties: body.difficulties ?? "",
      ai_feedback: feedback,
    },
    { onConflict: "user_id,checkin_date" }
  );

  if (upsertError) {
    return { error: "保存失败：" + upsertError.message, _status: 500 };
  }

  // 异步创建每日快照（带 emotion/energy）
  const energyMap: Record<string, number> = {
    energetic: 5,
    normal: 3,
    tired: 2,
  };

  const difficultiesArray = body.difficulties
    ? body.difficulties.split(/[,，、]/).map((s: string) => s.trim()).filter(Boolean)
    : [];

  createOrUpdateSnapshot(supabase, user.id, today, {
    totalHours: body.studyHours!,
    tasksCompleted: body.tasksCompleted!,
    tasksTotal: body.tasksTotal ?? 0,
    energyLevel: body.energyLevel ?? energyMap[body.status ?? "normal"] ?? 3,
    difficulties: difficultiesArray,
    subjectHours: body.subjectHours,
    subjectCompletion: body.subjectCompletion,
    emotion: body.emotion,
    energy: body.energy,
    memo: body.memo,
  }).catch((e) => console.error("[Checkin] 创建快照失败:", e));

  // 自动触发状态分析
  analyzeAndSaveState(supabase, user.id).catch((e) =>
    console.error("[Checkin] 状态分析失败:", e)
  );

  return { feedback };
});

