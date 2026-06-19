"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Send, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LearningRoadmap } from "@/lib/assistant/roadmap";
import { ChatMessageBubble } from "./chat-message";

type Message = {
  role: "user" | "assistant";
  content: string;
  roadmap?: LearningRoadmap;
};

const SUGGESTIONS = [
  "Create a roadmap to become a web developer",
  "What courses are available?",
  "Recommend a course for me",
  "How am I doing with my progress?",
];

export function ChatPanel({
  open,
  onClose = () => {},
  fullPage = false,
}: {
  open: boolean;
  onClose?: () => void;
  fullPage?: boolean;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm your **AI Learning Assistant**. I can answer course questions, track your progress, and build personalized learning roadmaps.\n\nTry asking: *\"Create a roadmap to become a data scientist\"*",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text.trim(),
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.message,
            roadmap: data.roadmap,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Sorry, something went wrong. Please try again." },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Connection error. Please try again." },
      ]);
    }

    setLoading(false);
  }

  if (!open && !fullPage) return null;

  return (
    <div
      data-screenshot-clutter={fullPage ? undefined : ""}
      className={cn(
        "flex flex-col bg-panel",
        fullPage
          ? "min-h-[calc(100vh-8rem)]"
          : "fixed z-50 flex flex-col border border-slate-200 shadow-elevated dark:border-slate-700 max-sm:inset-0 max-sm:h-full max-sm:w-full max-sm:rounded-none sm:bottom-4 sm:right-4 sm:h-[min(600px,calc(100vh-6rem))] sm:w-[min(400px,calc(100vw-2rem))] sm:rounded-lg safe-bottom"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border bg-gradient-to-r from-brand-600 to-brand-700 px-4 py-3 text-white">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="font-semibold">AI Learning Assistant</p>
          <p className="text-xs text-brand-100">Courses · Roadmaps · Advice</p>
        </div>
        {!fullPage && (
          <button
            onClick={onClose}
            className="rounded-sm p-1.5 hover:bg-white/20"
            aria-label="Close chat"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto bg-surface p-4">
        {messages.map((msg, i) => (
          <ChatMessageBubble
            key={i}
            role={msg.role}
            content={msg.content}
            roadmap={msg.roadmap}
          />
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface dark:bg-slate-800">
              <Bot className="h-4 w-4 text-brand-600" />
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-border bg-panel px-4 py-3 shadow-sm">
              <span className="h-2 w-2 animate-bounce rounded-full bg-brand-400 [animation-delay:0ms]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-brand-400 [animation-delay:150ms]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-brand-400 [animation-delay:300ms]" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 border-t border-border bg-panel px-4 py-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-ink transition-colors hover:border-brand-300 hover:text-brand-600 dark:text-muted dark:hover:text-brand-300"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        className="flex gap-2 border-t border-border bg-panel p-4"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about courses or request a roadmap..."
          className="flex-1 rounded-lg border border-border bg-panel px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="flex h-10 w-10 items-center justify-center rounded-sm bg-brand-600 text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
