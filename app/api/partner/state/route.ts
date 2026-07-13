import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api-utils";
import { getOrCreatePartner } from "@/lib/partner/partner-service";
import { getMorningCareContext } from "@/lib/partner/short-term";
import { getOccasionContext, getOccasionGreeting } from "@/lib/partner/occasion";

export const GET = withAuth(async (_request, { user, supabase }) => {
  const partner = await getOrCreatePartner(user.id);

  // Get short-term care context (for frontend greeting)
  const morningCare = await getMorningCareContext(user.id, partner.last_interaction_at);

  // Get occasion greeting (holiday / personal event)
  const { data: profile } = await supabase
    .from("student_profiles")
    .select("exam_year")
    .eq("user_id", user.id)
    .single();

  const occasionGreeting = getOccasionGreeting(profile || undefined);

  return {
    partner,
    yesterdayCare: morningCare || null,
    occasionGreeting: occasionGreeting || null,
  };
});
