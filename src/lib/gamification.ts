import { db } from "./db";
import { createNotification } from "./notifications";

const BADGE_DEFINITIONS = [
  { slug: "first-lesson", name: "First Steps", description: "Complete your first lesson", icon: "🎯", points: 10 },
  { slug: "first-quiz", name: "Quiz Taker", description: "Pass your first quiz", icon: "📝", points: 25 },
  { slug: "first-course", name: "Graduate", description: "Complete your first course", icon: "🎓", points: 100 },
  { slug: "forum-contributor", name: "Community Voice", description: "Post in a discussion forum", icon: "💬", points: 15 },
  { slug: "streak-5", name: "Dedicated Learner", description: "Earn 250 points", icon: "🔥", points: 50 },
  { slug: "quiz-master", name: "Quiz Master", description: "Pass 3 quizzes", icon: "🏆", points: 75 },
] as const;

export async function ensureBadgesExist() {
  for (const badge of BADGE_DEFINITIONS) {
    await db.badge.upsert({
      where: { slug: badge.slug },
      update: {},
      create: badge,
    });
  }
}

export async function addPoints(userId: string, amount: number) {
  return db.user.update({
    where: { id: userId },
    data: { points: { increment: amount } },
  });
}

export async function awardBadge(userId: string, slug: string) {
  const badge = await db.badge.findUnique({ where: { slug } });
  if (!badge) return null;

  const existing = await db.userBadge.findUnique({
    where: { userId_badgeId: { userId, badgeId: badge.id } },
  });
  if (existing) return null;

  await db.userBadge.create({ data: { userId, badgeId: badge.id } });
  await addPoints(userId, badge.points);

  await createNotification({
    userId,
    type: "BADGE_EARNED",
    title: `Badge earned: ${badge.name}`,
    message: badge.description,
    link: "/leaderboard",
  });

  return badge;
}

export async function checkAndAwardBadges(userId: string) {
  await ensureBadgesExist();

  const [lessonCount, quizPasses, courseCompletions, forumPosts, user] =
    await Promise.all([
      db.lessonProgress.count({ where: { userId, completed: true } }),
      db.quizAttempt.count({ where: { userId, passed: true } }),
      db.enrollment.count({ where: { userId, completedAt: { not: null } } }),
      db.forumPost.count({ where: { userId } }),
      db.user.findUnique({ where: { id: userId }, select: { points: true } }),
    ]);

  if (lessonCount >= 1) await awardBadge(userId, "first-lesson");
  if (quizPasses >= 1) await awardBadge(userId, "first-quiz");
  if (quizPasses >= 3) await awardBadge(userId, "quiz-master");
  if (courseCompletions >= 1) await awardBadge(userId, "first-course");
  if (forumPosts >= 1) await awardBadge(userId, "forum-contributor");
  if ((user?.points ?? 0) >= 250) await awardBadge(userId, "streak-5");
}

export async function getLeaderboard(limit = 20) {
  return db.user.findMany({
    where: { role: "STUDENT" },
    orderBy: { points: "desc" },
    take: limit,
    select: {
      id: true,
      name: true,
      points: true,
      userBadges: { include: { badge: true }, take: 3 },
      _count: { select: { certificates: true } },
    },
  });
}
