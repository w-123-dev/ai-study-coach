"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import {
  BookOpen, Send, Loader2, LogOut, Sparkles, FileText,
} from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export default function ChatPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [noProfile, setNoProfile] = useState(false);
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [greeting, setGreeting] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? "早上好" : hour < 18 ? "下午好" : "晚上好");
  }, []);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.push("/login");
        return;
      }

      // 检测是否已填写考研资料
      const { data: profile } = await supabase
        .from("student_profiles")
        .select("id")
        .eq("user_id", data.user.id)
        .single();

      if (!profile) {
        setNoProfile(true);
        setLoading(false);
        return;
      }

      const { data: msgData } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("user_id", data.user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (msgData) {
        setMessages(msgData.reverse());
      }

      setLoading(false);
    });
  }, [router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const userMessage = input.trim();
    setInput("");
    setSending(true);

    const tempUser: ChatMessage = {
      id: "temp-" + Date.now(), role: "user", content: userMessage,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUser]);

    try {
      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      if (res.ok) {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: latest } = await supabase
            .from("chat_messages")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(2);

          if (latest) {
            const newMsgs = latest.reverse();
            setMessages((prev) => {
              const filtered = prev.filter((m) => !m.id.startsWith("temp-"));
              for (const nm of newMsgs) {
                if (!filtered.find((f) => f.id === nm.id)) filtered.push(nm);
              }
              return filtered;
            });
          }
        }
      } else {
        const data = await res.json();
        console.warn("发送失败:", data.error);
      }
    } catch (e) {
      console.warn("请求失败:", e);
    }

    setSending(false);
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (noProfile) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-5">
            <Link href="/" className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <span className="text-[15px] font-semibold text-gray-900">AI考研教练</span>
            </Link>
            <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-gray-600">退出</button>
          </div>
        </header>
        <main className="flex flex-1 items-center justify-center px-5">
          <div className="text-center">
            <FileText className="mx-auto h-8 w-8 text-gray-300" />
            <h2 className="mt-4 text-lg font-semibold text-gray-900">请先填写考研信息</h2>
            <p className="mt-2 text-sm text-gray-500">AI需要了解你的目标才能和你聊学习</p>
            <Link href="/setup"
              className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-gray-900 px-5 text-sm font-medium text-white hover:bg-gray-800">
              去填写
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <span className="text-[15px] font-semibold text-gray-900">AI考研教练</span>
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600">
            <LogOut className="h-4 w-4" />退出
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-5 py-4">
        <div className="mx-auto max-w-3xl">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center pt-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
                <Sparkles className="h-7 w-7 text-blue-600" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-gray-900">{greeting}，有什么想问的？</h2>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-gray-500">
                可以问我关于学习计划、复习策略、<br />拖延问题、考试压力等等。
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {["今天的学习计划怎么安排？", "最近总是拖延怎么办？", "我的复习进度正常吗？"].map((q) => (
                  <button key={q} onClick={() => { setInput(q); inputRef.current?.focus(); }}
                    className="rounded-full border border-gray-200 px-3.5 py-1.5 text-xs text-gray-500 hover:border-gray-300 hover:text-gray-700">
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed md:max-w-[70%] ${
                  msg.role === "user"
                    ? "bg-gray-900 text-white"
                    : "border border-gray-100 bg-gray-50 text-gray-900"
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <p className="mt-1 text-[10px] text-gray-400">
                    {new Date(msg.created_at).toLocaleTimeString("zh-CN", {
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>
      </main>

      <div className="border-t border-gray-100 bg-white px-5 py-3">
        <form onSubmit={handleSend} className="mx-auto flex max-w-3xl items-center gap-2">
          <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="输入你的问题..." disabled={sending}
            className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:outline-none disabled:opacity-50" />
          <button type="submit" disabled={!input.trim() || sending}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-40">
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
