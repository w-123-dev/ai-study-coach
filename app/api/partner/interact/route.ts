import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/api-utils";
import { onInteraction, getOrCreatePartner } from "@/lib/partner/partner-service";
import { buildPartnerSystemPrompt } from "@/lib/partner/partner-prompt";
import { callDeepSeekChat } from "@/lib/deepseek";
import { getRecentMemories, extractMemoriesFromMessage, getRandomOldMemory, getMilestoneMemory, formatOldMemoryRecall } from "@/lib/partner/memory";
import { buildYesterdayCareContext, saveLastMessage } from "@/lib/partner/short-term";
import { getOccasionContext } from "@/lib/partner/occasion";
import type { PartnerState } from "@/lib/partner/types";

export const POST = withAuth(async (request, { user, supabase }) => {
  const { message } = await request.json();
  if (!message) {
    return { error: "message is required", _status: 400 };
  }

  const partner = await getOrCreatePartner(user.id);
  const state = partner.state as PartnerState;

  // Build current context
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

  // Read partner's recent memories
  const memories = await getRecentMemories(user.id, 5);

  // Short-term care: yesterday's conversation (new day injection)
  const yesterdayCare = await buildYesterdayCareContext(user.id, partner.last_interaction_at);

  // Occasion context: holiday / personal event
  const occasionContext = await getOccasionContext(user.id, supabase);

  // Long-term recall: randomly remember old things (~30% probability)
  let oldMemoryRecall = "";
  if (Math.random() < 0.3) {
    const milestone = await getMilestoneMemory(user.id);
    if (milestone) {
      oldMemoryRecall = formatOldMemoryRecall(milestone);
    } else {
      const randomOld = await getRandomOldMemory(user.id);
      if (randomOld) {
        oldMemoryRecall = formatOldMemoryRecall(randomOld);
      }
    }
  }

  // Merge context: short-term care + occasion + long-term recall
  let enrichedContext = recentContext;
  if (yesterdayCare) {
    enrichedContext += `\n\n${yesterdayCare}`;
  }
  if (occasionContext) {
    enrichedContext += `\n\n${occasionContext}`;
  }
  if (oldMemoryRecall) {
    enrichedContext += `\n\n${oldMemoryRecall}`;
  }

  // Build personality Prompt
  const systemPrompt = buildPartnerSystemPrompt({
    partnerName: partner.name,
    partnerState: state,
    memories,
    recentContext: enrichedContext,
  });

  const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
    { role: "system", content: systemPrompt },
    { role: "user", content: message },
  ];

  const reply = await callDeepSeekChat(messages, {
    temperature: 0.7,
    maxTokens: 300,
  });

  // Save user message to short-term memory (for tomorrow's care)
  await saveLastMessage(user.id, message);

  // Asynchronously extract long-term memory (non-blocking)
  extractMemoriesFromMessage(user.id, message, recentContext).catch(() => {});

  await onInteraction(user.id);

  return { reply };
});

/** Build current context text */
function buildContext(profile: any, snapshots: any): string {
  const parts: string[] = [];

  if (profile?.school) {
    parts.push(`Target: ${profile.school} ${profile.major || ""}`);
  }

  if (snapshots && snapshots.length > 0) {
    const recent = snapshots[0];
    parts.push(`Today's study: ${recent.total_hours || 0} hours`);
  } else {
    parts.push("No study records today yet");
  }

  return parts.join(" | ");
}
