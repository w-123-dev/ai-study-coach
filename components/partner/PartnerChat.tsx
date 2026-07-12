"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Loader2 } from "lucide-react";
import PartnerAvatar from "./PartnerAvatar";
import type { UserPartner, PartnerMood } from "@/lib/partner/types";
import { PARTNER_MOOD_EMOJI } from "@/lib/partner/types";

interface PartnerChatProps {
  userId: string;
  partner: UserPartner;
  onClose: () => void;
  onInteraction: () => void;
}

interface Message {
  role: "user" | "partner";
  content: string;
}

export default function PartnerChat({
  userId,
  partner,
  onClose,
  onInteraction,
}: PartnerChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "partner",
      content: `你好呀，我是${partner.name}。今天过得怎么样？`,
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleSend() {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setSending(true);

    try {
      const res = await fetch("/api/partner/interact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, { role: "partner", content: data.reply }]);
        // 更新伙伴状态
        onInteraction();
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "partner", content: "嗯…我有点走神了，能再说一遍吗？" },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "partner", content: "网络不太好，等会儿再聊？" },
      ]);
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const moodEmoji = PARTNER_MOOD_EMOJI[partner.mood as PartnerMood] || "😊";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
      {/* 遮罩 */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 聊天面板 */}
      <div className="relative z-10 mx-3 mb-0 flex h-[70vh] w-full max-w-sm flex-col rounded-t-2xl border border-white/[0.08] bg-[#111827] shadow-2xl md:mb-0 md:h-[480px] md:rounded-2xl">
        {/* 顶部栏 */}
        <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3">
          <PartnerAvatar mood={partner.mood as PartnerMood} level={0} size="sm" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-white">{partner.name}</span>
              <span className="text-xs">{moodEmoji}</span>
            </div>
            <div className="text-[10px] text-white/40">Lv.{partner.level} · 亲密度 {partner.connection}/100</div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/40 hover:bg-white/[0.06] hover:text-white/60"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* 消息列表 */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          <div className="space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-blue-500/15 text-blue-200"
                      : "bg-white/[0.04] text-white/70"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-white/[0.04] px-3.5 py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-white/30" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* 输入区 */}
        <div className="border-t border-white/[0.06] px-4 py-3">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`和${partner.name}说点什么...`}
              disabled={sending}
              className="min-w-0 flex-1 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3.5 py-2 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-blue-500/30"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400 transition-all hover:bg-blue-500/25 disabled:opacity-30"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
