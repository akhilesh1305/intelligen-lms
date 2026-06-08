"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BookOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function LessonForm({
  moduleId,
  moduleTitle,
  lessonCount = 0,
}: {
  moduleId: string;
  moduleTitle: string;
  lessonCount?: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(lessonCount === 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const res = await fetch(`/api/modules/${moduleId}/lessons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formData.get("title"),
        content: formData.get("content"),
        videoUrl: formData.get("videoUrl") || undefined,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to add lesson");
      return;
    }

    setOpen(lessonCount === 0);
    router.refresh();
    (e.target as HTMLFormElement).reset();
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-sm border-2 border-dashed border-brand-300 bg-brand-50/50 px-4 py-3 text-sm font-semibold text-brand-700 transition-colors hover:border-brand-500 hover:bg-brand-50"
      >
        <Plus className="h-4 w-4" />
        Add lesson to {moduleTitle}
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-sm border-2 border-brand-200 bg-brand-50/30 p-4"
    >
      <div className="flex items-center gap-2 text-sm font-semibold text-brand-700">
        <BookOpen className="h-4 w-4" />
        New lesson in {moduleTitle}
      </div>

      {error && (
        <p className="rounded-sm bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <Input
        name="title"
        label="Lesson title"
        placeholder="e.g. Introduction to Cloud Computing"
        required
      />
      <Textarea
        name="content"
        label="Lesson content"
        placeholder="Write your lesson content here..."
        required
        rows={6}
      />
      <Input
        name="videoUrl"
        label="Video URL (optional)"
        placeholder="https://www.youtube.com/embed/..."
      />
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={loading}>
          {loading ? "Saving..." : "Save lesson"}
        </Button>
        {lessonCount > 0 && (
          <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
