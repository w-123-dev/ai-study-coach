"use client";

import { useEffect, useState } from "react";

export default function AnimatedBackground() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      style={{ transform: `translateY(${scrollY * 0.15}px)` }}
    >
      {/* 主光晕 - 暖色 */}
      <div
        className="absolute top-1/4 left-1/3 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30"
        style={{
          background:
            "radial-gradient(circle, rgba(94,168,255,0.08) 0%, transparent 70%)",
          animation: "bgFloat 25s ease-in-out infinite",
        }}
      />

      {/* 暖色光晕 */}
      <div
        className="absolute bottom-0 right-0 h-[600px] w-[600px] translate-x-1/3 translate-y-1/4 rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(circle, rgba(255,215,106,0.06) 0%, transparent 60%)",
          animation: "bgFloat 30s ease-in-out infinite reverse",
        }}
      />

      {/* 中心光晕 */}
      <div
        className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10"
        style={{
          background:
            "radial-gradient(circle, rgba(94,168,255,0.04) 0%, transparent 50%)",
          animation: "bgFloat 35s ease-in-out infinite 5s",
        }}
      />

      {/* 噪点纹理 */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          backgroundSize: "256px 256px",
        }}
      />

      <style>{`
        @keyframes bgFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.05); }
          66% { transform: translate(-20px, 15px) scale(0.95); }
        }
      `}</style>
    </div>
  );
}
