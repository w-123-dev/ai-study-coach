import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/welcome";

  if (code) {
    const { supabase, supabaseResponse } = createClient(request);
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(next, request.url));
    }

    console.error("[Auth Callback] code exchange failed:", error.message);
  }

  return NextResponse.redirect(new URL("/login?error=验证链接无效或已过期，请重新注册", request.url));
}
