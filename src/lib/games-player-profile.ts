import type { AchievementLevel } from "@prisma/client";
import { db } from "@/lib/db";
import { ensureBadgesExist } from "@/lib/gamification";
import {
  computeAchievementLevel,
  getLevelInfo,
  getLevelProgress,
  getNextLevel,
  ACHIEVEMENT_LEVELS,
} from "@/lib/achievement-levels";
import { getUserWeeklyEntry, getWeekLabel } from "@/lib/weekly-leaderboard";
import { getUserCorporateBadgeRank } from "@/lib/corporate-game-badges";

export type PlayerBadge = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  earnedAt: Date;
};

export type AchievementMilestone = {
  id: string;
  label: string;
  description: string;
  icon: string;
  earnedAt: Date;
  type: "badge" | "rank";
};

export type RewardMilestone = {
  id: string;
  label: string;
  description: string;
  icon: string;
  current: number;
  target: number;
  percent: number;
};

export type GamesPlayerProfile = {
  isLoggedIn: boolean;
  displayName: string;
  rank: AchievementLevel | null;
  rankLabel: string;
  rankIcon: string;
  xp: number;
  challengePoints: number;
  badgesEarned: number;
  totalBadges: number;
  globalRank: number | null;
  globalRankTotal: number;
  levelLabel: string;
  levelIcon: string;
  levelProgressPercent: number;
  xpRemaining: number;
  nextLevelLabel: string | null;
  stats: {
    gamesPlayed: number;
    gamesWon: number;
    bestScore: number;
    weeklyPoints: number;
  };
  recentBadges: PlayerBadge[];
  milestones: AchievementMilestone[];
  rewards: RewardMilestone[];
  weekLabel: string;
};

const EMPTY_PROFILE: Omit<GamesPlayerProfile, "isLoggedIn" | "weekLabel"> = {
  displayName: "Guest",
  rank: null,
  rankLabel: "Unranked",
  rankIcon: "○",
  xp: 0,
  challengePoints: 0,
  badgesEarned: 0,
  totalBadges: 0,
  globalRank: null,
  globalRankTotal: 0,
  levelLabel: "Unranked",
  levelIcon: "○",
  levelProgressPercent: 0,
  xpRemaining: ACHIEVEMENT_LEVELS[0].minPoints,
  nextLevelLabel: ACHIEVEMENT_LEVELS[0].label,
  stats: {
    gamesPlayed: 0,
    gamesWon: 0,
    bestScore: 0,
    weeklyPoints: 0,
  },
  recentBadges: [],
  milestones: [],
  rewards: [],
};

