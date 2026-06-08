"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function NewThreadForm({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/forum/threads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseId,
        title: formData.get("title"),
        content: formData.get("content"),
      }),
    });

    setLoading(false);
    if (res.ok) {
      const data = await res.json();
      router.push(`/courses/${courseId}/forum/${data.id}`);
      router.refresh();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-sm border border-slate-200 bg-white p-5 shadow-card"
    >
      <h3 className="font-semibold text-ink">Start a discussion</h3>
      <div className="mt-4 space-y-3">
        <Input name="title" label="Title" placeholder="What's your question?" required />
        <Textarea name="content" label="Message" placeholder="Describe your topic..." required rows={4} />
        <Button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Post discussion"}
        </Button>
      </div>
    </form>
  );
}
