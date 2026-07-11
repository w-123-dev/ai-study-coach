import type { SupabaseClient } from "@supabase/supabase-js";
import type { MemoryCategory } from "@/lib/types";

export interface MemoryRecord {
  id: string;
  user_id: string;
  category: MemoryCategory | "goal" | "progress";
  content: string;
  confidence: number;
  source: string;
  context_snapshot: Record<string, unknown>;
  last_reinforced_at: string;
  expires_at: string | null;
  created_at: string;
}

export type MemoryCategoryAll = MemoryCategory | "goal" | "progress";

const CATEGORIES: MemoryCategoryAll[] = [
  "goal", "habit", "weakness", "strength",
  "personality", "preference", "concern", "progress",
];

/**
 * 获取用户拥有的活跃记忆（未过期）
 */
export async function getActiveMemories(
  supabase: SupabaseClient,
  userId: string
): Promise<MemoryRecord[]> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("user_memories")
    .select("*")
    .eq("user_id", userId)
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .order("confidence", { ascending: false })
    .order("last_reinforced_at", { ascending: false });

  if (error) {
    console.error("[MemoryManager] 获取记忆失败:", error);
    return [];
  }

  return (data ?? []) as MemoryRecord[];
}

/**
 * 按类别获取记忆
 */
export async function getMemoriesByCategory(
  supabase: SupabaseClient,
  userId: string,
  category: MemoryCategoryAll
): Promise<MemoryRecord[]> {
  const { data, error } = await supabase
    .from("user_memories")
    .select("*")
    .eq("user_id", userId)
    .eq("category", category)
    .order("confidence", { ascending: false });

  if (error) {
    console.error(`[MemoryManager] 获取 ${category} 记忆失败:`, error);
    return [];
  }

  return (data ?? []) as MemoryRecord[];
}

/**
 * 添加一条记忆
 */
export async function addMemory(
  supabase: SupabaseClient,
  userId: string,
  category: MemoryCategoryAll,
  content: string,
  options?: {
    confidence?: number;
    source?: string;
    contextSnapshot?: Record<string, unknown>;
    expiresAt?: string;
  }
): Promise<MemoryRecord | null> {
  const { data, error } = await supabase
    .from("user_memories")
    .insert({
      user_id: userId,
      category,
      content,
      confidence: options?.confidence ?? 5,
      source: options?.source ?? "system",
      context_snapshot: options?.contextSnapshot ?? {},
      expires_at: options?.expiresAt ?? null,
    })
    .select()
    .single();

  if (error) {
    console.error("[MemoryManager] 添加记忆失败:", error);
    return null;
  }

  return data as MemoryRecord;
}

/**
 * 批量添加记忆（原子操作）
 */
export async function addMemories(
  supabase: SupabaseClient,
  userId: string,
  memories: {
    category: MemoryCategoryAll;
    content: string;
    confidence?: number;
    source?: string;
  }[]
): Promise<number> {
  const records = memories.map((m) => ({
    user_id: userId,
    category: m.category,
    content: m.content,
    confidence: m.confidence ?? 5,
    source: m.source ?? "system",
  }));

  const { error } = await supabase.from("user_memories").insert(records);

  if (error) {
    console.error("[MemoryManager] 批量添加记忆失败:", error);
    return 0;
  }

  return records.length;
}

/**
 * 强化记忆（增加 confidence，更新 last_reinforced_at）
 * 用于当用户在后续对话中确认或重复了相同的信息
 */
export async function reinforceMemory(
  supabase: SupabaseClient,
  memoryId: string,
  increment: number = 1
): Promise<boolean> {
  // 先读取当前值
  const { data: current } = await supabase
    .from("user_memories")
    .select("confidence")
    .eq("id", memoryId)
    .single();

  if (!current) return false;

  const newConfidence = Math.min((current.confidence as number) + increment, 10);

  const { error } = await supabase
    .from("user_memories")
    .update({
      confidence: newConfidence,
      last_reinforced_at: new Date().toISOString(),
    })
    .eq("id", memoryId);

  if (error) {
    console.error("[MemoryManager] 强化记忆失败:", error);
    return false;
  }

  return true;
}

/**
 * 查找相似记忆（防止重复添加）
 */
export async function findSimilarMemory(
  supabase: SupabaseClient,
  userId: string,
  category: MemoryCategoryAll,
  contentKeywords: string[]
): Promise<MemoryRecord | null> {
  // 通过 content 关键词模糊匹配
  const { data } = await supabase
    .from("user_memories")
    .select("*")
    .eq("user_id", userId)
    .eq("category", category);

  if (!data) return null;

  const records = data as MemoryRecord[];

  // 简单的关键词匹配
  for (const record of records) {
    const matchCount = contentKeywords.filter((kw) =>
      record.content.includes(kw)
    ).length;
    if (matchCount >= 2) {
      return record;
    }
  }

  return null;
}

/**
 * 清理低置信度的过期记忆
 */
export async function cleanExpiredMemories(
  supabase: SupabaseClient,
  userId: string
): Promise<number> {
  const now = new Date().toISOString();
  const { error } = await supabase
    .from("user_memories")
    .delete()
    .eq("user_id", userId)
    .lt("confidence", 3) // 置信度低于3
    .lt("last_reinforced_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()); // 30天未强化

  if (error) {
    console.error("[MemoryManager] 清理记忆失败:", error);
    return 0;
  }

  return 0;
}

/**
 * 获取当前用户的全局上下文摘要
 * 用于 AI prompt 注入
 */
export async function buildMemorySummary(
  supabase: SupabaseClient,
  userId: string
): Promise<string> {
  const memories = await getActiveMemories(supabase, userId);

  if (memories.length === 0) return "";

  const grouped: Record<string, string[]> = {};
  for (const m of memories) {
    if (!grouped[m.category]) grouped[m.category] = [];
    grouped[m.category].push(m.content);
  }

  const parts: string[] = [];
  for (const cat of CATEGORIES) {
    if (grouped[cat] && grouped[cat].length > 0) {
      const label = CATEGORY_LABEL[cat] ?? cat;
      parts.push(`【${label}】${grouped[cat].join("；")}`);
    }
  }

  return parts.join("\n");
}

const CATEGORY_LABEL: Record<string, string> = {
  goal: "考研目标",
  habit: "学习习惯",
  weakness: "薄弱环节",
  strength: "优势科目",
  personality: "性格特点",
  preference: "偏好",
  concern: "关注/焦虑",
  progress: "学习进展",
};
