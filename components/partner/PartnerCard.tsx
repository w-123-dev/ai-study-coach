"use client";

import { useState, useEffect } from "react";
import { Sparkles, Timer, MessageCircle, Loader2, Zap } from "lucide-react";
import PartnerAvatar from "./PartnerAvatar";
import FocusMode from "./FocusMode";
import PartnerChat from "./PartnerChat";
import type { UserPartner, PartnerMood } from "@/lib/partner/types";
import { PARTNER_MOOD_LABELS, calculateLevel } from "@/lib/partner/types";

export default function PartnerCard({ userId }: { userId: string }) {
  const [partner, setPartner] = useState<UserPartner | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFocus, setShowFocus] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    loadPartner();
  }, []);

  async function loadPartner() {
    try {
      const res = await fetch("/api/partner/state");
      if (res.ok) {
        const data = await res.json();
        setPartner(data.partner);
      }
    } catch (err) {
      console.error("Failed to load partner", err);
    } finally {
      setLoading(false);
    }
  }

  /** 专注结束后刷新 */
  function handleFocusEnd() {
    setShowFocus(false);
    loadPartner();
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/[0.06] bg-[#111827] p-4">
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-white/30" />
        </div>
      </div>
    );
  }

  if (!partner) return null;

  const { level, currentExp, nextThreshold } = calculateLevel(partner.exp);
  const expPercent = nextThreshold > 0 ? (currentExp / nextThreshold) * 100 : 0;

  return (
    <>
      <div className="rounded-2xl border border-white/[0.06] bg-[#111827] p-4 transition-all hover:border-white/[0.1]">
        <div className="flex items-start gap-3">
          {/* 头像 */}
          <PartnerAvatar
            mood={partner.mood as PartnerMood}
            level={level}
            size="md"
            interactive
            onClick={() => setShowChat(true)}
          />

          {/* 信息 */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">{partner.name}</span>
              <span className="inline-flex items-center gap-0.5 rounded-md bg-white/[0.04] px-1.5 py-0.5 text-[11px] font-medium text-blue-400">
                <Sparkles className="h-3 w-3" />
                Lv.{level}
              </span>
              <span className="ml-auto text-[11px] text-white/40">
                {PARTNER_MOOD_LABELS[partner.mood as PartnerMood] || "平静"}
              </span>
            </div>

            {/* 经验条 */}
            <div className="mt-1.5 flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
                  style={{ width: `${expPercent}%` }}
                />
              </div>
              <span className="text-[10px] text-white/30">
                {currentExp}/{nextThreshold}
              </span>
            </div>

            {/* 亲密度 + 能量 */}
            <div className="mt-2 flex items-center gap-4 text-[11px] text-white/40">
              <span>亲密度 {partner.connection}/100</span>
              <span className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                {partner.energy}%
              </span>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => setShowFocus(true)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-500/10 px-3 py-2 text-xs font-medium text-blue-400 transition-all hover:bg-blue-500/20"
          >
            <Timer className="h-3.5 w-3.5" />
            开始专注
          </button>
          <button
            onClick={() => setShowChat(true)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-white/[0.04] px-3 py-2 text-xs font-medium text-white/60 transition-all hover:bg-white/[0.08]"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            和小伴聊天
          </button>
        </div>
      </div>

      {/* 专注模式浮层 */}
      {showFocus && (
        <FocusMode
          userId={userId}
          partnerName={partner.name}
          partnerMood={partner.mood as PartnerMood}
          onClose={() => setShowFocus(false)}
          onEnd={handleFocusEnd}
        />
      )}

      {/* 聊天浮层 */}
      {showChat && (
        <PartnerChat
          userId={userId}
          partner={partner}
          onClose={() => setShowChat(false)}
          onInteraction={loadPartner}
        />
      )}
    </>
  );
}
