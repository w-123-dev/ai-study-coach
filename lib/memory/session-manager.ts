import type { SupabaseClient } from "@supabase/supabase-js";
import { callDeepSeekChat } from "@/lib/deepseek";
import { addMemories } from "@/lib/memory/memory-manager";

// 会话超时时间：30 分钟无消息视为新会话
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
// 摘要生成阈值：累计 5 条消息后触发摘要
const SUMMARY_MESSAGE_THRESHOLD = 5;

export interface SessionInfo {
  id: string;
  user_id: string;
  session_start: string;
  session_end: string | null;
  session_type: string;
  message_count: number;
}

export interface SessionSummaryData {
  key_topics: string[];
  user_concerns: string[];
  ai_suggestions: string[];
  follow_up_asked: boolean;
  mood: "positive" | "neutral" | "negative" | "frustrated";
}

export interface ExtractedMemory {
  category: string;
  content: string;
  confidence: number;
}

/**
 * 获取当前活跃会话，如果没有则创建新会话
 * 如果上次会话已超时，自动结束它
 */
export async function getOrCreateSession(
  supabase: SupabaseClient,
  userId: string
): Promise<{ session: SessionInfo; isNew: boolean }> {
  // 查找最新的未结束会话
  const { data: latest } = await supabase
    .from("session_summaries")
    .select("*")
    .eq("user_id", userId)
    .order("session_start", { ascending: false })
    .limit(1);

  if (latest && latest.length > 0) {
    const last = latest[0] as SessionInfo;

    // 如果上一个会话已经结束，创建新会话
    if (last.session_end) {
      const newSession = await createSession(supabase, userId);
      return { session: newSession, isNew: true };
    }

    // 检查是否超时
    const lastMessageTime = new Date(last.session_start).getTime();
    // 使用 session_start 作为近似最后活动时间
    // 更准确的方式可以查询最后一条 chat_message 的时间
    const { data: lastMsg } = await supabase
      .from("chat_messages")
      .select("created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1);

    let lastActivity = lastMessageTime;
    if (lastMsg && lastMsg.length > 0) {
      lastActivity = new Date(lastMsg[0].created_at).getTime();
    }

    const elapsed = Date.now() - lastActivity;

    if (elapsed > SESSION_TIMEOUT_MS) {
      // 超时，结束旧会话，创建新会话
      await endSessionSilently(supabase, last.id, last.message_count);
      const newSession = await createSession(supabase, userId);
      return { session: newSession, isNew: true };
    }

    return { session: last as SessionInfo, isNew: false };
  }

  // 没有任何会话记录，创建新会话
  const newSession = await createSession(supabase, userId);
  return { session: newSession, isNew: true };
}

/**
 * 创建新会话
 */
async function createSession(
  supabase: SupabaseClient,
  userId: string
): Promise<SessionInfo> {
  const { data, error } = await supabase
    .from("session_summaries")
    .insert({
      user_id: userId,
      session_start: new Date().toISOString(),
      session_type: "chat",
      message_count: 0,
    })
    .select()
    .single();

  if (error) {
    console.error("[SessionManager] 创建会话失败:", error);
    throw new Error("创建会话失败");
  }

  return data as SessionInfo;
}

/**
 * 更新会话消息计数
 */
export async function incrementSessionMessageCount(
  supabase: SupabaseClient,
  sessionId: string
): Promise<void> {
  const { data: current } = await supabase
    .from("session_summaries")
    .select("message_count")
    .eq("id", sessionId)
    .single();

  if (!current) return;

  const newCount = (current.message_count as number) + 1;

  await supabase
    .from("session_summaries")
    .update({
      message_count: newCount,
      session_end: new Date().toISOString(), // 临时更新 end 为最新时间
    })
    .eq("id", sessionId);
}

/**
 * 判断是否需要生成摘要（达到消息阈值或超过指定时间）
 */
export async function shouldGenerateSummary(
  supabase: SupabaseClient,
  sessionId: string
): Promise<boolean> {
  const { data: session } = await supabase
    .from("session_summaries")
    .select("message_count, session_start")
    .eq("id", sessionId)
    .single();

  if (!session) return false;

  // 达到消息阈值
  if (session.message_count >= SUMMARY_MESSAGE_THRESHOLD) {
    return true;
  }

  // 超过 30 分钟
  const elapsed = Date.now() - new Date(session.session_start).getTime();
  if (elapsed > SESSION_TIMEOUT_MS && session.message_count >= 3) {
    return true;
  }

  return false;
}

/**
 * 生成会话摘要（调用 DeepSeek 分析对话）
 */
export async function generateSessionSummary(
  supabase: SupabaseClient,
  sessionId: string,
  userId: string,
  messages: { role: string; content: string }[]
): Promise<void> {
  if (messages.length < 2) return;

  try {
    // 只取用户消息和 AI 回复，去掉 system prompt
    const dialogMessages = messages.filter((m) => m.role !== "system");

    // 构建 AI 分析 prompt
    const dialogText = dialogMessages
      .map((m) => `[${m.role === "user" ? "用户" : "AI教练"}]: ${m.content}`)
      .join("\n\n");

    const analysisPrompt = [
      {
        role: "system" as const,
        content:
          "你是一个专业的考研教练记忆分析器。请分析以下对话，提取关键信息。\n" +
          "输出严格的 JSON 格式，不要包含任何其他文字。",
      },
      {
        role: "user" as const,
        content: `请分析以下考研教练与学生的对话，输出 JSON：\n\n${dialogText}\n\n` +
          "输出格式：\n" +
          `{
  "summary": {
    "key_topics": ["学生提问/讨论的主要话题"],
    "user_concerns": ["学生表达的担忧或困难"],
    "ai_suggestions": ["教练给出的建议摘要"],
    "follow_up_asked": true/false,
    "mood": "positive|neutral|negative|frustrated"
  },
  "memories": [
    {
      "category": "goal|habit|weakness|strength|personality|preference|concern|progress",
      "content": "具体的记忆内容描述",
      "confidence": 1-10
    }
  ]
}`,
      },
    ];

    const result = await callDeepSeekChat(analysisPrompt, {
      temperature: 0.3,
      maxTokens: 1024,
    });

    // 解析 AI 返回的 JSON
    const cleanJson = result
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim();

    const parsed = JSON.parse(cleanJson);

    const summaryData: SessionSummaryData = parsed.summary ?? {};
    const memories: ExtractedMemory[] = parsed.memories ?? [];

    // 更新会话摘要
    const { error: updateError } = await supabase
      .from("session_summaries")
      .update({
        session_end: new Date().toISOString(),
        key_topics: summaryData.key_topics ?? [],
        user_concerns: summaryData.user_concerns ?? [],
        ai_suggestions: summaryData.ai_suggestions ?? [],
        follow_up_asked: summaryData.follow_up_asked ?? false,
        mood: summaryData.mood ?? "neutral",
      })
      .eq("id", sessionId);

    if (updateError) {
      console.error("[SessionManager] 更新摘要失败:", updateError);
    }

    // 提取用户记忆
    if (memories.length > 0) {
      const memoryRecords = memories.map((m) => ({
        category: m.category as any,
        content: m.content,
        confidence: Math.min(Math.max(m.confidence ?? 5, 1), 10),
        source: "chat",
      }));

      await addMemories(supabase, userId, memoryRecords);
    }
  } catch (error) {
    console.error("[SessionManager] 生成摘要时出错:", error);
  }
}

/**
 * 静默结束会话（不使用 AI 分析，用于超时场景）
 */
async function endSessionSilently(
  supabase: SupabaseClient,
  sessionId: string,
  messageCount: number
): Promise<void> {
  await supabase
    .from("session_summaries")
    .update({
      session_end: new Date().toISOString(),
      message_count: messageCount,
    })
    .eq("id", sessionId);
}
