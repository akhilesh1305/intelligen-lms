"use client";

import { ProgressRing } from "@/components/games/dashboard/progress-ring";
import { ProgressBar } from "@/components/ui/progress-bar";
import { cn } from "@/lib/utils";
import type { GamesPlayerProfile } from "@/lib/games-player-profile";

export function XPProgressWidget({
  profile,
  className,
}: {
  profile: GamesPlayerProfile;
  className?: string;
}) {
  return (
    <article className={cn("glass-card rounded-[20px] p-6", className)}>
      <h3 className="text-lg font-bold text-ink">Rank progress</h3>
      <p className="mt-1 text-sm text-muted">
        Quiz challenge ranks — Bronze through Platinum
      </p>

      <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row">
        <ProgressRing value={profile.levelProgressPercent} size={100} stroke={8}>
          <div className="text-center">
            <span className="text-2xl" aria-hidden>
              {profile.levelIcon}
            </span>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
              {profile.levelLabel}
            </p>
          </div>
        </ProgressRing>

        <div className="min-w-0 flex-1">
          <div className="flex justify-between text-sm font-semibold text-ink">
            <span>Current rank</span>
            <span>{profile.levelLabel}</span>
          </div>
          {profile.nextLevelLabel ? (
            <p className="mt-1 text-xs text-muted">
              Next: {profile.nextLevelLabel} · {profile.xpRemaining} pts remaining
            </p>
          ) : (
            <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
              Max rank reached
            </p>
          )}
          <div className="mt-4">
            <ProgressBar value={profile.levelProgressPercent} className="h-2.5" />
          </div>
          <p className="mt-2 text-xs text-muted">
            {profile.challengePoints.toLocaleString()} challenge points ·{" "}
            {profile.xp.toLocaleString()} total XP
          </p>
        </div>
      </div>
    </article>
  );
}
