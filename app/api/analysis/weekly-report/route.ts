import { NextRequest } from "next/server";
import { withAuth } from "@/lib/api-utils";
import { generateWeeklyReport } from "@/lib/analysis/weekly-report";

/**
 * GET /api/analysis/weekly-report
 * 获取本周学习周报
 */
export const GET = withAuth(async (_request, { user, supabase }) => {
  const report = await generateWeeklyReport(supabase, user.id);
  if (!report) {
    return { report: null, message: "本周暂无学习数据" };
  }
  return { report, success: true };
});
