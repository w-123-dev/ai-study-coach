"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { BookOpen, Mail, ArrowLeft, Loader2 } from "lucide-react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(
        error.message === "User already registered"
          ? "该邮箱已注册，请直接登录"
          : error.message
      );
      setLoading(false);
      return;
    }

    setRegistered(true);
    setLoading(false);
  }

  if (registered) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="border-b border-gray-100">
          <div className="mx-auto flex h-14 max-w-5xl items-center px-5">
            <Link href="/" className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <span className="text-[15px] font-semibold text-gray-900">
                AI考研教练
              </span>
            </Link>
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center px-5">
          <div className="w-full max-w-sm text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
              <Mail className="h-7 w-7 text-blue-600" />
            </div>

            <h1 className="mt-5 text-xl font-bold tracking-tight text-gray-900">
              验证你的邮箱
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-gray-500">
              我们已向 <span className="font-medium text-gray-900">{email}</span> 发送了一封验证邮件。
            </p>
            <p className="mt-1 text-sm text-gray-500">
              请点击邮件中的链接完成注册。
            </p>

            <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-left">
              <p className="text-xs font-medium text-blue-800">没有收到邮件？</p>
              <ul className="mt-2 space-y-1 text-xs text-blue-600">
                <li>• 检查垃圾邮件文件夹</li>
                <li>• 确认邮箱地址正确</li>
                <li>• 稍等 1-2 分钟后重试</li>
              </ul>
            </div>

            <Link
              href="/login"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              返回登录
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-gray-100">
        <div className="mx-auto flex h-14 max-w-5xl items-center px-5">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <span className="text-[15px] font-semibold text-gray-900">
              AI考研教练
            </span>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-5">
        <div className="w-full max-w-sm">
          <h1 className="text-center text-2xl font-bold tracking-tight text-gray-900">
            注册
          </h1>
          <p className="mt-2 text-center text-sm text-gray-500">
            开启你的AI考研之旅
          </p>

          <form onSubmit={handleSignup} className="mt-8 space-y-4">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                邮箱
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 block w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:outline-none"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                密码
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 block w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:outline-none"
                placeholder="至少6位密码"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "发送验证邮件..." : "注册"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            已有账号？{" "}
            <Link href="/login" className="font-medium text-gray-900 hover:underline">
              登录
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
