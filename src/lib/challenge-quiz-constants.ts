export const QUIZ_QUESTION_SECONDS_MIN = 10;
export const QUIZ_QUESTION_SECONDS_MAX = 20;
export const QUIZ_TIME_GRACE_MS = 1500;
export const MAX_TAB_VIOLATIONS = 3;

export function randomQuestionSeconds() {
  return (
    QUIZ_QUESTION_SECONDS_MIN +
    Math.floor(
      Math.random() * (QUIZ_QUESTION_SECONDS_MAX - QUIZ_QUESTION_SECONDS_MIN + 1)
    )
  );
}
