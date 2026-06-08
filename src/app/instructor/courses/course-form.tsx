"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type CourseFormProps = {
  course?: {
    id: string;
    title: string;
    description: string;
    published: boolean;
  };
};

export function CourseForm({ course }: CourseFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const body = {
      title: formData.get("title"),
      description: formData.get("description"),
      published: formData.get("published") === "on",
    };

    const url = course
      ? `/api/courses/${course.id}`
      : "/api/courses";
    const method = course ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Failed to save course");
      return;
    }

    router.push(`/instructor/courses/${data.id || course?.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <Input
        id="title"
        name="title"
        label="Course title"
        placeholder="Introduction to Web Development"
        defaultValue={course?.title}
        required
      />
      <Textarea
        id="description"
        name="description"
        label="Description"
        placeholder="What will students learn in this course?"
        defaultValue={course?.description}
        required
      />
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          name="published"
          defaultChecked={course?.published}
          className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
        />
        Submit for approval (admin review required to go live)
      </label>
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : course ? "Update course" : "Create course"}
      </Button>
    </form>
  );
}
