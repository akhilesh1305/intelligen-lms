"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Question = {
  id: string;
  question: string;
  options: string[];
  order: number;
};

export function QuizTaker({
  quizId,
  title,
  passingScore,
  questions,
  previousScore,
  passed: wasPassed,
}: {
  quizId: string;
  title: string;
  passingScore: number;
  questions: Question[];
  previousScore?: number;
  passed?: boolean;
}) {
  const router = useRouter();
  const [answers, setAnswers] = useState<number[]>(
    questions.map(() => -1)
  );
  const [result, setResult] = useState<{
    score: number;
    passed: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (answers.some((a) => a < 0)) return;
    setLoading(true);

    const res = await fetch(`/api/quizzes/${quizId}/submit`, {
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

  if (wasPassed && previousScore !== undefined) {
    return (
      <div className="rounded-sm border border-emerald-200 bg-emerald-50 p-5">
        <p className="font-semibold text-emerald-800">Quiz passed!</p>
        <p className="mt-1 text-sm text-emerald-700">
          Score: {previousScore}% (required: {passingScore}%)
        </p>
      </div>
    );
  }

  if (result) {
    return (
      <div
        className={cn(
          "rounded-sm border p-5",
          result.passed
            ? "border-emerald-200 bg-emerald-50"
            : "border-amber-200 bg-amber-50"
        )}
      >
        <p className="font-semibold text-ink">
          {result.passed ? "Congratulations! You passed." : "Not quite — try again."}
        </p>
        <p className="mt-1 text-sm text-muted">
          Your score: {result.score}% (required: {passingScore}%)
        </p>
        {!result.passed && (
          <Button
            className="mt-4"
            size="sm"
            onClick={() => {
              setResult(null);
              setAnswers(questions.map(() => -1));
            }}
          >
            Retry quiz
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-slate-200 bg-white p-6 shadow-card">
      <h3 className="text-lg font-bold text-ink">{title}</h3>
      <p className="mt-1 text-sm text-muted">
        Pass with {passingScore}% or higher · {questions.length} questions
      </p>

      <div className="mt-6 space-y-6">
        {questions.map((q, qi) => {
          const options = q.options;
          return (
            <div key={q.id}>
              <p className="font-medium text-ink">
                {qi + 1}. {q.question}
              </p>
              <div className="mt-3 space-y-2">
                {options.map((opt, oi) => (
                  <label
                    key={oi}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-sm border px-4 py-3 text-sm transition-colors",
                      answers[qi] === oi
                        ? "border-brand-500 bg-brand-50"
                        : "border-slate-200 hover:border-slate-300"
                    )}
                  >
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      checked={answers[qi] === oi}
                      onChange={() => {
                        const next = [...answers];
                        next[qi] = oi;
                        setAnswers(next);
                      }}
                      className="text-brand-500"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          );
        })}
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
