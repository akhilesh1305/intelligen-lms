import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseId, title, content } = await request.json();

  if (!courseId || !title?.trim() || !content?.trim()) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const enrollment = await db.enrollment.findUnique({
    where: { userId_courseId: { userId: session.id, courseId } },
  });

  const course = await db.course.findUnique({ where: { id: courseId } });
  const isInstructor = course?.instructorId === session.id;

  if (!enrollment && !isInstructor && session.role !== "ADMIN") {
    return NextResponse.json({ error: "Not enrolled" }, { status: 403 });
  }

  const thread = await db.forumThread.create({
    data: { courseId, userId: session.id, title, content },
  });

  return NextResponse.json({ id: thread.id }, { status: 201 });
}
