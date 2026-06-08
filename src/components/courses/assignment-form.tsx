"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function AssignmentForm({
  assignmentId,
  title,
  description,
  submitted,
}: {
  assignmentId: string;
  title: string;
  description: string;
  submitted?: boolean;
}) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(submitted);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`/api/assignments/${assignmentId}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    setLoading(false);
    if (res.ok) {
      setDone(true);
      router.refresh();
    }
  }

  if (done) {
    return (
      <div className="rounded-sm border border-emerald-200 bg-emerald-50 p-5">
        <p className="font-semibold text-emerald-800">Assignment submitted</p>
        <p className="mt-1 text-sm text-emerald-700">{title}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-sm border border-slate-200 bg-white p-6 shadow-card"
    >
      <h3 className="text-lg font-bold text-ink">{title}</h3>
      <p className="mt-2 text-sm text-muted">{description}</p>
      <div className="mt-4">
        <Textarea
          label="Your submission"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your assignment response..."
          required
          rows={6}
        />
      </div>
      <Button type="submit" className="mt-4" disabled={loading || !content.trim()}>
        {loading ? "Submitting..." : "Submit assignment"}
      </Button>
    </form>
  );
}
