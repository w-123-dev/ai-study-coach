import { NextRequest } from "next/server";
import { withAuth, getStudentProfile, safeParseJSON, requireFields } from "@/lib/api-utils";
import { callDeepSeekChat } from "@/lib/deepseek";
import { buildChatSystemPrompt } from "@/lib/prompts";
import { buildFullContext } from "@/lib/memory/context-builder";
import {
  getOrCreateSession,
  incrementSessionMessageCount,
  shouldGenerateSummary,
  generateSessionSummary,
} from "@/lib/memory/session-manager";
import { extractMemoriesFromChat } from "@/lib/memory/chat-extractor";

export const POST = withAuth(async (request, { user, supabase }) => {
  const body = await safeParseJSON<{ message?: string }>(request, {});

  const missing = requireFields(body, ["message"]);
  if (missing) {
    return { error: missing, _status: 400 };
  }

  const message = (body.message ?? "").trim();
  if (!message) {
    return { error: "消息不能为空", _status: 400 };
  }

  // 1. 保存用户消息
  await supabase.from("chat_messages").insert({
    user_id: user.id,
    role: "user",
    content: message,
  });

  // 2. 读取用户资料
  const { data: profile } = await getStudentProfile(supabase, user.id);
  if (!profile) {
    return { error: "请先填写考研信息", _status: 400 };
  }

  // 3. 读取 AI 记忆上下文（长期记忆 + 近期快照 + 上次会话）
  const memoryContext = await buildFullContext(supabase, user.id);

  // 4. 构建增强版 system prompt（带记忆注入）
  const systemPrompt = buildChatSystemPrompt(profile, memoryContext);

  // 5. 读取最近聊天记录
  const { data: recentMessages } = await supabase
    .from("chat_messages")
    .select("role, content")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  // 6. 构建完整消息列表
  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: systemPrompt },
  ];

  if (recentMessages && recentMessages.length > 0) {
    const history = recentMessages.reverse();
    for (const msg of history) {
      messages.push({ role: msg.role, content: msg.content });
    }
  }

  // 7. 调用 DeepSeek（带超时和重试）
  const reply = await callDeepSeekChat(messages);

  // 8. 保存 AI 回复
  await supabase.from("chat_messages").insert({
    user_id: user.id,
    role: "assistant",
    content: reply,
  });

  // 9. 会话追踪（异步，不阻塞回复）
  trackSessionAfterChat(supabase, user.id, messages, reply).catch((e) =>
    console.error("[SessionTrack] 追踪会话失败:", e)
  );

  return { reply };
});

/**
 * 会话追踪：获取/创建会话 → 更新计数 → 按需生成摘要
 */
async function trackSessionAfterChat(
  supabase: ReturnType<typeof import("@/lib/supabase-server").createClient>["supabase"],
  userId: string,
  messages: { role: string; content: string }[],
  _reply: string
): Promise<void> {
  const { session, isNew } = await getOrCreateSession(supabase, userId);

  // 更新消息计数
  await incrementSessionMessageCount(supabase, session.id);

  // 判断是否需要生成摘要
  if (isNew && session.message_count < 2) {
    // 新会话且消息还很少，暂不生成摘要
    return;
  }

  const shouldSummarize = await shouldGenerateSummary(supabase, session.id);
  if (!shouldSummarize) return;

  // 获取该会话期间的所有消息
  const { data: sessionMessages } = await supabase
    .from("chat_messages")
    .select("role, content, created_at")
    .eq("user_id", userId)
    .gte("created_at", session.session_start)
    .order("created_at", { ascending: true });

  if (sessionMessages && sessionMessages.length >= 2) {
    await generateSessionSummary(
      supabase,
      session.id,
      userId,
      sessionMessages as { role: string; content: string }[]
    );
  }
}
