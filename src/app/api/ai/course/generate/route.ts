import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { instructorApiGuard } from "@/lib/instructor";
import { db } from "@/lib/db";
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

  const { courseId, topic, description, moduleCount, lessonsPerModule, apply } =
    parsed.data;

  const course = await db.course.findUnique({ where: { id: courseId } });
  if (!course || (course.instructorId !== session.id && session.role !== "ADMIN")) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
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

  const existingModuleCount = await db.module.count({ where: { courseId } });

  for (let mi = 0; mi < outline.modules.length; mi++) {
    const mod = outline.modules[mi];
    const createdModule = await db.module.create({
      data: {
        courseId,
        title: mod.title,
        order: existingModuleCount + mi + 1,
        lessons: {
          create: mod.lessons.map((lesson, li) => ({
            title: lesson.title,
            content: `${lesson.content}\n\n---\n**Summary:** ${lesson.summary}`,
            order: li + 1,
          })),
        },
      },
      include: { lessons: true },
    });
    void createdModule;
  }

  return NextResponse.json({
    ...outline,
    applied: true,
    modulesCreated: outline.modules.length,
  });
}
