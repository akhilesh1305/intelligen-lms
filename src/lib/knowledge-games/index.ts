import type { KnowledgeGameType } from "@prisma/client";

import { getCurrentDaySlug } from "@/lib/corporate-game-scenarios";
import { addPoints } from "@/lib/gamification";
import { db } from "@/lib/db";

export const KNOWLEDGE_GAME_MAX_POINTS = 50;

export type KnowledgeGameSlug =
  | "flashcard-challenge"
  | "match-the-pair"
  | "memory-game"
  | "word-scramble"
  | "crossword-puzzle";

const SLUG_TO_TYPE: Record<KnowledgeGameSlug, KnowledgeGameType> = {
  "flashcard-challenge": "FLASHCARD_CHALLENGE",
  "match-the-pair": "MATCH_THE_PAIR",
  "memory-game": "MEMORY_GAME",
  "word-scramble": "WORD_SCRAMBLE",
  "crossword-puzzle": "CROSSWORD_PUZZLE",
};

export type KnowledgeGameMeta = {
  slug: KnowledgeGameSlug;
  type: KnowledgeGameType;
  title: string;
  description: string;
  icon: string;
  accent: string;
  features: string[];
};

export const KNOWLEDGE_GAMES: KnowledgeGameMeta[] = [
  {
    slug: "flashcard-challenge",
    type: "FLASHCARD_CHALLENGE",
    title: "Flashcard Challenge",
    description:
      "Timed flashcard review — flip cards, test recall, and earn points for correct answers.",
    icon: "🃏",
    accent: "from-violet-500/15 to-purple-600/10 border-violet-500/30",
    features: [
      "Timed flashcard review",
      "Earn points for correct answers",
      "Spaced repetition system",
    ],
  },
  {
    slug: "match-the-pair",
    type: "MATCH_THE_PAIR",
    title: "Match the Pair",
    description: "Match countries to their capitals before the timer runs out.",
    icon: "🔗",
    accent: "from-sky-500/15 to-blue-600/10 border-sky-500/30",
    features: ["Tap-to-match", "Countries, capitals & facts", "Speed bonus points"],
  },
  {
    slug: "memory-game",
    type: "MEMORY_GAME",
    title: "Memory Game",
    description: "Flip cards to find matching pairs and train your recall under pressure.",
    icon: "🧩",
    accent: "from-pink-500/15 to-rose-600/10 border-pink-500/30",
    features: ["Flip cards to find pairs", "Fewer moves = higher score", "Daily puzzle set"],
  },
  {
    slug: "word-scramble",
    type: "WORD_SCRAMBLE",
    title: "Word Scramble",
    description: "Unscramble letters to reveal general-knowledge words with optional hints.",
    icon: "🔤",
    accent: "from-amber-500/15 to-orange-600/10 border-amber-500/30",
    features: ["Unscramble trivia words", "Hint after a wrong try", "Bonus for no hints"],
  },
  {
    slug: "crossword-puzzle",
    type: "CROSSWORD_PUZZLE",
    title: "Crossword Puzzle",
    description: "Fill in a mini crossword with geography, nature, and trivia clues.",
    icon: "📝",
    accent: "from-emerald-500/15 to-teal-600/10 border-emerald-500/30",
    features: ["Mini crossword grid", "Across & down clues", "Check answers as you go"],
  },
];

export function isKnowledgeGameSlug(slug: string): slug is KnowledgeGameSlug {
  return slug in SLUG_TO_TYPE;
}

export function getKnowledgeGameBySlug(slug: KnowledgeGameSlug) {
  return KNOWLEDGE_GAMES.find((g) => g.slug === slug) ?? null;
}

export function getKnowledgeGameType(slug: KnowledgeGameSlug) {
  return SLUG_TO_TYPE[slug];
}

export async function getUserKnowledgeGameAttempts(userId: string) {
  const daySlug = getCurrentDaySlug();
  return db.knowledgeGameAttempt.findMany({
    where: { userId, daySlug },
  });
}

export async function getKnowledgeGameAttempt(
  userId: string,
  slug: KnowledgeGameSlug
) {
  const daySlug = getCurrentDaySlug();
  return db.knowledgeGameAttempt.findUnique({
    where: {
      userId_gameType_daySlug: {
        userId,
        gameType: getKnowledgeGameType(slug),
        daySlug,
      },
    },
  });
}

export function scoreToPoints(score: number): number {
  return Math.max(0, Math.round((score / 100) * KNOWLEDGE_GAME_MAX_POINTS));
}

export async function submitKnowledgeGameAttempt(
  userId: string,
  slug: KnowledgeGameSlug,
  score: number,
  payload?: Record<string, unknown>
) {
  const daySlug = getCurrentDaySlug();
  const gameType = getKnowledgeGameType(slug);
  const pointsEarned = scoreToPoints(score);

  const existing = await db.knowledgeGameAttempt.findUnique({
    where: {
      userId_gameType_daySlug: { userId, gameType, daySlug },
    },
  });

  if (existing) {
    throw new Error("Already completed today — come back tomorrow");
  }

  await db.knowledgeGameAttempt.create({
    data: {
      userId,
      gameType,
      daySlug,
      score,
      pointsEarned,
      payload: payload ? JSON.stringify(payload) : null,
    },
  });

  if (pointsEarned > 0) {
    await addPoints(userId, pointsEarned);
  }

  return { score, pointsEarned };
}
