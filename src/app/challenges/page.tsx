import Link from "next/link";
import { Calendar, CalendarDays, Trophy } from "lucide-react";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  getActiveChallenges,
  getDailyQuizStatus,
  getTodayWeekdaySlot,
  WEEKDAY_SLOTS,
  DAILY_QUESTIONS_MIN,
  DAILY_QUESTIONS_MAX,
  WEEKLY_QUIZ_MIN,
  WEEKLY_QUIZ_MAX,
} from "@/lib/challenges";
import {
  ACHIEVEMENT_LEVELS,
  computeAchievementLevel,
  getLevelProgress,
  UNRANKED_INFO,
} from "@/lib/achievement-levels";
import {
  getUserWeeklyEntry,
  getWeeklyLeaderboard,
  getWeekLabel,
  QUIZ_POINTS_CORRECT,
  QUIZ_POINTS_INCORRECT,
} from "@/lib/weekly-leaderboard";
import { SectionHeader } from "@/components/ui/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChallengeLeaderboard } from "@/components/challenges/challenge-leaderboard";
import { AchievementLevelBadge } from "@/components/challenges/achievement-level-badge";
import { QuizPickerPanel } from "@/components/challenges/quiz-picker-panel";
import { buildQuizPickerEntries } from "@/lib/challenge-quiz-picker";
import { formatDailyQuizWindow, isDailyQuizPlayable } from "@/lib/weekday-quizzes";
import {
  QUIZ_QUESTION_SECONDS_MAX,
  QUIZ_QUESTION_SECONDS_MIN,
} from "@/lib/challenge-quiz-constants";

