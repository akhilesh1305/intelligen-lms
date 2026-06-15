"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle, CloudOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { queueProgressSync } from "@/lib/offline/db";

export function CompleteLessonButton({
  lessonId,
  courseId,
  completed,
}: {
  lessonId: string;
  courseId: string;
  completed: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isDone, setIsDone] = useState(completed);
  const [queued, setQueued] = useState(false);

  async function handleComplete() {
    setLoading(true);

    if (!navigator.onLine) {
      await queueProgressSync({ lessonId, courseId, completed: true });
      setIsDone(true);
      setQueued(true);
      setLoading(false);
      return;
    }

    const res = await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId, completed: true }),
    });
    setLoading(false);

    if (res.ok) {
      setIsDone(true);
      router.refresh();
    }
  }

  if (isDone) {
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-emerald-600">
          <CheckCircle className="h-5 w-5" />
          <span className="font-medium">Lesson completed</span>
        </div>
        {queued ? (
          <p className="flex items-center gap-1 text-sm text-amber-700 dark:text-amber-400">
            <CloudOff className="h-4 w-4" />
            Saved offline — will sync when you&apos;re back online
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <Button onClick={handleComplete} disabled={loading}>
      {loading ? "Saving..." : "Mark as complete"}
    </Button>
  );
}
