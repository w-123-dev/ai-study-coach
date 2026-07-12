import { NextRequest } from "next/server";
import { withAuth, getStudentProfile } from "@/lib/api-utils";
import { callDeepSeek } from "@/lib/deepseek";
import { buildPlanPrompt } from "@/lib/prompts";
import { decomposePlan, insertPlanTasks } from "@/lib/plan/plan-task-service";
import { initializeProfileMemories, updatePlanProgressMemory } from "@/lib/memory/profile-initializer";
import { analyzeAndSaveState } from "@/lib/analysis/student-state";
import { validateProfile } from "@/lib/profile/profile-validator";
import { searchSchoolMajor, formatSchoolContext } from "@/lib/research/school-search";
import { cachedSearch } from "@/lib/research/research-cache";
import type { StudyPlan } from "@/lib/types";

export const POST = withAuth(async (request, { user, supabase }) => {
  // ===== 读取用户资料 =====
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

  // ===== 验证用户信息质量 =====
  const validation = validateProfile({
    target_school: profile.school,
    target_major: profile.major,
    exam_year: profile.exam_year,
    education_background: profile.level,
    weak_subjects: profile.weak_subjects || [],
    daily_hours: profile.daily_hours,
    subjects: profile.subjects || [],
  });

  // ===== 查询院校专业信息 =====
  const { data: schoolInfo } = await cachedSearch(
    "school",
    `${profile.school}:${profile.major}`,
    () => searchSchoolMajor(supabase, profile.school, profile.major)
  );

  const schoolContext = schoolInfo ? formatSchoolContext(schoolInfo) : undefined;

  // ===== 构建提示词 =====
  let prompt = buildPlanPrompt(profile, schoolContext);

  // 如果有验证警告，注入到 prompt 中让 AI 了解潜在风险
  if (validation.warnings.length > 0) {
    const warningsBlock =
      `\n\n===== 用户信息验证提示（用户已确认）=====\n` +
      `以下信息经 AI 验证后用户已确认无误，请在制定计划时注意：\n` +
      validation.warnings
        .map((w, i) => `${i + 1}. [${w.title}] ${w.message}`)
        .join("\n") +
      `\n\n请基于以上信息，在制定计划时适当考虑这些因素，但不要重复提醒用户。\n`;
    prompt += warningsBlock;
  }

  // ===== 调用 DeepSeek =====
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
      error: "保存计划失败: " + updateError.message,
      _status: 500,
    };
  }

  // 将计划任务拆解为 plan_tasks 记录
  try {
    const planTasks = decomposePlan(user.id, planJson as StudyPlan);
    if (planTasks.length > 0) {
      await insertPlanTasks(supabase, planTasks, { clearExisting: true });
    }
  } catch (e) {
    console.error("[PlanGenerate] 拆解任务失败:", e);
  }

  return { plan: planJson };
});
