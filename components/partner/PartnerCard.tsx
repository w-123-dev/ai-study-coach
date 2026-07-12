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

  function handleFocusEnd() {
    setShowFocus(false);
    loadPartner();
  }

  // Behavior state machine — only when partner is loaded
  const topState = (partner?.state as PartnerState) || "calm";
  const behavior = usePartnerBehavior(topState);

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

  return (
    <>
      <div className="rounded-2xl border border-white/[0.06] bg-[#111827] p-4 transition-all hover:border-white/[0.1]">
        <div className="flex items-start gap-3">
          {/* Avatar with behavior animations */}
          <PartnerAvatar
            state={partner.state as PartnerState}
            behavior={behavior}
            skin={partner.skin as PartnerSkin}
            size="md"
            interactive
            onClick={() => setShowChat(true)}
          />

          {/* Info */}
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

            {/* Info line */}
            <div className="mt-2 flex items-center gap-3 text-[11px] text-white/40">
              <span className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                认识 {partner.last_interaction_at
                  ? Math.floor((Date.now() - new Date(partner.last_interaction_at).getTime()) / 86400000) + "天"
                  : "刚开始"}
              </span>
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

      {/* Focus overlay */}
      {showFocus && (
        <FocusMode
          userId={userId}
          partnerName={partner.name}
          partnerState={partner.state as PartnerState}
          onClose={() => setShowFocus(false)}
          onEnd={handleFocusEnd}
        />
      )}

      {/* Chat overlay */}
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
