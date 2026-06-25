"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, Clock, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MAX_TAB_VIOLATIONS,
  QUIZ_QUESTION_SECONDS_MAX,
  QUIZ_QUESTION_SECONDS_MIN,
} from "@/lib/challenge-quiz-constants";
import {
  QuizPickerPanel,
  type QuizPickerEntry,
} from "@/components/challenges/quiz-picker-panel";

type QuestionPayload = {
  id: string;
  question: string;
  options: string[];
};

type PlayState =
  | { phase: "intro" }
  | {
      phase: "playing";
      sessionId: string;
      totalQuestions: number;
      questionIndex: number;
      secondsAllowed: number;
      secondsLeft: number;
      question: QuestionPayload;
      tabViolations: number;
      submitting: boolean;
    }
  | {
      phase: "finished";
      score: number;
      pointsEarned: number;
      forfeited?: boolean;
    };

export function ChallengeQuizPlay({
  challengeId,
  title,
  topic,
  questionCount,
  returnHref,
  tab = "weekly",
  pickerEntries = [],
  pickerHeading = "Quizzes",
  completed = false,
  completedScore,
  completedPoints,
  playable = true,
  weeklySingleAttempt = false,
}: {
  challengeId: string;
  title: string;
  topic: string;
  questionCount: number;
  returnHref: string;
  tab?: "daily" | "weekly";
  pickerEntries?: QuizPickerEntry[];
  pickerHeading?: string;
  completed?: boolean;
  completedScore?: number;
  completedPoints?: number;
  playable?: boolean;
  weeklySingleAttempt?: boolean;
}) {
  const router = useRouter();
  const [state, setState] = useState<PlayState>({ phase: "intro" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const advancingRef = useRef(false);
  const sessionIdRef = useRef<string | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleFinish = useCallback(
    (score: number, pointsEarned: number, forfeited?: boolean) => {
      clearTimer();
      setState({ phase: "finished", score, pointsEarned, forfeited });
      router.refresh();
    },
    [clearTimer, router]
  );

  const advance = useCallback(
    async (sessionId: string, answerIndex: number, timedOut = false) => {
      if (advancingRef.current) return;
      advancingRef.current = true;
      clearTimer();

      setState((prev) =>
        prev.phase === "playing" ? { ...prev, submitting: true } : prev
      );

      try {
        const res = await fetch(`/api/challenges/${challengeId}/answer`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, answerIndex, timedOut }),
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error ?? "Failed to submit answer");
        }

        if (data.completed) {
          handleFinish(data.score, data.pointsEarned);
          return;
        }

        setState({
          phase: "playing",
          sessionId,
          totalQuestions: data.totalQuestions ?? questionCount,
          questionIndex: data.questionIndex,
          secondsAllowed: data.secondsAllowed,
          secondsLeft: data.secondsAllowed,
          question: data.question,
          tabViolations: data.tabViolations ?? 0,
          submitting: false,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
        setState((prev) =>
          prev.phase === "playing" ? { ...prev, submitting: false } : prev
        );
      } finally {
        advancingRef.current = false;
      }
    },
    [challengeId, clearTimer, handleFinish, questionCount]
  );

  const startTimer = useCallback(
    (sessionId: string) => {
      clearTimer();
      timerRef.current = setInterval(() => {
        setState((prev) => {
          if (prev.phase !== "playing" || prev.submitting) return prev;
          const next = prev.secondsLeft - 1;
          if (next <= 0) {
            void advance(sessionId, -1, true);
            return { ...prev, secondsLeft: 0 };
          }
          return { ...prev, secondsLeft: next };
        });
      }, 1000);
    },
    [advance, clearTimer]
  );

  const playingSessionId = state.phase === "playing" ? state.sessionId : undefined;
  const playingQuestionIndex =
    state.phase === "playing" ? state.questionIndex : undefined;
  const playingSubmitting = state.phase === "playing" ? state.submitting : undefined;

  useEffect(() => {
    if (!playingSessionId || playingSubmitting) return;
    startTimer(playingSessionId);
    return clearTimer;
  }, [
    playingSessionId,
    playingQuestionIndex,
    playingSubmitting,
    startTimer,
    clearTimer,
  ]);

  useEffect(() => {
    sessionIdRef.current = state.phase === "playing" ? state.sessionId : null;
  }, [state]);

  useEffect(() => {
    if (state.phase !== "playing") return;

    function onVisibilityChange() {
      if (document.visibilityState !== "hidden" || !sessionIdRef.current) return;

      void (async () => {
        try {
          const res = await fetch(`/api/challenges/${challengeId}/violation`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId: sessionIdRef.current }),
          });
          const data = await res.json();

          if (res.ok && data.forfeited) {
            handleFinish(data.score, data.pointsEarned, true);
            return;
          }

          if (res.ok) {
            setState((prev) =>
              prev.phase === "playing"
                ? { ...prev, tabViolations: data.tabViolations }
                : prev
            );
          }
        } catch {
          // ignore network errors during violation reporting
        }
      })();
    }

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [challengeId, handleFinish, state.phase]);

  useEffect(() => {
    if (state.phase !== "playing") return;

    function onBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [state.phase]);

  async function handleStart() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/challenges/${challengeId}/start`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Unable to start quiz");
      }

      setState({
        phase: "playing",
        sessionId: data.sessionId,
        totalQuestions: data.totalQuestions,
        questionIndex: data.questionIndex,
        secondsAllowed: data.secondsAllowed,
        secondsLeft: data.secondsRemaining ?? data.secondsAllowed,
        question: data.question,
        tabViolations: data.tabViolations ?? 0,
        submitting: false,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to start quiz");
    } finally {
      setLoading(false);
    }
  }

  const showPicker = pickerEntries.length > 0;

  if (state.phase === "finished") {
    const sign = state.pointsEarned >= 0 ? "+" : "";
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-border bg-panel p-6 shadow-card sm:p-8">
        <div className="text-center">
          <p className="text-lg font-bold text-ink">
            {state.forfeited ? "Quiz ended — focus required" : "Quiz complete!"}
          </p>
          <p className="mt-2 text-muted">
            Score: {state.score}% · {sign}
            {state.pointsEarned} pts this week
          </p>
        </div>

        {showPicker ? (
          <div className="mt-6 rounded-lg border border-border bg-surface/50 p-4">
            <QuizPickerPanel
              heading={pickerHeading}
              tab={tab}
              entries={pickerEntries}
            />
            <p className="mt-4 text-center text-sm text-muted">
              Pick another day above, or go back to quiz games.
            </p>
          </div>
        ) : weeklySingleAttempt ? (
          <p className="mt-4 text-center text-sm text-muted">
            Your weekly attempt is complete. Come back next week.
          </p>
        ) : null}

        <div className="mt-6 text-center">
          <Link href={returnHref}>
            <Button>Back to quiz games</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (state.phase === "intro") {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-border bg-panel p-6 shadow-card sm:p-8">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-6 w-6 shrink-0 text-brand-600" />
          <div>
            <h1 className="text-2xl font-bold text-ink">{title}</h1>
            <p className="mt-1 text-sm text-muted">{topic}</p>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-border bg-surface/50 p-4 sm:p-5">
          {showPicker ? (
            <QuizPickerPanel
              heading={pickerHeading}
              tab={tab}
              entries={pickerEntries}
            />
          ) : null}

          <div
            className={cn(
              "space-y-3 text-sm text-muted",
              showPicker ? "mt-5 border-t border-border pt-5" : ""
            )}
          >
            <p className="flex items-center gap-2 font-medium text-ink">
              <Clock className="h-4 w-4 text-brand-600" />
              {questionCount} question{questionCount !== 1 ? "s" : ""} ·{" "}
              {QUIZ_QUESTION_SECONDS_MIN}–{QUIZ_QUESTION_SECONDS_MAX} sec each
            </p>
            <p className="flex items-start gap-2">
              <Shield className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
              One question at a time. Timer starts immediately. Leaving the tab{" "}
              {MAX_TAB_VIOLATIONS} times ends the quiz. Copy/paste is disabled.
            </p>
            <p>+5 pts correct · −1 pt wrong · One attempt only</p>
          </div>

          {completed && completedPoints !== undefined ? (
            <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm dark:border-emerald-900 dark:bg-emerald-950/30">
              <p className="font-semibold text-emerald-800 dark:text-emerald-300">
                Already completed
              </p>
              <p className="mt-1 text-emerald-700 dark:text-emerald-400">
                {completedScore !== undefined ? `${completedScore}% correct · ` : ""}
                {completedPoints >= 0 ? "+" : ""}
                {completedPoints} pts this week
              </p>
              <p className="mt-2 text-muted">
                {weeklySingleAttempt
                  ? "Your weekly attempt is complete. Come back next week."
                  : "Choose another day above."}
              </p>
            </div>
          ) : !playable ? (
            <p className="mt-5 rounded-lg border border-border bg-surface px-4 py-3 text-center text-sm text-muted">
              This quiz is not available right now.
              {tab === "daily" ? " Pick another day above." : ""}
            </p>
          ) : (
            <>
              {error ? (
                <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                  {error}
                </p>
              ) : null}
              <Button
                className="mt-5 w-full sm:w-auto"
                onClick={handleStart}
                disabled={loading}
              >
                {loading ? "Starting..." : "Start quiz"}
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  const progress = ((state.questionIndex + 1) / state.totalQuestions) * 100;
  const timerRatio = state.secondsLeft / state.secondsAllowed;

  return (
    <div
      className="mx-auto max-w-2xl select-none"
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
      onPaste={(e) => e.preventDefault()}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Question {state.questionIndex + 1} of {state.totalQuestions}
          </p>
          <h2 className="text-lg font-bold text-ink">{title}</h2>
        </div>
        <div
          className={cn(
            "flex items-center gap-2 rounded-full px-4 py-2 font-mono text-lg font-bold tabular-nums",
            timerRatio <= 0.25
              ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
              : "bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300"
          )}
        >
          <Clock className="h-4 w-4" />
          {state.secondsLeft}s
        </div>
      </div>

      <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className="h-full rounded-full bg-brand-600 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      {state.tabViolations > 0 ? (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          Tab switch detected ({state.tabViolations}/{MAX_TAB_VIOLATIONS}). Stay on this
          page.
        </div>
      ) : null}

      <div className="rounded-xl border border-border bg-panel p-6 shadow-card">
        <p className="text-base font-medium leading-relaxed text-ink">
          {state.question.question}
        </p>

        <div className="mt-5 space-y-2">
          {state.question.options.map((option, index) => (
            <button
              key={index}
              type="button"
              disabled={state.submitting}
              onClick={() => void advance(state.sessionId, index)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm text-ink transition-colors",
                "border-border bg-surface hover:border-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/30",
                state.submitting && "pointer-events-none opacity-60"
              )}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                {String.fromCharCode(65 + index)}
              </span>
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
