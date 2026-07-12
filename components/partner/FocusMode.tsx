"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { X, Play, Pause, Square, Loader2 } from "lucide-react";
import PartnerAvatar from "./PartnerAvatar";
import type { PartnerState } from "@/lib/partner/types";

interface FocusModeProps {
  userId: string;
  partnerName: string;
  partnerState: PartnerState;
  onClose: () => void;
  onEnd: () => void;
}

const FOCUS_OPTIONS = [
  { minutes: 25, label: "25分钟", desc: "经典专注" },
  { minutes: 45, label: "45分钟", desc: "深度学习" },
  { minutes: 90, label: "90分钟", desc: "冲刺模式" },
];

export default function FocusMode({
  userId,
  partnerName,
  partnerState,
  onClose,
  onEnd,
}: FocusModeProps) {
  const [phase, setPhase] = useState<"select" | "focusing" | "done">("select");
  const [duration, setDuration] = useState(25);
  const [remaining, setRemaining] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startFocus = useCallback(async () => {
    setPhase("focusing");
    setRemaining(duration * 60);
    setRunning(true);

    await fetch("/api/partner/focus/start", { method: "POST" });

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setRunning(false);
          setCompleted(true);
          setPhase("done");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [duration]);

  const stopFocus = useCallback(async () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);

    const elapsedMinutes = duration - Math.ceil(remaining / 60);
    const actualMinutes = Math.max(elapsedMinutes, 1);

    setSaving(true);
    try {
      await fetch("/api/partner/focus/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          durationMinutes: actualMinutes,
          completed: false,
        }),
      });
    } catch {}
    setSaving(false);
    setPhase("done");
    setCompleted(false);
  }, [duration, remaining]);

  useEffect(() => {
    async function saveCompletedFocus() {
      setSaving(true);
      try {
        await fetch("/api/partner/focus/end", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            durationMinutes: duration,
            completed: true,
          }),
        });
      } catch {}
      setSaving(false);
    }
    if (phase === "done" && completed) {
      saveCompletedFocus();
    }
  }, [phase, completed, duration]);

  function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  function handleFinish() {
    onEnd();
  }

  if (phase === "select") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="mx-4 w-full max-w-sm rounded-2xl border border-white/[0.08] bg-[#111827] p-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">专注模式</h3>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-white/40 hover:bg-white/[0.06] hover:text-white/60"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 flex flex-col items-center gap-1 py-4">
            <PartnerAvatar state={partnerState} size="lg" />
            <p className="mt-2 text-xs text-white/40">{partnerName}会陪你</p>
          </div>

          <div className="space-y-2">
            {FOCUS_OPTIONS.map((opt) => (
              <button
                key={opt.minutes}
                onClick={() => {
                  setDuration(opt.minutes);
                  startFocus();
                }}
                className="flex w-full items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 transition-all hover:border-blue-500/30 hover:bg-blue-500/[0.04]"
              >
                <div className="flex items-center gap-3">
                  <TimerIcon />
                  <div className="text-left">
                    <div className="text-sm font-medium text-white">{opt.label}</div>
                    <div className="text-[11px] text-white/40">{opt.desc}</div>
                  </div>
                </div>
                <Play className="h-4 w-4 text-blue-400" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (phase === "focusing") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
        <div className="flex flex-col items-center gap-6">
          <PartnerAvatar state="studying" size="lg" />
          <div className="text-5xl font-bold tracking-wider text-white tabular-nums">
            {formatTime(remaining)}
          </div>
          <p className="text-xs text-white/30">专注中，{partnerName}陪着你</p>
          <div className="flex gap-3">
            <button
              onClick={running ? () => {
                if (intervalRef.current) clearInterval(intervalRef.current);
                setRunning(false);
              } : () => {
                intervalRef.current = setInterval(() => {
                  setRemaining((prev) => {
                    if (prev <= 1) {
                      if (intervalRef.current) clearInterval(intervalRef.current);
                      setRunning(false);
                      setCompleted(true);
                      setPhase("done");
                      return 0;
                    }
                    return prev - 1;
                  });
                }, 1000);
                setRunning(true);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.08] text-white/60 transition-all hover:bg-white/[0.12]"
            >
              {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <button
              onClick={stopFocus}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 text-red-400 transition-all hover:bg-red-500/20"
            >
              <Square className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-sm rounded-2xl border border-white/[0.08] bg-[#111827] p-6 shadow-2xl">
        <div className="flex flex-col items-center gap-4 py-6">
          <PartnerAvatar state={completed ? "happy" : "calm"} size="lg" />
          <h3 className="text-lg font-bold text-white">
            {completed ? "专注完成！" : "先休息一下"}
          </h3>
          <p className="text-center text-xs text-white/40">
            {completed
              ? `${partnerName}为你高兴，${duration}分钟专注学习`
              : `${partnerName}说没关系，休息一下`}
          </p>
          {saving && (
            <div className="flex items-center gap-1.5 text-xs text-blue-400">
              <Loader2 className="h-3 w-3 animate-spin" />
              记录中...
            </div>
          )}
          <button
            onClick={handleFinish}
            disabled={saving}
            className="mt-2 rounded-lg bg-white px-5 py-2 text-sm font-semibold text-[#0F172A] transition-all hover:bg-white/90 disabled:opacity-50"
          >
            返回
          </button>
        </div>
      </div>
    </div>
  );
}

function TimerIcon() {
  return (
    <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.5" className="text-blue-400/30" />
      <path
        d="M16 8v8l5 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="text-blue-400"
      />
    </svg>
  );
}
