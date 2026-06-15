"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { MATCH_PAIRS, shuffle } from "@/lib/knowledge-games/content";
import type { KnowledgeGameMeta } from "@/lib/knowledge-games";
import { KnowledgeGameResult, submitGame } from "./knowledge-game-shared";

type Tile = { id: string; text: string; pairId: string };

export function MatchThePairGame({ game }: { game: KnowledgeGameMeta }) {
  const pairs = useMemo(() => shuffle(MATCH_PAIRS).slice(0, 5), []);
  const tiles = useMemo(() => {
    const left: Tile[] = pairs.map((p) => ({
      id: `l-${p.id}`,
      text: p.left,
      pairId: p.id,
    }));
    const right: Tile[] = shuffle(
      pairs.map((p) => ({
        id: `r-${p.id}`,
        text: p.right,
        pairId: p.id,
      }))
    );
    return { left, right };
  }, [pairs]);

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [mistakes, setMistakes] = useState(0);
  const [result, setResult] = useState<{ score: number; pointsEarned: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function tryMatch(leftId: string, rightId: string) {
    const left = tiles.left.find((t) => t.id === leftId);
    const right = tiles.right.find((t) => t.id === rightId);
    if (!left || !right) return;

    if (left.pairId === right.pairId) {
      const next = new Set(matched);
      next.add(left.pairId);
      setMatched(next);
      setSelectedLeft(null);
      setSelectedRight(null);
      if (next.size === pairs.length) {
        setSubmitting(true);
        const score = Math.max(0, 100 - mistakes * 12);
        try {
          const data = await submitGame(game.slug, score, {
            mistakes,
            pairs: pairs.length,
          });
          setResult(data);
        } finally {
          setSubmitting(false);
        }
      }
    } else {
      setMistakes((m) => m + 1);
      setSelectedLeft(null);
      setSelectedRight(null);
    }
  }

  function pickLeft(id: string) {
    if (matched.has(tiles.left.find((t) => t.id === id)!.pairId)) return;
    setSelectedLeft(id);
    if (selectedRight) void tryMatch(id, selectedRight);
  }

  function pickRight(id: string) {
    if (matched.has(tiles.right.find((t) => t.id === id)!.pairId)) return;
    setSelectedRight(id);
    if (selectedLeft) void tryMatch(selectedLeft, id);
  }

  if (result) {
    return (
      <KnowledgeGameResult
        game={game}
        score={result.score}
        pointsEarned={result.pointsEarned}
        detail={`${pairs.length} pairs matched · ${mistakes} wrong tries`}
      />
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        Tap a country on the left, then its capital on the right.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          {tiles.left.map((tile) => {
            const isMatched = matched.has(tile.pairId);
            return (
              <button
                key={tile.id}
                type="button"
                disabled={isMatched || submitting}
                onClick={() => pickLeft(tile.id)}
                className={cn(
                  "w-full rounded-lg border px-3 py-3 text-left text-sm font-semibold transition-colors",
                  isMatched && "border-emerald-300 bg-emerald-50 opacity-60 dark:border-emerald-800 dark:bg-emerald-950/30",
                  selectedLeft === tile.id && "border-brand-500 bg-brand-50 dark:bg-brand-950/40",
                  !isMatched && selectedLeft !== tile.id && "border-border bg-surface hover:border-brand-300"
                )}
              >
                {tile.text}
              </button>
            );
          })}
        </div>
        <div className="space-y-2">
          {tiles.right.map((tile) => {
            const isMatched = matched.has(tile.pairId);
            return (
              <button
                key={tile.id}
                type="button"
                disabled={isMatched || submitting}
                onClick={() => pickRight(tile.id)}
                className={cn(
                  "w-full rounded-lg border px-3 py-3 text-left text-sm transition-colors",
                  isMatched && "border-emerald-300 bg-emerald-50 opacity-60 dark:border-emerald-800 dark:bg-emerald-950/30",
                  selectedRight === tile.id && "border-brand-500 bg-brand-50 dark:bg-brand-950/40",
                  !isMatched && selectedRight !== tile.id && "border-border bg-surface hover:border-brand-300"
                )}
              >
                {tile.text}
              </button>
            );
          })}
        </div>
      </div>
      <p className="text-center text-xs text-muted">
        Matched {matched.size} / {pairs.length}
      </p>
    </div>
  );
}
