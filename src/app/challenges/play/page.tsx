import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  getActiveChallenges,
  getTodayWeekdaySlot,
} from "@/lib/challenges";
import { isDailyQuizPlayable } from "@/lib/weekday-quizzes";
import { buildQuizPickerEntries } from "@/lib/challenge-quiz-picker";
import { ChallengeQuizPlay } from "@/components/challenges/challenge-quiz-play";

export default async function ChallengePlayHubPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; quiz?: string }>;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const params = await searchParams;
  const tab = params.tab === "weekly" ? "weekly" : "daily";
  const { daily, weekly } = await getActiveChallenges();
  const weeklyQuiz = weekly[0] ?? null;

  const todaySlot = getTodayWeekdaySlot();
  const defaultDailyQuiz =
    daily.find((q) => q.quizIndex === todaySlot.index) ?? daily[0] ?? null;

  const selectedQuiz =
    tab === "weekly"
      ? weeklyQuiz
      : daily.find((q) => q.id === params.quiz) ?? defaultDailyQuiz;

  if (!selectedQuiz) {
    notFound();
  }

  const allQuizIds = [...daily, ...weekly].map((q) => q.id);
  const attempts = await db.challengeAttempt.findMany({
    where: {
      userId: session.id,
      challengeId: { in: allQuizIds },
    },
  });
  const attemptMap = new Map(attempts.map((a) => [a.challengeId, a]));
  const attemptIds = new Set(attempts.map((a) => a.challengeId));

  const selectedAttempt = attemptMap.get(selectedQuiz.id);
  const returnHref =
    tab === "weekly"
      ? "/challenges?tab=weekly"
      : `/challenges?tab=daily&quiz=${selectedQuiz.id}`;

  const pickerEntries =
    tab === "daily"
      ? buildQuizPickerEntries({
          quizzes: daily,
          tab: "daily",
          selectedQuizId: selectedQuiz.id,
          attemptIds,
          hrefBase: "/challenges/play",
        })
      : [];

  const playable =
    selectedQuiz.period === "WEEKLY" ||
    isDailyQuizPlayable(
      selectedQuiz.quizIndex ?? 1,
      selectedQuiz.startsAt,
      selectedQuiz.endsAt
    );

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <Link
        href={returnHref}
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to quiz games
      </Link>

      <ChallengeQuizPlay
        challengeId={selectedQuiz.id}
        title={selectedQuiz.title}
        topic={selectedQuiz.topic}
        questionCount={selectedQuiz.questions.length}
        returnHref={returnHref}
        tab={tab}
        pickerEntries={pickerEntries}
        pickerHeading="Weekdays"
        completed={!!selectedAttempt}
        completedScore={selectedAttempt?.score}
        completedPoints={selectedAttempt?.pointsEarned}
        playable={playable}
        weeklySingleAttempt={tab === "weekly"}
      />
    </div>
  );
}
