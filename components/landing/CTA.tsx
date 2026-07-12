import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTA() {
  return (
    <section className="bg-[#0F172A] px-5 py-20 md:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10">
          <Sparkles className="h-6 w-6 text-amber-400" />
        </div>

        <h2 className="mt-5 text-2xl font-bold tracking-tight text-white md:text-3xl">
          你的竞争对手
          <br className="sm:hidden" />
          已经开始用 AI 学了
        </h2>

        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/40">
          无需下载 App，打开浏览器就能用。7 天试用，随时取消。\n        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/signup"
            className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-8 text-sm font-semibold text-[#0F172A] transition-all hover:bg-white/90 sm:w-auto"
          >
            免费开始备考
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="#features"
            className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 px-8 text-sm font-medium text-white/60 transition-colors hover:bg-white/10 sm:w-auto"
          >
            了解更多功能
          </Link>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-white/30">
          <span>无需信用卡</span>
          <span className="h-3 w-px bg-white/10" />
          <span>7 天免费</span>
          <span className="h-3 w-px bg-white/10" />
          <span>随时取消</span>
        </div>
      </div>
    </section>
  );
}
