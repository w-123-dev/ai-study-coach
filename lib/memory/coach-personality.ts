import type { SupabaseClient } from "@supabase/supabase-js";
import type { CoachMode, CoachConfig } from "@/lib/types";
import { COACH_MODE_LABELS, COACH_MODE_DESCRIPTIONS } from "@/lib/types";

/**
 * 教练人格系统
 * 不同教练模式的 Prompt 指令
 */

const COACH_MODE_INSTRUCTIONS: Record<CoachMode, string> = {
  strict:
    "你是一个严格监督型教练。\n" +
    "1. 语气坚定，不纵容拖延\n" +
    "2. 每天检查任务完成情况\n" +
    "3. 未完成任务要有惩罚感（增加任务）\n" +
    "4. 强调考研的紧迫性和竞争\n" +
    "5. 用数据说话，不留情面",
  gentle:
    "你是一个温和陪伴型教练。\n" +
    "1. 语气温暖，像朋友一样\n" +
    "2. 先肯定用户努力，再提改进\n" +
    "3. 关注用户情绪，适时鼓励\n" +
    "4. 不强硬催促，而是引导\n" +
    "5. 让用户感觉被理解和支持",
  analytic:
    "你是一个数据分析型教练。\n" +
    "1. 用数据和趋势说话\n" +
    "2. 分析学习效率、完成率变化\n" +
    "3. 给出基于统计的优化建议\n" +
    "4. 不关注情绪，只关注效果\n" +
    "5. 用图表思维分析学习问题",
  sprint:
    "你是一个冲刺强化型教练。\n" +
    "1. 高强度、高密度\n" +
    "2. 每天计划排满，不留空闲\n" +
    "3. 强调极限状态下突破\n" +
    "4. 减少休息，增加专注时间\n" +
    "5. 用语简短有力，不拖泥带水",
};

export async function getCoachConfig(
  supabase: SupabaseClient,
  userId: string
): Promise<CoachConfig> {
  const defaultConfig: CoachConfig = {
    mode: "gentle",
    autoAdjusted: false,
    lastAdjustReason: "",
    updatedAt: new Date().toISOString(),
  };

  try {
    const { data: preference } = await supabase
      .from("user_memories")
      .select("content")
      .eq("user_id", userId)
      .eq("category", "preference")
      .eq("source", "coach_mode")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (preference?.content) {
      defaultConfig.mode = preference.content as CoachMode;
    } else {
      const suggested = await autoSuggestCoachMode(supabase, userId);
      defaultConfig.mode = suggested.mode;
      defaultConfig.autoAdjusted = true;
      defaultConfig.lastAdjustReason = suggested.reason;
    }
  } catch {
  }

  return defaultConfig;
}

export async function setCoachMode(
  supabase: SupabaseClient,
  userId: string,
  mode: CoachMode
): Promise<void> {
  await supabase
    .from("user_memories")
    .delete()
    .eq("user_id", userId)
    .eq("category", "preference")
    .eq("source", "coach_mode");

  await supabase.from("user_memories").insert({
    user_id: userId,
    category: "preference",
    content: mode,
    confidence: 10,
    source: "coach_mode",
  });
}

export async function autoSuggestCoachMode(
  supabase: SupabaseClient,
  userId: string
): Promise<{ mode: CoachMode; reason: string }> {
  const today = new Date().toISOString().split("T")[0];
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const { data: recentSnapshots } = await supabase
    .from("daily_snapshots")
    .select("completion_rate, total_hours, emotion, energy")
    .eq("user_id", userId)
    .gte("date", sevenDaysAgo)
    .lte("date", today)
    .order("date", { ascending: false })
    .limit(7);

  if (!recentSnapshots || recentSnapshots.length === 0) {
    return { mode: "gentle", reason: "新用户，默认温和陪伴" };
  }

  const avgCompletion =
    recentSnapshots.reduce((s, r) => s + (r.completion_rate || 0), 0) / recentSnapshots.length;
  const avgHours =
    recentSnapshots.reduce((s, r) => s + (r.total_hours || 0), 0) / recentSnapshots.length;
  const lowEnergyDays = recentSnapshots.filter((r) => r.energy === "low").length;
  const anxiousDays = recentSnapshots.filter((r) => r.emotion === "anxious").length;

  if (avgCompletion < 40 && avgHours < 3 && lowEnergyDays >= 3) {
    return { mode: "gentle", reason: "完成率低且精力不足，需要鼓励陪伴" };
  }
  if (avgCompletion < 50 && avgHours < 4) {
    return { mode: "strict", reason: "完成率持续偏低，需要严格督促" };
  }
  if (avgCompletion >= 80 && avgHours >= 6) {
    return { mode: "sprint", reason: "状态良好，可以进入冲刺模式" };
  }
  if (anxiousDays >= 3) {
    return { mode: "gentle", reason: "焦虑天数较多，需要温和陪伴" };
  }
  if (recentSnapshots.length >= 5) {
    return { mode: "analytic", reason: "已有足够数据，适合数据分析" };
  }
  return { mode: "gentle", reason: "默认推荐" };
}

export function buildCoachModePrompt(config: CoachConfig): string {
  const label = COACH_MODE_LABELS[config.mode];
  const desc = COACH_MODE_DESCRIPTIONS[config.mode];
  const instruction = COACH_MODE_INSTRUCTIONS[config.mode];

  return (
    "\n\n===== 教练人格 =====\n" +
    "当前教练：" + label + " - " + desc + "\n" +
    instruction + "\n" +
    "===== 请按照以上人格特质回复 ====="
  );
}
