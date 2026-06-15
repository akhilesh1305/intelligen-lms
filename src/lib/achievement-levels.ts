import type { AchievementLevel } from "@prisma/client";

export type LevelInfo = {
  level: AchievementLevel;
  label: string;
  icon: string;
  minPoints: number;
  minWins: number;
  color: string;
  bg: string;
};

export const UNRANKED_INFO = {
  label: "No rank",
  icon: "○",
  minPoints: 0,
  minWins: 0,
  color: "text-muted",
  bg: "bg-slate-100 dark:bg-slate-800",
};

export const ACHIEVEMENT_LEVELS: LevelInfo[] = [
  {
    level: "BRONZE",
    label: "Bronze",
    icon: "🥉",
    minPoints: 25,
    minWins: 5,
    color: "text-amber-800",
    bg: "bg-amber-100 dark:bg-amber-950",
  },
  {
    level: "SILVER",
    label: "Silver",
    icon: "🥈",
    minPoints: 50,
    minWins: 12,
    color: "text-slate-600",
    bg: "bg-slate-200 dark:bg-slate-700",
  },
  {
    level: "GOLD",
    label: "Gold",
    icon: "🥇",
    minPoints: 130,
    minWins: 30,
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-900/40",
  },
  {
    level: "PLATINUM",
    label: "Platinum",
    icon: "💎",
    minPoints: 275,
    minWins: 60,
    color: "text-violet-700",
    bg: "bg-violet-100 dark:bg-violet-950",
  },
];

const LEVEL_RANK: Record<AchievementLevel, number> = {
  BRONZE: 1,
  SILVER: 2,
  GOLD: 3,
  PLATINUM: 4,
};

export function getLevelInfo(level: AchievementLevel): LevelInfo {
  return (
    ACHIEVEMENT_LEVELS.find((l) => l.level === level) ?? ACHIEVEMENT_LEVELS[0]
  );
}

export function computeAchievementLevel(
  challengePoints: number,
  challengesPassed: number
): AchievementLevel | null {
  if (challengePoints >= 275 || challengesPassed >= 60) return "PLATINUM";
  if (challengePoints >= 130 || challengesPassed >= 30) return "GOLD";
  if (challengePoints >= 50 || challengesPassed >= 12) return "SILVER";
  if (challengePoints >= 25 || challengesPassed >= 5) return "BRONZE";
  return null;
}

export function getNextLevel(
  current: AchievementLevel | null
): LevelInfo | null {
  if (current === null) return ACHIEVEMENT_LEVELS[0];
  const idx = ACHIEVEMENT_LEVELS.findIndex((l) => l.level === current);
  if (idx < 0 || idx >= ACHIEVEMENT_LEVELS.length - 1) return null;
  return ACHIEVEMENT_LEVELS[idx + 1];
}

export function getLevelProgress(
  challengePoints: number,
  challengesPassed: number,
  level: AchievementLevel | null
) {
  const next = getNextLevel(level);
  if (!next) return { percent: 100, next: null };

  const pointsProgress = Math.min(
    100,
    Math.round((challengePoints / next.minPoints) * 100)
  );
  const winsProgress = Math.min(
    100,
    Math.round((challengesPassed / next.minWins) * 100)
  );

  return {
    percent: Math.max(pointsProgress, winsProgress),
    next,
  };
}

export function isHigherLevel(
  a: AchievementLevel | null,
  b: AchievementLevel | null
): boolean {
  if (a === null) return false;
  if (b === null) return true;
  return LEVEL_RANK[a] > LEVEL_RANK[b];
}
