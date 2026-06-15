"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileUploadField } from "@/components/ui/file-upload-field";
import { CourseThumbnail } from "@/components/courses/course-thumbnail";

type PrerequisiteOption = { id: string; title: string };

type CourseFormProps = {
  course?: {
    id: string;
    title: string;
    description: string;
    published: boolean;
    pricePaise: number;
    thumbnail?: string | null;
    skillLevel?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
    prerequisiteCourseId?: string | null;
  };
  prerequisiteOptions?: PrerequisiteOption[];
};

export function CourseForm({ course, prerequisiteOptions = [] }: CourseFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [thumbnailLoading, setThumbnailLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState(course?.thumbnail ?? null);
  const [thumbnailMessage, setThumbnailMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const prereq = formData.get("prerequisiteCourseId");
    const body = {
      title: formData.get("title"),
      description: formData.get("description"),
      published: formData.get("published") === "on",
      priceInRupees: Number(formData.get("priceInRupees") || 0),
      skillLevel: formData.get("skillLevel") || "BEGINNER",
      prerequisiteCourseId: prereq ? String(prereq) : null,
    };

    const url = course ? `/api/courses/${course.id}` : "/api/courses";
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

  async function handleThumbnailUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!course) return;

    setThumbnailMessage("");
    setThumbnailLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await fetch(`/api/courses/${course.id}/thumbnail`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setThumbnailLoading(false);

    if (!res.ok) {
      setThumbnailMessage(data.error || "Failed to upload thumbnail");
      return;
    }

    setThumbnail(data.course.thumbnail);
    setThumbnailMessage("Thumbnail updated.");
    router.refresh();
    (e.target as HTMLFormElement).reset();
  }

  return (
    <div className="space-y-6">
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
          placeholder="What will learners gain from this course?"
          defaultValue={course?.description}
          required
        />
        <Input
          id="priceInRupees"
          name="priceInRupees"
          type="number"
          min={0}
          step={1}
          label="Price (₹ INR)"
          placeholder="0 for free course"
          defaultValue={course ? course.pricePaise / 100 : 0}
        />
      <p className="-mt-2 text-xs text-muted">
        Set to 0 for a free course. Paid courses can also be unlocked with an All Access subscription.
      </p>
      <div className="space-y-1.5">
        <label htmlFor="skillLevel" className="block text-sm font-semibold text-ink">
          Skill level
        </label>
        <select
          id="skillLevel"
          name="skillLevel"
          defaultValue={course?.skillLevel ?? "BEGINNER"}
          className="flex h-11 w-full rounded-sm border border-slate-300 bg-white px-3.5 text-sm text-ink focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-600 dark:bg-slate-900"
        >
          <option value="BEGINNER">Beginner</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="ADVANCED">Advanced</option>
        </select>
      </div>
      {course ? (
        <div className="space-y-1.5">
          <label
            htmlFor="prerequisiteCourseId"
            className="block text-sm font-semibold text-ink"
          >
            Prerequisite course (optional)
          </label>
          <select
            id="prerequisiteCourseId"
            name="prerequisiteCourseId"
            defaultValue={course.prerequisiteCourseId ?? ""}
            className="flex h-11 w-full rounded-sm border border-slate-300 bg-white px-3.5 text-sm text-ink focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-600 dark:bg-slate-900"
          >
            <option value="">None</option>
            {prerequisiteOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.title}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted">
            Learners must complete the prerequisite before enrolling.
          </p>
        </div>
      ) : null}
      <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
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

      {course ? (
        <form onSubmit={handleThumbnailUpload} className="space-y-4 border-t border-slate-200 pt-6 dark:border-slate-700">
          <div>
            <h3 className="text-sm font-semibold text-ink">Course thumbnail</h3>
            <p className="mt-1 text-xs text-muted">
              Upload a cover image shown on the course catalog and detail page.
            </p>
          </div>

          {thumbnail ? (
            <div className="relative h-40 w-full max-w-sm overflow-hidden rounded-sm border border-slate-200 dark:border-slate-700">
              <CourseThumbnail thumbnail={thumbnail} alt={course.title} fill />
            </div>
          ) : null}

          <FileUploadField
            name="thumbnail"
            label="Upload thumbnail"
            accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif"
            hint="JPEG, PNG, WebP, or GIF · max 2MB"
            previewType="image"
          />

          {thumbnailMessage ? (
            <p
              className={`text-sm ${
                thumbnailMessage.includes("updated")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {thumbnailMessage}
            </p>
          ) : null}

          <Button type="submit" variant="outline" disabled={thumbnailLoading}>
            {thumbnailLoading ? "Uploading..." : "Save thumbnail"}
          </Button>
        </form>
      ) : (
        <p className="border-t border-slate-200 pt-4 text-sm text-muted dark:border-slate-700">
          Save the course first, then you can upload a thumbnail here.
        </p>
      )}
    </div>
  );
}
