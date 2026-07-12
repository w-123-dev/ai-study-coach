import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTA() {
  return (
    <section className="border-t border-gray-100 bg-white px-5 py-20 md:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50">
          <Sparkles className="h-6 w-6 text-amber-500" />
        </div>

        <h2 className="mt-5 text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
          你的竞争对手
          <br className="sm:hidden" />
          已经开始用 AI 学了
        </h2>

        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-gray-500">
          无需下载 App，打开浏览器就能用。7 天试用，随时取消。
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/signup"
            className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0F172A] px-8 text-sm font-semibold text-white transition-all hover:bg-[#1e293b] sm:w-auto"
          >
            免费开始备考
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="#features"
            className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-8 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:w-auto"
          >
            了解更多功能
          </Link>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-400">
          <span>无需信用卡</span>
          <span className="h-3 w-px bg-gray-200" />
          <span>7 天免费</span>
          <span className="h-3 w-px bg-gray-200" />
          <span>随时取消</span>
        </div>
      </div>
    </section>
  );
}
