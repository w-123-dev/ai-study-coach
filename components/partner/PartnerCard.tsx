"use client";

import { useState, useEffect } from "react";
import { Timer, MessageCircle, Loader2, Sparkles } from "lucide-react";
import PartnerAvatar from "./PartnerAvatar";
import FocusMode from "./FocusMode";
import PartnerChat from "./PartnerChat";
import type { UserPartner, PartnerState, PartnerSkin } from "@/lib/partner/types";
import { PARTNER_STATE_LABELS, SKIN_CONFIGS } from "@/lib/partner/types";
import { usePartnerBehavior } from "@/lib/partner/behavior";

export default function PartnerCard({ userId }: { userId: string }) {
  const [partner, setPartner] = useState<UserPartner | null>(null);
  const [occasionGreeting, setOccasionGreeting] = useState<string | null>(null);
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
        setOccasionGreeting(data.occasionGreeting || null);
      }
    } catch (err) {
      console.error("Failed to load partner", err);
    } finally {
      setLoading(false);
    }
  }

  function handleFocusEnd() {
    setShowFocus(false);
    loadPartner();
  }

  const topState = (partner?.state as PartnerState) || "calm";
  const behavior = usePartnerBehavior(topState);

  function getDaysTogether(): number {
    if (!partner?.created_at) return 0;
    const created = new Date(partner.created_at);
    return Math.floor((Date.now() - created.getTime()) / 86400000);
  }

  function getDaysMessage(): string {
    const days = getDaysTogether();
    if (days <= 1) return "刚刚开始一起学习";
    if (days <= 3) return "刚开始一起学习呢";
    if (days <= 7) return "一起学习一周了";
    if (days <= 30) return `一起学习 ${days} 天了`;
    if (days <= 100) return `已经相互陪伴 ${days} 天`;
    if (days <= 200) return `一起走过了 ${days} 天`;
    return `相伴第 ${days} 天`;
  }

  function getEncouragement(): string | null {
    const days = getDaysTogether();
    if (days <= 1) return "很高兴认识你";
    if (days <= 7) return "每天进步一点点";
    if (days <= 30) return "你已经坚持了这么久";
    if (days <= 100) return "有你在的每一天都是好的";
    if (days <= 200) return "时间证明了一切";
    return "谢谢你的陪伴";
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

  const skinConfig = SKIN_CONFIGS[partner.skin] || SKIN_CONFIGS.default;
  const stateLabel = PARTNER_STATE_LABELS[partner.state as PartnerState] || "平静";
  const energyLabel = partner.energy >= 60 ? "充足" : partner.energy >= 30 ? "中等" : "较低";
  const daysTogether = getDaysTogether();
  const encouragement = getEncouragement();

  return (
    <>
      <div className="rounded-2xl border border-white/[0.06] bg-[#111827] p-4 transition-all hover:border-white/[0.1]">
        {/* Occasion greeting banner */}
        {occasionGreeting && (
          <div className="-mx-4 -mt-4 mb-3 rounded-t-2xl border-b border-white/[0.04] bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5 px-4 py-2.5">
            <p className="text-center text-[13px] font-medium leading-relaxed text-white/70">
              {occasionGreeting}
            </p>
          </div>
        )}

        <div className="flex items-start gap-3">
          <PartnerAvatar
            state={partner.state as PartnerState}
            behavior={behavior}
            skin={partner.skin as PartnerSkin}
            size="md"
            interactive
            onClick={() => setShowChat(true)}
          />

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">{partner.name}</span>
              <span className="ml-auto inline-flex items-center gap-1 rounded-md bg-white/[0.04] px-2 py-0.5 text-[11px] font-medium"
                style={{ color: skinConfig.primaryColor }}>
                {stateLabel}
              </span>
            </div>

            {/* Energy bar */}
            <div className="mt-2 flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${partner.energy}%`,
                    background: `linear-gradient(90deg, ${skinConfig.primaryColor}88, ${skinConfig.primaryColor})`,
                  }}
                />
              </div>
              <span className="text-[10px] text-white/40">{energyLabel}</span>
            </div>

            {/* 相伴天数（温暖化） */}
            <div className="mt-2 flex flex-col gap-0.5">
              <span className="text-[11px] text-white/50">
                {getDaysMessage()}
              </span>
              {encouragement && (
                <span className="text-[11px] text-blue-400/70 italic">
                  {encouragement}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons */}
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

      {showFocus && (
        <FocusMode
          userId={userId}
          partnerName={partner.name}
          partnerState={partner.state as PartnerState}
          onClose={() => setShowFocus(false)}
          onEnd={handleFocusEnd}
        />
      )}

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
