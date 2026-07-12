import { NextRequest } from "next/server";
import { withAuth, getStudentProfile } from "@/lib/api-utils";
import { callDeepSeek } from "@/lib/deepseek";
import { buildPlanPrompt } from "@/lib/prompts";
import { decomposePlan, insertPlanTasks } from "@/lib/plan/plan-task-service";
import { initializeProfileMemories, updatePlanProgressMemory } from "@/lib/memory/profile-initializer";
import { analyzeAndSaveState } from "@/lib/analysis/student-state";
import type { StudyPlan } from "@/lib/types";

export const POST = withAuth(async (request, { user, supabase }) => {
  // 读取用户资料
  const { data: profile, error: profileError } = await getStudentProfile(
    supabase,
    user.id
  );

  if (profileError || !profile) {
    return {
      error: "请先填写考研信息",
      _status: 400,
    };
  }

  // 构建提示词并调用 DeepSeek
  const prompt = buildPlanPrompt(profile);
  const planText = await callDeepSeek(prompt);

  // 尝试解析 JSON，确保返回的是有效 JSON
  let planJson: unknown;
  try {
    planJson = JSON.parse(planText);
  } catch {
    return {
      error: "AI返回格式异常，请重试",
      raw: planText,
      _status: 500,
    };
  }

  // 保存到数据库
  const { error: updateError } = await supabase
    .from("student_profiles")
    .update({ study_plan: planJson })
    .eq("user_id", user.id);

  if (updateError) {
    return {
      error: "保存计划失败：" + updateError.message,
      _status: 500,
    };
  }

  // 将计划任务拆解为 plan_tasks 记录（不阻塞主流程）
  try {
    const planTasks = decomposePlan(user.id, planJson as StudyPlan);
    if (planTasks.length > 0) {
      await insertPlanTasks(supabase, planTasks, { clearExisting: true });
    }
  } catch (e) {
    console.error("[PlanGenerate] 拆解任务失败:", e);
    // 不阻断返回，计划 JSON 已保存
  }

  return { plan: planJson };
});

