import { getWeekLabel } from "@/lib/weekly-leaderboard";
import type { GamesPlayerProfile } from "@/lib/games-player-profile";
import { ACHIEVEMENT_LEVELS } from "@/lib/achievement-levels";

export function getDemoGamesPlayerProfile(
  displayName: string,
  isLoggedIn: boolean
): GamesPlayerProfile {
  const weekLabel = getWeekLabel();

  if (!isLoggedIn) {
    return {
      isLoggedIn: false,
      weekLabel,
      displayName: "Guest",
      rank: null,
      rankLabel: "Unranked",
      rankIcon: "○",
      xp: 0,
      challengePoints: 0,
      badgesEarned: 0,
      totalBadges: 12,
      globalRank: null,
      globalRankTotal: 58,
      levelLabel: "Unranked",
      levelIcon: "○",
      levelProgressPercent: 0,
      xpRemaining: ACHIEVEMENT_LEVELS[0].minPoints,
      nextLevelLabel: ACHIEVEMENT_LEVELS[0].label,
      stats: { gamesPlayed: 0, gamesWon: 0, bestScore: 0, weeklyPoints: 0 },
      recentBadges: [],
      milestones: [],
      rewards: [],
    };
  }

  const now = new Date();

  return {
    isLoggedIn: true,
    weekLabel,
    displayName,
    rank: "GOLD",
    rankLabel: "Gold",
    rankIcon: "🥇",
    xp: 1840,
    challengePoints: 312,
    badgesEarned: 7,
    totalBadges: 12,
    globalRank: 12,
    globalRankTotal: 58,
    levelLabel: "Gold",
    levelIcon: "🥇",
    levelProgressPercent: 72,
    xpRemaining: 18,
    nextLevelLabel: "Platinum",
    stats: {
      gamesPlayed: 34,
      gamesWon: 22,
      bestScore: 94,
      weeklyPoints: 312,
    },
    recentBadges: [
      {
        slug: "quiz-champion",
        name: "Quiz Champion",
        description: "Top 10% on weekly quiz leaderboard",
        icon: "🏆",
        points: 200,
        earnedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        slug: "cyber-defender",
        name: "Cyber Defender",
        description: "Completed cybersecurity escape scenario",
        icon: "🛡️",
        points: 150,
        earnedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        slug: "streak-master",
        name: "Streak Master",
        description: "7-day learning streak",
        icon: "🔥",
        points: 100,
        earnedAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
      },
    ],
    milestones: [
      {
        id: "rank-GOLD",
        label: "Gold rank",
        description: "Quiz challenge rank: Gold",
        icon: "🥇",
        earnedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        type: "rank",
      },
      {
        id: "quiz-champion",
        label: "Quiz Champion",
        description: "Top 10% on weekly quiz leaderboard",
        icon: "🏆",
        earnedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        type: "badge",
      },
    ],
    rewards: [
      {
        id: "quiz-rank",
        label: "Platinum rank",
        description: "Reach 275 challenge pts or 60 wins",
        icon: "💎",
        current: 312,
        target: 275,
        percent: 100,
      },
      {
        id: "corporate-mastery",
        label: "Gold",
        description: "Elite simulation scores across all game types",
        icon: "🥇",
        current: 680,
        target: 1000,
        percent: 68,
      },
    ],
  };
}

export function getDemoGamesHubStats(isLoggedIn: boolean) {
  return {
    totalGames: 14,
    completedToday: isLoggedIn ? 3 : 0,
    isLoggedIn,
  };
}