export default async function ChallengesPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; quiz?: string }>;
}) {
  const session = await getSession();
  const params = await searchParams;
  const tab = params.tab === "weekly" ? "weekly" : "daily";
  const selectedQuizId = params.quiz;

  const { daily, weekly } = await getActiveChallenges();
  const weeklyQuiz = weekly[0] ?? null;
  const quizzes = tab === "weekly" ? (weeklyQuiz ? [weeklyQuiz] : []) : daily;
  const allQuizIds = [...daily, ...weekly].map((q) => q.id);

  const todaySlot = getTodayWeekdaySlot();
  const defaultDailyQuiz =
    daily.find((q) => q.quizIndex === todaySlot.index) ?? daily[0] ?? null;
  const selectedQuiz =
    tab === "weekly"
      ? weeklyQuiz
      : quizzes.find((q) => q.id === selectedQuizId) ?? defaultDailyQuiz ?? null;

  const [weeklyLeaders, weeklyEntry, attempts] = await Promise.all([
    getWeeklyLeaderboard(10),
    session ? getUserWeeklyEntry(session.id) : null,
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
  const weeklyCompleted = weeklyQuiz && attemptMap.has(weeklyQuiz.id) ? 1 : 0;

  const weeklyLevel = weeklyEntry
    ? computeAchievementLevel(
        weeklyEntry.points,
        weeklyEntry.quizzesCompleted
      )
    : null;
  const progress = weeklyEntry
    ? getLevelProgress(
        weeklyEntry.points,
        weeklyEntry.quizzesCompleted,
        weeklyLevel
      )
    : null;

  const selectedAttempt = selectedQuiz
    ? attemptMap.get(selectedQuiz.id)
    : undefined;

  const selectedWeekdayIndex =
    selectedQuiz?.period === "DAILY" ? selectedQuiz.quizIndex ?? 1 : null;
  const selectedDayStatus =
    selectedWeekdayIndex !== null
      ? getDailyQuizStatus(selectedWeekdayIndex)
      : null;
  const selectedDailyPlayable =
    selectedWeekdayIndex !== null &&
    selectedQuiz != null &&
    isDailyQuizPlayable(
      selectedWeekdayIndex,
      selectedQuiz.startsAt,
      selectedQuiz.endsAt
    );
  const canStartQuiz =
    selectedQuiz &&
    !selectedAttempt &&
    (selectedQuiz.period === "WEEKLY" || selectedDailyPlayable);

  const pickerEntries =
    tab === "daily"
      ? buildQuizPickerEntries({
          quizzes: daily,
          tab: "daily",
          selectedQuizId: selectedQuiz?.id,
          attemptIds: new Set(attempts.map((a) => a.challengeId)),
          hrefBase: "/challenges",
        })
      : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        title="Quiz games"
        description="Play daily (Mon–Sun) and weekly quizzes — scores count on the quiz leaderboard only. +5 pts correct, −1 pt wrong."
        action={
          <Link href="/leaderboard">
            <Button variant="soft" size="sm">
              <Trophy className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              Quiz leaderboard
            </Button>
          </Link>
        }
      />

      {weeklyEntry ? (
        <Card className="mt-8">
          <CardContent className="flex flex-wrap items-center gap-4 pt-6">
            <AchievementLevelBadge level={weeklyLevel} size="lg" />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-muted">
                {weeklyEntry.points} pts this week · {weeklyEntry.quizzesCompleted}{" "}
                quizzes · Daily {dailyCompleted}/{daily.length} · Weekly{" "}
                {weeklyCompleted}/1 weekly · Resets {getWeekLabel()}
              </p>
              {progress?.next ? (
                <p className="mt-1 text-sm text-ink">
                  Next: {progress.next.icon} {progress.next.label} —{" "}
                  {progress.next.minPoints} pts or {progress.next.minWins} quizzes
                </p>
              ) : (
                <p className="mt-1 text-sm font-semibold text-violet-700 dark:text-violet-300">
                  Max level this week!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/challenges?tab=daily"
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
            tab === "daily"
              ? "bg-brand-600 text-white"
              : "bg-slate-100 text-ink dark:bg-slate-800"
          }`}
        >
          <Calendar className="h-4 w-4" />
          Daily · M–S ({daily.length} days)
        </Link>
        <Link
          href="/challenges?tab=weekly"
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
            tab === "weekly"
              ? "bg-brand-600 text-white"
              : "bg-slate-100 text-ink dark:bg-slate-800"
          }`}
        >
          <CalendarDays className="h-4 w-4" />
          Weekly · 1× per week
        </Link>
      </div>

      <p className="mt-4 text-sm text-muted">
        {tab === "daily" ? (
          <>
            <strong className="text-ink">MTWTFSS</strong> — one quiz per weekday (
            {DAILY_QUESTIONS_MIN}–{DAILY_QUESTIONS_MAX} questions each), available
            for <strong className="text-ink">24 hours on that day only</strong> (UTC).
            Today: <strong className="text-ink">{todaySlot.label}</strong>.
          </>
        ) : (
          <>
            One timed quiz per week with {WEEKLY_QUIZ_MIN}–{WEEKLY_QUIZ_MAX}{" "}
            questions — <strong className="text-ink">single attempt only</strong>.
          </>
        )}{" "}
        · +{QUIZ_POINTS_CORRECT} / {QUIZ_POINTS_INCORRECT} per answer
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="min-w-0">
                  {!session ? (
                    <div className="py-12 text-center">
                      <p className="text-muted">Sign in to play quiz games.</p>
                      <Link href="/login" className="mt-4 inline-block">
                        <Button>Sign in</Button>
                      </Link>
                    </div>
                  ) : selectedQuiz ? (
                    <>
                      <div className="mb-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                          {tab === "daily" ? "Daily quiz" : "Weekly quiz"}
                        </p>
                        <h3 className="mt-1 text-lg font-bold text-ink">
                          {selectedQuiz.title}
                        </h3>
                        <p className="mt-1 text-sm text-muted">{selectedQuiz.topic}</p>
                        <p className="mt-1 text-xs text-brand-600">
                          {selectedQuiz.questions.length} question
                          {selectedQuiz.questions.length !== 1 ? "s" : ""} · +5 / −1 ·{" "}
                          {QUIZ_QUESTION_SECONDS_MIN}–{QUIZ_QUESTION_SECONDS_MAX}s each
                        </p>
                        {tab === "daily" ? (
                          <p className="mt-1 text-xs text-muted">
                            Window:{" "}
                            {formatDailyQuizWindow(
                              selectedQuiz.startsAt,
                              selectedQuiz.endsAt
                            )}
                          </p>
                        ) : (
                          <p className="mt-1 text-xs text-muted">
                            Available all week · one attempt only · resets{" "}
                            {getWeekLabel()}
                          </p>
                        )}
                      </div>
                      <div className="rounded-lg border border-border bg-surface/50 p-4 sm:p-5">
                        {tab === "daily" ? (
                          <QuizPickerPanel
                            heading="Weekdays"
                            tab="daily"
                            entries={pickerEntries}
                          />
                        ) : null}

                        {selectedAttempt ? (
                          <div
                            className={
                              tab === "daily" ? "mt-5 border-t border-border pt-5" : ""
                            }
                          >
                            <p className="font-semibold text-emerald-800 dark:text-emerald-300">
                              {tab === "weekly"
                                ? "Weekly quiz completed"
                                : "Quiz completed"}
                            </p>
                            <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">
                              {selectedAttempt.score}% correct ·{" "}
                              {selectedAttempt.pointsEarned >= 0 ? "+" : ""}
                              {selectedAttempt.pointsEarned} pts this week
                            </p>
                            {tab === "daily" ? (
                              <p className="mt-2 text-sm text-muted">
                                Pick another day above to continue.
                              </p>
                            ) : (
                              <p className="mt-2 text-sm text-muted">
                                You&apos;ve used your weekly attempt. Come back next week.
                              </p>
                            )}
                          </div>
                        ) : canStartQuiz ? (
                          <div
                            className={
                              tab === "daily"
                                ? "mt-5 border-t border-border pt-5 text-center"
                                : "text-center"
                            }
                          >
                            <p className="text-sm text-muted">
                              {tab === "weekly"
                                ? "Timed quiz — all questions in one sitting. One attempt per week."
                                : "Timed quiz — one question at a time. Switch days above before you start."}
                            </p>
                            <Link
                              href={`/challenges/play?tab=${tab}&quiz=${selectedQuiz.id}`}
                              className="mt-4 inline-block"
                            >
                              <Button size="lg">Start quiz</Button>
                            </Link>
                          </div>
                        ) : selectedDayStatus === "missed" ? (
                          <p className="mt-5 border-t border-border pt-5 text-center text-sm text-muted">
                            This day&apos;s 24-hour window has passed. You can only play{" "}
                            <strong className="text-ink">today&apos;s quiz</strong> (
                            {todaySlot.label}, UTC). Switch to weekly quizzes anytime.
                          </p>
                        ) : (
                          <p className="mt-5 border-t border-border pt-5 text-center text-sm text-muted">
                            <strong className="text-ink">{selectedQuiz.title}</strong>{" "}
                            unlocks on its weekday (UTC). Each daily quiz is available for
                            24 hours only.
                          </p>
                        )}
                      </div>
                    </>
                  ) : tab === "daily" ? (
                    <div className="rounded-lg border border-border bg-surface/50 p-4 sm:p-5">
                      <QuizPickerPanel
                        heading="Weekdays"
                        tab="daily"
                        entries={pickerEntries}
                      />
                    </div>
                  ) : (
                    <p className="py-12 text-center text-sm text-muted">
                      Weekly quiz is not available yet.
                    </p>
                  )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <ChallengeLeaderboard
            title="Quiz leaderboard — this week"
            viewAllHref="/leaderboard"
            leaders={weeklyLeaders.map((l) => ({
              rank: l.rank,
              userId: l.userId,
              name: l.name,
              score: l.points,
              pointsEarned: l.points,
              achievementLevel: l.achievementLevel,
            }))}
            currentUserId={session?.id}
            scoreLabel="pts"
          />
        </div>
      </div>

      <Card className="mt-12">
        <CardContent className="pt-6">
          <h3 className="font-bold text-ink">Weekly achievement levels</h3>
          <p className="mt-1 text-sm text-muted">
            Daily and weekly quizzes both count. Levels reset every Monday UTC.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-lg border border-border bg-slate-100 p-4 dark:bg-slate-800">
              <p className="text-2xl text-muted">{UNRANKED_INFO.icon}</p>
              <p className="mt-2 font-bold text-muted">{UNRANKED_INFO.label}</p>
              <p className="mt-1 text-xs text-muted">Below 25 pts this week</p>
            </div>
            {ACHIEVEMENT_LEVELS.map((level) => (
              <div
                key={level.level}
                className={`rounded-lg border border-border p-4 ${level.bg}`}
              >
                <p className={`text-2xl ${level.color}`}>{level.icon}</p>
                <p className={`mt-2 font-bold ${level.color}`}>{level.label}</p>
                <p className="mt-1 text-xs text-muted">
                  {level.minPoints} pts or {level.minWins} quizzes this week
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
