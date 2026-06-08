"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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

  async function handleComplete() {
    setLoading(true);
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
      <div className="flex items-center gap-2 text-emerald-600">
        <CheckCircle className="h-5 w-5" />
        <span className="font-medium">Lesson completed</span>
      </div>
    );
  }

  return (
    <Button onClick={handleComplete} disabled={loading}>
      {loading ? "Saving..." : "Mark as complete"}
    </Button>
  );
}
