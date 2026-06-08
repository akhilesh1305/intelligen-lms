import { getCourseCategory, getCourseLevel } from "@/lib/course-visuals";
import { db } from "@/lib/db";
import { countLessons } from "@/lib/courses";

export type CourseSummary = {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  lessonCount: number;
  instructor: string;
  enrollments: number;
};

export async function getCourseCatalog(): Promise<CourseSummary[]> {
  const courses = await db.course.findMany({
    where: { status: "APPROVED", published: true },
    include: {
      instructor: { select: { name: true } },
      modules: { include: { lessons: true } },
      _count: { select: { enrollments: true } },
    },
    orderBy: { title: "asc" },
  });

  return courses.map((c) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    category: getCourseCategory(c.title),
    level: getCourseLevel(c.title),
    lessonCount: countLessons(c.modules),
    instructor: c.instructor.name,
    enrollments: c._count.enrollments,
  }));
}

export async function getUserLearningContext(userId: string) {
  const [user, enrollments, certificates] = await Promise.all([
    db.user.findUnique({
      where: { id: userId },
      select: { name: true, points: true, role: true },
    }),
    db.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          select: { id: true, title: true, description: true },
        },
      },
    }),
    db.certificate.findMany({
      where: { userId },
      include: { course: { select: { title: true } } },
    }),
  ]);

  return {
    name: user?.name,
    points: user?.points ?? 0,
    enrollments: enrollments.map((e) => ({
      courseId: e.courseId,
      title: e.course.title,
      progress: e.progressPercent,
    })),
    certificates: certificates.map((c) => c.course.title),
  };
}

export function buildSystemContext(
  catalog: CourseSummary[],
  userContext?: Awaited<ReturnType<typeof getUserLearningContext>>
) {
  const catalogText = catalog
    .map(
      (c) =>
        `- [${c.id}] "${c.title}" (${c.level}, ${c.category}) — ${c.lessonCount} lessons — ${c.description.slice(0, 120)}...`
    )
    .join("\n");

  const userText = userContext
    ? `Student: ${userContext.name}
Points: ${userContext.points}
Enrolled: ${userContext.enrollments.map((e) => `${e.title} (${e.progress}%)`).join(", ") || "none"}
Certificates: ${userContext.certificates.join(", ") || "none"}`
    : "User is not logged in.";

  return { catalogText, userText, catalog };
}
