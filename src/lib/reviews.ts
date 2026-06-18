import { db } from "@/lib/db";

export type FeaturedReview = {
  id: string;
  rating: number;
  comment: string;
  createdAt: Date;
  userName: string;
  userAvatarUrl: string | null;
  courseTitle: string;
};

export async function getFeaturedReviews(limit = 3): Promise<FeaturedReview[]> {
  const rows = await db.courseReview.findMany({
    where: {
      published: true,
      comment: { not: null },
      rating: { gte: 4 },
    },
    orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
    take: Math.max(limit * 4, 12),
    include: {
      user: { select: { name: true, avatarUrl: true } },
      course: { select: { title: true } },
    },
  });

  return rows
    .filter((r) => r.comment && r.comment.trim().length >= 48)
    .map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment!.trim(),
      createdAt: r.createdAt,
      userName: r.user.name,
      userAvatarUrl: r.user.avatarUrl,
      courseTitle: r.course.title,
    }))
    .sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return b.comment.length - a.comment.length;
    })
    .slice(0, limit);
}

export async function getCourseReviewStats(courseId: string) {
  const agg = await db.courseReview.aggregate({
    where: { courseId, published: true },
    _avg: { rating: true },
    _count: true,
  });

  if (agg._count === 0) {
    return { rating: null as number | null, count: 0 };
  }

  return {
    rating: Math.round((agg._avg.rating ?? 0) * 10) / 10,
    count: agg._count,
  };
}

export async function getReviewStatsForCourses(courseIds: string[]) {
  if (courseIds.length === 0) return new Map<string, { rating: number; count: number }>();

  const groups = await db.courseReview.groupBy({
    by: ["courseId"],
    where: { courseId: { in: courseIds }, published: true },
    _avg: { rating: true },
    _count: true,
  });

  return new Map(
    groups.map((g) => [
      g.courseId,
      {
        rating: Math.round((g._avg.rating ?? 0) * 10) / 10,
        count: g._count,
      },
    ])
  );
}

export async function getCourseReviews(courseId: string, limit = 20) {
  return db.courseReview.findMany({
    where: { courseId, published: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      user: { select: { name: true, avatarUrl: true } },
    },
  });
}

export async function getUserCourseReview(userId: string, courseId: string) {
  return db.courseReview.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
}
