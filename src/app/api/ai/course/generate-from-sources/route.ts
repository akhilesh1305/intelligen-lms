import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { instructorApiGuard } from "@/lib/instructor";
import { db } from "@/lib/db";
import { applyCourseOutline } from "@/lib/ai/apply-course-outline";
import {
  generateCourseOutlineFromSources,
  type CourseOutline,
} from "@/lib/ai/course-generator";
import {
  combineSourceMaterial,
  extractPdfText,
  buildVideoSourceText,
  isPdfFile,
  isVideoFile,
  PDF_MAX_FILES,
  splitVideoTranscripts,
  VIDEO_MAX_FILES,
  type ExtractedSource,
} from "@/lib/document-extract";

export const runtime = "nodejs";

const outlinePayloadSchema = z.object({
  modules: z
    .array(
      z.object({
        title: z.string().min(2),
        summary: z.string().min(1),
        lessons: z.array(
          z.object({
            title: z.string().min(2),
            content: z.string().min(1),
            summary: z.string().min(1),
          })
        ),
      })
    )
    .min(1),
});

async function verifyCourseAccess(courseId: string, session: { id: string; role: string }) {
  const course = await db.course.findUnique({ where: { id: courseId } });
  if (!course || (course.instructorId !== session.id && session.role !== "ADMIN")) {
    return null;
  }
  return course;
}

async function extractSourcesFromForm(formData: FormData): Promise<ExtractedSource[]> {
  const pdfFiles = formData
    .getAll("pdfs")
    .filter((f): f is File => f instanceof File && f.size > 0);
  const videoFiles = formData
    .getAll("videos")
    .filter((f): f is File => f instanceof File && f.size > 0);

  if (pdfFiles.length === 0 && videoFiles.length === 0) {
    throw new Error("Upload at least one PDF or video file.");
  }
  if (pdfFiles.length > PDF_MAX_FILES) {
    throw new Error(`Maximum ${PDF_MAX_FILES} PDF files allowed.`);
  }
  if (videoFiles.length > VIDEO_MAX_FILES) {
    throw new Error(`Maximum ${VIDEO_MAX_FILES} video files allowed.`);
  }

  for (const file of pdfFiles) {
    if (!isPdfFile(file)) {
      throw new Error(`${file.name} is not a valid PDF.`);
    }
  }
  for (const file of videoFiles) {
    if (!isVideoFile(file)) {
      throw new Error(`${file.name} is not a supported video.`);
    }
  }

  const transcripts = splitVideoTranscripts(
    String(formData.get("videoTranscripts") ?? ""),
    videoFiles.length
  );

  const sources: ExtractedSource[] = [];

  for (const file of pdfFiles) {
    const text = await extractPdfText(file);
    sources.push({ label: file.name, kind: "pdf", text });
  }

  for (let i = 0; i < videoFiles.length; i++) {
    sources.push(buildVideoSourceText(videoFiles[i], transcripts[i]));
  }

  return sources;
}

export async function POST(request: Request) {
  const session = await instructorApiGuard(await getSession());
  if (session instanceof NextResponse) return session;

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json(
      { error: "Expected multipart form data with PDF/video files" },
      { status: 400 }
    );
  }

  try {
    const formData = await request.formData();
    const courseId = String(formData.get("courseId") ?? "").trim();
    if (!courseId) {
      return NextResponse.json({ error: "courseId is required" }, { status: 400 });
    }

    const course = await verifyCourseAccess(courseId, session);
    if (!course) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const moduleCount = Math.min(
      Math.max(Number(formData.get("moduleCount") ?? 3), 1),
      6
    );
    const lessonsPerModule = Math.min(
      Math.max(Number(formData.get("lessonsPerModule") ?? 2), 1),
      5
    );
    const apply = formData.get("apply") === "true";
    const topic = String(formData.get("topic") ?? course.title).trim();
    const description = String(formData.get("description") ?? course.description).trim();

    const outlineJson = formData.get("outline");
    if (apply && outlineJson) {
      const parsedOutline = outlinePayloadSchema.safeParse(JSON.parse(String(outlineJson)));
      if (!parsedOutline.success) {
        return NextResponse.json({ error: "Invalid outline payload" }, { status: 400 });
      }

      const modulesCreated = await applyCourseOutline(courseId, parsedOutline.data);
      return NextResponse.json({
        applied: true,
        modulesCreated,
        modules: parsedOutline.data.modules,
        source: "edited",
      });
    }

    const sources = await extractSourcesFromForm(formData);
    const sourceMaterial = combineSourceMaterial(sources);

    const outline = await generateCourseOutlineFromSources(
      sourceMaterial,
      moduleCount,
      lessonsPerModule,
      topic,
      description
    );

    if (!apply) {
      const response: CourseOutline & {
        extractedSources: { label: string; kind: string; chars: number }[];
      } = {
        ...outline,
        extractedSources: sources.map((s) => ({
          label: s.label,
          kind: s.kind,
          chars: s.text.length,
        })),
      };
      return NextResponse.json(response);
    }

    const modulesCreated = await applyCourseOutline(courseId, outline);

    return NextResponse.json({
      ...outline,
      applied: true,
      modulesCreated,
      extractedSources: sources.map((s) => ({
        label: s.label,
        kind: s.kind,
        chars: s.text.length,
      })),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to process sources" },
      { status: 400 }
    );
  }
}
