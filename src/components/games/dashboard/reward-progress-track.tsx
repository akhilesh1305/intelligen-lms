"use client";

import { Gift, LogIn, Sparkles } from "lucide-react";
import { ProgressRing } from "@/components/games/dashboard/progress-ring";
import { cn } from "@/lib/utils";
import type { GamesPlayerProfile } from "@/lib/games-player-profile";
import { EmptyState } from "@/components/ui/empty-state";

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
        <EmptyState
          size="inline"
          icon={profile.isLoggedIn ? Sparkles : LogIn}
          title={
            profile.isLoggedIn ? "All milestones unlocked" : "Sign in to track rewards"
          }
          description={
            profile.isLoggedIn
              ? "Keep playing to climb ranks and earn new badges."
              : "Track rank, badge, and mastery rewards after you sign in."
          }
          action={
            profile.isLoggedIn
              ? { label: "Play more games", href: "/games" }
              : { label: "Sign in", href: "/login" }
          }
          className="mt-6 border-none bg-transparent shadow-none"
        />
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
