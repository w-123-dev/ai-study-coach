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

/** 格式化记忆为文字 */
export function formatMemories(memories: PartnerMemory[]): string {
  if (!memories.length) return "";
  return memories
    .map((m) => `- ${m.content}`)
    .join("\n");
}

/**
 * 从用户消息中提取记忆
 * 用 AI 识别应该记住的信息
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
4. 每条记忆 1-10 个字，简洁
5. 如果没什么值得记住的，返回 {"memories":[]}

返回严格 JSON 格式：
{"memories":[{"category":"feeling|subject|habit|event|preference","content":"记忆内容","importance":1}]}`;

  try {
    const result = await callDeepSeek(prompt, {
      systemPrompt: "你是记忆提取器。只返回 JSON。",
      temperature: 0.3,
      maxTokens: 500,
    });

    // 解析 JSON
    const cleaned = result.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    const extracted: MemoryExtract = JSON.parse(cleaned);

    if (!extracted.memories || extracted.memories.length === 0) return;

    // 保存到数据库
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
    // 记忆提取失败不应该影响主流程
    console.warn("[PartnerMemory] 提取记忆失败:", e);
  }
}

/**
 * 清理过期记忆
 * 仅保留最近30天的记忆
 */
export async function cleanupOldMemories(userId: string): Promise<void> {
  const supabase = createClient();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { error } = await supabase
    .from("partner_memories")
    .delete()
    .eq("user_id", userId)
    .lt("created_at", thirtyDaysAgo.toISOString());

  if (error) console.warn("[PartnerMemory] 清理失败:", error);
}
