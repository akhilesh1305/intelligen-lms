"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gamepad2, Trophy, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function LeaderboardNavSwitch({
  variant = "mobile",
  onNavigate,
  compact = false,
}: {
  variant?: "mobile" | "dropdown";
  onNavigate?: () => void;
  compact?: boolean;
}) {
  const pathname = usePathname();
  const active = pathname.startsWith("/corporate-games/leaderboard")
    ? "corporate"
    : "quiz";

  const isMobile = variant === "mobile";

  const switchControl = (
    <div
      className={cn(
        "inline-flex w-full max-w-full rounded-full border border-border bg-panel p-0.5 sm:w-auto",
        compact && "sm:w-auto"
      )}
      role="group"
      aria-label="Leaderboard type"
    >
      <Link
        href="/leaderboard"
        onClick={onNavigate}
        className={cn(
          "inline-flex flex-1 items-center justify-center gap-1 rounded-full font-semibold transition-colors sm:flex-none",
          isMobile ? "px-3 py-2 text-xs" : "px-2.5 py-1 text-xs",
          active === "quiz"
            ? "bg-brand-600 text-white shadow-sm"
            : "text-muted hover:text-ink"
        )}
      >
        <Zap className="h-3 w-3 shrink-0" />
        Quiz
      </Link>
      <Link
        href="/corporate-games/leaderboard"
        onClick={onNavigate}
        className={cn(
          "inline-flex flex-1 items-center justify-center gap-1 rounded-full font-semibold transition-colors sm:flex-none",
          isMobile ? "px-3 py-2 text-xs" : "px-2.5 py-1 text-xs",
          active === "corporate"
            ? "bg-brand-600 text-white shadow-sm"
            : "text-muted hover:text-ink"
        )}
      >
        <Gamepad2 className="h-3 w-3 shrink-0" />
        Corporate
      </Link>
    </div>
  );

  if (isMobile) {
    return (
      <div className={cn("space-y-2", !compact && "rounded-xl bg-surface px-3 py-3")}>
        <div className="flex items-center gap-3 text-base font-semibold text-ink">
          <Trophy className="h-5 w-5 shrink-0 text-brand-600 dark:text-brand-400" />
          Leaderboard
        </div>
        {switchControl}
      </div>
    );
  }

  return (
    <div className="border-t border-border/60 px-3 py-2.5">
      <div className="flex items-center gap-2.5 text-sm font-semibold text-ink">
        <Trophy className="h-4 w-4 shrink-0 text-brand-600" />
        Leaderboard
      </div>
      <div className="mt-2 pl-6">{switchControl}</div>
    </div>
  );
}
