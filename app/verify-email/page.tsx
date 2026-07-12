"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { BookOpen, Mail, RefreshCw, Loader2, LogOut } from "lucide-react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSent, setResendSent] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setEmail(data.user.email ?? "");
        // 如果已经验证了，直接跳转
        if (data.user.email_confirmed_at) {
          router.push("/dashboard");
        }
      } else {
        router.push("/login");
      }
    });
  }, [router]);

  async function handleCheckVerification() {
    setChecking(true);
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    if (data.user?.email_confirmed_at) {
      router.push("/dashboard");
      router.refresh();
    }
    setChecking(false);
  }

  async function handleResend() {
    if (!email) return;
    setResending(true);
    setResendSent(false);
    const supabase = createClient();
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (!error) {
      setResendSent(true);
    }
    setResending(false);
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-gray-100">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <span className="text-[15px] font-semibold text-gray-900">
              AI考研教练
            </span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600"
          >
            <LogOut className="h-4 w-4" />
            退出
          </button>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-5">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
            <Mail className="h-7 w-7 text-blue-600" />
          </div>

          <h1 className="mt-5 text-xl font-bold tracking-tight text-gray-900">
            请验证你的邮箱
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-500">
            我们已向 <span className="font-medium text-gray-900">{email}</span> 发送了验证邮件。
          </p>
          <p className="mt-1 text-sm text-gray-500">
            验证后才能使用 AI 考研教练的全部功能。
          </p>

          <div className="mt-8 space-y-3">
            <button
              onClick={handleCheckVerification}
              disabled={checking}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
            >
              {checking ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  检查中...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  我已验证，进入系统
                </>
              )}
            </button>

            <button
              onClick={handleResend}
              disabled={resending || resendSent}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              {resending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  发送中...
                </>
              ) : resendSent ? (
                "验证邮件已重新发送"
              ) : (
                "重新发送验证邮件"
              )}
            </button>
          </div>

          <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-left">
            <p className="text-xs font-medium text-blue-800">没有收到邮件？</p>
            <ul className="mt-2 space-y-1 text-xs text-blue-600">
              <li>• 检查垃圾邮件文件夹</li>
              <li>• 确认邮箱地址正确</li>
              <li>• 稍等 1-2 分钟后重试</li>
            </ul>
          </div>

          <Link
            href="/"
            className="mt-6 inline-block text-sm text-gray-400 hover:text-gray-600"
          >
            返回首页
          </Link>
        </div>
      </main>
    </div>
  );
}
