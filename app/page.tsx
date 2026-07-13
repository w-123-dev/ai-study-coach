"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import AuthButton from "@/components/AuthButton";
import Hero from "@/components/landing/Hero";
import CoachDifference from "@/components/landing/CoachDifference";
import PartnerShowcase from "@/components/landing/PartnerShowcase";
import ProductDemo from "@/components/landing/ProductDemo";
import GrowthTimeline from "@/components/landing/GrowthTimeline";
import Trust from "@/components/landing/Trust";
import FAQ from "@/components/landing/FAQ";
import CTA from "@/components/landing/CTA";
import AnimatedBackground from "@/components/ui/AnimatedBackground";

export default function HomePage() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 40);
  });

  return (
    <>
      <AnimatedBackground />

      {/* 导航栏 */}
      <motion.header
        className="fixed top-0 right-0 left-0 z-50"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <motion.div
          className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5 transition-all duration-500"
          animate={
            scrolled
              ? {
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                  backgroundColor: "rgba(15,23,42,0.85)",
                  backdropFilter: "blur(16px)",
                  borderRadius: "0px",
                }
              : {
                  borderBottom: "1px solid rgba(255,255,255,0)",
                  backgroundColor: "rgba(15,23,42,0)",
                  backdropFilter: "blur(0px)",
                  borderRadius: "0px",
                }
          }
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-400" />
            <motion.span
              className="text-[15px] font-semibold tracking-tight text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: scrolled ? 1 : 0.9 }}
              transition={{ duration: 0.5 }}
            >
              AI考研教练
            </motion.span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden text-sm font-medium text-white/60 transition-colors duration-300 hover:text-white sm:inline"
            >
              登录
            </Link>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/signup"
                className="inline-flex h-8 items-center justify-center rounded-lg bg-white px-4 text-xs font-semibold text-[#0F172A] transition-all duration-300 hover:bg-white/90 hover:shadow-lg"
              >
                免费注册
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.header>

      <main className="relative z-10">
        <Hero />
        <CoachDifference />
        <PartnerShowcase />
        <ProductDemo />
        <GrowthTimeline />
        <Trust />
        <FAQ />
        <CTA />
      </main>

      {/* 页脚 */}
      <footer className="relative z-10 border-t border-white/10 bg-[#0F172A] px-5 py-10">
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
