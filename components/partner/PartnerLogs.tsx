"use client";

import { useEffect, useState } from "react";
import { BookHeart, Loader2 } from "lucide-react";
import type { PartnerLog } from "@/lib/partner/logs";

export default function PartnerLogs() {
  const [logs, setLogs] = useState<PartnerLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  async function loadLogs() {
    try {
      const res = await fetch("/api/partner/logs");
      if (res.ok) {
        const data = await res.json();
        setLogs(data.data ?? []);
      }
    } catch (e) {
      console.error("[PartnerLogs] Failed to load:", e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="h-4 w-4 animate-spin text-white/30" />
      </div>
    );
  }

  if (logs.length === 0) return null;

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#111827] p-4">
      <div className="mb-3 flex items-center gap-2">
        <BookHeart className="h-4 w-4 text-white/30" />
        <span className="text-xs font-medium text-white/40">观察日志</span>
      </div>

      <div className="space-y-3">
        {logs.map((log, i) => {
          const isToday = log.log_date === new Date().toISOString().split("T")[0];
          const dateLabel = isToday
            ? "今天"
            : formatDateLabel(log.log_date);

          return (
            <div key={log.id} className="flex items-start gap-3">
              {/* 时间线圆点 */}
              <div className="mt-1.5 flex flex-col items-center">
                <div
                  className={`h-2 w-2 rounded-full ${
                    isToday ? "bg-blue-400/60" : "bg-white/10"
                  }`}
                />
                {i < logs.length - 1 && (
                  <div className="mt-1 h-full w-px bg-white/[0.04]" />
                )}
              </div>

              {/* 内容 */}
              <div className="min-w-0 flex-1 pb-3">
                <p className="text-sm leading-relaxed text-white/70">
                  {log.content}
                </p>
                <p className="mt-0.5 text-[10px] text-white/20">{dateLabel}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const ymd = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  if (ymd(date) === ymd(yesterday)) return "昨天";
  if (ymd(date) === ymd(today)) return "今天";

  const days = Math.floor((today.getTime() - date.getTime()) / 86400000);
  if (days <= 7) return `${days}天前`;

  return `${date.getMonth() + 1}月${date.getDate()}日`;
}
