"use client";

import type { KnowledgeGameMeta, KnowledgeGameSlug } from "@/lib/knowledge-games";
import { FlashcardChallengeGame } from "./flashcard-challenge-game";
import { MatchThePairGame } from "./match-the-pair-game";
import { MemoryGame } from "./memory-game";
import { WordScrambleGame } from "./word-scramble-game";
import { CrosswordPuzzleGame } from "./crossword-puzzle-game";
import {
  KnowledgeGameAlreadyDone,
} from "./knowledge-game-shared";

export function KnowledgeGamePlayer({
  game,
  alreadyCompleted,
  previousScore,
  previousPoints,
}: {
  game: KnowledgeGameMeta;
  alreadyCompleted?: boolean;
  previousScore?: number;
  previousPoints?: number;
}) {
  if (
    alreadyCompleted &&
    previousScore !== undefined &&
    previousPoints !== undefined
  ) {
    return (
      <KnowledgeGameAlreadyDone
        game={game}
        score={previousScore}
        pointsEarned={previousPoints}
      />
    );
  }

  const slug = game.slug as KnowledgeGameSlug;

  switch (slug) {
    case "flashcard-challenge":
      return <FlashcardChallengeGame game={game} />;
    case "match-the-pair":
      return <MatchThePairGame game={game} />;
    case "memory-game":
      return <MemoryGame game={game} />;
    case "word-scramble":
      return <WordScrambleGame game={game} />;
    case "crossword-puzzle":
      return <CrosswordPuzzleGame game={game} />;
    default:
      return null;
  }
}
