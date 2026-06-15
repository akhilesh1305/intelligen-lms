import { mkdir, readdir, unlink, writeFile } from "fs/promises";
import path from "path";

const THUMBNAIL_DIR = path.join(process.cwd(), "public", "uploads", "thumbnails");
const VIDEO_DIR = path.join(process.cwd(), "public", "uploads", "videos");

const THUMBNAIL_MAX_SIZE = 2 * 1024 * 1024;
const VIDEO_MAX_SIZE = 50 * 1024 * 1024;

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

const IMAGE_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const VIDEO_EXT: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};

function isDatabaseImageStorage() {
  return (
    process.env.MEDIA_STORAGE === "database" ||
    process.env.AVATAR_STORAGE === "database" ||
    process.env.NODE_ENV === "production"
  );
}

async function removeFilesWithPrefix(dir: string, prefix: string) {
  try {
    const files = await readdir(dir);
    await Promise.all(
      files
        .filter((name) => name.startsWith(prefix))
        .map((name) => unlink(path.join(dir, name)).catch(() => undefined))
    );
  } catch {
    // directory may not exist yet
  }
}

export function isEmbedVideoUrl(url: string): boolean {
  return /youtube\.com|youtu\.be|vimeo\.com/i.test(url);
}

export async function saveCourseThumbnail(
  courseId: string,
  file: File
): Promise<string> {
  if (!IMAGE_TYPES.has(file.type)) {
    throw new Error("Thumbnail must be JPEG, PNG, WebP, or GIF.");
  }

  if (file.size > THUMBNAIL_MAX_SIZE) {
    throw new Error("Thumbnail must be 2MB or smaller.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  if (isDatabaseImageStorage()) {
    return `data:${file.type};base64,${buffer.toString("base64")}`;
  }

  await mkdir(THUMBNAIL_DIR, { recursive: true });
  await removeFilesWithPrefix(THUMBNAIL_DIR, `${courseId}.`);

  const ext = IMAGE_EXT[file.type] ?? "jpg";
  const filename = `${courseId}.${ext}`;
  await writeFile(path.join(THUMBNAIL_DIR, filename), buffer);

  return `/uploads/thumbnails/${filename}`;
}

export async function saveLessonVideo(lessonId: string, file: File): Promise<string> {
  if (!VIDEO_TYPES.has(file.type)) {
    throw new Error("Video must be MP4, WebM, or MOV.");
  }

  if (file.size > VIDEO_MAX_SIZE) {
    throw new Error("Video must be 50MB or smaller.");
  }

  await mkdir(VIDEO_DIR, { recursive: true });
  await removeFilesWithPrefix(VIDEO_DIR, `${lessonId}.`);

  const ext = VIDEO_EXT[file.type] ?? "mp4";
  const filename = `${lessonId}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(VIDEO_DIR, filename), buffer);

  return `/uploads/videos/${filename}`;
}
