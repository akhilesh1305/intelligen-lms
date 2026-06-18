"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CompleteLessonButton({
  lessonId,
  completed,
}: {
  lessonId: string;
  completed: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isDone, setIsDone] = useState(completed);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsDone(completed);
    setError(null);
  }, [lessonId, completed]);

  async function handleComplete() {
    setLoading(true);
    setError(null);

    try {
      if (!navigator.onLine) {
        setError("You are offline. Reconnect to save your progress.");
        return;
      }

      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, completed: true }),
      });

      if (res.ok) {
        setIsDone(true);
        router.refresh();
        return;
      }

      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "Could not save progress. Please try again.");
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  if (isDone) {
    return (
      <div className="flex items-center gap-2 text-emerald-600">
        <CheckCircle className="h-5 w-5" />
        <span className="font-medium">Lesson completed</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Button type="button" onClick={handleComplete} disabled={loading}>
        {loading ? "Saving..." : "Mark as complete"}
      </Button>
      {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
    </div>
  );
}
