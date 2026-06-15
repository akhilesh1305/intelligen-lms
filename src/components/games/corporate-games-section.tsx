import Link from "next/link";
import { Gamepad2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChallengeLeaderboard } from "@/components/challenges/challenge-leaderboard";
import { CorporateAchievementLevels } from "@/components/corporate-games/corporate-achievement-levels";
import { CorporateBadgeRank } from "@/components/corporate-games/corporate-badge-rank";
import { GameCardImage } from "@/components/games/game-card-image";
import { GamesAnimatedSection } from "@/components/games/games-animated-section";
import { GamesSectionBanner } from "@/components/games/games-section-banner";
import { getUserCorporateBadgeRank } from "@/lib/corporate-game-badges";
import {
  CORPORATE_GAMES,
  getUserCorporateGameAttempts,
} from "@/lib/corporate-games";
import {
  getCorporateGamesDailyLeaderboard,
  getDayLabel,
} from "@/lib/corporate-games-leaderboard";
import {
  GAMES_PAGE_IMAGES,
  HOME_CORPORATE_GAME_IMAGES,
} from "@/lib/game-images";
import { cn } from "@/lib/utils";

type SessionLike = { id: string } | null;

export async function CorporateGamesSection({ session }: { session: SessionLike }) {
  const [attempts, leaders, badgeRank] = await Promise.all([
    session ? getUserCorporateGameAttempts(session.id) : [],
    getCorporateGamesDailyLeaderboard(10),
    session ? getUserCorporateBadgeRank(session.id) : null,
  ]);
  const attemptMap = new Map(attempts.map((a) => [a.gameType, a]));
  const completedCount = attempts.length;

  return (
    <section id="corporate-games" className="scroll-mt-28">
      <GamesAnimatedSection>
        <GamesSectionBanner
          src={GAMES_PAGE_IMAGES.corporateSection}
          alt="Corporate workplace simulations"
          gradient="bg-gradient-to-r from-cyan-950/90 via-cyan-900/50 to-transparent"
        >
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold text-white sm:text-2xl">
              <Gamepad2 className="h-6 w-6 text-cyan-300" />
              Corporate games
            </h2>
            <p className="mt-1 max-w-xl text-sm text-cyan-100/90">
              Scenario simulations — cybersecurity, compliance, sales, leadership & more.
              Fresh stories daily (UTC).
            </p>
          </div>
        </GamesSectionBanner>
      </GamesAnimatedSection>

      {session ? (
        <GamesAnimatedSection delay={80}>
          <Card className="overflow-hidden border-cyan-500/20 bg-gradient-to-r from-cyan-500/5 to-transparent">
            <CardContent className="flex flex-wrap items-start gap-6 pt-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15">
                <Gamepad2 className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-ink">
                  {completedCount}/{CORPORATE_GAMES.length} games completed today
                </p>
                <p className="text-sm text-muted">
                  {getDayLabel()} (UTC) · new scenarios tomorrow
                </p>
                {badgeRank ? (
                  <div className="mt-4">
                    <CorporateBadgeRank rank={badgeRank} size="sm" />
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </GamesAnimatedSection>
      ) : (
        <GamesAnimatedSection delay={80}>
          <Card className="overflow-hidden border-dashed border-cyan-500/30">
            <CardContent className="py-8 text-center">
              <Gamepad2 className="mx-auto h-10 w-10 text-cyan-600/60" />
              <p className="mt-3 text-muted">Sign in to play corporate games and earn points.</p>
              <Link href="/login?next=/games" className="mt-4 inline-block">
                <Button>Sign in</Button>
              </Link>
            </CardContent>
          </Card>
        </GamesAnimatedSection>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="grid gap-5 sm:grid-cols-2">
            {CORPORATE_GAMES.map((game, index) => {
              const attempt = attemptMap.get(game.type);
              const thumb =
                HOME_CORPORATE_GAME_IMAGES[game.slug] ??
                GAMES_PAGE_IMAGES.corporateSection;
              return (
                <GamesAnimatedSection key={game.slug} delay={120 + index * 60}>
                  <Link href={`/corporate-games/${game.slug}`} className="group block h-full">
                    <Card
                      className={cn(
                        "h-full overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-card-hover",
                        `bg-gradient-to-br ${game.accent}`
                      )}
                    >
                      <GameCardImage
                        src={thumb}
                        alt={game.title}
                        gradient="from-black/70 via-black/25 to-transparent"
                        badge={
                          <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/25 bg-black/30 text-xl shadow-lg backdrop-blur-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                            {game.icon}
                          </span>
                        }
                      />
                      <CardContent className="flex h-full flex-col p-5">
                        <h3 className="font-bold text-ink">{game.title}</h3>
                        <p className="mt-2 flex-1 text-sm text-muted">{game.description}</p>
                        <ul className="mt-3 space-y-1">
                          {game.activities.map((activity) => (
                            <li
                              key={activity}
                              className="text-xs text-brand-700 dark:text-brand-300"
                            >
                              · {activity}
                            </li>
                          ))}
                        </ul>
                        <p className="mt-4 text-xs font-semibold text-muted">
                          {attempt
                            ? `Completed today · ${attempt.score}% · +${attempt.pointsEarned} pts`
                            : "4 story scenarios · multiple questions each · fresh mix daily"}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </GamesAnimatedSection>
              );
            })}
          </div>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <GamesAnimatedSection delay={200} animation="slide-left">
            <ChallengeLeaderboard
              title="Corporate leaderboard — today"
              showLevels={false}
              leaders={leaders.map((l) => ({
                rank: l.rank,
                userId: l.userId,
                name: l.name,
                score: l.points,
                pointsEarned: l.points,
              }))}
              currentUserId={session?.id}
              scoreLabel="pts"
            />
          </GamesAnimatedSection>
          <GamesAnimatedSection delay={280} animation="slide-left">
            <CorporateAchievementLevels />
          </GamesAnimatedSection>
        </div>
      </div>
    </section>
  );
}
