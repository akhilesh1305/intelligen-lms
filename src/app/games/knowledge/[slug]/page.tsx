import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Play } from "lucide-react";
import { getSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  getKnowledgeGameAttempt,
  getKnowledgeGameBySlug,
  isKnowledgeGameSlug,
  KNOWLEDGE_GAME_MAX_POINTS,
} from "@/lib/knowledge-games";

export default async function KnowledgeGameDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!isKnowledgeGameSlug(slug)) notFound();

  const game = getKnowledgeGameBySlug(slug)!;
  const session = await getSession();

  if (!session) {
    redirect(`/login?next=/games/knowledge/${slug}`);
  }

  const attempt = await getKnowledgeGameAttempt(session.id, slug);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <Link
        href="/games#knowledge-games"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        General knowledge games
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
          <h2 className="font-semibold text-ink">How it works</h2>
          <ul className="mt-3 space-y-2">
            {game.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm text-muted">
                <span className="text-brand-600">✓</span>
                {feature}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted">
            Earn up to {KNOWLEDGE_GAME_MAX_POINTS} pts per day · one attempt per game (UTC day)
          </p>

          {attempt ? (
            <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
              <p className="font-semibold text-emerald-800 dark:text-emerald-300">
                Completed today
              </p>
              <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">
                {attempt.score}% · +{attempt.pointsEarned} pts
              </p>
            </div>
          ) : (
            <Link href={`/games/knowledge/${slug}/play`} className="mt-6 inline-block">
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
