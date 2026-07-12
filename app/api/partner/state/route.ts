import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api-utils";
import { getOrCreatePartner } from "@/lib/partner/partner-service";

export const GET = withAuth(async (_request, { user, supabase }) => {
  const partner = await getOrCreatePartner(user.id);
  return { partner };
});