export async function getGamesPlayerProfile(
  userId: string | undefined
): Promise<GamesPlayerProfile> {
  const weekLabel = getWeekLabel();

  if (!userId) {
    const totalBadges = await db.badge.count();
    return {
      isLoggedIn: false,
      weekLabel,
      ...EMPTY_PROFILE,
      totalBadges,
    };
  }

  await ensureBadgesExist();

  const [
    user,
    userBadges,
    badgesEarned,
    totalBadges,
    weeklyEntry,
    corporateRank,
    globalRankTotal,
    challengeAgg,
    corporateAgg,
    knowledgeAgg,
    passedChallenges,
    nextBadge,
  ] = await Promise.all([
    db.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        points: true,
        challengePoints: true,
        challengesPassed: true,
        achievementLevel: true,
      },
    }),
    db.userBadge.findMany({
      where: { userId },
      include: { badge: true },
      orderBy: { earnedAt: "desc" },
      take: 8,
    }),
    db.userBadge.count({ where: { userId } }),
    db.badge.count(),
    getUserWeeklyEntry(userId),
    getUserCorporateBadgeRank(userId),
    db.user.count({ where: { role: "STUDENT" } }),
    db.challengeAttempt.aggregate({
      where: { userId },
      _count: { _all: true },
      _max: { score: true },
    }),
    db.corporateGameAttempt.aggregate({
      where: { userId },
      _count: { _all: true },
      _max: { score: true },
    }),
    db.knowledgeGameAttempt.aggregate({
      where: { userId },
      _count: { _all: true },
      _max: { score: true },
    }),
    db.challengeAttempt.count({ where: { userId, passed: true } }),
    db.badge.findMany({ orderBy: { points: "asc" } }).then(async (badges) => {
      const earned = await db.userBadge.findMany({
        where: { userId },
        select: { badgeId: true },
      });
      const earnedIds = new Set(earned.map((e) => e.badgeId));
      return badges.find((b) => !earnedIds.has(b.id)) ?? null;
    }),
  ]);

  const xp = user?.points ?? 0;
  const challengePoints = user?.challengePoints ?? 0;
  const challengesPassed = user?.challengesPassed ?? 0;

  const rank =
    user?.achievementLevel ??
    computeAchievementLevel(challengePoints, challengesPassed);
  const rankInfo = rank ? getLevelInfo(rank) : null;

  const levelProgress = getLevelProgress(
    challengePoints,
    challengesPassed,
    rank
  );
  const nextLevel = getNextLevel(rank);
  const xpRemaining = nextLevel
    ? Math.max(0, nextLevel.minPoints - challengePoints)
    : 0;

  const globalRank =
    xp > 0
      ? (await db.user.count({ where: { role: "STUDENT", points: { gt: xp } } })) +
        1
      : null;

  const gamesPlayed =
    (challengeAgg._count._all ?? 0) +
    (corporateAgg._count._all ?? 0) +
    (knowledgeAgg._count._all ?? 0);

  const gamesWon = passedChallenges + (corporateAgg._count._all ?? 0);

  const bestScore = Math.max(
    challengeAgg._max.score ?? 0,
    corporateAgg._max.score ?? 0,
    knowledgeAgg._max.score ?? 0
  );

  const recentBadges: PlayerBadge[] = userBadges.map((ub) => ({
    slug: ub.badge.slug,
    name: ub.badge.name,
    description: ub.badge.description,
    icon: ub.badge.icon,
    points: ub.badge.points,
    earnedAt: ub.earnedAt,
  }));

  const milestones: AchievementMilestone[] = recentBadges.slice(0, 5).map((b) => ({
    id: b.slug,
    label: b.name,
    description: b.description,
    icon: b.icon,
    earnedAt: b.earnedAt,
    type: "badge" as const,
  }));

  if (rank && rankInfo && userBadges[0]) {
    milestones.unshift({
      id: `rank-${rank}`,
      label: `${rankInfo.label} rank`,
      description: `Quiz challenge rank: ${rankInfo.label}`,
      icon: rankInfo.icon,
      earnedAt: userBadges[0].earnedAt,
      type: "rank",
    });
  }

  const rewards: RewardMilestone[] = [];

  if (nextLevel) {
    rewards.push({
      id: "quiz-rank",
      label: `${nextLevel.label} rank`,
      description: `Reach ${nextLevel.minPoints} challenge pts or ${nextLevel.minWins} wins`,
      icon: nextLevel.icon,
      current: challengePoints,
      target: nextLevel.minPoints,
      percent: levelProgress.percent,
    });
  }

  if (nextBadge) {
    rewards.push({
      id: nextBadge.slug,
      label: nextBadge.name,
      description: nextBadge.description,
      icon: nextBadge.icon,
      current: xp,
      target: Math.max(nextBadge.points, 1),
      percent: Math.min(
        100,
        Math.round((xp / Math.max(nextBadge.points, 1)) * 100)
      ),
    });
  }

  if (corporateRank.nextTier) {
    rewards.push({
      id: "corporate-mastery",
      label: corporateRank.nextTier.name.replace(" Mastery", ""),
      description: corporateRank.nextTier.description,
      icon: corporateRank.nextTier.icon,
      current: corporateRank.totalPoints,
      target: corporateRank.nextTier.minPoints,
      percent: corporateRank.progressPercent,
    });
  }

  return {
    isLoggedIn: true,
    weekLabel,
    displayName: user?.name ?? "Player",
    rank,
    rankLabel: rankInfo?.label ?? "Unranked",
    rankIcon: rankInfo?.icon ?? "○",
    xp,
    challengePoints,
    badgesEarned: badgesEarned,
    totalBadges,
    globalRank,
    globalRankTotal,
    levelLabel: rankInfo?.label ?? "Unranked",
    levelIcon: rankInfo?.icon ?? "○",
    levelProgressPercent: levelProgress.percent,
    xpRemaining,
    nextLevelLabel: nextLevel?.label ?? null,
    stats: {
      gamesPlayed,
      gamesWon,
      bestScore,
      weeklyPoints: weeklyEntry?.points ?? 0,
    },
    recentBadges,
    milestones: milestones.slice(0, 6),
    rewards,
  };
}
