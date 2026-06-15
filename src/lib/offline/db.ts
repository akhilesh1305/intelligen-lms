export type OfflineLesson = {
  id: string;
  courseId: string;
  courseTitle: string;
  moduleTitle: string;
  title: string;
  content: string;
  videoUrl: string | null;
  order: number;
  downloadedAt: number;
};

export type SyncQueueItem = {
  id: string;
  lessonId: string;
  courseId: string;
  completed: boolean;
  queuedAt: number;
};

const DB_NAME = "intelligen-offline";
const DB_VERSION = 1;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("lessons")) {
        db.createObjectStore("lessons", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("syncQueue")) {
        db.createObjectStore("syncQueue", { keyPath: "id" });
      }
    };
  });
}

function tx<T>(
  store: string,
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const transaction = db.transaction(store, mode);
        const objectStore = transaction.objectStore(store);
        const request = fn(objectStore);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      })
  );
}

export async function saveOfflineLesson(lesson: OfflineLesson) {
  return tx("lessons", "readwrite", (s) => s.put(lesson));
}

export async function getOfflineLesson(id: string) {
  return tx<OfflineLesson | undefined>("lessons", "readonly", (s) => s.get(id));
}

export async function getOfflineLessonsByCourse(courseId: string) {
  const all = await tx<OfflineLesson[]>("lessons", "readonly", (s) => s.getAll());
  return all.filter((l) => l.courseId === courseId).sort((a, b) => a.order - b.order);
}

export async function getAllOfflineLessons() {
  return tx<OfflineLesson[]>("lessons", "readonly", (s) => s.getAll());
}

export async function removeOfflineLesson(id: string) {
  return tx("lessons", "readwrite", (s) => s.delete(id));
}

export async function clearOfflineLessons() {
  return tx("lessons", "readwrite", (s) => s.clear());
}

export async function queueProgressSync(item: Omit<SyncQueueItem, "id" | "queuedAt">) {
  const entry: SyncQueueItem = {
    ...item,
    id: `${item.lessonId}-${Date.now()}`,
    queuedAt: Date.now(),
  };
  return tx("syncQueue", "readwrite", (s) => s.put(entry));
}

export async function getSyncQueue() {
  return tx<SyncQueueItem[]>("syncQueue", "readonly", (s) => s.getAll());
}

export async function removeSyncItem(id: string) {
  return tx("syncQueue", "readwrite", (s) => s.delete(id));
}

export async function clearSyncQueue() {
  return tx("syncQueue", "readwrite", (s) => s.clear());
}

export function isOnline() {
  return typeof navigator !== "undefined" ? navigator.onLine : true;
}
