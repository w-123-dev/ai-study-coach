import { NextRequest } from "next/server";
import { withAuth, safeParseJSON, requireFields } from "@/lib/api-utils";
import { markCoachMessage } from "@/lib/analysis/coach-detector";

/**
 * PATCH /api/coach/messages
 * 标记教练消息为已读或忽略
 *
 * Body: { messageId: string, status: "read" | "dismissed" }
 */
export const PATCH = withAuth(async (request, { user, supabase }) => {
  const body = await safeParseJSON<{
    messageId?: string;
    status?: "read" | "dismissed";
  }>(request, {});

  const missing = requireFields(body, ["messageId", "status"]);
  if (missing) {
    return { error: missing, _status: 400 };
  }

  try {
    const ok = await markCoachMessage(
      supabase,
      body.messageId!,
      user.id,
      body.status!
    );

    if (!ok) {
      return {
        success: false,
        error: "更新消息状态失败",
        _status: 500,
      };
    }

    return {
      success: true,
      data: { id: body.messageId, status: body.status },
    };
  } catch (error) {
    console.error("[CoachAPI] 标记消息失败:", error);
    return {
      success: false,
      error: "标记消息失败",
      _status: 500,
    };
  }
});
