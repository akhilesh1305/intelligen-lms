import Link from "next/link";
import { CheckCircle2, Circle, Lock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type QuizGameCardProps = {
  id: string;
  title: string;
  topic: string;
  quizIndex: number;
  tab: "daily" | "weekly";
  questionCount?: number;
  weekdayShort?: string;
  dayStatus?: "locked" | "today" | "missed";
  completed?: boolean;
  pointsEarned?: number;
  selected?: boolean;
};

export function QuizGameCard({
  id,
  title,
  topic,
  quizIndex,
  tab,
  questionCount,
  weekdayShort,
  dayStatus,
  completed,
  pointsEarned,
  selected,
}: QuizGameCardProps) {
  const locked = dayStatus === "locked";
  const href = locked
    ? "#"
    : `/challenges?tab=${tab}&quiz=${id}`;

  const content = (
    <>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {weekdayShort ? (
            <span
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
                dayStatus === "today"
                  ? "bg-brand-600 text-white"
                  : locked
                    ? "bg-slate-200 text-muted dark:bg-slate-700"
                    : "bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300"
              )}
            >
              {weekdayShort}
            </span>
          ) : (
            <>
              <Sparkles className="h-4 w-4 shrink-0 text-brand-600" />
              <span className="text-xs font-bold uppercase tracking-wide text-muted">
                #{quizIndex}
              </span>
            </>
          )}
        </div>
        {locked ? (
          <Lock className="h-5 w-5 shrink-0 text-muted" />
        ) : completed ? (
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
        ) : (
          <Circle className="h-5 w-5 shrink-0 text-muted" />
        )}
      </div>
      <p className="mt-2 font-semibold text-ink">{title}</p>
      <p className="mt-1 line-clamp-2 text-xs text-muted">{topic}</p>
      <p className="mt-3 text-xs font-medium text-brand-600">
        {locked
          ? "Unlocks on this day (UTC)"
          : completed && pointsEarned !== undefined
            ? `${pointsEarned >= 0 ? "+" : ""}${pointsEarned} pts`
            : questionCount
              ? `${questionCount} questions · +5 / −1`
              : "+5 correct · −1 wrong"}
      </p>
    </>
  );

  if (locked) {
    return (
      <div
        className={cn(
          "block cursor-not-allowed rounded-lg border border-border bg-surface/50 p-4 opacity-60"
        )}
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "block rounded-lg border p-4 transition-colors",
        selected
          ? "border-brand-500 bg-brand-500/10 ring-1 ring-brand-500/25"
          : "border-border bg-panel hover:border-brand-400/50",
        dayStatus === "today" &&
          !selected &&
          "border-brand-300 dark:border-brand-700",
        completed && !selected && "border-emerald-200/80 dark:border-emerald-900/50"
      )}
    >
      {content}
    </Link>
  );
}
