export const PDF_MAX_SIZE = 10 * 1024 * 1024;
export const PDF_MAX_FILES = 5;
export const VIDEO_MAX_SIZE = 50 * 1024 * 1024;
export const VIDEO_MAX_FILES = 3;
export const SOURCE_TEXT_MAX_CHARS = 24_000;

const PDF_TYPES = new Set(["application/pdf"]);
const VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

export type ExtractedSource = {
  label: string;
  kind: "pdf" | "video";
  text: string;
};

export function isPdfFile(file: File): boolean {
  return PDF_TYPES.has(file.type) || file.name.toLowerCase().endsWith(".pdf");
}

export function isVideoFile(file: File): boolean {
  return (
    VIDEO_TYPES.has(file.type) ||
    /\.(mp4|webm|mov)$/i.test(file.name)
  );
}

async function parsePdfBuffer(buffer: Buffer): Promise<string> {
  const { default: pdf } = await import("pdf-parse");
  const parsed = await pdf(buffer);
  return parsed.text?.replace(/\s+/g, " ").trim() ?? "";
}

export async function extractPdfText(file: File): Promise<string> {
  if (!isPdfFile(file)) {
    throw new Error(`${file.name} is not a PDF file.`);
  }
  if (file.size > PDF_MAX_SIZE) {
    throw new Error(`${file.name} exceeds the 10MB PDF limit.`);
  }
  if (file.size === 0) {
    throw new Error(`${file.name} is empty.`);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const text = await parsePdfBuffer(buffer);

  if (text.length < 50) {
    throw new Error(
      `${file.name} has too little readable text. Try a text-based PDF or paste a transcript.`
    );
  }

  return text;
}

export function buildVideoSourceText(
  file: File,
  transcript?: string
): ExtractedSource {
  if (!isVideoFile(file)) {
    throw new Error(`${file.name} is not a supported video (MP4, WebM, MOV).`);
  }
  if (file.size > VIDEO_MAX_SIZE) {
    throw new Error(`${file.name} exceeds the 50MB video limit.`);
  }

  const trimmedTranscript = transcript?.trim();
  const sizeMb = (file.size / (1024 * 1024)).toFixed(1);

  if (trimmedTranscript && trimmedTranscript.length >= 20) {
    return {
      label: file.name,
      kind: "video",
      text: `Video: ${file.name} (${sizeMb} MB)\nTranscript:\n${trimmedTranscript}`,
    };
  }

  return {
    label: file.name,
    kind: "video",
    text: `Video: ${file.name} (${sizeMb} MB)\nNo transcript provided. Infer lesson topics from the filename and any surrounding course context. Note in lesson content that learners should watch the uploaded video.`,
  };
}

export function combineSourceMaterial(sources: ExtractedSource[]): string {
  const combined = sources.map((s) => `## ${s.label}\n${s.text}`).join("\n\n");
  if (combined.length <= SOURCE_TEXT_MAX_CHARS) return combined;
  return `${combined.slice(0, SOURCE_TEXT_MAX_CHARS)}\n\n[Content truncated for AI processing]`;
}

export function splitVideoTranscripts(raw: string, count: number): string[] {
  if (!raw.trim()) return Array(count).fill("");
  const parts = raw
    .split(/\n---+\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length >= count) return parts.slice(0, count);
  if (parts.length === 1 && count === 1) return parts;
  return Array.from({ length: count }, (_, i) => parts[i] ?? "");
}
