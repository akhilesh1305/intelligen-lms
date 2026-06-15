import Link from "next/link";
import { Check, Lock, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuizPickerIcon({
  href,
  label,
  selected,
  completed,
  locked,
  missed,
  isToday,
  title,
  size = "default",
}: {
  href: string;
  label: string;
  selected?: boolean;
  completed?: boolean;
  locked?: boolean;
  missed?: boolean;
  isToday?: boolean;
  title?: string;
  size?: "default" | "sm";
}) {
  const className = cn(
    "relative flex items-center justify-center rounded-full font-bold transition-all",
    size === "sm"
      ? "h-7 w-7 text-xs ring-offset-1"
      : "h-9 w-9 text-sm sm:h-10 sm:w-10",
    locked && "cursor-not-allowed bg-slate-200 text-muted opacity-60 dark:bg-slate-700",
    missed &&
      !completed &&
      "bg-slate-100 text-muted opacity-70 hover:bg-slate-200 dark:bg-slate-800",
    missed &&
      completed &&
      "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-950 dark:text-emerald-400",
    !locked &&
      !missed &&
      selected &&
      (size === "sm"
        ? "bg-brand-600 text-white ring-2 ring-brand-400 ring-offset-1 ring-offset-surface"
        : "bg-brand-600 text-white ring-2 ring-brand-400 ring-offset-2 ring-offset-surface"),
    !locked &&
      !missed &&
      !selected &&
      isToday &&
      "bg-brand-600 text-white hover:bg-brand-700",
    !locked &&
      !missed &&
      !selected &&
      !isToday &&
      completed &&
      "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-950 dark:text-emerald-400",
    !locked &&
      !missed &&
      !selected &&
      !isToday &&
      !completed &&
      "bg-brand-100 text-brand-700 hover:bg-brand-200 dark:bg-brand-950 dark:text-brand-300"
  );

  const inner = (
    <>
      {locked ? (
        <Lock className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
      ) : (
        label
      )}
      {missed && !completed ? (
        <span
          className={cn(
            "absolute -right-0.5 -top-0.5 flex items-center justify-center rounded-full bg-slate-500 text-white",
            size === "sm" ? "h-3 w-3" : "h-4 w-4"
          )}
        >
          <X
            className={size === "sm" ? "h-2 w-2" : "h-2.5 w-2.5"}
            strokeWidth={3}
          />
        </span>
      ) : null}
      {completed && !locked && !selected ? (
        <span
          className={cn(
            "absolute -right-0.5 -top-0.5 flex items-center justify-center rounded-full bg-emerald-600 text-white",
            size === "sm" ? "h-3 w-3" : "h-4 w-4"
          )}
        >
          <Check
            className={size === "sm" ? "h-2 w-2" : "h-2.5 w-2.5"}
            strokeWidth={3}
          />
        </span>
      ) : null}
    </>
  );

  if (locked) {
    return (
      <span className={className} title={title}>
        {inner}
      </span>
    );
  }

  return (
    <Link href={href} className={className} title={title}>
      {inner}
    </Link>
  );
}
