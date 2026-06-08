import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { lessonSchema } from "@/lib/validations";
import { db } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || !["INSTRUCTOR", "ADMIN"].includes(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

  const body = await request.json();
  const parsed = lessonSchema.safeParse(body);

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
      videoUrl: parsed.data.videoUrl || null,
      order: lessonCount + 1,
      moduleId,
    },
  });

  return NextResponse.json({ id: lesson.id }, { status: 201 });
}
