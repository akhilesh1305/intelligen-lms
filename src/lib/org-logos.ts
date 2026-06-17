import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "org-logos");
const MAX_SIZE = 2 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const EXT_MAP: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

function isDatabaseLogoStorage() {
  return (
    process.env.AVATAR_STORAGE === "database" ||
    process.env.MEDIA_STORAGE === "database" ||
    process.env.NODE_ENV === "production"
  );
}

export async function saveOrganizationLogo(
  organizationId: string,
  file: File
): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Use a JPEG, PNG, WebP, or GIF image.");
  }

  if (file.size > MAX_SIZE) {
    throw new Error("Logo must be 2MB or smaller.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  if (isDatabaseLogoStorage()) {
    return `data:${file.type};base64,${buffer.toString("base64")}`;
  }

  await mkdir(UPLOAD_DIR, { recursive: true });

  const ext = EXT_MAP[file.type] ?? "png";
  const filename = `${organizationId}.${ext}`;
  const filepath = path.join(UPLOAD_DIR, filename);

  for (const oldExt of Object.values(EXT_MAP)) {
    if (oldExt === ext) continue;
    try {
      await unlink(path.join(UPLOAD_DIR, `${organizationId}.${oldExt}`));
    } catch {
      // ignore missing files
    }
  }

  await writeFile(filepath, buffer);

  return `/uploads/org-logos/${filename}`;
}
