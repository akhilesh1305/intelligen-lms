import { Sparkles } from "lucide-react";
import { ChatPanel } from "@/components/assistant/chat-panel";

export default function AssistantPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-brand-600">
          <Sparkles className="h-7 w-7" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-ink">AI Learning Assistant</h1>
        <p className="mt-2 text-muted">
          Get course answers, personalized roadmaps, and smart recommendations
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 shadow-card">
        <ChatPanel open fullPage />
      </div>
    </div>
  );
}
