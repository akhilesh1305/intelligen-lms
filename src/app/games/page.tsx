import { getSession } from "@/lib/auth";
import { getUserCorporateGameAttempts, CORPORATE_GAMES } from "@/lib/corporate-games";
import { getActiveChallenges } from "@/lib/challenges";
import { db } from "@/lib/db";
import { KNOWLEDGE_GAMES, getKnowledgeGameAttempt } from "@/lib/knowledge-games";
import { CorporateGamesSection } from "@/components/games/corporate-games-section";
import { QuizGamesSection } from "@/components/games/quiz-games-section";
import { KnowledgeGamesSection } from "@/components/games/knowledge-games-section";
import { GamesHashScroll } from "@/components/games/games-hash-scroll";
import { GamesHero } from "@/components/games/games-hero";

async function getGamesHubStats(userId: string | undefined) {
  const totalGames =
    CORPORATE_GAMES.length + KNOWLEDGE_GAMES.length + 2; /* daily + weekly quiz entry points */

  if (!userId) {
    return { totalGames, completedToday: 0, isLoggedIn: false };
  }

  const { daily, weekly } = await getActiveChallenges();
  const allQuizIds = [...daily, ...weekly].map((q) => q.id);

  const [corporateAttempts, quizAttempts, knowledgeAttempts] = await Promise.all([
    getUserCorporateGameAttempts(userId),
    db.challengeAttempt.findMany({
      where: { userId, challengeId: { in: allQuizIds } },
      select: { challengeId: true },
    }),
    Promise.all(
      KNOWLEDGE_GAMES.map((g) => getKnowledgeGameAttempt(userId, g.slug))
    ),
  ]);

  const completedToday =
    corporateAttempts.length +
    quizAttempts.length +
    knowledgeAttempts.filter(Boolean).length;

  return { totalGames, completedToday, isLoggedIn: true };
}

export default async function GamesPage() {
  const session = await getSession();
  const stats = await getGamesHubStats(session?.id);

  return (
    <div className="min-h-screen bg-background">
      <GamesHero
        totalGames={stats.totalGames}
        completedToday={stats.completedToday}
        isLoggedIn={stats.isLoggedIn}
      />

      <div className="relative mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -left-32 top-40 h-64 w-64 animate-float rounded-full bg-brand-500/5 blur-3xl" />
        <div
          className="pointer-events-none absolute -right-24 top-[800px] h-72 w-72 animate-float rounded-full bg-violet-500/5 blur-3xl"
          style={{ animationDelay: "3s" }}
        />

        <GamesHashScroll />

        <div className="relative mt-12 space-y-20 sm:space-y-24">
          <CorporateGamesSection session={session} />
          <QuizGamesSection />
          <KnowledgeGamesSection session={session} />
        </div>
      </div>
    </div>
  );
}
