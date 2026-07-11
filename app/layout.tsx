import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI考研私人教练 — 你的专属考研规划师",
  description:
    "根据目标院校和学习情况，AI自动生成个性化学习计划，每日监督执行，陪你坚持到考试上岸。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
