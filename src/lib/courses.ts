import { db } from "./db";

export async function getPublishedCourses() {
  return db.course.findMany({
    where: { published: true, status: "APPROVED" },
    include: {
      instructor: { select: { name: true } },
      modules: { include: { lessons: true } },
      _count: { select: { enrollments: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCourseWithContent(courseId: string) {
  return db.course.findUnique({
    where: { id: courseId },
    include: {
      instructor: { select: { id: true, name: true, email: true } },
      modules: {
        orderBy: { order: "asc" },
        include: { lessons: { orderBy: { order: "asc" } } },
      },
      quizzes: {
        orderBy: { createdAt: "desc" },
        include: {
          questions: { orderBy: { order: "asc" } },
          _count: { select: { attempts: true } },
        },
      },
      assignments: true,
      enrollments: true,
    },
  });
}

export async function getStudentEnrollments(userId: string) {
  const enrollments = await db.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          instructor: { select: { name: true } },
          modules: { include: { lessons: true } },
        },
      },
    },
    orderBy: { enrolledAt: "desc" },
  });

  return enrollments.map((e) => ({
    ...e,
    progress: e.progressPercent,
    lessonCount: e.course.modules.reduce((s, m) => s + m.lessons.length, 0),
  }));
}

export async function getInstructorCourses(instructorId: string) {
  return db.course.findMany({
    where: { instructorId },
    include: {
      modules: { include: { lessons: true } },
      _count: { select: { enrollments: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getPendingCourses() {
  return db.course.findMany({
    where: { status: "PENDING_APPROVAL" },
    include: {
      instructor: { select: { name: true, email: true } },
      modules: { include: { _count: { select: { lessons: true } } } },
    },
    orderBy: { createdAt: "asc" },
  });
}

export function countLessons(modules: { lessons: unknown[] }[]): number {
  return modules.reduce((sum, m) => sum + m.lessons.length, 0);
}
