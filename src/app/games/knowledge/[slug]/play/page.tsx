import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getSession } from "@/lib/auth";
import { KnowledgeGamePlayer } from "@/components/knowledge-games/knowledge-game-player";
import {
  getKnowledgeGameAttempt,
  getKnowledgeGameBySlug,
  isKnowledgeGameSlug,
} from "@/lib/knowledge-games";

export default async function KnowledgeGamePlayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!isKnowledgeGameSlug(slug)) notFound();

  const game = getKnowledgeGameBySlug(slug)!;
  const session = await getSession();

  if (!session) {
    redirect(`/login?next=/games/knowledge/${slug}/play`);
  }

  const attempt = await getKnowledgeGameAttempt(session.id, slug);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <Link
        href={`/games/knowledge/${slug}`}
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        {game.title}
      </Link>

      <div className="mb-6 flex items-center gap-3">
        <span className="text-3xl">{game.icon}</span>
        <h1 className="text-xl font-bold text-ink">{game.title}</h1>
      </div>

      <KnowledgeGamePlayer
        game={game}
        alreadyCompleted={Boolean(attempt)}
        previousScore={attempt?.score}
        previousPoints={attempt?.pointsEarned}
      />
    </div>
  );
}
