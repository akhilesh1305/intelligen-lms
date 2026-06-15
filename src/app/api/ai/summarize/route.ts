import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { summarizeLesson } from "@/lib/ai/summarizer";
import { aiSummarizeSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = aiSummarizeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  if (parsed.data.text) {
    const result = await summarizeLesson(
      parsed.data.title ?? "Content",
      parsed.data.text
    );
    return NextResponse.json(result);
  }

  const lesson = await db.lesson.findUnique({
    where: { id: parsed.data.lessonId },
    include: { module: { include: { course: true } } },
  });

  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  const enrollment = await db.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.id,
        courseId: lesson.module.courseId,
      },
    },
  });

  const isInstructor =
    lesson.module.course.instructorId === session.id ||
    session.role === "ADMIN";

  if (!enrollment && !isInstructor) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const result = await summarizeLesson(lesson.title, lesson.content);
  return NextResponse.json(result);
}
