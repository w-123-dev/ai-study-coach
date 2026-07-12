import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/api-utils";
import { onInteraction, getOrCreatePartner } from "@/lib/partner/partner-service";
import { buildPartnerChatPrompt } from "@/lib/partner/partner-prompt";
import { callDeepSeekChat } from "@/lib/deepseek";
import type { PartnerState } from "@/lib/partner/types";

export const POST = withAuth(async (request, { user, supabase }) => {
  const { message } = await request.json();
  if (!message) {
    return { error: "message is required", _status: 400 };
  }

  const partner = await getOrCreatePartner(user.id);

  const { data: snapshots } = await supabase
    .from("daily_snapshots")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .limit(3);

  const recentStudy = snapshots && snapshots.length > 0
    ? snapshots.map((s: any) => s.date + ": " + s.total_hours + "h, rate:" + Math.round(s.completion_rate * 100) + "%").join("; ")
    : "no study records yet";

  const { data: profile } = await supabase
    .from("student_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const context = {
    partnerName: partner.name,
    partnerState: partner.state as PartnerState,
    userName: profile?.school ? profile.school + " " + profile.major : undefined,
    recentStudy,
    userEmotion: partner.state,
  };

  const prompt = buildPartnerChatPrompt(context);
  const systemPrompt = prompt + "\n\nUser message: " + message + "\n\nReply as " + partner.name + ", short and friendly.";

  const reply = await callDeepSeekChat([
    { role: "system", content: systemPrompt },
    { role: "user", content: message },
  ], {
    temperature: 0.8,
    maxTokens: 500,
  });

  await onInteraction(user.id);

  return { reply };
});
