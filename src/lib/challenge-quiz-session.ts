import { submitChallengeAttempt } from "@/lib/challenges";
import { isDailyQuizPlayable, getDailyQuizStatus, WEEKDAY_SLOTS } from "@/lib/weekday-quizzes";
import {
  MAX_TAB_VIOLATIONS,
  QUIZ_QUESTION_SECONDS_MIN,
  QUIZ_TIME_GRACE_MS,
  randomQuestionSeconds,
} from "@/lib/challenge-quiz-constants";
import { db } from "@/lib/db";

export {
  MAX_TAB_VIOLATIONS,
  QUIZ_QUESTION_SECONDS_MIN,
  QUIZ_QUESTION_SECONDS_MAX,
} from "@/lib/challenge-quiz-constants";

function parseJsonArray<T>(value: string, fallback: T[]): T[] {
  try {
    const parsed = JSON.parse(value) as T[];
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

async function assertChallengePlayable(challengeId: string, userId: string) {
  const challenge = await db.challenge.findUnique({
    where: { id: challengeId },
    include: { questions: { orderBy: { order: "asc" } } },
  });

  if (!challenge) {
    throw new Error("Quiz not found");
  }

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
          ? `${slot.label}'s quiz is not available yet.`
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
    throw new Error("You have already completed this quiz");
  }

  return challenge;
}

function buildQuestionPayload(question: {
  id: string;
  question: string;
  options: string;
}) {
  return {
    id: question.id,
    question: question.question,
    options: JSON.parse(question.options) as string[],
  };
}

export async function startChallengeQuizSession(challengeId: string, userId: string) {
  const challenge = await assertChallengePlayable(challengeId, userId);

  const active = await db.challengeQuizSession.findFirst({
    where: { challengeId, userId, status: "ACTIVE" },
    orderBy: { startedAt: "desc" },
  });

  if (active) {
    if (active.expiresAt.getTime() < Date.now()) {
      await db.challengeQuizSession.update({
        where: { id: active.id },
        data: { status: "EXPIRED" },
      });
    } else {
      return resumeChallengeQuizSession(active.id, userId);
    }
  }

  const questionIds = challenge.questions.map((q) => q.id);
  for (let i = questionIds.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questionIds[i], questionIds[j]] = [questionIds[j], questionIds[i]];
  }

  const secondsPerQuestion = questionIds.map(() => randomQuestionSeconds());
  const totalSeconds = secondsPerQuestion.reduce((sum, value) => sum + value, 0);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + totalSeconds * 1000 + 30_000);

  const session = await db.challengeQuizSession.create({
    data: {
      challengeId,
      userId,
      startedAt: now,
      expiresAt,
      secondsPerQuestion: JSON.stringify(secondsPerQuestion),
      questionOrder: JSON.stringify(questionIds),
      answers: JSON.stringify([]),
      currentIndex: 0,
      questionStartedAt: now,
      status: "ACTIVE",
    },
  });

  const firstQuestion = challenge.questions.find((q) => q.id === questionIds[0]);
  if (!firstQuestion) {
    throw new Error("Quiz has no questions");
  }

  return {
    sessionId: session.id,
    totalQuestions: questionIds.length,
    questionIndex: 0,
    secondsAllowed: secondsPerQuestion[0],
    question: buildQuestionPayload(firstQuestion),
    tabViolations: 0,
  };
}

export async function resumeChallengeQuizSession(sessionId: string, userId: string) {
  const session = await getOwnedSession(sessionId, userId);
  const challenge = await db.challenge.findUnique({
    where: { id: session.challengeId },
    include: { questions: true },
  });

  if (!challenge) {
    throw new Error("Quiz not found");
  }

  const questionOrder = parseJsonArray<string>(session.questionOrder, []);
  const secondsPerQuestion = parseJsonArray<number>(session.secondsPerQuestion, []);
  const questionId = questionOrder[session.currentIndex];
  const question = challenge.questions.find((q) => q.id === questionId);

  if (!question) {
    throw new Error("Question not found");
  }

  const elapsed = Date.now() - session.questionStartedAt.getTime();
  const allowedMs = (secondsPerQuestion[session.currentIndex] ?? 0) * 1000;
  const secondsRemaining = Math.max(
    0,
    Math.ceil((allowedMs + QUIZ_TIME_GRACE_MS - elapsed) / 1000)
  );

  return {
    sessionId: session.id,
    totalQuestions: questionOrder.length,
    questionIndex: session.currentIndex,
    secondsAllowed: secondsPerQuestion[session.currentIndex] ?? QUIZ_QUESTION_SECONDS_MIN,
    secondsRemaining,
    question: buildQuestionPayload(question),
    tabViolations: session.tabViolations,
  };
}

