/**
 * 伙伴学习空间 — 服务层
 *
 * 用于计算用户的学习痕迹数据并持久化。
 * 数据来源：plan_tasks, focus_sessions, daily_checkins
 * 物品变化非常缓慢，无任何奖励/解锁表达。
 */

import { createClient } from "@/lib/supabase";

// ===== 类型定义 =====

export interface PartnerSpace {
  id: string;
  user_id: string;
  book_count: number;
  coffee_count: number;
  plant_stage: number;
  note_count: number;
  updated_at: string;
  created_at: string;
}

export type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

// ===== 查询函数 =====

/** 获取当前空间，不存在则创建默认 */
export async function getOrCreateSpace(userId: string): Promise<PartnerSpace | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("partner_space")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code === "PGRST116") {
    // 不存在则创建
    const { data: newSpace, error: createError } = await supabase
      .from("partner_space")
      .insert({ user_id: userId })
      .select()
      .single();

    if (createError) {
      console.warn("[PartnerSpace] 创建失败:", createError);
      return null;
    }
    return newSpace;
  }

  if (error) {
    console.warn("[PartnerSpace] 查询失败:", error);
    return null;
  }

  return data;
}

/**
 * 根据用户真实学习数据自动计算空间状态
 * 在用户打卡、完成专注、完成任务后调用
 */
export async function recalculateSpace(userId: string): Promise<PartnerSpace | null> {
  const supabase = createClient();

  // 1. 计算书本数量：每完成 5 个任务 +1 本书
  const { count: completedTasks } = await supabase
    .from("plan_tasks")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("status", "completed");

  const bookCount = completedTasks ? Math.min(Math.floor(completedTasks / 5), 15) : 0;

  // 2. 计算咖啡杯：每完成 5 次专注 +1 杯，最多 3 杯
  const { count: focusSessions } = await supabase
    .from("focus_sessions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("completed", true);

  const coffeeCount = focusSessions ? Math.min(Math.floor(focusSessions / 5), 3) : 0;

  // 3. 计算植物阶段：根据最大连续打卡天数
  const { data: checkins } = await supabase
    .from("daily_checkins")
    .select("checkin_date")
    .eq("user_id", userId)
    .order("checkin_date", { ascending: false });

  let maxStreak = 0;
  if (checkins && checkins.length > 0) {
    // 计算最大连续天数
    const dates = [...new Set(checkins.map((c) => c.checkin_date))].sort().reverse();
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < dates.length; i++) {
      const expected = new Date(currentDate);
      expected.setDate(expected.getDate() - i);
      const expectedStr = expected.toISOString().split("T")[0];
      if (dates[i] === expectedStr) {
        streak++;
      } else {
        break;
      }
    }
    maxStreak = streak;
  }

  let plantStage = 0;
  if (maxStreak >= 60) plantStage = 4;
  else if (maxStreak >= 30) plantStage = 3;
  else if (maxStreak >= 14) plantStage = 2;
  else if (maxStreak >= 7) plantStage = 1;

  // 4. 计算便利贴数量：每次打卡填困难 +1 张，最多 10 张
  const { count: checkinsWithNotes } = await supabase
    .from("daily_checkins")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .neq("difficulties", "")
    .not("difficulties", "is", null);

  const noteCount = checkinsWithNotes ? Math.min(checkinsWithNotes, 10) : 0;

  // 5. 保存
  const { data: updated, error } = await supabase
    .from("partner_space")
    .upsert({
      user_id: userId,
      book_count: bookCount,
      coffee_count: coffeeCount,
      plant_stage: plantStage,
      note_count: noteCount,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.warn("[PartnerSpace] 更新失败:", error);
    return null;
  }

  return updated;
}

/** 获取当前时间分类 */
export function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  if (hour >= 18 && hour < 21) return "evening";
  return "night";
}
