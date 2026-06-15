import type { ChallengePeriod } from "@prisma/client";
import {
  type ChallengeQuizCategory,
  distributeCategories,
  formatChallengeTopicLabel,
  pickChallengeTopic,
  summarizeChallengeTopics,
} from "@/lib/challenge-quiz-topics";
import { generateChallengeQuizQuestions } from "@/lib/quiz-generator";
import {
  computeAchievementLevel,
  getLevelInfo,
  isHigherLevel,
} from "@/lib/achievement-levels";
import { addPoints } from "@/lib/gamification";
import { createNotification } from "@/lib/notifications";
import { getChallengeWindow } from "@/lib/challenge-window";
import {
  addWeeklyLeaderboardPoints,
  QUIZ_POINTS_CORRECT,
  QUIZ_POINTS_INCORRECT,
} from "@/lib/weekly-leaderboard";
import {
  DAILY_WEEKDAY_COUNT,
  getDailyQuizStatus,
  getDailyWeekBatchPrefix,
  getWeekdayDayWindow,
  randomDailyQuestionCount,
  WEEKDAY_SLOTS,
  isDailyQuizPlayable,
} from "@/lib/weekday-quizzes";
import { db } from "./db";

export { getChallengeSlug, getChallengeWindow } from "@/lib/challenge-window";
export {
  WEEKDAY_SLOTS,
  getTodayWeekdaySlot,
  getDailyQuizStatus,
  DAILY_QUESTIONS_MIN,
  DAILY_QUESTIONS_MAX,
} from "@/lib/weekday-quizzes";

/** Questions in the single weekly quiz (one attempt per week). */
export const WEEKLY_QUIZ_MIN = 10;
export const WEEKLY_QUIZ_MAX = 20;

type GeneratedQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  topic: string;
};

const challengeInclude = {
  questions: { orderBy: { order: "asc" as const } },
  _count: { select: { attempts: true } },
};

function randomWeeklyQuestionCount() {
  return (
    WEEKLY_QUIZ_MIN +
    Math.floor(Math.random() * (WEEKLY_QUIZ_MAX - WEEKLY_QUIZ_MIN + 1))
  );
}

async function generateQuestionBatch(
  count: number
): Promise<GeneratedQuestion[]> {
  const categorySlots = distributeCategories(count);
  const questions: GeneratedQuestion[] = [];
  const neededByCategory = new Map<ChallengeQuizCategory, number>();

  for (const category of categorySlots) {
    neededByCategory.set(category, (neededByCategory.get(category) ?? 0) + 1);
  }

  for (const [category, needed] of neededByCategory) {
    let generatedForCategory = 0;

    while (generatedForCategory < needed) {
      const { topic, content } = pickChallengeTopic(category);
      const remaining = needed - generatedForCategory;
      const batchSize = Math.min(remaining, 5);
      const { questions: generated } = await generateChallengeQuizQuestions(
        category,
        topic,
        content,
        batchSize
      );

      for (const q of generated) {
        questions.push({
          ...q,
          topic: formatChallengeTopicLabel(category, topic),
        });
        generatedForCategory++;
        if (generatedForCategory >= needed) break;
      }
    }
  }

  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }

  return questions.slice(0, count);
}

async function createDailyWeekdayQuizzes() {
  const prefix = getDailyWeekBatchPrefix();
  const created = [];

  for (const slot of WEEKDAY_SLOTS) {
    const { startsAt, endsAt } = getWeekdayDayWindow(slot.index);
    const questionCount = randomDailyQuestionCount();
    const questions = await generateQuestionBatch(questionCount);
    const slug = `${prefix}${slot.slug}`;
    const topic = summarizeChallengeTopics(questions.map((q) => q.topic));

    const challenge = await db.challenge.create({
      data: {
        slug,
        period: "DAILY",
        quizIndex: slot.index,
        title: slot.label,
        topic,
        startsAt,
        endsAt,
        passingScore: 0,
        pointsReward: QUIZ_POINTS_CORRECT,
        source: "local",
        questions: {
          create: questions.map((q, i) => ({
            question: q.question,
            options: JSON.stringify(q.options),
            correctIndex: q.correctIndex,
            order: i + 1,
          })),
        },
      },
      include: challengeInclude,
    });

    created.push(challenge);
  }

  return created;
}

