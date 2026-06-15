"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BookOpen, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

type PreviewModule = {
  title: string;
  summary: string;
  lessons: { title: string; summary: string }[];
};

export function AiCourseGenerator({
  courseId,
  courseTitle,
  courseDescription,
}: {
  courseId: string;
  courseTitle: string;
  courseDescription: string;
}) {
  const router = useRouter();
  const [topic, setTopic] = useState(courseTitle);
  const [description, setDescription] = useState(courseDescription);
  const [moduleCount, setModuleCount] = useState(3);
  const [lessonsPerModule, setLessonsPerModule] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<{
    modules: PreviewModule[];
    source: string;
  } | null>(null);

  async function generate(apply: boolean) {
    setError("");
    setLoading(true);

    const res = await fetch("/api/ai/course/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseId,
        topic,
        description,
        moduleCount,
        lessonsPerModule,
        apply,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Generation failed");
      return;
    }

    if (apply) {
      setPreview(null);
      router.refresh();
      return;
    }

    setPreview({ modules: data.modules, source: data.source });
  }

  return (
    <div className="rounded-lg border border-border bg-panel p-6 shadow-card">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-white">
          <BookOpen className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold text-ink">AI Course Generator</h3>
          <p className="text-sm text-muted">
            Generate modules, lessons, and summaries from a topic
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Input
          label="Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Modules"
            type="number"
            min={1}
            max={6}
            value={moduleCount}
            onChange={(e) => setModuleCount(Number(e.target.value))}
          />
          <Input
            label="Lessons / module"
            type="number"
            min={1}
            max={5}
            value={lessonsPerModule}
            onChange={(e) => setLessonsPerModule(Number(e.target.value))}
          />
        </div>
      </div>
      <Textarea
        label="Description"
        className="mt-4"
        rows={2}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={() => generate(false)} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Preview outline
        </Button>
        {preview ? (
          <Button variant="outline" onClick={() => generate(true)} disabled={loading}>
            Apply to course
          </Button>
        ) : null}
      </div>

      {error ? (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : null}

      {preview ? (
        <div className="mt-6 space-y-4">
          <Badge variant="brand">Source: {preview.source}</Badge>
          {preview.modules.map((mod, i) => (
            <div
              key={mod.title}
              className="rounded-lg border border-border bg-surface p-4"
            >
              <p className="font-semibold text-ink">
                Module {i + 1}: {mod.title}
              </p>
              <p className="mt-1 text-sm text-muted">{mod.summary}</p>
              <ul className="mt-2 space-y-1 text-sm text-ink">
                {mod.lessons.map((l) => (
                  <li key={l.title}>· {l.title}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
