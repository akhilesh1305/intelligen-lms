import { getChallengeWindow } from "@/lib/challenge-window";
import {
  getCurrentWeekSlug,
  getWeekLabel,
  getWeeklyLeaderboard,
} from "@/lib/weekly-leaderboard";
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

export async function getLeaderboardAnalytics() {
  const weekSlug = getCurrentWeekSlug();
  const { startsAt, endsAt } = getChallengeWindow("WEEKLY");

  const [
    topLearners,
    participants,
    weekAttempts,
    aggregate,
    dailyQuizCount,
    weeklyQuizCount,
  ] = await Promise.all([
    getWeeklyLeaderboard(10),
    db.weeklyLeaderboardEntry.count({ where: { weekSlug } }),
    db.challengeAttempt.findMany({
      where: { completedAt: { gte: startsAt, lte: endsAt } },
      select: { completedAt: true, pointsEarned: true },
    }),
    db.weeklyLeaderboardEntry.aggregate({
      where: { weekSlug },
      _sum: { points: true, quizzesCompleted: true },
    }),
    db.challenge.count({
      where: {
        period: "DAILY",
        startsAt: { gte: startsAt, lte: endsAt },
      },
    }),
    db.challenge.count({
      where: {
        period: "WEEKLY",
        startsAt: { gte: startsAt, lte: endsAt },
      },
    }),
  ]);

  const activityByDay = new Map<string, { attempts: number; points: number }>();
  for (const attempt of weekAttempts) {
    const day = attempt.completedAt.toISOString().slice(0, 10);
    const current = activityByDay.get(day) ?? { attempts: 0, points: 0 };
    current.attempts += 1;
    current.points += attempt.pointsEarned;
    activityByDay.set(day, current);
  }

  const quizActivity = Array.from(activityByDay.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, stats]) => ({
      day: new Date(day + "T12:00:00Z").toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      }),
      attempts: stats.attempts,
      points: stats.points,
    }));

  return {
    weekSlug,
    weekLabel: getWeekLabel(),
    participants,
    totalAttempts: weekAttempts.length,
    totalPoints: aggregate._sum.points ?? 0,
    totalQuizzesCompleted: aggregate._sum.quizzesCompleted ?? 0,
    dailyQuizCount,
    weeklyQuizCount,
    topLearners: topLearners.map((l) => ({
      name: l.name,
      points: l.points,
      quizzes: l.quizzesCompleted,
    })),
    quizActivity,
  };
}
