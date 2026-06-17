import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { instructorApiGuard } from "@/lib/instructor";
import { db } from "@/lib/db";
import { applyCourseOutline } from "@/lib/ai/apply-course-outline";
import { generateCourseOutline } from "@/lib/ai/course-generator";
import { aiCourseGenerateSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const session = await instructorApiGuard(await getSession());
  if (session instanceof NextResponse) return session;

  const body = await request.json();
  const parsed = aiCourseGenerateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { courseId, topic, description, moduleCount, lessonsPerModule, apply, outline: editedOutline } =
    parsed.data;

  const course = await db.course.findUnique({ where: { id: courseId } });
  if (!course || (course.instructorId !== session.id && session.role !== "ADMIN")) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (apply && editedOutline) {
    const modulesCreated = await applyCourseOutline(courseId, editedOutline);
    return NextResponse.json({
      modules: editedOutline.modules,
      applied: true,
      modulesCreated,
      source: "edited",
    });
  }

  const outline = await generateCourseOutline(
    topic || course.title,
    description || course.description,
    moduleCount,
    lessonsPerModule
  );

  if (!apply) {
    return NextResponse.json(outline);
  }

  const modulesCreated = await applyCourseOutline(courseId, outline);

  return NextResponse.json({
    ...outline,
    applied: true,
    modulesCreated,
  });
}
