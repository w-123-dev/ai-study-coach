import { createClient } from "@/lib/supabase";
import type { UserPartner, PartnerState, PartnerSkin, FocusSession } from "./types";

/** 获取伙伴，不存在则自动创建 */
export async function getPartner(userId: string): Promise<UserPartner | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("user_partner")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code === "PGRST116") return null;
  if (error) throw error;
  return data;
}

/** 创建新伙伴 */
export async function createPartner(userId: string, name?: string): Promise<UserPartner> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("user_partner")
    .insert({
      user_id: userId,
      name: name || "小伴",
      state: "calm",
      energy: 80,
      skin: "default",
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

/** 更新伙伴 */
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

/** 设置伙伴名称 */
export async function setPartnerName(userId: string, name: string): Promise<UserPartner> {
  return updatePartner(userId, { name });
}

/** 切换皮肤 */
export async function setPartnerSkin(userId: string, skin: PartnerSkin): Promise<UserPartner> {
  return updatePartner(userId, { skin });
}

/** 完成任务 -> happy */
export async function onTaskCompleted(userId: string): Promise<UserPartner> {
  return updatePartner(userId, { state: "happy" });
}

/** 完成打卡 -> happy */
export async function onCheckinCompleted(userId: string): Promise<UserPartner> {
  return updatePartner(userId, { state: "happy" });
}

/** 用户回来 -> happy greeting */
export async function onUserReturn(userId: string): Promise<UserPartner> {
  return updatePartner(userId, { state: "happy", last_interaction_at: new Date().toISOString() });
}

/** 开始专注 -> studying */
export async function startFocus(userId: string): Promise<{ partner: UserPartner; stateBefore: string }> {
  const partner = await getOrCreatePartner(userId);
  const stateBefore = partner.state;
  const updated = await updatePartner(userId, { state: "studying" });
  return { partner: updated, stateBefore };
}

/** 结束专注 -> happy(完成) / calm(中断) */
export async function endFocus(
  userId: string,
  durationMinutes: number,
  completed: boolean
): Promise<{ partner: UserPartner; session: FocusSession }> {
  const partner = await getOrCreatePartner(userId);
  const energyDrop = Math.floor(durationMinutes / 5);
  const newEnergy = Math.max(0, partner.energy - energyDrop);
  const stateAfter: PartnerState = completed ? "happy" : "calm";

  const supabase = createClient();

  const { data: session, error: sessionError } = await supabase
    .from("focus_sessions")
    .insert({
      user_id: userId,
      duration_minutes: durationMinutes,
      completed,
      partner_state_before: partner.state,
      partner_state_after: stateAfter,
      completed_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (sessionError) throw sessionError;

  const updated = await updatePartner(userId, {
    state: stateAfter,
    energy: newEnergy,
    last_interaction_at: new Date().toISOString(),
  });

  return { partner: updated, session };
}

/** 用户互动 */
export async function onInteraction(userId: string): Promise<UserPartner> {
  return updatePartner(userId, {
    last_interaction_at: new Date().toISOString(),
  });
}

/** 早晚情绪变化 */
export async function onTimeOfDay(userId: string): Promise<UserPartner> {
  const hour = new Date().getHours();
  const partner = await getOrCreatePartner(userId);
  // 晚10点后 -> resting
  if (hour >= 22 || hour < 6) {
    if (partner.state !== "resting") {
      return updatePartner(userId, { state: "resting" });
    }
  }
  // 早6-9点 -> calm
  if (hour >= 6 && hour < 9) {
    if (partner.state === "resting") {
      return updatePartner(userId, { state: "calm" });
    }
  }
  return partner;
}
