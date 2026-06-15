import { db } from "./db";
import { isCourseCompleted } from "./prerequisites";

export async function getPublishedPaths() {
  return db.learningPath.findMany({
    where: { published: true },
    include: {
      pathCourses: {
        orderBy: { order: "asc" },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              skillLevel: true,
              published: true,
              status: true,
            },
          },
        },
      },
      _count: { select: { pathCourses: true } },
    },
    orderBy: { name: "asc" },
  });
}

export async function getPathBySlug(slug: string) {
  return db.learningPath.findUnique({
    where: { slug },
    include: {
      pathCourses: {
        orderBy: { order: "asc" },
        include: {
          course: {
            include: {
              instructor: { select: { name: true } },
              prerequisiteCourse: { select: { id: true, title: true } },
              modules: { include: { _count: { select: { lessons: true } } } },
            },
          },
        },
      },
    },
  });
}

export async function getPathProgress(userId: string, pathId: string) {
  const path = await db.learningPath.findUnique({
    where: { id: pathId },
    include: {
      pathCourses: {
        orderBy: { order: "asc" },
        select: { courseId: true },
      },
    },
  });

  if (!path) return null;

  const courseIds = path.pathCourses.map((pc) => pc.courseId);
  let completed = 0;

  for (const courseId of courseIds) {
    if (await isCourseCompleted(userId, courseId)) completed++;
  }

  return {
    total: courseIds.length,
    completed,
    percent: courseIds.length
      ? Math.round((completed / courseIds.length) * 100)
      : 0,
  };
}

export async function ensurePathEnrollment(userId: string, pathId: string) {
  return db.userPathProgress.upsert({
    where: { userId_pathId: { userId, pathId } },
    create: { userId, pathId },
    update: {},
  });
}
