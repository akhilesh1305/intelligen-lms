import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "org-signatures");
const MAX_SIZE = 1 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const EXT_MAP: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function isDatabaseSignatureStorage() {
  return (
    process.env.AVATAR_STORAGE === "database" ||
    process.env.MEDIA_STORAGE === "database" ||
    process.env.NODE_ENV === "production"
  );
}

export async function saveOrganizationSignature(
  organizationId: string,
  file: File
): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Use a JPEG, PNG, or WebP signature image.");
  }

  if (file.size > MAX_SIZE) {
    throw new Error("Signature image must be 1MB or smaller.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  if (isDatabaseSignatureStorage()) {
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

  return `/uploads/org-signatures/${filename}`;
}
