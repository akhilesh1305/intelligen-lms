import type { CorporateGameSlug } from "@/lib/corporate-game-scenarios";
import { awardBadge } from "@/lib/gamification";
import { db } from "@/lib/db";

export type CorporatePerformanceTierId =
  | "perfect"
  | "excellent"
  | "good"
  | "participant";

export type CorporateMasteryTierId =
  | "bronze"
  | "silver"
  | "gold"
  | "platinum"
  | "diamond";

export type CorporatePerformanceTier = {
  id: CorporatePerformanceTierId;
  slug: string;
  name: string;
  description: string;
  icon: string;
  minScore: number;
  color: string;
  bg: string;
};

export type CorporateMasteryTier = {
  id: CorporateMasteryTierId;
  slug: string;
  name: string;
  description: string;
  icon: string;
  minPoints: number;
  color: string;
  bg: string;
};

export const CORPORATE_PERFORMANCE_TIERS: CorporatePerformanceTier[] = [
  {
    id: "perfect",
    slug: "corporate-tier-perfect",
    name: "Flawless Executive",
    description: "Score 100% on a corporate game",
    icon: "🏅",
    minScore: 100,
    color: "text-amber-700 dark:text-amber-300",
    bg: "bg-amber-100 dark:bg-amber-950/40",
  },
  {
    id: "excellent",
    slug: "corporate-tier-excellent",
    name: "Sharp Operator",
    description: "Score 75% or higher on a corporate game",
    icon: "⭐",
    minScore: 75,
    color: "text-violet-700 dark:text-violet-300",
    bg: "bg-violet-100 dark:bg-violet-950/40",
  },
  {
    id: "good",
    slug: "corporate-tier-good",
    name: "Rising Professional",
    description: "Score 50% or higher on a corporate game",
    icon: "📈",
    minScore: 50,
    color: "text-emerald-700 dark:text-emerald-300",
    bg: "bg-emerald-100 dark:bg-emerald-950/40",
  },
  {
    id: "participant",
    slug: "corporate-player",
    name: "Corporate Player",
    description: "Complete your first corporate game",
    icon: "🎮",
    minScore: 0,
    color: "text-slate-700 dark:text-slate-300",
    bg: "bg-slate-100 dark:bg-slate-800",
  },
];

export const CORPORATE_MASTERY_TIERS: CorporateMasteryTier[] = [
  {
    id: "diamond",
    slug: "corporate-mastery-diamond",
    name: "Diamond Mastery",
    description: "Earn 1,500 total corporate game points",
    icon: "💎",
    minPoints: 1500,
    color: "text-cyan-700 dark:text-cyan-300",
    bg: "bg-cyan-100 dark:bg-cyan-950/40",
  },
  {
    id: "platinum",
    slug: "corporate-mastery-platinum",
    name: "Platinum Mastery",
    description: "Earn 800 total corporate game points",
    icon: "🏆",
    minPoints: 800,
    color: "text-indigo-700 dark:text-indigo-300",
    bg: "bg-indigo-100 dark:bg-indigo-950/40",
  },
  {
    id: "gold",
    slug: "corporate-mastery-gold",
    name: "Gold Mastery",
    description: "Earn 400 total corporate game points",
    icon: "🥇",
    minPoints: 400,
    color: "text-amber-700 dark:text-amber-300",
    bg: "bg-amber-100 dark:bg-amber-950/40",
  },
  {
    id: "silver",
    slug: "corporate-mastery-silver",
    name: "Silver Mastery",
    description: "Earn 150 total corporate game points",
    icon: "🥈",
    minPoints: 150,
    color: "text-slate-600 dark:text-slate-300",
    bg: "bg-slate-200 dark:bg-slate-800",
  },
  {
    id: "bronze",
    slug: "corporate-mastery-bronze",
    name: "Bronze Mastery",
    description: "Earn 50 total corporate game points",
    icon: "🥉",
    minPoints: 50,
    color: "text-orange-800 dark:text-orange-300",
    bg: "bg-orange-100 dark:bg-orange-950/40",
  },
];

const GAME_PERFECT_BADGES: Record<
  CorporateGameSlug,
  { slug: string; name: string; description: string; icon: string }
> = {
  "cybersecurity-escape": {
    slug: "corporate-perfect-cybersecurity",
    name: "Security Sentinel",
    description: "Perfect score on Cybersecurity Escape Room",
    icon: "🔐",
  },
  "compliance-detective": {
    slug: "corporate-perfect-compliance",
    name: "Compliance Ace",
    description: "Perfect score on Compliance Detective",
    icon: "🔍",
  },
  "customer-service": {
    slug: "corporate-perfect-customer-service",
    name: "Service Champion",
    description: "Perfect score on Customer Service Simulator",
    icon: "🤝",
  },
  "sales-negotiation": {
    slug: "corporate-perfect-sales",
    name: "Deal Closer",
    description: "Perfect score on Sales Negotiation Simulator",
    icon: "💼",
  },
  "leadership-challenge": {
    slug: "corporate-perfect-leadership",
    name: "Visionary Leader",
    description: "Perfect score on Leadership Challenge",
    icon: "👔",
  },
  "project-management": {
    slug: "corporate-perfect-project-management",
    name: "Project Maestro",
    description: "Perfect score on Project Management Game",
    icon: "📊",
  },
};

