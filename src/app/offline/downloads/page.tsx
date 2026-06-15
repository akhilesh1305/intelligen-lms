"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Download, Trash2, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import {
  clearOfflineLessons,
  getAllOfflineLessons,
  removeOfflineLesson,
  type OfflineLesson,
} from "@/lib/offline/db";
import { formatDate } from "@/lib/utils";
import { PushNotificationToggle } from "@/components/mobile/push-notification-toggle";

export default function OfflineDownloadsPage() {
  const [lessons, setLessons] = useState<OfflineLesson[]>([]);
  const [online, setOnline] = useState(true);

  async function refresh() {
    const data = await getAllOfflineLessons();
    setLessons(data.sort((a, b) => b.downloadedAt - a.downloadedAt));
  }

  useEffect(() => {
    refresh();
    setOnline(navigator.onLine);
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  async function handleRemove(id: string) {
    await removeOfflineLesson(id);
    refresh();
  }

  async function handleClearAll() {
    await clearOfflineLessons();
    refresh();
  }

  const byCourse = lessons.reduce<Record<string, OfflineLesson[]>>((acc, lesson) => {
    if (!acc[lesson.courseId]) acc[lesson.courseId] = [];
    acc[lesson.courseId].push(lesson);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        title="Mobile & offline"
        description="Downloaded lessons, sync settings, and push notifications."
      />

      {!online ? (
        <div className="mt-4 flex items-center gap-2 rounded-sm bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-200">
          <WifiOff className="h-4 w-4" />
          Offline mode — progress will sync when you reconnect
        </div>
      ) : null}

      <Card className="mt-8">
        <CardContent className="pt-6">
          <h2 className="font-bold text-ink">Push notifications</h2>
          <div className="mt-4">
            <PushNotificationToggle />
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-xl font-bold text-ink">Downloaded lessons</h2>
        {lessons.length > 0 ? (
          <Button variant="ghost" size="sm" onClick={handleClearAll}>
            <Trash2 className="h-4 w-4" />
            Clear all
          </Button>
        ) : null}
      </div>

      {lessons.length === 0 ? (
        <Card className="mt-4">
          <CardContent className="py-16 text-center">
            <Download className="mx-auto h-12 w-12 text-slate-300" />
            <p className="mt-4 font-semibold text-ink">No downloads yet</p>
            <p className="mt-2 text-sm text-muted">
              Open a lesson and tap &quot;Download lesson&quot; to learn offline.
            </p>
            <Link href="/dashboard" className="mt-6 inline-block">
              <Button variant="outline">Go to my courses</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-4 space-y-6">
          {Object.entries(byCourse).map(([courseId, courseLessons]) => (
            <Card key={courseId}>
              <CardContent className="pt-5">
                <h3 className="font-bold text-ink">{courseLessons[0].courseTitle}</h3>
                <p className="text-sm text-muted">
                  {courseLessons.length} lesson{courseLessons.length !== 1 ? "s" : ""} saved
                </p>
                <ul className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
                  {courseLessons
                    .sort((a, b) => a.order - b.order)
                    .map((lesson) => (
                      <li
                        key={lesson.id}
                        className="flex flex-wrap items-center justify-between gap-3 py-3"
                      >
                        <div>
                          <Link
                            href={`/learn/${courseId}?lesson=${lesson.id}&tab=lessons`}
                            className="font-medium text-ink hover:text-brand-600"
                          >
                            {lesson.title}
                          </Link>
                          <p className="text-xs text-muted">
                            {lesson.moduleTitle} · Downloaded{" "}
                            {formatDate(new Date(lesson.downloadedAt))}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemove(lesson.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
