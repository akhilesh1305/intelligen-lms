"use client";



import { useEffect, useRef, useState } from "react";

import { Bot, Send, Sparkles } from "lucide-react";

import type { LearningRoadmap } from "@/lib/assistant/roadmap";

import { ChatMessageBubble } from "@/components/assistant/chat-message";

import { Button } from "@/components/ui/button";



type Message = {

  role: "user" | "assistant";

  content: string;

  roadmap?: LearningRoadmap;

};



const SUGGESTIONS = [

  "What should I focus on this week?",

  "Create a roadmap for my target role",

  "Which skills am I missing?",

  "How can I accelerate my career growth?",

];



export function CoachChatPanel({ userName }: { userName: string }) {

  const [messages, setMessages] = useState<Message[]>([

    {

      role: "assistant",

      content: `Hello ${userName.split(" ")[0]}! I'm your **Corporate Coach** — here to guide your learning and career growth with personalized, data-driven advice.\n\nSet your profile on the left, then ask me anything about skills, courses, or your career path.`,

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

      const res = await fetch("/api/coach/chat", {

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

          { role: "assistant", content: "Sorry, I couldn't respond. Please try again." },

        ]);

      }

    } catch {

      setMessages((prev) => [

        ...prev,

        { role: "assistant", content: "Connection error. Please try again." },

      ]);

    } finally {

      setLoading(false);

    }

  }



  return (

    <div className="flex h-[520px] flex-col rounded-lg border border-border bg-panel shadow-card">

      <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-3">

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-600 dark:bg-brand-500/20 dark:text-brand-300">

          <Sparkles className="h-4 w-4" />

        </div>

        <div>

          <p className="text-sm font-semibold text-ink">Corporate Coach</p>

          <p className="text-xs text-muted">Personalized learning & career guidance</p>

        </div>

      </div>



      <div className="flex-1 space-y-4 overflow-y-auto bg-surface p-4">

        {messages.map((msg, i) => (

          <ChatMessageBubble

            key={`${msg.role}-${i}`}

            role={msg.role}

            content={msg.content}

            roadmap={msg.roadmap}

          />

        ))}

        {loading ? (

          <div className="flex items-center gap-2 text-sm text-muted">

            <Bot className="h-4 w-4 animate-pulse" />

            Thinking…

          </div>

        ) : null}

        <div ref={bottomRef} />

      </div>



      <div className="border-t border-border bg-panel p-3">

        <div className="mb-2 flex flex-wrap gap-1.5">

          {SUGGESTIONS.map((s) => (

            <button

              key={s}

              type="button"

              onClick={() => sendMessage(s)}

              className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-medium text-ink transition-colors hover:border-brand-300 hover:bg-brand-50 dark:hover:bg-brand-500/10"

            >

              {s}

            </button>

          ))}

        </div>

        <form

          onSubmit={(e) => {

            e.preventDefault();

            sendMessage(input);

          }}

          className="flex gap-2"

        >

          <input

            value={input}

            onChange={(e) => setInput(e.target.value)}

            placeholder="Ask your corporate coach…"

            className="flex-1 rounded-lg border border-border bg-panel px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"

          />

          <Button type="submit" disabled={loading || !input.trim()}>

            <Send className="h-4 w-4" />

          </Button>

        </form>

      </div>

    </div>

  );

}


