"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function CourseReviewForm({
  courseId,
  initialRating,
  initialComment,
}: {
  courseId: string;
  initialRating?: number;
  initialComment?: string | null;
}) {
  const router = useRouter();
  const [rating, setRating] = useState(initialRating ?? 0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState(initialComment ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating < 1) {
      setError("Please select a star rating");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/courses/${courseId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          comment: comment.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Could not save review");
        return;
      }
      setSuccess(true);
      router.refresh();
    } catch {
      setError("Could not save review");
    } finally {
      setSaving(false);
    }
  }

  const active = hover || rating;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-panel p-5 shadow-card">
      <div>
        <p className="text-sm font-semibold text-ink">Your rating</p>
        <div className="mt-2 flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="rounded p-0.5 transition-transform hover:scale-110"
              aria-label={`Rate ${star} stars`}
            >
              <Star
                className={cn(
                  "h-7 w-7",
                  star <= active
                    ? "fill-amber-400 text-amber-400"
                    : "text-border dark:text-slate-600"
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <Textarea
        label="Your review (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share what you liked about this course..."
        rows={4}
      />

      {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
      {success ? (
        <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
          Thanks! Your review has been saved.
        </p>
      ) : null}

      <Button type="submit" disabled={saving}>
        {saving ? "Saving…" : initialRating ? "Update review" : "Submit review"}
      </Button>
    </form>
  );
}
