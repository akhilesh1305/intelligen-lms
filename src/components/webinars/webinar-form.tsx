"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type CourseOption = { id: string; title: string };

export function WebinarForm({
  courses,
  webinar,
}: {
  courses: CourseOption[];
  webinar?: {
    id: string;
    title: string;
    description: string;
    scheduledAt: string;
    durationMinutes: number;
    meetingUrl: string | null;
    courseId: string | null;
    maxAttendees: number | null;
  };
}) {
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
      description: formData.get("description"),
      scheduledAt: formData.get("scheduledAt"),
      durationMinutes: Number(formData.get("durationMinutes") || 60),
      meetingUrl: formData.get("meetingUrl") || "",
      courseId: formData.get("courseId") || null,
      maxAttendees: formData.get("maxAttendees")
        ? Number(formData.get("maxAttendees"))
        : null,
    };

    const url = webinar ? `/api/webinars/${webinar.id}` : "/api/webinars";
    const method = webinar ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setLoading(false);

    if (!res.ok) {
      setError("Could not save webinar. Check all fields.");
      return;
    }

    const data = await res.json();
    router.push(`/webinars/${webinar?.id ?? data.id}`);
    router.refresh();
  }

  const defaultDate = webinar
    ? new Date(webinar.scheduledAt).toISOString().slice(0, 16)
    : "";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="title"
        label="Title"
        defaultValue={webinar?.title}
        required
        minLength={3}
      />
      <Textarea
        name="description"
        label="Description"
        rows={4}
        defaultValue={webinar?.description}
        required
        minLength={10}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          name="scheduledAt"
          label="Date & time"
          type="datetime-local"
          defaultValue={defaultDate}
          required
        />
        <Input
          name="durationMinutes"
          label="Duration (minutes)"
          type="number"
          min={15}
          max={480}
          defaultValue={webinar?.durationMinutes ?? 60}
          required
        />
      </div>
      <Input
        name="meetingUrl"
        label="Meeting link (Zoom, Meet, Teams)"
        type="url"
        placeholder="https://..."
        defaultValue={webinar?.meetingUrl ?? ""}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="courseId" className="block text-sm font-semibold text-ink">
            Related course (optional)
          </label>
          <select
            id="courseId"
            name="courseId"
            defaultValue={webinar?.courseId ?? ""}
            className="flex h-11 w-full rounded-sm border border-slate-300 bg-white px-3.5 text-sm dark:border-slate-600 dark:bg-slate-900"
          >
            <option value="">None</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
        <Input
          name="maxAttendees"
          label="Max attendees (optional)"
          type="number"
          min={1}
          defaultValue={webinar?.maxAttendees ?? ""}
        />
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : webinar ? "Update webinar" : "Schedule webinar"}
      </Button>
    </form>
  );
}
