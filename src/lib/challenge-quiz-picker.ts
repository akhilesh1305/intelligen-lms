import {
  getDailyQuizStatus,
  WEEKDAY_SLOTS,
} from "@/lib/weekday-quizzes";
import type { QuizPickerEntry } from "@/components/challenges/quiz-picker-panel";

type ChallengeQuiz = {
  id: string;
  period: string;
  quizIndex: number | null;
  topic: string;
};

export function buildQuizPickerEntries({
  quizzes,
  tab,
  selectedQuizId,
  attemptIds,
  hrefBase,
}: {
  quizzes: ChallengeQuiz[];
  tab: "daily" | "weekly";
  selectedQuizId?: string;
  attemptIds: Set<string>;
  hrefBase: string;
}): QuizPickerEntry[] {
  return quizzes.map((quiz, index) => {
    const weeklyNumber = index + 1;
    const weekday =
      quiz.period === "DAILY"
        ? WEEKDAY_SLOTS.find((s) => s.index === quiz.quizIndex)
        : null;
    const dayStatus =
      quiz.quizIndex != null ? getDailyQuizStatus(quiz.quizIndex) : undefined;

    const label =
      tab === "daily" ? (weekday?.short ?? "?") : String(weeklyNumber);

    const query = new URLSearchParams({ tab, quiz: quiz.id });
    const href = `${hrefBase}?${query.toString()}`;

    return {
      id: quiz.id,
      href,
      label,
      selected: quiz.id === selectedQuizId,
      completed: attemptIds.has(quiz.id),
      locked: quiz.period === "DAILY" ? dayStatus === "locked" : false,
      missed: quiz.period === "DAILY" ? dayStatus === "missed" : false,
      isToday: dayStatus === "today",
      title:
        tab === "daily"
          ? weekday?.label
          : `Quiz ${weeklyNumber}: ${quiz.topic}`,
    };
  });
}
