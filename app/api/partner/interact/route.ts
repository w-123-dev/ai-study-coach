import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/api-utils";
import { onInteraction, getOrCreatePartner } from "@/lib/partner/partner-service";
import { buildPartnerSystemPrompt } from "@/lib/partner/partner-prompt";
import { callDeepSeekChat } from "@/lib/deepseek";
import { getRecentMemories, extractMemoriesFromMessage } from "@/lib/partner/memory";
import type { PartnerState } from "@/lib/partner/types";

export const POST = withAuth(async (request, { user, supabase }) => {
  const { message } = await request.json();
  if (!message) {
    return { error: "message is required", _status: 400 };
  }

  const partner = await getOrCreatePartner(user.id);
  const state = partner.state as PartnerState;

  // 构建当前上下文
  const { data: snapshots } = await supabase
    .from("daily_snapshots")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .limit(3);

  const { data: profile } = await supabase
    .from("student_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const recentContext = buildContext(profile, snapshots);

  // 读取小伴的记忆
  const memories = await getRecentMemories(user.id, 5);

  // 构建人格 Prompt
  const systemPrompt = buildPartnerSystemPrompt({
    partnerName: partner.name,
    partnerState: state,
    memories,
    recentContext,
  });

  const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
    { role: "system", content: systemPrompt },
    { role: "user", content: message },
  ];

  const reply = await callDeepSeekChat(messages, {
    temperature: 0.7,
    maxTokens: 300,
  });

  // 异步提取记忆（不阻塞回复）
  extractMemoriesFromMessage(user.id, message, recentContext).catch(() => {});

  await onInteraction(user.id);

  return { reply };
});

/** 构建当前上下文文字 */
function buildContext(profile: any, snapshots: any): string {
  const parts: string[] = [];

  if (profile?.school) {
    parts.push(`目标：${profile.school} ${profile.major || ""}`);
  }

  if (snapshots && snapshots.length > 0) {
    const recent = snapshots[0];
    parts.push(`今天学习：${recent.total_hours || 0}小时`);
  } else {
    parts.push("今天还没有学习记录");
  }

  return parts.join("。");
}
