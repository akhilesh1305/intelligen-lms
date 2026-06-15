import type { FeedPostType } from "@prisma/client";
import { db } from "./db";

export type FeedMetadata = {
  badgeId?: string;
  badgeName?: string;
  badgeIcon?: string;
  certificateId?: string;
  certificateNo?: string;
  courseId?: string;
  courseTitle?: string;
  link?: string;
};

function parseMetadata(raw: string | null): FeedMetadata | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as FeedMetadata;
  } catch {
    return null;
  }
}

export function formatTimeAgo(date: Date | string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  const intervals: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
    [4.345, "week"],
    [12, "month"],
  ];

  let value = seconds;
  let unit: Intl.RelativeTimeFormatUnit = "second";

  for (const [threshold, nextUnit] of intervals) {
    if (value < threshold) break;
    value = Math.floor(value / threshold);
    unit = nextUnit;
  }

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  return rtf.format(-value, unit);
}

export async function createFeedPost({
  authorId,
  type,
  title,
  content,
  metadata,
}: {
  authorId: string;
  type: FeedPostType;
  title: string;
  content: string;
  metadata?: FeedMetadata;
}) {
  return db.feedPost.create({
    data: {
      authorId,
      type,
      title,
      content,
      metadata: metadata ? JSON.stringify(metadata) : null,
    },
  });
}

export async function createAchievementPost(
  userId: string,
  badge: { id: string; name: string; description: string; icon: string }
) {
  return createFeedPost({
    authorId: userId,
    type: "ACHIEVEMENT",
    title: `Earned the ${badge.name} badge`,
    content: badge.description,
    metadata: {
      badgeId: badge.id,
      badgeName: badge.name,
      badgeIcon: badge.icon,
      link: "/leaderboard",
    },
  });
}

export async function createCertificationPost(
  userId: string,
  certificate: { id: string; certificateNo: string },
  course: { id: string; title: string }
) {
  return createFeedPost({
    authorId: userId,
    type: "CERTIFICATION",
    title: `Completed ${course.title}`,
    content: `Earned certificate ${certificate.certificateNo}`,
    metadata: {
      certificateId: certificate.id,
      certificateNo: certificate.certificateNo,
      courseId: course.id,
      courseTitle: course.title,
      link: `/certificates/${certificate.id}`,
    },
  });
}

export async function createAnnouncementPost(
  authorId: string,
  title: string,
  content: string
) {
  return createFeedPost({
    authorId,
    type: "ANNOUNCEMENT",
    title,
    content,
  });
}

export async function getFeedPosts({
  type,
  limit = 30,
  viewerId,
}: {
  type?: FeedPostType;
  limit?: number;
  viewerId?: string;
}) {
  const posts = await db.feedPost.findMany({
    where: type ? { type } : undefined,
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      author: { select: { id: true, name: true, avatarUrl: true, role: true } },
      likes: viewerId
        ? { where: { userId: viewerId }, select: { id: true } }
        : false,
      _count: { select: { likes: true } },
    },
  });

  return posts.map((post) => ({
    id: post.id,
    type: post.type,
    title: post.title,
    content: post.content,
    metadata: parseMetadata(post.metadata),
    createdAt: post.createdAt,
    author: post.author,
    likeCount: post._count.likes,
    likedByViewer:
      viewerId && Array.isArray(post.likes) ? post.likes.length > 0 : false,
  }));
}

export async function toggleFeedLike(userId: string, postId: string) {
  const post = await db.feedPost.findUnique({ where: { id: postId } });
  if (!post) return null;

  const existing = await db.feedLike.findUnique({
    where: { postId_userId: { postId, userId } },
  });

  if (existing) {
    await db.feedLike.delete({ where: { id: existing.id } });
    const count = await db.feedLike.count({ where: { postId } });
    return { liked: false, likeCount: count };
  }

  await db.feedLike.create({ data: { postId, userId } });
  const count = await db.feedLike.count({ where: { postId } });
  return { liked: true, likeCount: count };
}

export async function backfillFeedFromHistory() {
  const count = await db.feedPost.count();
  if (count > 0) return;

  const [badges, certificates] = await Promise.all([
    db.userBadge.findMany({
      include: {
        badge: true,
        user: { select: { id: true } },
      },
      orderBy: { earnedAt: "asc" },
    }),
    db.certificate.findMany({
      include: {
        course: { select: { id: true, title: true } },
        user: { select: { id: true } },
      },
      orderBy: { issuedAt: "asc" },
    }),
  ]);

  for (const ub of badges) {
    await createAchievementPost(ub.user.id, ub.badge);
  }

  for (const cert of certificates) {
    await createCertificationPost(cert.user.id, cert, cert.course);
  }
}
