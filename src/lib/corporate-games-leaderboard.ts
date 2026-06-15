import { getCurrentDaySlug, getDayLabel } from "@/lib/corporate-game-scenarios";
import { getCurrentWeekSlug, getWeekLabel } from "@/lib/weekly-leaderboard";
import { db } from "@/lib/db";

export { getWeekLabel, getDayLabel, getCurrentDaySlug };

export async function addCorporateGamesDailyLeaderboardPoints(
  userId: string,
  delta: number,
  date = new Date()
) {
  const daySlug = getCurrentDaySlug(date);

  return db.corporateGamesDailyLeaderboardEntry.upsert({
    where: { userId_daySlug: { userId, daySlug } },
    create: {
      userId,
      daySlug,
      points: delta,
      gamesCompleted: 1,
    },
    update: {
      points: { increment: delta },
      gamesCompleted: { increment: 1 },
    },
  });
}

export async function addCorporateGamesLeaderboardPoints(
  userId: string,
  delta: number,
  date = new Date()
) {
  const weekSlug = getCurrentWeekSlug(date);

  return db.corporateGamesLeaderboardEntry.upsert({
    where: { userId_weekSlug: { userId, weekSlug } },
    create: {
      userId,
      weekSlug,
      points: delta,
      gamesCompleted: 1,
    },
    update: {
      points: { increment: delta },
      gamesCompleted: { increment: 1 },
    },
  });
}

export async function addCorporateGamesLeaderboardPointsAll(
  userId: string,
  delta: number,
  date = new Date()
) {
  await Promise.all([
    addCorporateGamesDailyLeaderboardPoints(userId, delta, date),
    addCorporateGamesLeaderboardPoints(userId, delta, date),
  ]);
}

export async function getUserCorporateGamesDailyEntry(
  userId: string,
  date = new Date()
) {
  const daySlug = getCurrentDaySlug(date);
  return db.corporateGamesDailyLeaderboardEntry.findUnique({
    where: { userId_daySlug: { userId, daySlug } },
  });
}

export async function getUserCorporateGamesLeaderboardEntry(
  userId: string,
  date = new Date()
) {
  const weekSlug = getCurrentWeekSlug(date);
  return db.corporateGamesLeaderboardEntry.findUnique({
    where: { userId_weekSlug: { userId, weekSlug } },
  });
}

export async function getCorporateGamesDailyLeaderboard(
  limit = 20,
  date = new Date()
) {
  const daySlug = getCurrentDaySlug(date);

  const entries = await db.corporateGamesDailyLeaderboardEntry.findMany({
    where: { daySlug },
    orderBy: [{ points: "desc" }, { updatedAt: "asc" }],
    take: limit,
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return entries.map((entry, index) => ({
    rank: index + 1,
    userId: entry.user.id,
    name: entry.user.name,
    points: entry.points,
    gamesCompleted: entry.gamesCompleted,
  }));
}

export async function getCorporateGamesLeaderboard(limit = 20, date = new Date()) {
  const weekSlug = getCurrentWeekSlug(date);

  const entries = await db.corporateGamesLeaderboardEntry.findMany({
    where: { weekSlug },
    orderBy: [{ points: "desc" }, { updatedAt: "asc" }],
    take: limit,
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return entries.map((entry, index) => ({
    rank: index + 1,
    userId: entry.user.id,
    name: entry.user.name,
    points: entry.points,
    gamesCompleted: entry.gamesCompleted,
  }));
}
