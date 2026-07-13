"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function CTA() {
  return (
    <section className="border-t border-white/[0.04] bg-[#0F172A] px-5 py-20 md:py-28">
      <div className="mx-auto max-w-lg text-center">
        <ScrollReveal>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-400/10">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="0.8" className="text-amber-400/40" />
              <circle cx="12" cy="12" r="3" fill="currentColor" className="text-amber-300/60" />
              <path d="M12 8v2M12 14v2" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" className="text-amber-400/30" />
            </svg>
          </div>
          <h2 className="mt-5 text-2xl font-bold tracking-tight text-white md:text-3xl">准备好了吗？</h2>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-white/40">不用想太多。先写下你的目标，剩下的交给小伴。它会一直在这里，陪你走完这三百天。</p>
          <div className="mt-8">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link href="/signup" className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-8 text-sm font-semibold text-[#0F172A] shadow-lg transition-all duration-300 hover:bg-white/90 hover:shadow-xl">
                开始备考
                <motion.span className="inline-block" initial={{ x: 0 }} whileHover={{ x: 3 }}>→</motion.span>
              </Link>
            </motion.div>
          </div>
          <p className="mt-4 text-xs text-white/20">不需要下载任何东西，打开浏览器就能开始</p>
        </ScrollReveal>
      </div>
    </section>
  );
}
