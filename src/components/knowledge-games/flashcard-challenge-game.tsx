"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FLASHCARD_DECK, shuffle } from "@/lib/knowledge-games/content";
import type { KnowledgeGameMeta } from "@/lib/knowledge-games";
import { KnowledgeGameResult, submitGame } from "./knowledge-game-shared";

const SESSION_SIZE = 8;
const TIME_LIMIT_SEC = 90;

async function reviewCard(cardId: string, correct: boolean) {
  await fetch("/api/knowledge-games/flashcards/review", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cardId, correct }),
  });
}

export function FlashcardChallengeGame({ game }: { game: KnowledgeGameMeta }) {
  const cards = useMemo(
    () => shuffle(FLASHCARD_DECK).slice(0, SESSION_SIZE),
    []
  );
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(TIME_LIMIT_SEC);
  const [result, setResult] = useState<{ score: number; pointsEarned: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const finish = useCallback(async () => {
    if (done || submitting) return;
    setDone(true);
    setSubmitting(true);
    const score = Math.round((correct / cards.length) * 100);
    try {
      const data = await submitGame(game.slug, score, {
        correct,
        total: cards.length,
      });
      setResult(data);
    } catch {
      setDone(false);
    } finally {
      setSubmitting(false);
    }
  }, [cards.length, correct, done, game.slug, submitting]);

  useEffect(() => {
    if (done || result) return;
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          void finish();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [done, finish, result]);

  const card = cards[index];

  async function answer(wasCorrect: boolean) {
    if (done || !card) return;
    await reviewCard(card.id, wasCorrect);
    const nextCorrect = wasCorrect ? correct + 1 : correct;
    setCorrect(nextCorrect);
    setFlipped(false);
    if (index + 1 >= cards.length) {
      setCorrect(nextCorrect);
      setDone(true);
      setSubmitting(true);
      const score = Math.round((nextCorrect / cards.length) * 100);
      try {
        const data = await submitGame(game.slug, score, {
          correct: nextCorrect,
          total: cards.length,
        });
        setResult(data);
      } finally {
        setSubmitting(false);
      }
      return;
    }
    setIndex((i) => i + 1);
  }

  if (result) {
    return (
      <KnowledgeGameResult
        game={game}
        score={result.score}
        pointsEarned={result.pointsEarned}
        detail={`${correct}/${cards.length} correct · SRS updated for each card`}
      />
    );
  }

  if (!card) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-ink">
          Card {Math.min(index + 1, cards.length)} / {cards.length}
        </span>
        <span
          className={cn(
            "font-mono font-bold",
            secondsLeft <= 15 ? "text-red-600" : "text-brand-600"
          )}
        >
          {secondsLeft}s
        </span>
      </div>

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className="flex min-h-[200px] w-full flex-col items-center justify-center rounded-xl border-2 border-brand-300 bg-gradient-to-br from-brand-50 to-panel p-6 text-center transition-transform active:scale-[0.99] dark:border-brand-700 dark:from-brand-950/40"
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          {flipped ? "Definition" : "Term · tap to flip"}
        </p>
        <p className="mt-4 text-xl font-bold text-ink">
          {flipped ? card.definition : card.term}
        </p>
      </button>

      <p className="text-center text-xs text-muted">
        Spaced repetition schedules your next review after each answer
      </p>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          disabled={!flipped || submitting}
          onClick={() => void answer(false)}
        >
          Need practice
        </Button>
        <Button disabled={!flipped || submitting} onClick={() => void answer(true)}>
          Got it
        </Button>
      </div>
    </div>
  );
}
