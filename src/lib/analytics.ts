import { db } from "./db";

export async function getPlatformAnalytics() {
  const [
    usersByRole,
    coursesByStatus,
    totalEnrollments,
    enrollments,
    completions,
    recentUsers,
  ] = await Promise.all([
    db.user.groupBy({ by: ["role"], _count: true }),
    db.course.groupBy({ by: ["status"], _count: true }),
    db.enrollment.count(),
    db.enrollment.findMany({
      select: { enrolledAt: true },
      orderBy: { enrolledAt: "asc" },
    }),
    db.enrollment.count({ where: { completedAt: { not: null } } }),
    db.user.count({
      where: {
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
    }),
  ]);

  const enrollmentByMonth = new Map<string, number>();
  for (const e of enrollments) {
    const key = e.enrolledAt.toISOString().slice(0, 7);
    enrollmentByMonth.set(key, (enrollmentByMonth.get(key) ?? 0) + 1);
  }

  const enrollmentTrend = Array.from(enrollmentByMonth.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, count]) => ({
      month: new Date(month + "-01").toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      }),
      enrollments: count,
    }));

  const topCourses = await db.course.findMany({
    where: { status: "APPROVED" },
    include: { _count: { select: { enrollments: true } } },
    orderBy: { enrollments: { _count: "desc" } },
    take: 5,
  });

  return {
    usersByRole: usersByRole.map((r) => ({
      role: r.role,
      count: r._count,
    })),
    coursesByStatus: coursesByStatus.map((c) => ({
      status: c.status,
      count: c._count,
    })),
    totalEnrollments,
    completionRate:
      totalEnrollments > 0
        ? Math.round((completions / totalEnrollments) * 100)
        : 0,
    newUsersThisMonth: recentUsers,
    enrollmentTrend,
    topCourses: topCourses.map((c) => ({
      title: c.title,
      enrollments: c._count.enrollments,
    })),
  };
}

export async function getInstructorAnalytics(instructorId: string) {
  const courses = await db.course.findMany({
    where: { instructorId },
    include: {
      _count: { select: { enrollments: true } },
      enrollments: { select: { progressPercent: true, completedAt: true } },
    },
  });

  const totalStudents = courses.reduce((s, c) => s + c._count.enrollments, 0);
  const avgProgress =
    courses.length > 0
      ? Math.round(
          courses.reduce(
            (s, c) =>
              s +
              (c.enrollments.length > 0
                ? c.enrollments.reduce((a, e) => a + e.progressPercent, 0) /
                  c.enrollments.length
                : 0),
            0
          ) / courses.length
        )
      : 0;

  return {
    courseCount: courses.length,
    totalStudents,
    avgProgress,
    courses: courses.map((c) => ({
      id: c.id,
      title: c.title,
      status: c.status,
      enrollments: c._count.enrollments,
      avgProgress:
        c.enrollments.length > 0
          ? Math.round(
              c.enrollments.reduce((a, e) => a + e.progressPercent, 0) /
                c.enrollments.length
            )
          : 0,
    })),
  };
}
