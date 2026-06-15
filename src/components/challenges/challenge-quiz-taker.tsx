"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Question = {
  id: string;
  question: string;
  options: string[];
  order: number;
};

export function ChallengeQuizTaker({
  challengeId,
  title,
  source,
  questions,
  previousScore,
  pointsEarned: previousPoints,
}: {
  challengeId: string;
  title: string;
  source: string;
  questions: Question[];
  previousScore?: number;
  pointsEarned?: number;
}) {
  const router = useRouter();
  const [answers, setAnswers] = useState<number[]>(questions.map(() => -1));
  const [result, setResult] = useState<{
    score: number;
    pointsEarned: number;
    alreadyCompleted?: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const completed = previousPoints !== undefined;

  async function handleSubmit() {
    if (answers.some((a) => a < 0)) return;
    setLoading(true);

    const res = await fetch(`/api/challenges/${challengeId}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setResult(data);
      router.refresh();
    }
  }

  if (completed && previousPoints !== undefined) {
    const sign = previousPoints >= 0 ? "+" : "";
    return (
      <div className="rounded-sm border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900 dark:bg-emerald-950/30">
        <p className="font-semibold text-emerald-800 dark:text-emerald-300">
          Quiz completed
        </p>
        <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">
          {previousScore !== undefined ? `${previousScore}% correct · ` : ""}
          {sign}
          {previousPoints} pts this week
        </p>
      </div>
    );
  }

  if (result) {
    const sign = result.pointsEarned >= 0 ? "+" : "";
    return (
      <div className="rounded-sm border border-brand-200 bg-brand-50 p-5 dark:border-brand-900 dark:bg-brand-950/30">
        <p className="font-semibold text-ink">
          {result.alreadyCompleted ? "Already completed" : "Quiz submitted!"}
        </p>
        <p className="mt-1 text-sm text-muted">
          Score: {result.score}% · {sign}
          {result.pointsEarned} pts toward this week&apos;s leaderboard
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-panel p-6 shadow-card">
      <div className="flex flex-wrap items-center gap-2">
        <Sparkles className="h-5 w-5 text-brand-600 dark:text-brand-400" />
        <h3 className="text-lg font-bold text-ink">{title}</h3>
        <Badge variant={source === "openai" ? "brand" : "info"} className="ml-auto">
          AI {source}
        </Badge>
      </div>
      <p className="mt-2 text-sm text-muted">
        +5 pts per correct answer · −1 pt per wrong answer · One attempt per quiz
      </p>

      <div className="mt-6 space-y-6">
        {questions.map((q, qi) => (
          <div key={q.id}>
            <p className="font-medium text-ink">
              {qi + 1}. {q.question}
            </p>
            <div className="mt-3 space-y-2">
              {q.options.map((opt, oi) => (
                <label
                  key={oi}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm text-ink transition-colors",
                    answers[qi] === oi
                      ? "border-brand-500 bg-brand-500/10 ring-1 ring-brand-500/25 dark:border-brand-400 dark:bg-brand-500/20 dark:ring-brand-400/30"
                      : "border-border bg-surface hover:border-brand-400/50 hover:bg-panel"
                  )}
                >
                  <input
                    type="radio"
                    name={`cq-${q.id}`}
                    checked={answers[qi] === oi}
                    onChange={() => {
                      const next = [...answers];
                      next[qi] = oi;
                      setAnswers(next);
                    }}
                    className="accent-brand-600"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Button
        className="mt-6"
        onClick={handleSubmit}
        disabled={loading || answers.some((a) => a < 0)}
      >
        {loading ? "Submitting..." : "Submit quiz"}
      </Button>
    </div>
  );
}
