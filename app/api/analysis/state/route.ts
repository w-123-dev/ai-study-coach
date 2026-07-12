import { withAuth, safeParseJSON } from "@/lib/api-utils";
import {
  analyzeAndSaveState,
  getLatestStudentState,
} from "@/lib/analysis/student-state";

/**
 * GET /api/analysis/state
 * 获取当前学生状态分析
 */
export const GET = withAuth(async (_request, { user, supabase }) => {
  try {
    let state = await getLatestStudentState(supabase, user.id);

    // 如果没有状态记录，实时分析并保存
    if (!state) {
      state = await analyzeAndSaveState(supabase, user.id);
    }

    return Response.json({
      success: true,
      data: state,
    });
  } catch (error) {
    console.error("[StateAPI] 获取状态失败:", error);
    return Response.json(
      { success: false, error: "获取状态失败" },
      { status: 500 }
    );
  }
});

/**
 * POST /api/analysis/state
 * 手动触发状态分析
 */
export const POST = withAuth(async (_request, { user, supabase }) => {
  try {
    const state = await analyzeAndSaveState(supabase, user.id);
    return Response.json({
      success: true,
      data: state,
    });
  } catch (error) {
    console.error("[StateAPI] 分析失败:", error);
    return Response.json(
      { success: false, error: "分析失败" },
      { status: 500 }
    );
  }
});
