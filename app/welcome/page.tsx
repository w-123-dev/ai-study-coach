"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Target, CalendarCheck, Sparkles, Brain } from "lucide-react";

const valueProps = [
  {
    icon: Target,
    title: "根据你的目标制定计划",
    description: "输入目标院校和专业，AI 自动生成从今天到考研日的完整学习路径",
  },
  {
    icon: CalendarCheck,
    title: "根据每天学习调整计划",
    description: "打卡记录后 AI 自动分析完成情况，动态调整后续任务，计划永远贴合你的节奏",
  },
  {
    icon: Brain,
    title: "陪伴整个备考周期",
    description: "不是一次性的计划工具，是全程跟踪、主动提醒、数据分析的私人教练",
  },
];

export default function WelcomePage() {
  const router = useRouter();

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

      <main className="flex flex-1 items-center justify-center px-5 py-10">
        <div className="w-full max-w-lg text-center">
          {/* 欢迎标识 */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-200">
            <Sparkles className="h-8 w-8 text-white" />
          </div>

          <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">
            你的AI考研私人教练
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            在开始之前，让我告诉你我能为你做什么
          </p>

          {/* 价值点列表 */}
          <div className="mt-10 space-y-4 text-left">
            {valueProps.map((prop, i) => {
              const Icon = prop.icon;
              return (
                <div
                  key={i}
                  className="flex items-start gap-4 rounded-xl border border-gray-100 bg-white p-4 transition-shadow hover:shadow-sm"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                    <Icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {prop.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-500">
                      {prop.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 提示语 */}
          <p className="mt-8 text-xs text-gray-400">
            先了解你，才能成为你的专属教练
          </p>

          {/* 按钮 */}
          <button
            onClick={() => router.push("/setup")}
            className="mt-3 inline-flex h-12 w-full items-center justify-center gap-1.5 rounded-lg bg-gray-900 px-6 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            <Sparkles className="h-4 w-4" />
            开始制定我的计划
          </button>

          {/* 步骤指示 */}
          <div className="mt-6 flex items-center justify-center gap-1.5">
            <span className="h-1.5 w-6 rounded-full bg-gray-900" />
            <span className="h-1.5 w-2 rounded-full bg-gray-200" />
            <span className="h-1.5 w-2 rounded-full bg-gray-200" />
            <span className="h-1.5 w-2 rounded-full bg-gray-200" />
          </div>
          <p className="mt-1.5 text-xs text-gray-400">共 4 步 · 约 3 分钟</p>
        </div>
      </main>
    </div>
  );
}
