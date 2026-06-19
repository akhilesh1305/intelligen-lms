import { getWeekLabel } from "@/lib/weekly-leaderboard";
import { DEMO_LEARNERS } from "./learners";
import { getDemoAchievementLevel } from "./courses";

export type DemoWeeklyLeaderEntry = {
  rank: number;
  userId: string;
  name: string;
  points: number;
  quizzesCompleted: number;
  achievementLevel: ReturnType<typeof getDemoAchievementLevel>;
};

function buildWeeklyLeaderboard(
  limit: number,
  currentUser?: { id: string; name: string }
): DemoWeeklyLeaderEntry[] {
  const top = DEMO_LEARNERS.slice(0, limit).map((l, i) => ({
    rank: i + 1,
    userId: l.id,
    name: l.name,
    points: Math.round(l.xp * 0.35),
    quizzesCompleted: l.quizzesCompleted,
    achievementLevel: getDemoAchievementLevel(Math.round(l.xp * 0.35)),
  }));

  if (!currentUser) return top;

  const alreadyListed = top.some((e) => e.userId === currentUser.id);
  if (alreadyListed) {
    return top.map((e) =>
      e.userId === currentUser.id ? { ...e, name: currentUser.name } : e
    );
  }

  const you: DemoWeeklyLeaderEntry = {
    rank: 7,
    userId: currentUser.id,
    name: currentUser.name,
    points: 312,
    quizzesCompleted: 14,
    achievementLevel: "GOLD",
  };

  const merged = [...top.slice(0, 6), you, ...top.slice(6, limit - 1)];
  return merged.map((e, i) => ({ ...e, rank: i + 1 }));
}

export function getDemoWeeklyLeaderboard(
  limit = 20,
  currentUser?: { id: string; name: string }
) {
  return buildWeeklyLeaderboard(limit, currentUser);
}

export function getDemoLeaderboardAnalytics() {
  const topLearners = getDemoWeeklyLeaderboard(10).map((l) => ({
    name: l.name,
    points: l.points,
    quizzes: l.quizzesCompleted,
  }));

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const quizActivity = days.map((day, i) => ({
    day: `${day}, Jun ${9 + i}`,
    attempts: 18 + i * 4 + (i % 2) * 6,
    points: 240 + i * 38,
  }));

  return {
    weekSlug: "2026-W24",
    weekLabel: getWeekLabel(),
    participants: 48,
    totalAttempts: 186,
    totalPoints: 4280,
    totalQuizzesCompleted: 312,
    dailyQuizCount: 7,
    weeklyQuizCount: 3,
    topLearners,
    quizActivity,
  };
}

export type DemoCorporateLeaderEntry = {
  rank: number;
  userId: string;
  name: string;
  points: number;
  gamesCompleted: number;
};

export function getDemoCorporateLeaderboard(
  limit = 20,
  currentUser?: { id: string; name: string }
): DemoCorporateLeaderEntry[] {
  const sorted = [...DEMO_LEARNERS].sort((a, b) => b.gamesCompleted - a.gamesCompleted);
  const top = sorted.slice(0, limit).map((l, i) => ({
    rank: i + 1,
    userId: l.id,
    name: l.name,
    points: l.gamesCompleted * 85 + (l.xp % 40),
    gamesCompleted: l.gamesCompleted,
  }));

  if (!currentUser) return top;

  const you: DemoCorporateLeaderEntry = {
    rank: 5,
    userId: currentUser.id,
    name: currentUser.name,
    points: 680,
    gamesCompleted: 8,
  };

  if (top.some((e) => e.userId === currentUser.id)) {
    return top.map((e) =>
      e.userId === currentUser.id ? { ...e, name: currentUser.name } : e
    );
  }

  return [...top.slice(0, 4), you, ...top.slice(4, limit - 1)].map((e, i) => ({
    ...e,
    rank: i + 1,
  }));
}

import { getMasteryProgress } from "@/lib/corporate-game-badges";

export function getDemoCorporateBadgeRank() {
  return getMasteryProgress(680);
}
