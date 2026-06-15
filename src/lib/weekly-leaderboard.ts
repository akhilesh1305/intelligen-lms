import { computeAchievementLevel } from "@/lib/achievement-levels";
import { getChallengeSlug, getChallengeWindow } from "@/lib/challenge-window";
import { db } from "@/lib/db";

export const QUIZ_POINTS_CORRECT = 5;
export const QUIZ_POINTS_INCORRECT = -1;

export function getCurrentWeekSlug(date = new Date()) {
  return getChallengeSlug("WEEKLY", date);
}

export function getWeekLabel(date = new Date()) {
  const { startsAt, endsAt } = getChallengeWindow("WEEKLY", date);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
  return `${fmt(startsAt)} – ${fmt(endsAt)} UTC`;
}

export async function addWeeklyLeaderboardPoints(
  userId: string,
  delta: number,
  date = new Date()
) {
  const weekSlug = getCurrentWeekSlug(date);

  return db.weeklyLeaderboardEntry.upsert({
    where: { userId_weekSlug: { userId, weekSlug } },
    create: {
      userId,
      weekSlug,
      points: delta,
      quizzesCompleted: 1,
    },
    update: {
      points: { increment: delta },
      quizzesCompleted: { increment: 1 },
    },
  });
}

export async function getUserWeeklyEntry(userId: string, date = new Date()) {
  const weekSlug = getCurrentWeekSlug(date);
  return db.weeklyLeaderboardEntry.findUnique({
    where: { userId_weekSlug: { userId, weekSlug } },
  });
}

export async function getWeeklyLeaderboard(limit = 20, date = new Date()) {
  const weekSlug = getCurrentWeekSlug(date);

  const entries = await db.weeklyLeaderboardEntry.findMany({
    where: { weekSlug },
    orderBy: [{ points: "desc" }, { updatedAt: "asc" }],
    take: limit,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          achievementLevel: true,
        },
      },
    },
  });

  return entries.map((entry, index) => ({
    rank: index + 1,
    userId: entry.user.id,
    name: entry.user.name,
    points: entry.points,
    quizzesCompleted: entry.quizzesCompleted,
    achievementLevel: computeAchievementLevel(
      entry.points,
      entry.quizzesCompleted
    ),
  }));
}
