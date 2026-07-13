/**
 * 伙伴记忆系统
 *
 * 小伴会记得用户提到过的事情。
 * 记忆不是为了分析用户，而是让对话有"你记得我"的感觉。
 */

import { createClient } from "@/lib/supabase";
import { callDeepSeek } from "@/lib/deepseek";
import type { PartnerMemory, MemoryCategory, MemoryExtract } from "./personality";

/** 获取最近激活的记忆（按重要性和时间排序） */
export async function getRecentMemories(
  userId: string,
  limit: number = 5
): Promise<PartnerMemory[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("partner_memories")
    .select("*")
    .eq("user_id", userId)
    .order("importance", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

/**
 * 获取一条随机的旧记忆（14天以上、重要性>=3）
 * 用于伙伴"突然想起"某件事
 */
export async function getRandomOldMemory(
  userId: string
): Promise<PartnerMemory | null> {
  const supabase = createClient();
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

  const { data, error } = await supabase
    .from("partner_memories")
    .select("*")
    .eq("user_id", userId)
    .gte("importance", 3)
    .lt("created_at", fourteenDaysAgo.toISOString())
    .order("last_recalled_at", { ascending: true, nullsFirst: true })
    .limit(10);

  if (error || !data || data.length === 0) return null;

  // 随机选一条
  const picked = data[Math.floor(Math.random() * data.length)];

  // 更新回忆时间
  await supabase
    .from("partner_memories")
    .update({ last_recalled_at: new Date().toISOString() })
    .eq("id", picked.id);

  return picked;
}

/**
 * 获取一条重要里程碑记忆
 * 专门搜索第一次事件：第一次焦虑、第一次完成连续学习等
 */
export async function getMilestoneMemory(
  userId: string
): Promise<PartnerMemory | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("partner_memories")
    .select("*")
    .eq("user_id", userId)
    .or(`content.ilike.%第一%,content.ilike.%首次%,content.ilike.%开始%`)
    .gte("importance", 3)
    .order("created_at", { ascending: true })
    .limit(3);

  if (error || !data || data.length === 0) return null;

  const picked = data[Math.floor(Math.random() * data.length)];

  await supabase
    .from("partner_memories")
    .update({ last_recalled_at: new Date().toISOString() })
    .eq("id", picked.id);

  return picked;
}

/**
 * 构建"突然想起"的记忆上下文
 * 不分析、不总结，只是像朋友一样突然提到
 */
export function formatOldMemoryRecall(memory: PartnerMemory): string {
  const daysAgo = Math.floor(
    (Date.now() - new Date(memory.created_at).getTime()) / 86400000
  );

  if (daysAgo >= 60) {
    return `（突然想起）${Math.floor(daysAgo / 30)}个月前你好像说过${memory.content}`;
  }
  if (daysAgo >= 30) {
    return `（突然想起）一个月前你好像说过${memory.content}`;
  }
  return `（突然想起）${daysAgo}天前你好像说过${memory.content}`;
}

/** 格式化记忆为文字 */
export function formatMemories(memories: PartnerMemory[]): string {
  if (!memories.length) return "";
  return memories
    .map((m) => `- ${m.content}`)
    .join("\n");
}

/**
 * 从用户消息中提取记忆
 */
export async function extractMemoriesFromMessage(
  userId: string,
  message: string,
  recentContext: string
): Promise<void> {
  const prompt = `你是一个观察者功能。从以下对话中，判断是否有值得"记住"的信息。
对话上下文：${recentContext}
用户说：${message}

规则：
1. 只有用户明确提到的、且对长期陪伴有用的信息才值得记住
2. 不要记住日常寒暄（"你好""在吗"）
3. 值得记住的类型：
   - 用户表达情绪（"好累""有点焦虑"）
   - 某科很难（"数学看不懂"）
   - 用户习惯（"我一般晚上学"）
   - 重要事件（"下周期中考"）
   - 第一次事件（"第一次连续学习三天""第一次做完一套题"）
4. 每条记忆 1-10 个字，简洁
5. 对于第一次/重要的时刻，importance 给 4-5
6. 如果没什么值得记住的，返回 {"memories":[]}

返回严格 JSON 格式：
{"memories":[{"category":"feeling|subject|habit|event|preference","content":"记忆内容","importance":1}]}`;

  try {
    const result = await callDeepSeek(prompt, {
      systemPrompt: "你是记忆提取器。只返回 JSON。",
      temperature: 0.3,
      maxTokens: 500,
    });

    const cleaned = result.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    const extracted: MemoryExtract = JSON.parse(cleaned);

    if (!extracted.memories || extracted.memories.length === 0) return;

    const supabase = createClient();
    const records = extracted.memories.map((m) => ({
      user_id: userId,
      category: m.category,
      content: m.content,
      source: message,
      importance: m.importance,
    }));

    const { error } = await supabase.from("partner_memories").insert(records);
    if (error) console.warn("[PartnerMemory] 保存记忆失败:", error);
  } catch (e) {
    console.warn("[PartnerMemory] 提取记忆失败:", e);
  }
}

/**
 * 清理过期记忆
 * 只清理低重要性（1-2）且超过30天的记忆
 * 高重要性（3-5）的记忆永久保留
 */
export async function cleanupOldMemories(userId: string): Promise<void> {
  const supabase = createClient();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // 只删除低重要性的旧记忆
  const { error } = await supabase
    .from("partner_memories")
    .delete()
    .eq("user_id", userId)
    .lt("importance", 3)
    .lt("created_at", thirtyDaysAgo.toISOString());

  if (error) console.warn("[PartnerMemory] 清理失败:", error);
}
