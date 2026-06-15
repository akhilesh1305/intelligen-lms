"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export function AnnouncementForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const body = {
      title: formData.get("title"),
      content: formData.get("content"),
    };

    const res = await fetch("/api/feed/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setLoading(false);

    if (!res.ok) {
      setError("Could not post announcement. Check title and content.");
      return;
    }

    e.currentTarget.reset();
    router.refresh();
  }

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="mb-4 flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-brand-600" />
          <h2 className="font-bold text-ink">Post an announcement</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="title"
            placeholder="Announcement title"
            required
            minLength={3}
          />
          <Textarea
            name="content"
            placeholder="Share updates with the learning community..."
            rows={3}
            required
            minLength={10}
          />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button type="submit" disabled={loading}>
            {loading ? "Posting..." : "Publish announcement"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