async function createWeeklyChallenge() {
  const { slug, startsAt, endsAt } = getChallengeWindow("WEEKLY");
  const questionCount = randomWeeklyQuestionCount();
  const questions = await generateQuestionBatch(questionCount);
  const topic = summarizeChallengeTopics(questions.map((q) => q.topic));

  const challenge = await db.challenge.create({
    data: {
      slug,
      period: "WEEKLY",
      quizIndex: 1,
      title: "Weekly Quiz",
      topic,
      startsAt,
      endsAt,
      passingScore: 0,
      pointsReward: QUIZ_POINTS_CORRECT,
      source: "local",
      questions: {
        create: questions.map((q, i) => ({
          question: q.question,
          options: JSON.stringify(q.options),
          correctIndex: q.correctIndex,
          order: i + 1,
        })),
      },
    },
    include: challengeInclude,
  });

  return challenge;
}

export async function getOrCreatePeriodQuizzes(period: ChallengePeriod) {
  if (period === "DAILY") {
    const prefix = getDailyWeekBatchPrefix();

    const existing = await db.challenge.findMany({
      where: { slug: { startsWith: prefix }, period: "DAILY" },
      include: challengeInclude,
      orderBy: { quizIndex: "asc" },
    });

    if (existing.length >= DAILY_WEEKDAY_COUNT) {
      return existing.slice(0, DAILY_WEEKDAY_COUNT);
    }

    return createDailyWeekdayQuizzes();
  }

  const { slug } = getChallengeWindow("WEEKLY");

  const existing = await db.challenge.findUnique({
    where: { slug },
    include: challengeInclude,
  });

  if (existing) {
    return [existing];
  }

  const challenge = await createWeeklyChallenge();
  return [challenge];
}

export async function getOrCreateWeeklyChallenge() {
  const [challenge] = await getOrCreatePeriodQuizzes("WEEKLY");
  return challenge;
}

/** @deprecated Use getOrCreatePeriodQuizzes */
export async function getOrCreateChallenge(period: ChallengePeriod) {
  const quizzes = await getOrCreatePeriodQuizzes(period);
  return quizzes[0];
}

export async function getActiveChallenges() {
  const [daily, weekly] = await Promise.all([
    getOrCreatePeriodQuizzes("DAILY"),
    getOrCreatePeriodQuizzes("WEEKLY"),
  ]);
  return { daily, weekly };
}

export async function getChallengeLeaderboard(
  challengeId: string,
  limit = 20
) {
  const attempts = await db.challengeAttempt.findMany({
    where: { challengeId },
    orderBy: [{ pointsEarned: "desc" }, { completedAt: "asc" }],
    take: limit,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          achievementLevel: true,
        },
      },
    },
  });

  return attempts.map((a, i) => ({
    rank: i + 1,
    userId: a.user.id,
    name: a.user.name,
    score: a.score,
    pointsEarned: a.pointsEarned,
    achievementLevel: a.user.achievementLevel,
    completedAt: a.completedAt,
  }));
}

