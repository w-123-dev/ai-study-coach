import { withAuth } from "@/lib/api-utils";
import {
  detectAndSave,
  getUnreadCoachMessages,
} from "@/lib/analysis/coach-detector";

/**
 * GET /api/coach/detect
 * 获取当前用户的未读教练消息
 * （不会触发新的检测，只读取已有消息）
 */
export const GET = withAuth(async (_request, { user, supabase }) => {
  try {
    const messages = await getUnreadCoachMessages(supabase, user.id);

    return {
      success: true,
      data: {
        messages,
        count: messages.length,
        hasUnread: messages.length > 0,
      },
    };
  } catch (error) {
    console.error("[CoachAPI] 读取消息失败:", error);
    return {
      success: false,
      error: "读取消息失败",
      _status: 500,
    };
  }
});

/**
 * POST /api/coach/detect
 * 运行主动检测，生成教练消息
 * 会在打卡后或页面加载时触发
 */
export const POST = withAuth(async (_request, { user, supabase }) => {
  try {
    const messages = await detectAndSave(supabase, user.id);

    return {
      success: true,
      data: {
        messages,
        newCount: messages.length,
      },
    };
  } catch (error) {
    console.error("[CoachAPI] 检测失败:", error);
    return {
      success: false,
      error: "检测失败",
      _status: 500,
    };
  }
});
