import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/api-utils";
import { endFocus } from "@/lib/partner/partner-service";

export const POST = withAuth(async (request, { user }) => {
  const { durationMinutes, completed } = await request.json();

  if (!durationMinutes || typeof durationMinutes !== "number") {
    return { error: "参数错误", _status: 400 };
  }

  const result = await endFocus(user.id, durationMinutes, completed ?? false);
  return result;
});
