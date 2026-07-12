import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
import { getRecentLogs } from "@/lib/partner/logs";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const logs = await getRecentLogs(user.id);
    return NextResponse.json({ success: true, data: logs });
  } catch (error) {
    console.error("[Partner Logs API] Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
