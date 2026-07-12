import Link from "next/link";
import { BookOpen } from "lucide-react";
import AuthButton from "@/components/AuthButton";
import Hero from "@/components/landing/Hero";
import CoachDifference from "@/components/landing/CoachDifference";
import CoachFlow from "@/components/landing/CoachFlow";
import ProductDemo from "@/components/landing/ProductDemo";
import GrowthTimeline from "@/components/landing/GrowthTimeline";
import Trust from "@/components/landing/Trust";
import CTA from "@/components/landing/CTA";

export default function HomePage() {
  return (
    <>
      {/* 导航栏 */}
      <header className="fixed top-0 right-0 left-0 z-50 border-b border-white/10 bg-[#0F172A]/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-400" />
            <span className="text-[15px] font-semibold tracking-tight text-white">
              AI考研教练
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden text-sm font-medium text-white/60 transition-colors hover:text-white sm:inline"
            >
              登录
            </Link>
            <Link
              href="/signup"
              className="inline-flex h-8 items-center justify-center rounded-lg bg-white px-4 text-xs font-semibold text-[#0F172A] transition-all hover:bg-white/90"
            >
              免费注册
            </Link>
          </div>
        </div>
      </header>

      <main>
        <Hero />
        <CoachDifference />
        <CoachFlow />
        <ProductDemo />
        <GrowthTimeline />
        <Trust />
        <CTA />
      </main>

      {/* 页脚 */}
      <footer className="border-t border-white/10 bg-[#0F172A] px-5 py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-blue-400" />
            <span className="text-xs font-semibold text-white/60">
              AI考研私人教练
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-white/30">
            <Link href="/" className="hover:text-white/60">
              首页
            </Link>
            <Link href="/login" className="hover:text-white/60">
              登录
            </Link>
            <Link href="/signup" className="hover:text-white/60">
              注册
            </Link>
          </div>
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} AI考研私人教练
          </p>
        </div>
      </footer>
    </>
  );
}
