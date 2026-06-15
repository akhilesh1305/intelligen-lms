import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { addPoints } from "@/lib/gamification";
import { syncEnrollmentProgress } from "@/lib/progress";

const itemSchema = z.object({
  lessonId: z.string().min(1),
  courseId: z.string().min(1),
  completed: z.boolean(),
  queuedAt: z.number().optional(),
});

const schema = z.object({
  items: z.array(itemSchema).min(1).max(50),
});

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid sync payload" }, { status: 400 });
  }

  const results: { lessonId: string; success: boolean }[] = [];
  const courseIds = new Set<string>();

  for (const item of parsed.data.items) {
    const lesson = await db.lesson.findUnique({
      where: { id: item.lessonId },
      include: { module: { select: { courseId: true } } },
    });

    if (!lesson || lesson.module.courseId !== item.courseId) {
      results.push({ lessonId: item.lessonId, success: false });
      continue;
    }

    const enrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: { userId: session.id, courseId: item.courseId },
      },
    });

    if (!enrollment) {
      results.push({ lessonId: item.lessonId, success: false });
      continue;
    }

    const wasCompleted = await db.lessonProgress.findUnique({
      where: { userId_lessonId: { userId: session.id, lessonId: item.lessonId } },
    });

    await db.lessonProgress.upsert({
      where: { userId_lessonId: { userId: session.id, lessonId: item.lessonId } },
      create: {
        userId: session.id,
        lessonId: item.lessonId,
        completed: item.completed,
        completedAt: item.completed ? new Date() : null,
      },
      update: {
        completed: item.completed,
        completedAt: item.completed ? new Date() : null,
      },
    });

    if (item.completed && !wasCompleted?.completed) {
      await addPoints(session.id, 10);
    }

    courseIds.add(item.courseId);
    results.push({ lessonId: item.lessonId, success: true });
  }

  for (const courseId of courseIds) {
    await syncEnrollmentProgress(session.id, courseId);
  }

  return NextResponse.json({
    synced: results.filter((r) => r.success).length,
    failed: results.filter((r) => !r.success).length,
    results,
  });
}
