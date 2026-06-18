"use client";

import { Gift } from "lucide-react";
import { ProgressRing } from "@/components/games/dashboard/progress-ring";
import { cn } from "@/lib/utils";
import type { GamesPlayerProfile } from "@/lib/games-player-profile";

export function RewardProgressTrack({
  profile,
  className,
}: {
  profile: GamesPlayerProfile;
  className?: string;
}) {
  return (
    <section className={cn("glass-card rounded-[20px] p-6", className)}>
      <div className="flex items-center gap-2">
        <Gift className="h-5 w-5 text-amber-500" />
        <div>
          <h3 className="text-lg font-bold text-ink">Reward progress</h3>
          <p className="text-sm text-muted">XP milestones and unlockable rewards</p>
        </div>
      </div>

      {!profile.isLoggedIn || profile.rewards.length === 0 ? (
        <p className="mt-6 rounded-[14px] border border-dashed border-border px-4 py-10 text-center text-sm text-muted">
          {profile.isLoggedIn
            ? "You have unlocked all tracked milestones — keep playing!"
            : "Sign in to track rank, badge, and mastery rewards."}
        </p>
      ) : (
        <ul className="mt-5 space-y-4">
          {profile.rewards.map((reward) => (
            <li key={reward.id} className="flex items-center gap-4">
              <ProgressRing value={reward.percent} size={52} stroke={5}>
                <span className="text-lg">{reward.icon}</span>
              </ProgressRing>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between gap-2 text-sm">
                  <span className="truncate font-semibold text-ink">{reward.label}</span>
                  <span className="shrink-0 tabular-nums text-muted">
                    {Math.min(reward.current, reward.target)} / {reward.target}
                  </span>
                </div>
                <p className="mt-0.5 line-clamp-1 text-xs text-muted">{reward.description}</p>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-border/60">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-cyan transition-all duration-700"
                    style={{ width: `${reward.percent}%` }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
