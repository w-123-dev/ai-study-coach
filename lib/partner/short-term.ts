/**
 * 伙伴短期关怀记忆
 *
 * 让伙伴记住昨天用户说过的话，今天优先问候。
 * 不要主动分析数据，更像朋友自然记住。
 *
 * "昨天你最后说：感冒了"
 * "今天："身体恢复一点了吗？"
 */

import { createClient } from "@/lib/supabase";

/**
 * 判断是否是新的一天（与上次交互相比）
 */
export function isNewDay(lastInteractionAt: string | null): boolean {
  if (!lastInteractionAt) return false;

  const lastDate = new Date(lastInteractionAt);
  const today = new Date();

  return (
    lastDate.getDate() !== today.getDate() ||
    lastDate.getMonth() !== today.getMonth() ||
    lastDate.getFullYear() !== today.getFullYear()
  );
}

/**
 * 判断 last_message_date 是否等于昨天
 */
function isYesterdayStored(lastMessageDate: string | null): boolean {
  if (!lastMessageDate) return false;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yStr = yesterday.toISOString().split("T")[0];
  return lastMessageDate === yStr;
}

/**
 * 保存用户最后一条消息（每次互动后调用）
 */
export async function saveLastMessage(
  userId: string,
  message: string
): Promise<void> {
  const supabase = createClient();
  const today = new Date().toISOString().split("T")[0];

  const { error } = await supabase
    .from("user_partner")
    .update({
      last_user_message: message.slice(0, 100),
      last_message_date: today,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  if (error) {
    console.warn("[ShortTermMemory] 保存失败:", error);
  }
}

/**
 * 构建"昨日关怀"上下文
 *
 * 如果是新的一天且昨天有最后消息：
 *   "昨天你最后说过：xxx"
 *
 * 否则返回空字符串
 */
export async function buildYesterdayCareContext(
  userId: string,
  lastInteractionAt: string | null
): Promise<string> {
  if (!isNewDay(lastInteractionAt)) return "";

  const supabase = createClient();
  const { data: partner } = await supabase
    .from("user_partner")
    .select("last_user_message, last_message_date")
    .eq("user_id", userId)
    .single();

  if (!partner?.last_user_message || !isYesterdayStored(partner.last_message_date)) {
    return "";
  }

  const brief =
    partner.last_user_message.length > 60
      ? partner.last_user_message.slice(0, 60) + "…"
      : partner.last_user_message;

  return `昨天你最后说过：${brief}`;
}

/**
 * 获取今日初始问候的关怀上下文（更简短版本，用于首次聊天）
 */
export async function getMorningCareContext(
  userId: string,
  lastInteractionAt: string | null
): Promise<string> {
  if (!isNewDay(lastInteractionAt)) return "";

  const supabase = createClient();
  const { data: partner } = await supabase
    .from("user_partner")
    .select("last_user_message, last_message_date")
    .eq("user_id", userId)
    .single();

  if (!partner?.last_user_message || !isYesterdayStored(partner.last_message_date)) {
    return "";
  }

  const brief =
    partner.last_user_message.length > 30
      ? partner.last_user_message.slice(0, 30) + "…"
      : partner.last_user_message;

  return brief;
}
