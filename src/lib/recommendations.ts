import type { Role } from "@prisma/client";

import { getAccessibleCoursesWhereForUser } from "@/lib/organizations";

import { getCourseCategory } from "./course-visuals";
import { db } from "./db";

export async function getRecommendedCourses(
  userId: string,
  role: Role = "STUDENT",
  limit = 4
) {
  const enrollments = await db.enrollment.findMany({
    where: { userId },
    include: { course: true },
  });

  const enrolledIds = new Set(enrollments.map((e) => e.courseId));
  const preferredCategories = enrollments.map((e) =>
    getCourseCategory(e.course.title)
  );

  const accessibleWhere = await getAccessibleCoursesWhereForUser({
    id: userId,
    role,
  });

  const allCourses = await db.course.findMany({
    where: accessibleWhere,
    include: {
      instructor: { select: { name: true } },
      modules: { include: { lessons: true } },
      _count: { select: { enrollments: true } },
    },
  });

  const available = allCourses.filter((c) => !enrolledIds.has(c.id));

  const scored = available.map((course) => {
    const category = getCourseCategory(course.title);
    let score = course._count.enrollments;

    if (preferredCategories.includes(category)) score += 50;
    if (preferredCategories.filter((c) => c === category).length > 1) score += 20;

    const titleWords = course.title.toLowerCase().split(/\s+/);
    for (const e of enrollments) {
      const enrolledWords = e.course.title.toLowerCase().split(/\s+/);
      const overlap = titleWords.filter((w) => enrolledWords.includes(w) && w.length > 3);
      score += overlap.length * 10;
    }

    return { course, score, category };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => ({
    ...s.course,
    matchReason:
      preferredCategories.includes(s.category)
        ? `Based on your interest in ${s.category}`
        : "Popular with learners like you",
    confidence: Math.min(95, 60 + s.score % 35),
  }));
}
