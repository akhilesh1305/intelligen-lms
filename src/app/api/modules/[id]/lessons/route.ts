import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { instructorApiGuard } from "@/lib/instructor";
import { saveLessonVideo } from "@/lib/media";
import { lessonSchema } from "@/lib/validations";
import { db } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await instructorApiGuard(await getSession());
  if (session instanceof NextResponse) return session;

  const { id: moduleId } = await params;
  const mod = await db.module.findUnique({
    where: { id: moduleId },
    include: { course: true },
  });

  if (
    !mod ||
    (mod.course.instructorId !== session.id && session.role !== "ADMIN")
  ) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const contentType = request.headers.get("content-type") || "";
  let title: string;
  let content: string;
  let videoFile: File | null = null;

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    title = String(formData.get("title") ?? "").trim();
    content = String(formData.get("content") ?? "").trim();
    const video = formData.get("video");
    if (video instanceof File && video.size > 0) {
      videoFile = video;
    }
  } else {
    const body = await request.json();
    const parsed = lessonSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }
    title = parsed.data.title;
    content = parsed.data.content;
  }

  const parsed = lessonSchema.safeParse({ title, content });
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  const lessonCount = await db.lesson.count({ where: { moduleId } });

  const lesson = await db.lesson.create({
    data: {
      title: parsed.data.title,
      content: parsed.data.content,
      order: lessonCount + 1,
      moduleId,
    },
  });

  if (videoFile) {
    try {
      const videoUrl = await saveLessonVideo(lesson.id, videoFile);
      await db.lesson.update({
        where: { id: lesson.id },
        data: { videoUrl },
      });
    } catch (err) {
      await db.lesson.delete({ where: { id: lesson.id } });
      return NextResponse.json(
        { error: err instanceof Error ? err.message : "Invalid video file" },
        { status: 400 }
      );
    }
  }

  return NextResponse.json({ id: lesson.id }, { status: 201 });
}
