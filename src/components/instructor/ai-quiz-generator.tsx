"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Sparkles, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type Module = { id: string; title: string; lessonCount: number };

type PreviewQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
};

export function AiQuizGenerator({
  courseId,
  modules,
}: {
  courseId: string;
  modules: Module[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [questionCount, setQuestionCount] = useState(5);
  const [passingScore, setPassingScore] = useState(70);
  const [moduleId, setModuleId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<{
    questions: PreviewQuestion[];
    source: string;
    quizTitle: string;
  } | null>(null);

  async function handleGenerate() {
    setError("");
    setLoading(true);
    setPreview(null);

    const res = await fetch(`/api/courses/${courseId}/quizzes/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim() || undefined,
        questionCount,
        passingScore,
        moduleId: moduleId || undefined,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Failed to generate quiz");
      return;
    }

    setPreview({
      questions: data.questions,
      source: data.source,
      quizTitle: data.title,
    });
    router.refresh();
  }

  const totalLessons = modules.reduce((s, m) => s + m.lessonCount, 0);

  return (
    <div className="rounded-sm border border-brand-200 bg-gradient-to-br from-brand-50 to-white p-6 shadow-card">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-brand-600 text-white">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold text-ink">AI Quiz Generator</h3>
          <p className="text-sm text-muted">
            Auto-generate questions from your lesson content
          </p>
        </div>
      </div>

      {totalLessons === 0 ? (
        <p className="mt-4 rounded-sm bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Add lessons with content first — the AI reads your course material to
          create relevant questions.
        </p>
      ) : (
        <div className="mt-5 space-y-4">
          <Input
            id="quiz-title"
            label="Quiz title (optional)"
            placeholder="e.g. Module 1 Assessment"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-ink">
                Source content
              </label>
              <select
                value={moduleId}
                onChange={(e) => setModuleId(e.target.value)}
                className="flex h-11 w-full rounded-sm border border-slate-300 bg-white px-3.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="">Entire course</option>
                {modules.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title} ({m.lessonCount} lessons)
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-ink">
                Number of questions
              </label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="flex h-11 w-full rounded-sm border border-slate-300 bg-white px-3.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              >
                {[3, 5, 7, 10, 15].map((n) => (
                  <option key={n} value={n}>
                    {n} questions
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-ink">
              Passing score (%)
            </label>
            <input
              type="range"
              min={50}
              max={100}
              step={5}
              value={passingScore}
              onChange={(e) => setPassingScore(Number(e.target.value))}
              className="w-full accent-brand-600"
            />
            <p className="text-sm text-muted">{passingScore}% required to pass</p>
          </div>

          {error && (
            <p className="rounded-sm bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <Button onClick={handleGenerate} disabled={loading} className="w-full sm:w-auto">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating quiz...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate quiz with AI
              </>
            )}
          </Button>
        </div>
      )}

      {preview && (
        <div className="mt-6 border-t border-brand-100 pt-6">
          <div className="flex flex-wrap items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <span className="font-semibold text-ink">
              Quiz created: {preview.quizTitle}
            </span>
            <Badge variant={preview.source === "openai" ? "brand" : "info"}>
              {preview.source === "openai" ? "AI generated" : "Smart generated"}
            </Badge>
          </div>

          <div className="mt-4 space-y-4">
            {preview.questions.map((q, i) => (
              <div
                key={i}
                className="rounded-sm border border-slate-200 bg-white p-4"
              >
                <p className="font-medium text-ink">
                  {i + 1}. {q.question}
                </p>
                <ul className="mt-2 space-y-1">
                  {q.options.map((opt, oi) => (
                    <li
                      key={oi}
                      className={`text-sm ${
                        oi === q.correctIndex
                          ? "font-semibold text-emerald-700"
                          : "text-muted"
                      }`}
                    >
                      {String.fromCharCode(65 + oi)}. {opt}
                      {oi === q.correctIndex && " ✓"}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
