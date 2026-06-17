import { db } from "@/lib/db";
import type { CourseOutline } from "./course-generator";

export async function applyCourseOutline(
  courseId: string,
  outline: Pick<CourseOutline, "modules">
): Promise<number> {
  const existingModuleCount = await db.module.count({ where: { courseId } });

  for (let mi = 0; mi < outline.modules.length; mi++) {
    const mod = outline.modules[mi];
    await db.module.create({
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
    });
  }

  return outline.modules.length;
}
