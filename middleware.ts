import { type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function middleware(request: NextRequest) {
  const { supabase, supabaseResponse } = createClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // 需要登录才能访问的路径
  const protectedPaths = ["/dashboard", "/setup", "/chat", "/welcome"];

  if (!user && protectedPaths.some((p) => path.startsWith(p))) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", path);
    return Response.redirect(loginUrl);
  }

  // 已登录用户访问 login/signup → 跳转 dashboard
  if (user && (path === "/login" || path === "/signup")) {
    return Response.redirect(new URL("/dashboard", request.url));
  }

  // 已登录但未验证邮箱 → 只能访问 verify-email
  if (user && !user.email_confirmed_at) {
    const allowedPaths = ["/verify-email", "/logout", "/", "/login", "/signup"];
    const isAllowed = allowedPaths.some((p) => path.startsWith(p));
    const isApiRoute = path.startsWith("/api/");

    if (!isAllowed && !isApiRoute) {
      return Response.redirect(new URL("/verify-email", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
