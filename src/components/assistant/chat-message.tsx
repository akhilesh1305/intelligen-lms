import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LearningRoadmap } from "@/lib/assistant/roadmap";
import { RoadmapCard } from "./roadmap-card";

function renderMarkdown(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-brand-600 underline hover:text-brand-700">$1</a>')
    .replace(/\n/g, "<br />");
}

export function ChatMessageBubble({
  role,
  content,
  roadmap,
}: {
  role: "user" | "assistant";
  content: string;
  roadmap?: LearningRoadmap;
}) {
  const isUser = role === "user";

  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-brand-600 text-white" : "bg-slate-100 text-brand-600"
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div className={cn("max-w-[85%]", isUser && "text-right")}>
        <div
          className={cn(
            "inline-block rounded-lg px-4 py-2.5 text-sm leading-relaxed",
            isUser
              ? "bg-brand-600 text-white"
              : "bg-white text-ink shadow-sm border border-slate-100"
          )}
        >
          {isUser ? (
            content
          ) : (
            <div
              className="prose prose-sm max-w-none text-left [&_a]:font-medium"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
            />
          )}
        </div>
        {roadmap && !isUser && <RoadmapCard roadmap={roadmap} />}
      </div>
    </div>
  );
}
