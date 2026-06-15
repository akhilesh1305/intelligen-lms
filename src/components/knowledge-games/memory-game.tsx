"use client";

import { useMemo, useState } from "react";
import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { MEMORY_PAIRS, shuffle } from "@/lib/knowledge-games/content";
import type { KnowledgeGameMeta } from "@/lib/knowledge-games";
import { KnowledgeGameResult, submitGame } from "./knowledge-game-shared";

type Card = { uid: string; pairId: string; label: string; isEmoji: boolean };

function isEmojiLabel(label: string) {
  return !/^[a-zA-Z]/.test(label.trim());
}

export function MemoryGame({ game }: { game: KnowledgeGameMeta }) {
  const cards = useMemo(() => {
    const pairs = shuffle(MEMORY_PAIRS).slice(0, 6);
    const deck: Card[] = [];
    for (const p of pairs) {
      deck.push({
        uid: `${p.id}-a`,
        pairId: p.id,
        label: p.left,
        isEmoji: isEmojiLabel(p.left),
      });
      deck.push({
        uid: `${p.id}-b`,
        pairId: p.id,
        label: p.right,
        isEmoji: isEmojiLabel(p.right),
      });
    }
    return shuffle(deck);
  }, []);

  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [moves, setMoves] = useState(0);
  const [lock, setLock] = useState(false);
  const [result, setResult] = useState<{ score: number; pointsEarned: number } | null>(null);

  async function finish(finalMoves: number) {
    const pairCount = cards.length / 2;
    const idealMoves = pairCount * 2;
    const score = Math.max(
      20,
      Math.round(100 - ((finalMoves - idealMoves) / idealMoves) * 60)
    );
    const data = await submitGame(game.slug, score, { moves: finalMoves });
    setResult(data);
  }

  function flip(uid: string) {
    const card = cards.find((c) => c.uid === uid);
    if (!card || lock || flipped.includes(uid) || matched.has(card.pairId)) return;

    const next = [...flipped, uid];
    setFlipped(next);

    if (next.length === 2) {
      setMoves((m) => m + 1);
      setLock(true);
      const [a, b] = next.map((id) => cards.find((c) => c.uid === id)!);
      if (a.pairId === b.pairId) {
        const nextMatched = new Set(matched);
        nextMatched.add(a.pairId);
        setMatched(nextMatched);
        setFlipped([]);
        setLock(false);
        if (nextMatched.size === cards.length / 2) {
          void finish(moves + 1);
        }
      } else {
        setTimeout(() => {
          setFlipped([]);
          setLock(false);
        }, 900);
      }
    }
  }

  if (result) {
    return (
      <KnowledgeGameResult
        game={game}
        score={result.score}
        pointsEarned={result.pointsEarned}
        detail={`Completed in ${moves} moves`}
      />
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        Flip two cards at a time. Match each landmark or icon with its place or name (e.g. 🗼 ↔ Paris).
      </p>
      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3">
        {cards.map((card) => {
          const isOpen = flipped.includes(card.uid) || matched.has(card.pairId);
          const isMatched = matched.has(card.pairId);

          return (
            <button
              key={card.uid}
              type="button"
              onClick={() => flip(card.uid)}
              disabled={lock && !isOpen}
              aria-label={isOpen ? card.label : "Hidden card"}
              className={cn(
                "group relative aspect-square min-h-[4.5rem] w-full select-none rounded-xl border-2 p-1 transition-all duration-200 sm:min-h-[5.25rem]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40",
                isMatched
                  ? "border-emerald-400 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-950/40"
                  : isOpen
                    ? "border-brand-500 bg-panel shadow-sm"
                    : "border-brand-300/70 bg-gradient-to-br from-brand-600 to-brand-800 hover:border-brand-400 hover:shadow-md dark:from-brand-700 dark:to-brand-950"
              )}
            >
              {isOpen ? (
                <span
                  className={cn(
                    "flex h-full w-full items-center justify-center rounded-lg px-1 text-center",
                    card.isEmoji
                      ? "text-3xl sm:text-4xl"
                      : "text-[11px] font-bold leading-tight text-ink sm:text-xs"
                  )}
                >
                  {card.label}
                </span>
              ) : (
                <span className="flex h-full w-full flex-col items-center justify-center gap-0.5 rounded-lg text-white/90">
                  <HelpCircle className="h-6 w-6 opacity-90 sm:h-7 sm:w-7" />
                  <span className="text-[10px] font-semibold uppercase tracking-wide opacity-80">
                    Tap
                  </span>
                </span>
              )}
            </button>
          );
        })}
      </div>
      <p className="text-center text-xs text-muted">
        Moves: {moves} · Pairs: {matched.size} / {cards.length / 2}
      </p>
    </div>
  );
}
