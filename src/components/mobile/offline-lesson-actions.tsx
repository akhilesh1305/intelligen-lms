"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Download, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getOfflineLesson,
  removeOfflineLesson,
  saveOfflineLesson,
  type OfflineLesson,
} from "@/lib/offline/db";

export function OfflineLessonActions({
  lesson,
  courseId,
  courseTitle,
  moduleTitle,
  lessonOrder,
}: {
  lesson: {
    id: string;
    title: string;
    content: string;
    videoUrl: string | null;
  };
  courseId: string;
  courseTitle: string;
  moduleTitle: string;
  lessonOrder: number;
}) {
  const router = useRouter();
  const [downloaded, setDownloaded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getOfflineLesson(lesson.id).then((stored) => setDownloaded(Boolean(stored)));
  }, [lesson.id]);

  async function handleDownload() {
    setLoading(true);
    const entry: OfflineLesson = {
      id: lesson.id,
      courseId,
      courseTitle,
      moduleTitle,
      title: lesson.title,
      content: lesson.content,
      videoUrl: lesson.videoUrl,
      order: lessonOrder,
      downloadedAt: Date.now(),
    };
    await saveOfflineLesson(entry);
    setDownloaded(true);
    setLoading(false);
  }

  async function handleRemove() {
    setLoading(true);
    await removeOfflineLesson(lesson.id);
    setDownloaded(false);
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 rounded-sm border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/50">
      <Download className="h-4 w-4 text-brand-600" />
      <span className="text-sm font-semibold text-ink">Offline learning</span>
      {downloaded ? (
        <>
          <span className="inline-flex items-center gap-1 text-sm text-emerald-600">
            <Check className="h-4 w-4" />
            Downloaded
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            Remove
          </Button>
        </>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleDownload}
          disabled={loading}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          Download lesson
        </Button>
      )}
    </div>
  );
}
