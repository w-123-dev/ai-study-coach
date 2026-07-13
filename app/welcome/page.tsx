"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Heart, Sun, Sparkles } from "lucide-react";

const promises = [
  {
    icon: Heart,
    text: "从今天开始，我会一直记得你的目标和困难",
  },
  {
    icon: Sun,
    text: "每天你学了什么、状态如何，我都知道",
  },
  {
    icon: Sparkles,
    text: "不只是一张计划表，我会陪你走完这300天",
  },
];

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-50 to-white">
      <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center px-5">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <span className="text-[15px] font-semibold text-gray-900">AI考研教练</span>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-5 py-10">
        <div className="w-full max-w-sm text-center">
          {/* 表情符号替代品牌图标 */}
          <div
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-200"
            style={{ animation: "fadeUp 0.5s ease-out" }}
          >
            <span className="text-3xl">📖</span>
          </div>

          <h1
            className="mt-6 text-2xl font-bold tracking-tight text-gray-900"
            style={{ animation: "fadeUp 0.5s ease-out 0.1s both" }}
          >
            欢迎来到你的考研旅程
          </h1>
          <p
            className="mt-2 text-sm leading-relaxed text-gray-500"
            style={{ animation: "fadeUp 0.5s ease-out 0.2s both" }}
          >
            在开始之前，我想让你知道——
            <br />
            我不是一个工具，是你的私人教练。
          </p>

          {/* 承诺列表 */}
          <div
            className="mt-10 space-y-3 text-left"
            style={{ animation: "fadeUp 0.5s ease-out 0.3s both" }}
          >
            {promises.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-4 transition-shadow hover:shadow-sm"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                    <Icon className="h-4.5 w-4.5 text-blue-600" />
                  </div>
                  <p className="pt-1 text-sm leading-relaxed text-gray-700">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div style={{ animation: "fadeUp 0.5s ease-out 0.5s both" }}>
            <button
              onClick={() => router.push("/setup")}
              className="mt-8 inline-flex h-12 w-full items-center justify-center gap-1.5 rounded-lg bg-gray-900 px-6 text-sm font-medium text-white transition-all hover:bg-gray-800 active:scale-[0.98]"
            >
              <Sparkles className="h-4 w-4" />
              好的，我们开始吧
            </button>
            <p className="mt-3 text-xs text-gray-400">
              先了解你，才能成为你的专属教练
            </p>
          </div>

          {/* 步骤指示 */}
          <div
            className="mt-8 flex items-center justify-center gap-1.5"
            style={{ animation: "fadeUp 0.5s ease-out 0.6s both" }}
          >
            <span className="h-1.5 w-6 rounded-full bg-gray-900" />
            <span className="h-1.5 w-2 rounded-full bg-gray-200" />
            <span className="h-1.5 w-2 rounded-full bg-gray-200" />
            <span className="h-1.5 w-2 rounded-full bg-gray-200" />
          </div>
          <p
            className="mt-1.5 text-xs text-gray-400"
            style={{ animation: "fadeUp 0.5s ease-out 0.65s both" }}
          >
            共 4 步 · 约 3 分钟
          </p>
        </div>
      </main>
    </div>
  );
}