export async function submitChallengeAttempt(
  challengeId: string,
  userId: string,
  answers: number[]
) {
  const challenge = await db.challenge.findUnique({
    where: { id: challengeId },
    include: { questions: { orderBy: { order: "asc" } } },
  });

  if (!challenge) return null;

  const now = new Date();

  if (challenge.period === "DAILY") {
    const weekdayIndex = challenge.quizIndex ?? 1;
    if (!isDailyQuizPlayable(weekdayIndex, challenge.startsAt, challenge.endsAt, now)) {
      const slot = WEEKDAY_SLOTS.find((s) => s.index === weekdayIndex);
      const status = getDailyQuizStatus(weekdayIndex, now);
      if (status === "missed") {
        throw new Error(
          slot
            ? `${slot.label}'s quiz has expired. Each daily quiz is only available for 24 hours on its day (UTC).`
            : "This daily quiz has expired."
        );
      }
      throw new Error(
        slot
          ? `${slot.label}'s quiz is not available yet. Check back on that day (UTC).`
          : "This daily quiz is not available yet."
      );
    }
  } else if (now < challenge.startsAt || now > challenge.endsAt) {
    throw new Error("Quiz is not active this week");
  }

  const existing = await db.challengeAttempt.findUnique({
    where: { challengeId_userId: { challengeId, userId } },
  });

  if (existing) {
    return {
      score: existing.score,
      passed: true,
      passingScore: 0,
      pointsEarned: existing.pointsEarned,
      alreadyCompleted: true,
    };
  }

  let correct = 0;
  let pointsEarned = 0;

  for (let i = 0; i < challenge.questions.length; i++) {
    const q = challenge.questions[i];
    if (answers[i] === q.correctIndex) {
      correct++;
      pointsEarned += QUIZ_POINTS_CORRECT;
    } else {
      pointsEarned += QUIZ_POINTS_INCORRECT;
    }
  }

  const score =
    challenge.questions.length > 0
      ? Math.round((correct / challenge.questions.length) * 100)
      : 0;

  await db.challengeAttempt.create({
    data: {
      challengeId,
      userId,
      score,
      passed: true,
      pointsEarned,
      answers: JSON.stringify(answers),
    },
  });

  const { getUserWeeklyEntry } = await import("@/lib/weekly-leaderboard");
  const weeklyBefore = await getUserWeeklyEntry(userId);

  await addWeeklyLeaderboardPoints(userId, pointsEarned);

  if (pointsEarned > 0) {
    await addPoints(userId, pointsEarned);
  }

  await db.user.update({
    where: { id: userId },
    data: {
      challengePoints: { increment: pointsEarned },
      challengesPassed: { increment: 1 },
    },
  });

  const sign = pointsEarned >= 0 ? "+" : "";
  await createNotification({
    userId,
    type: "CHALLENGE_PASSED",
    title: `Quiz complete! ${sign}${pointsEarned} pts`,
    message: challenge.title,
    link: "/challenges",
  });

  await updateUserAchievementLevel(userId, {
    points: weeklyBefore?.points ?? 0,
    quizzesCompleted: weeklyBefore?.quizzesCompleted ?? 0,
  });

  return {
    score,
    passed: true,
    passingScore: 0,
    pointsEarned,
    alreadyCompleted: false,
  };
}

export async function updateUserAchievementLevel(
  userId: string,
  previousWeekly?: { points: number; quizzesCompleted: number }
) {
  const { getUserWeeklyEntry } = await import("@/lib/weekly-leaderboard");
  const weekly = await getUserWeeklyEntry(userId);

  if (!weekly) return null;

  const oldLevel = computeAchievementLevel(
    previousWeekly?.points ?? weekly.points,
    previousWeekly?.quizzesCompleted ?? weekly.quizzesCompleted
  );
  const newLevel = computeAchievementLevel(
    weekly.points,
    weekly.quizzesCompleted
  );

  if (!newLevel || !isHigherLevel(newLevel, oldLevel)) {
    return newLevel;
  }

  await db.user.update({
    where: { id: userId },
    data: { achievementLevel: newLevel },
  });

  const info = getLevelInfo(newLevel);
  await createNotification({
    userId,
    type: "LEVEL_UP",
    title: `Level up: ${info.label}!`,
    message: `You've reached ${info.icon} ${info.label} this week`,
    link: "/leaderboard",
  });

  return newLevel;
}

export async function getOverallChallengeLeaders(limit = 20) {
  const { getWeeklyLeaderboard } = await import("@/lib/weekly-leaderboard");
  return getWeeklyLeaderboard(limit);
}
