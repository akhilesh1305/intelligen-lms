import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getSession } from "@/lib/auth";
import {
  getCorporateGameBySlug,
  getUserCorporateGameAttempts,
  isCorporateGameSlug,
} from "@/lib/corporate-games";
import { getCorporateGameScenarios } from "@/lib/corporate-game-scenarios";
import { CorporateGamePlayer } from "@/components/corporate-games/corporate-game-player";

export const dynamic = "force-dynamic";

export default async function CorporateGamePlayPage({
  params,
}: {
  params: Promise<{ gameType: string }>;
}) {
  const { gameType } = await params;
  if (!isCorporateGameSlug(gameType)) notFound();

  const session = await getSession();
  if (!session) {
    redirect(`/login?next=/corporate-games/${gameType}/play`);
  }

  const game = getCorporateGameBySlug(gameType)!;
  const scenarios = getCorporateGameScenarios(gameType);
  const attempts = await getUserCorporateGameAttempts(session.id);
  const attempt = attempts.find((a) => a.gameType === game.type);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <Link
        href={`/corporate-games/${gameType}`}
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        {game.title}
      </Link>

      <CorporateGamePlayer
        game={game}
        scenarios={scenarios}
        alreadyCompleted={!!attempt}
        previousScore={attempt?.score}
        previousPoints={attempt?.pointsEarned}
      />
    </div>
  );
}
