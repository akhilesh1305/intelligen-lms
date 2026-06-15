import {
  getSyncQueue,
  removeSyncItem,
  type SyncQueueItem,
} from "./db";

export async function flushSyncQueue(): Promise<{
  synced: number;
  failed: number;
}> {
  if (!navigator.onLine) return { synced: 0, failed: 0 };

  const queue = await getSyncQueue();
  if (queue.length === 0) return { synced: 0, failed: 0 };

  try {
    const res = await fetch("/api/offline/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: queue.map((item) => ({
          lessonId: item.lessonId,
          courseId: item.courseId,
          completed: item.completed,
          queuedAt: item.queuedAt,
        })),
      }),
    });

    if (res.ok) {
      const data = await res.json();
      for (const item of queue) {
        await removeSyncItem(item.id);
      }
      return { synced: data.synced ?? 0, failed: data.failed ?? 0 };
    }
  } catch {
    /* fall through to per-item sync */
  }

  let synced = 0;
  let failed = 0;

  for (const item of queue) {
    const ok = await syncItem(item);
    if (ok) {
      await removeSyncItem(item.id);
      synced++;
    } else {
      failed++;
    }
  }

  return { synced, failed };
}

async function syncItem(item: SyncQueueItem): Promise<boolean> {
  try {
    const res = await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lessonId: item.lessonId,
        completed: item.completed,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
