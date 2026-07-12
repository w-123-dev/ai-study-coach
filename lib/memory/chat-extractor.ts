import type { SupabaseClient } from "@supabase/supabase-js";
import { callDeepSeekChat } from "@/lib/deepseek";
import { addMemories, reinforceMemory, findSimilarMemory, getActiveMemories } from "@/lib/memory/memory-manager";
import type { MemoryCategory, MemoryExtraction } from "@/lib/types";

/**
 * 聊天记忆提取器
 * AI 回复后自动分析对话，提取用户信息
 */
export async function extractMemoriesFromChat(
  supabase: SupabaseClient,
  userId: string,
  userMessage: string,
  aiReply: string
): Promise<void> {
  if (userMessage.length < 5) return;

  try {
    const extraction = await analyzeConversation(userMessage, aiReply);
    if (extraction.memories.length > 0) {
      await saveExtractedMemories(supabase, userId, extraction);
    }
    if (extraction.stateChange.detected) {
      await reinforceRelatedMemories(supabase, userId, extraction.stateChange.description);
    }
  } catch (error) {
    console.error("[ChatExtractor] 提取记忆失败:", error);
  }
}

async function analyzeConversation(
  userMessage: string,
  aiReply: string
): Promise<MemoryExtraction> {
  const systemPrompt = `你是一个考研教练的记忆分析系统。
分析用户最新的一条消息和AI的回复，提取需要记住的用户信息。

提取规则：
1. 只提取明确的、有长期价值的信息
2. 不要提取问候语、寒暄、简单问答
3. 如果有新的目标、困难、习惯变化，必须记录
4. 如果用户表达了情绪变化，记录到stateChange
5. confidence 1-10，根据信息的确定性打分

类别说明：
- goal: 考研目标、院校、专业
- habit: 学习习惯、时间安排、作息
- weakness: 薄弱科目、困难点
- strength: 优势科目、擅长领域
- personality: 性格特点、学习风格
- preference: 偏好、不喜欢的方式
- concern: 焦虑、担心、压力
- progress: 进展、里程碑

返回格式（纯JSON，不要markdown）：
{
  "memories": [
    { "category": "goal", "content": "目标内容", "confidence": 8 }
  ],
  "stateChange": {
    "detected": false,
    "description": ""
  }
}`;

  const result = await callDeepSeekChat(
    [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
      { role: "assistant", content: aiReply },
    ],
    { temperature: 0.3, maxTokens: 512 }
  );

  try {
    const cleaned = result.replace(/^\`\`\`json?\s*/, "").replace(/\`\`\`\s*$/, "").trim();
    return JSON.parse(cleaned) as MemoryExtraction;
  } catch {
    console.warn("[ChatExtractor] 解析AI返回失败:", result.slice(0, 100));
    return { memories: [], stateChange: { detected: false, description: "" } };
  }
}

async function saveExtractedMemories(
  supabase: SupabaseClient,
  userId: string,
  extraction: MemoryExtraction
): Promise<void> {
  const newMemories: {
    category: MemoryCategory | "goal" | "progress";
    content: string;
    confidence: number;
    source: string;
  }[] = [];

  for (const mem of extraction.memories) {
    const keywords = mem.content.split("");
    const existing = await findSimilarMemory(supabase, userId, mem.category, keywords);

    if (existing) {
      await reinforceMemory(supabase, existing.id, 1);
    } else {
      newMemories.push({
        category: mem.category,
        content: mem.content,
        confidence: Math.min(Math.max(mem.confidence ?? 5, 1), 10),
        source: "chat",
      });
    }
  }

  if (newMemories.length > 0) {
    await addMemories(supabase, userId, newMemories);
  }
}

async function reinforceRelatedMemories(
  supabase: SupabaseClient,
  userId: string,
  _description: string
): Promise<void> {
  const memories = await getActiveMemories(supabase, userId);
  const recentThreshold = Date.now() - 24 * 60 * 60 * 1000;
  for (const mem of memories) {
    const createdAt = new Date(mem.created_at).getTime();
    if (createdAt > recentThreshold) {
      await reinforceMemory(supabase, mem.id, 1);
    }
  }
}
