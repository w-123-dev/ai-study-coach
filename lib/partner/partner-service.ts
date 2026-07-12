import { createClient } from "@/lib/supabase";
import type { UserPartner, PartnerMood, FocusSession } from "./types";
import { calculateLevel } from "./types";

/** 获取伙伴状态，如果没有则自动创建 */
export async function getPartner(userId: string): Promise<UserPartner | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("user_partner")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code === "PGRST116") {
    return null;
  }
  if (error) throw error;
  return data;
}

/** 创建新伙伴 */
export async function createPartner(userId: string, name = "小伴"): Promise<UserPartner> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("user_partner")
    .insert({
      user_id: userId,
      name,
      level: 1,
      exp: 0,
      connection: 0,
      mood: "calm",
      energy: 80,
      total_focus_minutes: 0,
      total_study_days: 0,
      longest_streak: 0,
      current_streak: 0,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** 获取或创建伙伴 */
export async function getOrCreatePartner(userId: string, name?: string): Promise<UserPartner> {
  const existing = await getPartner(userId);
  if (existing) return existing;
  return createPartner(userId, name);
}

/** 更新伙伴状态 */
async function updatePartner(userId: string, updates: Partial<UserPartner>): Promise<UserPartner> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("user_partner")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** 完成任务时增加经验 */
export async function onTaskCompleted(userId: string): Promise<UserPartner> {
  const partner = await getOrCreatePartner(userId);
  const newExp = partner.exp + 20;

  const { level } = calculateLevel(newExp);
  const mood: PartnerMood = "happy";
  const energy = Math.min(100, partner.energy + 5);

  return updatePartner(userId, {
    exp: newExp,
    level,
    mood,
    energy,
  });
}

/** 完成一次打卡时 */
export async function onCheckinCompleted(userId: string): Promise<UserPartner> {
  const partner = await getOrCreatePartner(userId);
  const newExp = partner.exp + 30;
  const { level } = calculateLevel(newExp);
  const connection = Math.min(100, partner.connection + 3);

  return updatePartner(userId, {
    exp: newExp,
    level,
    connection,
    mood: "happy",
  });
}

/** 每日初始化（凌晨更新） */
export async function onNewDay(userId: string): Promise<UserPartner> {
  const partner = await getOrCreatePartner(userId);

  // 检查昨天是否有学习记录
  const supabase = createClient();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  const { count } = await supabase
    .from("daily_snapshots")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", yesterdayStr);

  const hasStudyYesterday = (count ?? 0) > 0;
  const newStreak = hasStudyYesterday ? partner.current_streak + 1 : 0;
  const longestStreak = Math.max(partner.longest_streak, newStreak);
  const totalStudyDays = hasStudyYesterday ? partner.total_study_days + 1 : partner.total_study_days;

  return updatePartner(userId, {
    current_streak: newStreak,
    longest_streak: longestStreak,
    total_study_days: totalStudyDays,
    energy: 80,
    mood: "calm",
  });
}

/** 开始专注 */
export async function startFocus(userId: string): Promise<{ partner: UserPartner; moodBefore: string }> {
  const partner = await getOrCreatePartner(userId);
  const moodBefore = partner.mood;

  const updated = await updatePartner(userId, {
    mood: "focused",
  });

  return { partner: updated, moodBefore };
}

/** 结束专注 */
export async function endFocus(
  userId: string,
  durationMinutes: number,
  completed: boolean
): Promise<{ partner: UserPartner; session: FocusSession }> {
  const partner = await getOrCreatePartner(userId);

  const expGain = Math.floor(durationMinutes / 5);
  const connectionGain = completed ? Math.floor(durationMinutes / 15) : 1;
  const energyDrop = Math.floor(durationMinutes / 5);

  const newExp = partner.exp + Math.max(expGain, 1);
  const { level } = calculateLevel(newExp);
  const newConnection = Math.min(100, partner.connection + connectionGain);
  const newEnergy = Math.max(0, partner.energy - energyDrop);
  const totalFocus = partner.total_focus_minutes + durationMinutes;
  const moodAfter: PartnerMood = completed ? "happy" : "calm";

  const supabase = createClient();

  // 创建专注记录
  const { data: session, error: sessionError } = await supabase
    .from("focus_sessions")
    .insert({
      user_id: userId,
      duration_minutes: durationMinutes,
      completed,
      partner_mood_before: partner.mood,
      partner_mood_after: moodAfter,
      completed_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (sessionError) throw sessionError;

  const updated = await updatePartner(userId, {
    exp: newExp,
    level,
    connection: newConnection,
    energy: newEnergy,
    mood: moodAfter,
    total_focus_minutes: totalFocus,
    last_interaction_at: new Date().toISOString(),
  });

  return { partner: updated, session };
}

/** 更新伙伴能量 */
export async function updateEnergy(userId: string, energy: number): Promise<UserPartner> {
  return updatePartner(userId, { energy: Math.max(0, Math.min(100, energy)) });
}

/** 更新认识程度（每次互动+1） */
export async function onInteraction(userId: string): Promise<UserPartner> {
  const partner = await getOrCreatePartner(userId);
  const connection = Math.min(100, partner.connection + 1);
  return updatePartner(userId, {
    connection,
    last_interaction_at: new Date().toISOString(),
    mood: partner.mood === "sleepy" ? "calm" : partner.mood,
  });
}
