"use client";



import { useState } from "react";

import { FileText, Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";

import { VoiceNarrationControls } from "@/components/ai/voice-narration-controls";



export function LessonAiTools({

  lessonId,

  lessonTitle,

  content,

}: {

  lessonId: string;

  lessonTitle: string;

  content: string;

}) {

  const [summary, setSummary] = useState<{

    summary: string;

    keyPoints: string[];

    source: string;

  } | null>(null);

  const [loadingSummary, setLoadingSummary] = useState(false);

  const [error, setError] = useState("");



  async function handleSummarize() {

    setError("");

    setLoadingSummary(true);

    const res = await fetch("/api/ai/summarize", {

      method: "POST",

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({ lessonId }),

    });

    const data = await res.json();

    setLoadingSummary(false);

    if (!res.ok) {

      setError(data.error || "Could not summarize");

      return;

    }

    setSummary(data);

  }



  const narrateText = summary?.summary ?? content;



  return (

    <Card className="mt-6 border-brand-200 bg-gradient-to-br from-brand-50/50 to-white dark:from-brand-950/20 dark:to-slate-900">

      <CardContent className="pt-5">

        <div className="flex flex-wrap items-center gap-2">

          <Sparkles className="h-4 w-4 text-brand-600" />

          <span className="text-sm font-bold text-ink">AI learning tools</span>

        </div>

        <div className="mt-3 flex flex-wrap gap-2">

          <Button

            type="button"

            variant="outline"

            size="sm"

            onClick={handleSummarize}

            disabled={loadingSummary}

          >

            {loadingSummary ? (

              <Loader2 className="h-4 w-4 animate-spin" />

            ) : (

              <FileText className="h-4 w-4" />

            )}

            Summarize lesson

          </Button>

          <VoiceNarrationControls text={narrateText} />

        </div>

        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}

        {summary ? (

          <div className="mt-4 rounded-sm border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">

            <p className="text-xs font-semibold uppercase tracking-wide text-muted">

              AI summary · {summary.source}

            </p>

            <p className="mt-2 text-sm leading-relaxed text-ink">{summary.summary}</p>

            {summary.keyPoints.length > 0 ? (

              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">

                {summary.keyPoints.map((point) => (

                  <li key={point}>{point}</li>

                ))}

              </ul>

            ) : null}

            <div className="mt-3">

              <VoiceNarrationControls

                text={summary.summary}

                label="Listen to summary"

              />

            </div>

          </div>

        ) : null}

        <p className="mt-2 text-xs text-muted">

          Summarizes &quot;{lessonTitle}&quot;. Voice uses OpenAI TTS or browser speech

          with pause and resume.

        </p>

      </CardContent>

    </Card>

  );

}


