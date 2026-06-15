import type { CorporateGameType } from "@prisma/client";

import {
  awardCorporateGameBadges,
  getUserCorporateBadgeRank,
} from "@/lib/corporate-game-badges";
import { addCorporateGamesLeaderboardPointsAll } from "@/lib/corporate-games-leaderboard";

import { addPoints } from "@/lib/gamification";

import { getCurrentWeekSlug } from "@/lib/weekly-leaderboard";

import { db } from "@/lib/db";

import {

  getCorporateGameScenarios,

  getCurrentDaySlug,

  getDailyScenarioSetIndex,

  type CorporateGameSlug,

} from "@/lib/corporate-game-scenarios";

import {
  flattenScenarioQuestions,
  getScenarioQuestionCount,
} from "@/lib/corporate-game-types";



export const CORPORATE_GAME_POINTS_MAX = 10;

export const CORPORATE_GAME_POINTS_PARTIAL = 4;



export type CorporateGameMeta = {

  slug: CorporateGameSlug;

  type: CorporateGameType;

  title: string;

  description: string;

  icon: string;

  accent: string;

  activities: string[];

};



export const CORPORATE_GAMES: CorporateGameMeta[] = [

  {

    slug: "cybersecurity-escape",

    type: "CYBERSECURITY_ESCAPE",

    title: "Cybersecurity Escape Room",

    description:

      "Identify phishing emails, spot vulnerabilities, and solve security puzzles before time runs out.",

    icon: "🔐",

    accent: "from-cyan-500/15 to-blue-600/10 border-cyan-500/30",

    activities: [

      "Identify phishing emails",

      "Find security vulnerabilities",

      "Solve security puzzles",

    ],

  },

  {

    slug: "compliance-detective",

    type: "COMPLIANCE_DETECTIVE",

    title: "Compliance Detective",

    description:

      "Investigate workplace cases and spot policy violations like a corporate investigator.",

    icon: "🕵️",

    accent: "from-amber-500/15 to-orange-600/10 border-amber-500/30",

    activities: ["Find policy violations", "Investigate workplace cases"],

  },

  {

    slug: "customer-service",

    type: "CUSTOMER_SERVICE",

    title: "Customer Service Simulator",

    description:

      "Handle virtual customers, de-escalate issues, and earn satisfaction points.",

    icon: "🎧",

    accent: "from-emerald-500/15 to-teal-600/10 border-emerald-500/30",

    activities: ["Handle virtual customers", "Earn satisfaction points"],

  },

  {

    slug: "sales-negotiation",

    type: "SALES_NEGOTIATION",

    title: "Sales Negotiation Simulator",

    description:

      "Practice sales conversations with different customer personalities and close deals.",

    icon: "🤝",

    accent: "from-violet-500/15 to-purple-600/10 border-violet-500/30",

    activities: [

      "Practice sales conversations",

      "Different customer personalities",

    ],

  },

  {

    slug: "leadership-challenge",

    type: "LEADERSHIP_CHALLENGE",

    title: "Leadership Challenge",

    description:

      "Manage a virtual team and make tough management decisions under pressure.",

    icon: "👥",

    accent: "from-rose-500/15 to-pink-600/10 border-rose-500/30",

    activities: ["Manage a virtual team", "Make management decisions"],

  },

  {

    slug: "project-management",

    type: "PROJECT_MANAGEMENT",

    title: "Project Management Game",

    description:

      "Allocate resources, meet deadlines, and handle project risks in a fast-paced sprint.",

    icon: "📊",

    accent: "from-indigo-500/15 to-blue-600/10 border-indigo-500/30",

    activities: ["Allocate resources", "Meet deadlines", "Handle risks"],

  },

];



export function getCorporateGameBySlug(slug: string) {

  return CORPORATE_GAMES.find((g) => g.slug === slug) ?? null;

}



export function isCorporateGameSlug(slug: string): slug is CorporateGameSlug {

  return CORPORATE_GAMES.some((g) => g.slug === slug);

}



export async function getUserCorporateGameAttempts(

  userId: string,

  daySlug = getCurrentDaySlug()

) {

  return db.corporateGameAttempt.findMany({

    where: { userId, daySlug },

  });

}



export async function getUserCorporateGameAttemptsThisWeek(

  userId: string,

  weekSlug = getCurrentWeekSlug()

) {

  return db.corporateGameAttempt.findMany({

    where: { userId, weekSlug },

  });

}



export async function submitCorporateGameAttempt(

  userId: string,

  slug: CorporateGameSlug,

  choiceIndices: number[]

) {

  const game = getCorporateGameBySlug(slug);

  if (!game) throw new Error("Unknown game");



  const now = new Date();

  const daySlug = getCurrentDaySlug(now);

  const weekSlug = getCurrentWeekSlug(now);

  const scenarioSet = getDailyScenarioSetIndex(slug, now);

  const scenarios = getCorporateGameScenarios(slug, now);
  const flatQuestions = flattenScenarioQuestions(scenarios);
  const questionCount = getScenarioQuestionCount(scenarios);

  if (choiceIndices.length !== questionCount) {
    throw new Error("Incomplete game session");
  }



  const existing = await db.corporateGameAttempt.findUnique({

    where: {

      userId_gameType_daySlug: {

        userId,

        gameType: game.type,

        daySlug,

      },

    },

  });



  if (existing) {
    const badgeRank = await getUserCorporateBadgeRank(userId);

    return {
      score: existing.score,
      pointsEarned: existing.pointsEarned,
      alreadyCompleted: true,
      maxScore: questionCount * CORPORATE_GAME_POINTS_MAX,
      badgesEarned: [],
      badgeRank,
      pointsToNextRank: badgeRank.pointsToNextRank,
    };
  }



  let pointsEarned = 0;

  const breakdown: number[] = [];



  for (let i = 0; i < flatQuestions.length; i++) {
    const choice = flatQuestions[i].question.options[choiceIndices[i]];
    const pts = choice?.points ?? 0;
    breakdown.push(pts);
    pointsEarned += pts;
  }

  const maxScore = questionCount * CORPORATE_GAME_POINTS_MAX;

  const score =

    maxScore > 0 ? Math.round((pointsEarned / maxScore) * 100) : 0;



  await db.corporateGameAttempt.create({

    data: {

      userId,

      gameType: game.type,

      daySlug,

      weekSlug,

      scenarioSet,

      score,

      pointsEarned,

      answers: JSON.stringify({ choiceIndices, breakdown, scenarioSet }),

    },

  });



  await addCorporateGamesLeaderboardPointsAll(userId, pointsEarned, now);

  if (pointsEarned > 0) {
    await addPoints(userId, pointsEarned);
  }

  const { performanceTier, badgesEarned, badgeRank } =
    await awardCorporateGameBadges(userId, slug, score);

  return {
    score,
    pointsEarned,
    alreadyCompleted: false,
    maxScore,
    breakdown,
    performanceTier: {
      id: performanceTier.id,
      name: performanceTier.name,
      icon: performanceTier.icon,
      color: performanceTier.color,
      bg: performanceTier.bg,
    },
    badgesEarned,
    badgeRank,
    pointsToNextRank: badgeRank.pointsToNextRank,
  };
}


