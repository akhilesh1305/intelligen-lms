"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CorporateBadgeRank } from "@/components/corporate-games/corporate-badge-rank";
import { CorporateGameBadge } from "@/components/corporate-games/corporate-game-badge";
import { cn } from "@/lib/utils";
import {
  flattenScenarioQuestions,
  getScenarioQuestionCount,
  type GameScenario,
} from "@/lib/corporate-game-types";
import type { CorporateGameMeta } from "@/lib/corporate-games";
import type {
  CorporateBadgeEarned,
  CorporateBadgeRankInfo,
} from "@/lib/corporate-game-badges";

export function CorporateGamePlayer({
  game,
  scenarios,
  alreadyCompleted,
  previousScore,
  previousPoints,
}: {
  game: CorporateGameMeta;
  scenarios: GameScenario[];
  alreadyCompleted?: boolean;
  previousScore?: number;
  previousPoints?: number;
}) {
  const router = useRouter();
  const flat = useMemo(() => flattenScenarioQuestions(scenarios), [scenarios]);
  const totalQuestions = getScenarioQuestionCount(scenarios);

  const [flatIndex, setFlatIndex] = useState(0);
  const [choices, setChoices] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    pointsEarned: number;
    performanceTier?: {
      id: string;
      name: string;
      icon: string;
      color: string;
      bg: string;
    };
    badgesEarned?: CorporateBadgeEarned[];
    badgeRank?: CorporateBadgeRankInfo;
  } | null>(null);

  const current = flat[flatIndex];
  const isNewScenario =
    flatIndex === 0 ||
    flat[flatIndex - 1]?.scenarioId !== current?.scenarioId;

  if (alreadyCompleted && previousPoints !== undefined && !result) {
    const sign = previousPoints >= 0 ? "+" : "";
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center dark:border-emerald-900 dark:bg-emerald-950/30">
        <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
        <p className="mt-3 text-lg font-bold text-emerald-800 dark:text-emerald-300">
          Already completed today
        </p>
        <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">
          {previousScore}% · {sign}
          {previousPoints} pts
        </p>
        <Link href="/games" className="mt-6 inline-block">
          <Button variant="soft">Back to games</Button>
        </Link>
      </div>
    );
  }

  if (result) {
    const sign = result.pointsEarned >= 0 ? "+" : "";
    const earned = result.badgesEarned ?? [];
    return (
      <div className="rounded-xl border border-border bg-panel p-8 shadow-card">
        <div className="text-center">
          <p className="text-2xl">{game.icon}</p>
          <p className="mt-3 text-lg font-bold text-ink">Mission complete!</p>
          <p className="mt-2 text-muted">
            Score: {result.score}% · {sign}
            {result.pointsEarned} pts on the corporate games leaderboard
          </p>
        </div>

        {result.performanceTier ? (
          <div className="mt-6 flex justify-center">
            <CorporateGameBadge
              icon={result.performanceTier.icon}
              name={result.performanceTier.name}
              description="Performance this run"
              tier={result.performanceTier}
              size="lg"
            />
          </div>
        ) : null}

        {earned.length > 0 ? (
          <div className="mt-6">
            <p className="text-center text-sm font-semibold text-ink">
              New badges earned
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-6">
              {earned.map((badge) => (
                <CorporateGameBadge
                  key={badge.slug}
                  icon={badge.icon}
                  name={badge.name}
                  description={badge.description}
                  size="sm"
                />
              ))}
            </div>
          </div>
        ) : null}

        {result.badgeRank ? (
          <div className="mt-6 rounded-lg border border-border bg-surface/60 p-4">
            <p className="mb-3 text-sm font-semibold text-ink">
              Corporate mastery rank
            </p>
            <CorporateBadgeRank rank={result.badgeRank} />
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/games">
            <Button>More corporate games</Button>
          </Link>
          <Link href="/corporate-games/leaderboard">
            <Button variant="soft">View leaderboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  async function handleNext() {
    if (selected === null || !current) return;

    const nextChoices = [...choices, selected];
    setChoices(nextChoices);
    setShowFeedback(false);
    setSelected(null);

    if (flatIndex + 1 >= flat.length) {
      setLoading(true);
      const res = await fetch(`/api/corporate-games/${game.slug}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ choices: nextChoices }),
      });
      const data = await res.json();
      setLoading(false);
      if (res.ok) {
        setResult({
          score: data.score,
          pointsEarned: data.pointsEarned,
          performanceTier: data.performanceTier,
          badgesEarned: data.badgesEarned,
          badgeRank: data.badgeRank,
        });
        router.refresh();
      }
      return;
    }

    setFlatIndex(flatIndex + 1);
  }

  if (!current) return null;

  const scenarioNum = current.scenarioIndex + 1;
  const scenarioCount = scenarios.length;
  const questionInScenario = current.questionIndex + 1;
  const questionsInScenario =
    scenarios[current.scenarioIndex]?.questions.length ?? 1;

  return (
    <div className="rounded-xl border border-border bg-panel shadow-card">
      <div className="border-b border-border px-5 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
              {current.scenarioPhase}
            </p>
            <p className="text-sm text-muted">
              Scenario {scenarioNum} of {scenarioCount} · Question{" "}
              {questionInScenario} of {questionsInScenario}
            </p>
          </div>
          <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full rounded-full bg-brand-600 transition-all"
              style={{
                width: `${((flatIndex + 1) / totalQuestions) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {isNewScenario ? (
          <div className="mb-6 rounded-xl border border-brand-200/60 bg-brand-50/50 p-4 dark:border-brand-800/40 dark:bg-brand-950/20">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-brand-700 dark:text-brand-300">
              <BookOpen className="h-4 w-4" />
              Read the scenario
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink sm:text-base">
              {current.narrative}
            </p>
            {questionsInScenario > 1 ? (
              <p className="mt-3 text-xs text-muted">
                {questionsInScenario} questions follow — all based on the story
                above.
              </p>
            ) : null}
          </div>
        ) : (
          <p className="mb-4 text-xs text-muted">
            Same scenario · question {questionInScenario} of {questionsInScenario}
          </p>
        )}

        <h2 className="text-lg font-bold text-ink">{current.question.prompt}</h2>

        <div className="mt-5 space-y-2">
          {current.question.options.map((option, i) => (
            <button
              key={i}
              type="button"
              disabled={showFeedback || loading}
              onClick={() => {
                if (!showFeedback) setSelected(i);
              }}
              className={cn(
                "w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors",
                selected === i && !showFeedback
                  ? "border-brand-500 bg-brand-500/10 ring-1 ring-brand-500/25"
                  : "border-border bg-surface hover:border-brand-400/50",
                showFeedback &&
                  selected === i &&
                  (option.points >= 10
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
                    : option.points > 0
                      ? "border-amber-500 bg-amber-50 dark:bg-amber-950/30"
                      : "border-red-300 bg-red-50 dark:bg-red-950/30")
              )}
            >
              {option.text}
            </button>
          ))}
        </div>

        {showFeedback && selected !== null ? (
          <p className="mt-4 rounded-lg border border-border bg-surface/60 p-4 text-sm text-muted">
            {current.question.options[selected].feedback}
          </p>
        ) : null}

        <div className="mt-6 flex justify-end">
          {!showFeedback ? (
            <Button
              disabled={selected === null}
              onClick={() => setShowFeedback(true)}
            >
              Confirm choice
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={loading}>
              {loading
                ? "Submitting..."
                : flatIndex + 1 >= flat.length
                  ? "Finish game"
                  : flatIndex + 1 < flat.length &&
                      flat[flatIndex + 1]?.scenarioId === current.scenarioId
                    ? "Next question"
                    : "Next scenario"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
