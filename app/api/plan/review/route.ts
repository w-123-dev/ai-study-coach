import { withAuth, safeParseJSON } from "@/lib/api-utils";
import { runWeeklyReview, getLatestReview, getWeekReview } from "@/lib/plan/plan-review";

/**
 * POST /api/plan/review
 * 触发每周复盘
 *
 * Body:
 *   week?: number (默认当前周)
 *   autoApply?: boolean (默认 false，只生成建议不自动应用)
 */
export const POST = withAuth(async (request, { user, supabase }) => {
  try {
    const body = await safeParseJSON<{ week?: number; autoApply?: boolean }>(request, {});
    const weekNumber = body.week;
    const autoApply = body.autoApply ?? false;

    const { review, applied } = await runWeeklyReview(
      supabase,
      user.id,
      weekNumber,
      autoApply
    );

    if (!review) {
      return Response.json(
        {
          success: false,
          error: "复盘失败：本周暂无任务数据",
        },
        { status: 400 }
      );
    }

    return Response.json({
      success: true,
      data: {
        review,
        applied,
        suggestions: review.adjustment_suggestions,
        validated: review.validation_status === "approved",
      },
    });
  } catch (error) {
    console.error("[ReviewAPI] 复盘失败:", error);
    return Response.json(
      { success: false, error: "复盘失败" },
      { status: 500 }
    );
  }
});

/**
 * GET /api/plan/review?week=1
 * 获取复盘记录
 */
export const GET = withAuth(async (request, { user, supabase }) => {
  try {
    const url = new URL(request.url);
    const weekParam = url.searchParams.get("week");

    let review;
    if (weekParam) {
      review = await getWeekReview(supabase, user.id, parseInt(weekParam));
    } else {
      review = await getLatestReview(supabase, user.id);
    }

    return Response.json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error("[ReviewAPI] 查询复盘失败:", error);
    return Response.json(
      { success: false, error: "查询失败" },
      { status: 500 }
    );
  }
});
