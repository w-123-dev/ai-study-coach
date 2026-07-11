import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import type { User } from "@supabase/supabase-js";

export type ApiHandler<T> = (
  request: NextRequest,
  context: { user: User; supabase: ReturnType<typeof createClient>["supabase"] }
) => Promise<T>;

/**
 * 包装 API 路由处理器，自动处理：
 * - Supabase 客户端创建
 * - 用户认证检查（返回 401）
 * - try/catch 统一错误处理
 *
 * handler 可以返回 `_status` 字段来自定义 HTTP 状态码，
 * 该字段会被自动移除，不会出现在响应体中。
 */
export function withAuth<T>(
  handler: ApiHandler<T>
): (request: NextRequest) => Promise<NextResponse> {
  return async (request: NextRequest) => {
    try {
      const { supabase } = createClient(request);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.json({ error: "未登录" }, { status: 401 });
      }

      const result = await handler(request, { user, supabase });

      // 如果 handler 返回了 _status 字段，使用自定义状态码
      const resultRecord = result as Record<string, unknown>;
      if (typeof resultRecord._status === "number") {
        const { _status, ...clean } = resultRecord;
        return NextResponse.json(clean as T, { status: _status });
      }

      return NextResponse.json(result);
    } catch (error) {
      console.error("[API Error]", error);
      const message =
        error instanceof Error ? error.message : "未知错误";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  };
}

/**
 * 从请求体中安全读取 JSON，如果解析失败返回默认值
 */
export async function safeParseJSON<T>(
  request: NextRequest,
  fallback: T
): Promise<T> {
  try {
    return await request.json();
  } catch {
    return fallback;
  }
}

/**
 * 校验请求体中的必填字段
 */
export function requireFields<T extends Record<string, unknown>>(
  body: T,
  required: (keyof T)[]
): string | null {
  for (const field of required) {
    if (body[field] == null) {
      return `缺少必填字段: ${String(field)}`;
    }
  }
  return null;
}

/**
 * 从 student_profiles 中获取用户画像，不存在时返回 null
 */
export async function getStudentProfile(
  supabase: ReturnType<typeof createClient>["supabase"],
  userId: string
) {
  const { data, error } = await supabase
    .from("student_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();
  return { data, error };
}
