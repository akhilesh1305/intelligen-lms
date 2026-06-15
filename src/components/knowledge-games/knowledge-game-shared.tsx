"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { KnowledgeGameMeta } from "@/lib/knowledge-games";

export function KnowledgeGameResult({
  game,
  score,
  pointsEarned,
  detail,
}: {
  game: KnowledgeGameMeta;
  score: number;
  pointsEarned: number;
  detail?: string;
}) {
  const sign = pointsEarned >= 0 ? "+" : "";
  return (
    <div className="rounded-xl border border-border bg-panel p-8 shadow-card text-center">
      <p className="text-3xl">{game.icon}</p>
      <p className="mt-3 text-lg font-bold text-ink">Great work!</p>
      <p className="mt-2 text-muted">
        Score: <strong className="text-ink">{score}%</strong> · {sign}
        {pointsEarned} pts
      </p>
      {detail ? <p className="mt-2 text-sm text-muted">{detail}</p> : null}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Link href={`/games/knowledge/${game.slug}`}>
          <Button variant="soft">Game details</Button>
        </Link>
        <Link href="/games#knowledge-games">
          <Button>All games</Button>
        </Link>
      </div>
    </div>
  );
}

export function KnowledgeGameAlreadyDone({
  score,
  pointsEarned,
}: {
  game: KnowledgeGameMeta;
  score: number;
  pointsEarned: number;
}) {
  const sign = pointsEarned >= 0 ? "+" : "";
  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center dark:border-emerald-900 dark:bg-emerald-950/30">
      <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
      <p className="mt-3 text-lg font-bold text-emerald-800 dark:text-emerald-300">
        Already completed today
      </p>
      <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">
        {score}% · {sign}
        {pointsEarned} pts
      </p>
      <Link href="/games#knowledge-games" className="mt-6 inline-block">
        <Button variant="soft">Back to games</Button>
      </Link>
    </div>
  );
}

async function submitGame(
  slug: string,
  score: number,
  payload?: Record<string, unknown>
) {
  const res = await fetch(`/api/knowledge-games/${slug}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ score, payload }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Submit failed");
  return data as { score: number; pointsEarned: number };
}

export { submitGame };
