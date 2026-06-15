"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CROSSWORD_CLUES, CROSSWORD_GRID } from "@/lib/knowledge-games/content";
import type { KnowledgeGameMeta } from "@/lib/knowledge-games";
import { KnowledgeGameResult, submitGame } from "./knowledge-game-shared";

function buildInitialGrid(): (string | null)[][] {
  return CROSSWORD_GRID.map((row) =>
    row.split("").map((ch) => (ch === "." ? null : ""))
  );
}

export function CrosswordPuzzleGame({ game }: { game: KnowledgeGameMeta }) {
  const [grid, setGrid] = useState(buildInitialGrid);
  const [result, setResult] = useState<{ score: number; pointsEarned: number } | null>(null);

  const cells = useMemo(() => {
    const nums = new Map<string, number>();
    for (const clue of CROSSWORD_CLUES) {
      nums.set(`${clue.row},${clue.col}`, clue.number);
    }
    return nums;
  }, []);

  function setCell(row: number, col: number, value: string) {
    if (CROSSWORD_GRID[row][col] === ".") return;
    const letter = value.slice(-1).toUpperCase();
    setGrid((g) => {
      const next = g.map((r) => [...r]);
      next[row][col] = letter || "";
      return next;
    });
  }

  function checkAnswers() {
    let correct = 0;
    let total = 0;
    for (const clue of CROSSWORD_CLUES) {
      const answer = clue.answer.toUpperCase();
      for (let i = 0; i < answer.length; i++) {
        const r = clue.direction === "across" ? clue.row : clue.row + i;
        const c = clue.direction === "across" ? clue.col + i : clue.col;
        if (CROSSWORD_GRID[r]?.[c] === ".") continue;
        total++;
        if ((grid[r][c] ?? "").toUpperCase() === answer[i]) correct++;
      }
    }
    const score = total > 0 ? Math.round((correct / total) * 100) : 0;
    void submitGame(game.slug, score, { correct, total }).then(setResult);
  }

  if (result) {
    return (
      <KnowledgeGameResult
        game={game}
        score={result.score}
        pointsEarned={result.pointsEarned}
        detail="Crossword complete"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="mx-auto w-fit">
        <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(5, 2.5rem)` }}>
          {grid.map((row, ri) =>
            row.map((cell, ci) => {
              const blocked = CROSSWORD_GRID[ri][ci] === ".";
              const num = cells.get(`${ri},${ci}`);
              return (
                <div
                  key={`${ri}-${ci}`}
                  className={cn(
                    "relative h-10 w-10",
                    blocked && "bg-transparent"
                  )}
                >
                  {!blocked ? (
                    <>
                      {num ? (
                        <span className="absolute left-0.5 top-0 text-[8px] font-bold text-muted">
                          {num}
                        </span>
                      ) : null}
                      <input
                        value={cell ?? ""}
                        maxLength={1}
                        onChange={(e) => setCell(ri, ci, e.target.value)}
                        className="h-10 w-10 rounded border border-border bg-panel text-center text-sm font-bold uppercase text-ink focus:border-brand-500 focus:outline-none"
                      />
                    </>
                  ) : null}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-bold uppercase text-muted">Across</p>
          <ul className="mt-2 space-y-2 text-sm">
            {CROSSWORD_CLUES.filter((c) => c.direction === "across").map((c) => (
              <li key={c.id}>
                <span className="font-semibold text-ink">{c.number}.</span> {c.clue}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-muted">Down</p>
          <ul className="mt-2 space-y-2 text-sm">
            {CROSSWORD_CLUES.filter((c) => c.direction === "down").map((c) => (
              <li key={c.id}>
                <span className="font-semibold text-ink">{c.number}.</span> {c.clue}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Button className="w-full" onClick={checkAnswers}>
        Check & finish
      </Button>
    </div>
  );
}