async function getOwnedSession(sessionId: string, userId: string) {
  const session = await db.challengeQuizSession.findUnique({
    where: { id: sessionId },
  });

  if (!session || session.userId !== userId) {
    throw new Error("Quiz session not found");
  }

  if (session.status !== "ACTIVE") {
    throw new Error("This quiz session has ended");
  }

  if (session.expiresAt.getTime() < Date.now()) {
    await db.challengeQuizSession.update({
      where: { id: session.id },
      data: { status: "EXPIRED" },
    });
    throw new Error("Quiz time has expired");
  }

  return session;
}

function isAnswerLate(session: {
  questionStartedAt: Date;
  currentIndex: number;
  secondsPerQuestion: string;
}) {
  const secondsPerQuestion = parseJsonArray<number>(session.secondsPerQuestion, []);
  const allowedMs = (secondsPerQuestion[session.currentIndex] ?? 0) * 1000;
  const elapsed = Date.now() - session.questionStartedAt.getTime();
  return elapsed > allowedMs + QUIZ_TIME_GRACE_MS;
}

async function completeSession(
  sessionId: string,
  challengeId: string,
  userId: string,
  answers: number[]
) {
  await db.challengeQuizSession.update({
    where: { id: sessionId },
    data: {
      answers: JSON.stringify(answers),
      status: "COMPLETED",
    },
  });

  return submitChallengeAttempt(challengeId, userId, answers);
}

async function advanceSession(
  session: {
    id: string;
    challengeId: string;
    userId: string;
    currentIndex: number;
    questionOrder: string;
    secondsPerQuestion: string;
    answers: string;
  },
  answerIndex: number
) {
  const questionOrder = parseJsonArray<string>(session.questionOrder, []);
  const answers = parseJsonArray<number>(session.answers, []);
  answers[session.currentIndex] = answerIndex;

  const nextIndex = session.currentIndex + 1;

  if (nextIndex >= questionOrder.length) {
    const result = await completeSession(
      session.id,
      session.challengeId,
      session.userId,
      answers
    );

    return {
      completed: true as const,
      score: result?.score ?? 0,
      pointsEarned: result?.pointsEarned ?? 0,
      alreadyCompleted: result?.alreadyCompleted ?? false,
    };
  }

  const secondsPerQuestion = parseJsonArray<number>(session.secondsPerQuestion, []);
  const now = new Date();

  await db.challengeQuizSession.update({
    where: { id: session.id },
    data: {
      answers: JSON.stringify(answers),
      currentIndex: nextIndex,
      questionStartedAt: now,
    },
  });

  const challenge = await db.challenge.findUnique({
    where: { id: session.challengeId },
    include: { questions: true },
  });

  const nextQuestion = challenge?.questions.find(
    (q) => q.id === questionOrder[nextIndex]
  );

  if (!nextQuestion) {
    throw new Error("Next question not found");
  }

  return {
    completed: false as const,
    questionIndex: nextIndex,
    secondsAllowed: secondsPerQuestion[nextIndex] ?? QUIZ_QUESTION_SECONDS_MIN,
    question: buildQuestionPayload(nextQuestion),
  };
}

export async function submitChallengeQuizAnswer(
  sessionId: string,
  userId: string,
  answerIndex: number
) {
  const session = await getOwnedSession(sessionId, userId);
  const recordedAnswer = isAnswerLate(session) ? -1 : answerIndex;
  return advanceSession(session, recordedAnswer);
}

export async function timeoutChallengeQuizQuestion(sessionId: string, userId: string) {
  const session = await getOwnedSession(sessionId, userId);
  return advanceSession(session, -1);
}

export async function reportChallengeQuizViolation(sessionId: string, userId: string) {
  const session = await getOwnedSession(sessionId, userId);
  const tabViolations = session.tabViolations + 1;

  if (tabViolations >= MAX_TAB_VIOLATIONS) {
    const questionOrder = parseJsonArray<string>(session.questionOrder, []);
    const answers = parseJsonArray<number>(session.answers, []);

    for (let i = session.currentIndex; i < questionOrder.length; i++) {
      if (answers[i] === undefined) answers[i] = -1;
    }

    await db.challengeQuizSession.update({
      where: { id: session.id },
      data: { tabViolations, status: "FORFEITED" },
    });

    const result = await submitChallengeAttempt(
      session.challengeId,
      session.userId,
      answers
    );

    return {
      forfeited: true as const,
      tabViolations,
      score: result?.score ?? 0,
      pointsEarned: result?.pointsEarned ?? 0,
    };
  }

  await db.challengeQuizSession.update({
    where: { id: session.id },
    data: { tabViolations },
  });

  return {
    forfeited: false as const,
    tabViolations,
  };
}
