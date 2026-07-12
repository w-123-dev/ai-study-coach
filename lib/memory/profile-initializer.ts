import type { SupabaseClient } from "@supabase/supabase-js";
import type { StudentProfile } from "@/lib/types";
import { addMemories } from "@/lib/memory/memory-manager";

/**
 * 用户画像初始化器
 * 用户填写/更新个人信息后，自动生成记忆记录
 */
export async function initializeProfileMemories(
  supabase: SupabaseClient,
  userId: string,
  profile: StudentProfile
): Promise<void> {
  const memories: {
    category: "goal" | "weakness" | "habit" | "strength" | "progress";
    content: string;
    confidence: number;
    source: string;
  }[] = [];

  // 考研目标
  memories.push({
    category: "goal",
    content: "目标院校：" + profile.school + "，目标专业：" + profile.major + "，考试年份：" + profile.exam_year + "年",
    confidence: 10,
    source: "profile",
  });

  // 薄弱科目
  if (profile.weak_subjects && profile.weak_subjects.length > 0) {
    memories.push({
      category: "weakness",
      content: "薄弱科目：" + profile.weak_subjects.join("、"),
      confidence: 8,
      source: "profile",
    });
  }

  // 学习习惯
  memories.push({
    category: "habit",
    content: "当前水平：" + profile.level + "，每日可学习时间：" + profile.daily_hours + "小时",
    confidence: 7,
    source: "profile",
  });

  // 备考科目
  if (profile.subjects && profile.subjects.length > 0) {
    const strengths = profile.subjects.filter(
      (s) => !profile.weak_subjects?.includes(s)
    );
    if (strengths.length > 0) {
      memories.push({
        category: "strength",
        content: "备考科目：" + strengths.join("、"),
        confidence: 6,
        source: "profile",
      });
    }
  }

  // 清除旧的 profile 来源记忆，重新写入
  await supabase
    .from("user_memories")
    .delete()
    .eq("user_id", userId)
    .eq("source", "profile");

  const inserted = await addMemories(supabase, userId, memories);
  if (inserted > 0) {
    console.log("[ProfileInit] 已初始化 " + inserted + " 条记忆");
  }
}

export async function updatePlanProgressMemory(
  supabase: SupabaseClient,
  userId: string
): Promise<void> {
  // 清除旧的进度记忆
  await supabase
    .from("user_memories")
    .delete()
    .eq("user_id", userId)
    .eq("category", "progress")
    .eq("source", "profile");

  await supabase.from("user_memories").insert({
    user_id: userId,
    category: "progress",
    content: "学习计划已生成，开始执行",
    confidence: 7,
    source: "profile",
  });
}

export async function hasProfileMemories(
  supabase: SupabaseClient,
  userId: string
): Promise<boolean> {
  const { data } = await supabase
    .from("user_memories")
    .select("id")
    .eq("user_id", userId)
    .eq("source", "profile")
    .limit(1);

  return !!(data && data.length > 0);
}

