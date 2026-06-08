"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function ReplyForm({ threadId }: { threadId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    await fetch("/api/forum/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        threadId,
        content: formData.get("content"),
      }),
    });

    setLoading(false);
    router.refresh();
    (e.target as HTMLFormElement).reset();
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-sm border border-slate-200 bg-white p-5 shadow-card">
      <Textarea name="content" label="Your reply" placeholder="Write a reply..." required rows={4} />
      <Button type="submit" className="mt-3" disabled={loading}>
        {loading ? "Posting..." : "Post reply"}
      </Button>
    </form>
  );
}
