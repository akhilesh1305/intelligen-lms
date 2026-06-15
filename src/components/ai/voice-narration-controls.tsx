"use client";

import { useState } from "react";
import { Loader2, Pause, Play, Square, Volume2 } from "lucide-react";
import { useVoiceNarration } from "@/hooks/use-voice-narration";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function VoiceNarrationControls({
  text,
  label = "Listen (AI voice)",
  compact = false,
  className,
}: {
  text: string;
  label?: string;
  compact?: boolean;
  className?: string;
}) {
  const { state, speak, pause, resume, stop } = useVoiceNarration();
  const [error, setError] = useState("");

  async function handleSpeak() {
    setError("");
    try {
      await speak(text);
    } catch {
      setError("Narration unavailable");
    }
  }

  if (compact) {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        {state === "idle" ? (
          <button
            type="button"
            onClick={handleSpeak}
            className="rounded-md p-1 text-muted transition-colors hover:bg-surface hover:text-brand-600"
            title="Listen with AI voice"
            aria-label="Listen with AI voice"
          >
            <Volume2 className="h-4 w-4" />
          </button>
        ) : null}
        {state === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin text-brand-600" />
        ) : null}
        {state === "playing" ? (
          <>
            <button
              type="button"
              onClick={pause}
              className="rounded-md p-1 text-brand-600 hover:bg-surface"
              title="Pause"
              aria-label="Pause narration"
            >
              <Pause className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={stop}
              className="rounded-md p-1 text-muted hover:bg-surface hover:text-ink"
              title="Stop"
              aria-label="Stop narration"
            >
              <Square className="h-3.5 w-3.5" />
            </button>
          </>
        ) : null}
        {state === "paused" ? (
          <>
            <button
              type="button"
              onClick={resume}
              className="rounded-md p-1 text-brand-600 hover:bg-surface"
              title="Resume"
              aria-label="Resume narration"
            >
              <Play className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={stop}
              className="rounded-md p-1 text-muted hover:bg-surface hover:text-ink"
              title="Stop"
              aria-label="Stop narration"
            >
              <Square className="h-3.5 w-3.5" />
            </button>
          </>
        ) : null}
        {error ? <span className="sr-only">{error}</span> : null}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {state === "idle" ? (
        <Button type="button" variant="outline" size="sm" onClick={handleSpeak}>
          <Volume2 className="h-4 w-4" />
          {label}
        </Button>
      ) : null}
      {state === "loading" ? (
        <Button type="button" variant="outline" size="sm" disabled>
          <Loader2 className="h-4 w-4 animate-spin" />
          Preparing voice…
        </Button>
      ) : null}
      {state === "playing" ? (
        <>
          <Button type="button" variant="outline" size="sm" onClick={pause}>
            <Pause className="h-4 w-4" />
            Pause
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={stop}>
            <Square className="h-4 w-4" />
            Stop
          </Button>
        </>
      ) : null}
      {state === "paused" ? (
        <>
          <Button type="button" variant="outline" size="sm" onClick={resume}>
            <Play className="h-4 w-4" />
            Resume
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={stop}>
            <Square className="h-4 w-4" />
            Stop
          </Button>
        </>
      ) : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
