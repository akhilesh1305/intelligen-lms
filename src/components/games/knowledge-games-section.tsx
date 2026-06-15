import Link from "next/link";
import { Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { GameCardImage } from "@/components/games/game-card-image";
import { GamesAnimatedSection } from "@/components/games/games-animated-section";
import { GamesSectionBanner } from "@/components/games/games-section-banner";
import {
  KNOWLEDGE_GAMES,
  getKnowledgeGameAttempt,
} from "@/lib/knowledge-games";
import { GAMES_PAGE_IMAGES, KNOWLEDGE_GAME_IMAGES } from "@/lib/game-images";
import type { SessionLike } from "@/lib/organizations";
import { cn } from "@/lib/utils";

export async function KnowledgeGamesSection({
  session,
}: {
  session: SessionLike | null;
}) {
  const attempts = session
    ? await Promise.all(
        KNOWLEDGE_GAMES.map(async (game) => ({
          game,
          attempt: await getKnowledgeGameAttempt(session.id, game.slug),
        }))
      )
    : KNOWLEDGE_GAMES.map((game) => ({ game, attempt: null }));

  const completedToday = attempts.filter((a) => a.attempt).length;

  return (
    <section id="knowledge-games" className="scroll-mt-28">
      <GamesAnimatedSection>
        <GamesSectionBanner
          src={GAMES_PAGE_IMAGES.knowledgeSection}
          alt="General knowledge trivia games"
          gradient="bg-gradient-to-r from-violet-950/90 via-violet-900/50 to-transparent"
        >
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold text-white sm:text-2xl">
              <Globe className="h-6 w-6 text-violet-300" />
              General Knowledge Games
            </h2>
            <p className="mt-1 max-w-xl text-sm text-violet-100/90">
              Flashcards, matching, memory, word puzzles & crosswords — geography, science,
              history & culture. Up to 50 pts per game daily.
            </p>
            {session ? (
              <p className="mt-2 text-xs font-semibold text-violet-200">
                {completedToday}/{KNOWLEDGE_GAMES.length} completed today
              </p>
            ) : null}
          </div>
        </GamesSectionBanner>
      </GamesAnimatedSection>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {attempts.map(({ game, attempt }, index) => {
          const thumb =
            KNOWLEDGE_GAME_IMAGES[game.slug] ?? GAMES_PAGE_IMAGES.knowledgeSection;
          return (
            <GamesAnimatedSection key={game.slug} delay={100 + index * 70}>
              <Link href={`/games/knowledge/${game.slug}`} className="group block h-full">
                <Card
                  className={cn(
                    "h-full overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-card-hover",
                    `bg-gradient-to-br ${game.accent}`
                  )}
                >
                  <GameCardImage
                    src={thumb}
                    alt={game.title}
                    gradient="from-black/65 via-black/20 to-transparent"
                    height="h-28 sm:h-32"
                    badge={
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/25 bg-black/30 text-xl shadow-lg backdrop-blur-sm transition-transform duration-500 group-hover:scale-110">
                        {game.icon}
                      </span>
                    }
                  />
                  <CardContent className="flex h-full flex-col p-5">
                    <h3 className="font-bold text-ink">{game.title}</h3>
                    <p className="mt-2 flex-1 text-sm text-muted">{game.description}</p>
                    <ul className="mt-3 space-y-1">
                      {game.features.map((feature) => (
                        <li
                          key={feature}
                          className="text-xs text-brand-700 dark:text-brand-300"
                        >
                          · {feature}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 text-xs font-semibold text-muted">
                      {attempt
                        ? `Done today · ${attempt.score}% · +${attempt.pointsEarned} pts`
                        : "One play per day · up to 50 pts"}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </GamesAnimatedSection>
          );
        })}
      </div>
    </section>
  );
}
