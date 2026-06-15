import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Play } from "lucide-react";
import { getSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  getCorporateGameBySlug,
  getUserCorporateGameAttempts,
  isCorporateGameSlug,
} from "@/lib/corporate-games";
import {
  CORPORATE_SCENARIOS_PER_GAME,
  getCorporateGameScenarios,
  getDayLabel,
  getCorporateGameScenarioCatalogSize,
} from "@/lib/corporate-game-scenarios";
import { getScenarioQuestionCount } from "@/lib/corporate-game-types";

export const dynamic = "force-dynamic";

export default async function CorporateGameDetailPage({
  params,
}: {
  params: Promise<{ gameType: string }>;
}) {
  const { gameType } = await params;
  if (!isCorporateGameSlug(gameType)) notFound();

  const game = getCorporateGameBySlug(gameType)!;
  const scenarios = getCorporateGameScenarios(gameType);
  const questionCount = getScenarioQuestionCount(scenarios);
  const catalogSize = getCorporateGameScenarioCatalogSize(gameType);
  const session = await getSession();

  if (!session) {
    redirect(`/login?next=/corporate-games/${gameType}`);
  }

  const attempts = await getUserCorporateGameAttempts(session.id);
  const attempt = attempts.find((a) => a.gameType === game.type);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <Link
        href="/games"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        All corporate games
      </Link>

      <div className="flex items-start gap-4">
        <span className="text-4xl">{game.icon}</span>
        <div>
          <h1 className="text-2xl font-bold text-ink">{game.title}</h1>
          <p className="mt-2 text-muted">{game.description}</p>
        </div>
      </div>

      <Card className="mt-8">
        <CardContent className="pt-6">
          <h2 className="font-semibold text-ink">What you&apos;ll do</h2>
          <ul className="mt-3 space-y-2">
            {game.activities.map((activity) => (
              <li key={activity} className="flex items-start gap-2 text-sm text-muted">
                <span className="text-brand-600">✓</span>
                {activity}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted">
            {scenarios.length} detailed scenarios ({questionCount} questions) · read each
            story, then answer every question · up to 10 pts per correct choice · one
            attempt per day ({getDayLabel()} UTC)
          </p>
          <p className="mt-2 text-xs text-brand-700 dark:text-brand-300">
            Today&apos;s {CORPORATE_SCENARIOS_PER_GAME} scenarios are picked from{" "}
            {catalogSize} in the catalog — all new stories tomorrow at midnight UTC
          </p>

          {attempt ? (
            <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
              <p className="font-semibold text-emerald-800 dark:text-emerald-300">
                Completed today
              </p>
              <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">
                {attempt.score}% · +{attempt.pointsEarned} pts
              </p>
              <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-500">
                Come back tomorrow for fresh scenarios
              </p>
            </div>
          ) : (
            <Link href={`/corporate-games/${gameType}/play`} className="mt-6 inline-block">
              <Button size="lg">
                <Play className="h-4 w-4" />
                Start game
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
