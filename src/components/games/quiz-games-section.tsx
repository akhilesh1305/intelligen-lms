import Link from "next/link";
import { ArrowRight, Brain, Calendar, Zap } from "lucide-react";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { getActiveChallenges } from "@/lib/challenges";
import { getWeeklyLeaderboard, getWeekLabel } from "@/lib/weekly-leaderboard";
import { Card, CardContent } from "@/components/ui/card";
import { ChallengeLeaderboard } from "@/components/challenges/challenge-leaderboard";
import { GameCardImage } from "@/components/games/game-card-image";
import { GamesAnimatedSection } from "@/components/games/games-animated-section";
import { GamesSectionBanner } from "@/components/games/games-section-banner";
import { GAMES_PAGE_IMAGES, HOME_MIND_GAME_IMAGES } from "@/lib/game-images";
import { shouldUseDemoData, getDemoWeeklyLeaderboard } from "@/lib/demo";
import { STICKY_ANCHOR_MT } from "@/components/home/home-polish";
import { cn } from "@/lib/utils";

export async function QuizGamesSection() {
  const session = await getSession();
  const { daily, weekly } = await getActiveChallenges();
  const weeklyQuiz = weekly[0] ?? null;
  const allQuizIds = [...daily, ...weekly].map((q) => q.id);

  const [weeklyLeaders, attempts] = await Promise.all([
    shouldUseDemoData(session?.email)
      ? Promise.resolve(
          getDemoWeeklyLeaderboard(
            8,
            session ? { id: session.id, name: session.name } : undefined
          )
        )
      : getWeeklyLeaderboard(8),
    session
      ? db.challengeAttempt.findMany({
          where: {
            userId: session.id,
            challengeId: { in: allQuizIds },
          },
        })
      : [],
  ]);

  const attemptMap = new Map(attempts.map((a) => [a.challengeId, a]));
  const dailyCompleted = daily.filter((q) => attemptMap.has(q.id)).length;

  return (
    <section id="quiz-games" className={cn(STICKY_ANCHOR_MT)}>
      <GamesAnimatedSection>
        <GamesSectionBanner
          src={GAMES_PAGE_IMAGES.quizSection}
          alt="Quiz games and timed challenges"
          gradient="bg-gradient-to-r from-brand-950/90 via-brand-900/50 to-transparent"
        >
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold text-white sm:text-2xl">
              <Zap className="h-6 w-6 text-brand-300" />
              Quiz games
            </h2>
            <p className="mt-1 max-w-xl text-sm text-brand-100/90">
              Daily and weekly timed quizzes — climb the leaderboard and unlock ranks.
            </p>
          </div>
        </GamesSectionBanner>
      </GamesAnimatedSection>

      <div className="grid gap-5 sm:grid-cols-2">
        <GamesAnimatedSection delay={100} animation="slide-right">
          <Link href="/challenges" className="group block h-full">
            <Card className="h-full overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-brand-400/50 hover:shadow-card-hover">
              <GameCardImage
                src={HOME_MIND_GAME_IMAGES.quizGames}
                alt="Daily quiz challenges"
                gradient="from-brand-900/80 via-brand-900/20 to-transparent"
                badge={
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/25 bg-brand-500/30 shadow-lg backdrop-blur-sm transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                    <Calendar className="h-5 w-5 text-white" />
                  </span>
                }
              />
              <CardContent className="flex h-full flex-col p-5">
                <h3 className="font-bold text-ink">Daily quizzes</h3>
                <p className="mt-2 flex-1 text-sm text-muted">
                  {daily.length} quiz{daily.length === 1 ? "" : "zes"} available today. Timed
                  questions with streak bonuses.
                </p>
                {session ? (
                  <p className="mt-3 text-xs font-semibold text-brand-700 dark:text-brand-300">
                    {dailyCompleted}/{daily.length} completed today
                  </p>
                ) : (
                  <p className="mt-3 text-xs font-semibold text-muted">Sign in to track progress</p>
                )}
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 transition-all duration-300 group-hover:gap-2">
                  Play daily
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </CardContent>
            </Card>
          </Link>
        </GamesAnimatedSection>

        <GamesAnimatedSection delay={180} animation="slide-left">
          <Link href="/challenges?tab=weekly" className="group block h-full">
            <Card className="h-full overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-violet-400/50 hover:shadow-card-hover">
              <GameCardImage
                src={GAMES_PAGE_IMAGES.quizSection}
                alt="Weekly quiz challenge"
                gradient="from-violet-900/80 via-violet-900/20 to-transparent"
                badge={
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/25 bg-violet-500/30 shadow-lg backdrop-blur-sm transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                    <Brain className="h-5 w-5 text-white" />
                  </span>
                }
              />
              <CardContent className="flex h-full flex-col p-5">
                <h3 className="font-bold text-ink">Weekly challenge</h3>
                <p className="mt-2 flex-1 text-sm text-muted">
                  {weeklyQuiz
                    ? `This week: ${weeklyQuiz.title}`
                    : "No weekly quiz live right now — check back soon."}
                </p>
                <p className="mt-3 text-xs font-semibold text-muted">{getWeekLabel()}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-violet-600 transition-all duration-300 group-hover:gap-2 dark:text-violet-400">
                  Play weekly
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </CardContent>
            </Card>
          </Link>
        </GamesAnimatedSection>
      </div>

      <GamesAnimatedSection delay={260}>
        <div className="mt-8">
          <ChallengeLeaderboard
            title="Quiz leaderboard — this week"
            leaders={weeklyLeaders.map((l) => ({
              rank: l.rank,
              userId: l.userId,
              name: l.name,
              score: l.points,
              pointsEarned: l.points,
            }))}
            currentUserId={session?.id}
            scoreLabel="pts"
          />
        </div>
      </GamesAnimatedSection>
    </section>
  );
}
