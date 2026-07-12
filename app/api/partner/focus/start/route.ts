import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api-utils";
import { startFocus } from "@/lib/partner/partner-service";

export const POST = withAuth(async (_request, { user }) => {
  const { partner } = await startFocus(user.id);
  return { partner };
});
