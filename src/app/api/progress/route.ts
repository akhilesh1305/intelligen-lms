import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { addPoints } from "@/lib/gamification";
import { syncEnrollmentProgress } from "@/lib/progress";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { lessonId, completed } = await request.json();
  if (!lessonId) {
    return NextResponse.json({ error: "Lesson ID required" }, { status: 400 });
  }

  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    include: { module: { select: { courseId: true } } },
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

  if (!enrollment) {
    return NextResponse.json({ error: "Not enrolled in this course" }, { status: 403 });
  }

  const wasCompleted = await db.lessonProgress.findUnique({
    where: { userId_lessonId: { userId: session.id, lessonId } },
  });

  await db.lessonProgress.upsert({
    where: { userId_lessonId: { userId: session.id, lessonId } },
    create: {
      userId: session.id,
      lessonId,
      completed: completed ?? true,
      completedAt: completed !== false ? new Date() : null,
    },
    update: {
      completed: completed ?? true,
      completedAt: completed !== false ? new Date() : null,
    },
  });

  if (completed !== false && !wasCompleted?.completed) {
    await addPoints(session.id, 10);
  }

  const result = await syncEnrollmentProgress(session.id, lesson.module.courseId);

  return NextResponse.json({
    success: true,
    progress: result?.details.percent ?? 0,
    complete: result?.details.isComplete ?? false,
  });
}