export type CorporateBadgeEarned = {
  slug: string;
  name: string;
  description: string;
  icon: string;
};

export type CorporateBadgeRankInfo = {
  tier: CorporateMasteryTier | null;
  totalPoints: number;
  pointsToNextRank: number | null;
  nextTier: CorporateMasteryTier | null;
  progressPercent: number;
};

export function getPerformanceTier(
  score: number
): CorporatePerformanceTier {
  for (const tier of CORPORATE_PERFORMANCE_TIERS) {
    if (score >= tier.minScore) return tier;
  }
  return CORPORATE_PERFORMANCE_TIERS[CORPORATE_PERFORMANCE_TIERS.length - 1];
}

export function getMasteryTier(
  totalPoints: number
): CorporateMasteryTier | null {
  for (const tier of CORPORATE_MASTERY_TIERS) {
    if (totalPoints >= tier.minPoints) return tier;
  }
  return null;
}

export function getMasteryProgress(
  totalPoints: number
): CorporateBadgeRankInfo {
  const tier = getMasteryTier(totalPoints);
  const tiersAsc = [...CORPORATE_MASTERY_TIERS].reverse();
  const nextTier =
    tiersAsc.find((t) => totalPoints < t.minPoints) ?? null;

  if (!tier) {
    const first = tiersAsc[0];
    const progressPercent =
      first.minPoints > 0
        ? Math.min(100, Math.round((totalPoints / first.minPoints) * 100))
        : 0;
    return {
      tier: null,
      totalPoints,
      pointsToNextRank: Math.max(0, first.minPoints - totalPoints),
      nextTier: first,
      progressPercent,
    };
  }

  if (!nextTier) {
    return {
      tier,
      totalPoints,
      pointsToNextRank: null,
      nextTier: null,
      progressPercent: 100,
    };
  }

  const prevMin =
    CORPORATE_MASTERY_TIERS.find((t) => t.minPoints < nextTier.minPoints)
      ?.minPoints ?? tier.minPoints;
  const span = nextTier.minPoints - prevMin;
  const progress = totalPoints - prevMin;
  const progressPercent =
    span > 0 ? Math.min(100, Math.round((progress / span) * 100)) : 100;

  return {
    tier,
    totalPoints,
    pointsToNextRank: Math.max(0, nextTier.minPoints - totalPoints),
    nextTier,
    progressPercent,
  };
}

export async function getTotalCorporatePoints(
  userId: string
): Promise<number> {
  const result = await db.corporateGameAttempt.aggregate({
    where: { userId },
    _sum: { pointsEarned: true },
  });
  return result._sum.pointsEarned ?? 0;
}

export async function ensureCorporateBadgesExist() {
  const definitions = [
    ...CORPORATE_PERFORMANCE_TIERS.map((t) => ({
      slug: t.slug,
      name: t.name,
      description: t.description,
      icon: t.icon,
      points: 0,
    })),
    ...CORPORATE_MASTERY_TIERS.map((t) => ({
      slug: t.slug,
      name: t.name,
      description: t.description,
      icon: t.icon,
      points: 0,
    })),
    ...Object.values(GAME_PERFECT_BADGES).map((b) => ({
      ...b,
      points: 0,
    })),
  ];

  for (const badge of definitions) {
    await db.badge.upsert({
      where: { slug: badge.slug },
      update: {
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
      },
      create: badge,
    });
  }
}

export async function getUserCorporateBadgeRank(
  userId: string
): Promise<CorporateBadgeRankInfo> {
  const totalPoints = await getTotalCorporatePoints(userId);
  return getMasteryProgress(totalPoints);
}

export async function awardCorporateGameBadges(
  userId: string,
  gameSlug: CorporateGameSlug,
  score: number
): Promise<{
  performanceTier: CorporatePerformanceTier;
  badgesEarned: CorporateBadgeEarned[];
  badgeRank: CorporateBadgeRankInfo;
}> {
  await ensureCorporateBadgesExist();

  const badgesEarned: CorporateBadgeEarned[] = [];

  async function tryAward(slug: string) {
    const earned = await awardBadge(userId, slug);
    if (earned) {
      badgesEarned.push({
        slug: earned.slug,
        name: earned.name,
        description: earned.description,
        icon: earned.icon,
      });
    }
  }

  const performanceTier = getPerformanceTier(score);

  for (const tier of CORPORATE_PERFORMANCE_TIERS) {
    if (score >= tier.minScore) {
      await tryAward(tier.slug);
    }
  }

  if (score === 100) {
    const perfectBadge = GAME_PERFECT_BADGES[gameSlug];
    if (perfectBadge) {
      await tryAward(perfectBadge.slug);
    }
  }

  const totalPoints = await getTotalCorporatePoints(userId);
  const masteryTiersAsc = [...CORPORATE_MASTERY_TIERS].reverse();
  for (const tier of masteryTiersAsc) {
    if (totalPoints >= tier.minPoints) {
      await tryAward(tier.slug);
    }
  }

  const badgeRank = getMasteryProgress(totalPoints);

  return { performanceTier, badgesEarned, badgeRank };
}

export function getGamePerfectBadgeSlug(
  gameSlug: CorporateGameSlug
): string | undefined {
  return GAME_PERFECT_BADGES[gameSlug]?.slug;
}
