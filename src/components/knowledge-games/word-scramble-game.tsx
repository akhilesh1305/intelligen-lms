"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { SCRAMBLE_WORDS, scrambleLetters } from "@/lib/knowledge-games/content";
import type { KnowledgeGameMeta } from "@/lib/knowledge-games";
import { KnowledgeGameResult, submitGame } from "./knowledge-game-shared";

export function WordScrambleGame({ game }: { game: KnowledgeGameMeta }) {
  const words = useMemo(() => SCRAMBLE_WORDS, []);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [hintsUsed, setHintsUsed] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [scrambled] = useState(() =>
    words.map((w) => ({ ...w, scrambled: scrambleLetters(w.word) }))
  );
  const [result, setResult] = useState<{ score: number; pointsEarned: number } | null>(null);

  const current = scrambled[index];

  async function finish(finalCorrect: number, hints: number) {
    const base = Math.round((finalCorrect / words.length) * 100);
    const score = Math.max(0, base - hints * 5);
    const data = await submitGame(game.slug, score, {
      correct: finalCorrect,
      hints,
    });
    setResult(data);
  }

  function checkAnswer() {
    if (!current) return;
    const ok = input.trim().toUpperCase() === current.word;
    const nextCorrect = ok ? correctCount + 1 : correctCount;
    if (ok) setCorrectCount(nextCorrect);

    if (index + 1 >= words.length) {
      void finish(nextCorrect, hintsUsed);
      return;
    }

    setIndex((i) => i + 1);
    setInput("");
    setShowHint(false);
  }

  if (result) {
    return (
      <KnowledgeGameResult
        game={game}
        score={result.score}
        pointsEarned={result.pointsEarned}
        detail={`${correctCount}/${words.length} words solved`}
      />
    );
  }

  if (!current) return null;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        Word {index + 1} of {words.length} — unscramble the letters
      </p>
      <p className="text-center font-mono text-3xl font-bold tracking-widest text-brand-700 dark:text-brand-300">
        {current.scrambled}
      </p>
      {showHint ? (
        <p className="text-center text-sm text-amber-700 dark:text-amber-300">
          Hint: {current.hint}
        </p>
      ) : (
        <p className="text-center">
          <button
            type="button"
            className="text-xs font-semibold text-brand-600 hover:underline"
            onClick={() => {
              setShowHint(true);
              setHintsUsed((h) => h + 1);
            }}
          >
            Show hint (−5 pts)
          </button>
        </p>
      )}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value.toUpperCase())}
        onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
        placeholder="Your answer"
        className="h-12 w-full rounded-lg border border-border bg-panel px-4 text-center text-lg font-semibold uppercase tracking-wide text-ink focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        autoComplete="off"
      />
      <Button className="w-full" onClick={checkAnswer}>
        Submit
      </Button>
    </div>
  );
}
