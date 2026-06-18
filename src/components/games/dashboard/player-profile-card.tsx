import Link from "next/link";
import { Globe, Medal, Star, Trophy, Zap } from "lucide-react";
import { AchievementLevelBadge } from "@/components/challenges/achievement-level-badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { GamesPlayerProfile } from "@/lib/games-player-profile";

export function PlayerProfileCard({
  profile,
  className,
}: {
  profile: GamesPlayerProfile;
  className?: string;
}) {
  const stats = [
    { icon: Star, label: "XP", value: profile.xp.toLocaleString() },
    { icon: Zap, label: "Points", value: profile.challengePoints.toLocaleString() },
    {
      icon: Medal,
      label: "Badges",
      value: `${profile.badgesEarned}/${profile.totalBadges}`,
    },
    {
      icon: Globe,
      label: "Global",
      value: profile.globalRank ? `#${profile.globalRank}` : "—",
    },
  ];

  return (
    <article
      className={cn(
        "glass-card overflow-hidden rounded-[20px] border border-brand-500/20 bg-gradient-to-br from-brand-50/60 via-panel to-violet-50/40 p-6 dark:from-brand-950/30 dark:via-panel dark:to-violet-950/20 sm:p-8",
        className
      )}
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-gradient-to-br from-brand-500 to-violet-600 text-2xl font-bold text-white shadow-lg">
            {profile.displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">
              Player profile
            </p>
            <h2 className="text-xl font-bold text-ink sm:text-2xl">{profile.displayName}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <AchievementLevelBadge level={profile.rank} size="sm" />
              {profile.globalRank ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-panel/80 px-2.5 py-1 text-xs font-semibold text-muted">
                  <Trophy className="h-3.5 w-3.5 text-amber-500" />
                  #{profile.globalRank} of {profile.globalRankTotal}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {!profile.isLoggedIn ? (
          <Link href="/login" className="shrink-0">
            <Button>Sign in</Button>
          </Link>
        ) : (
          <Link href="/leaderboard" className="shrink-0">
            <Button variant="outline" size="sm">
              View leaderboard
            </Button>
          </Link>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-[14px] border border-border/80 bg-panel/60 px-3 py-3 backdrop-blur-sm"
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted">
              <s.icon className="h-3.5 w-3.5 text-brand-500" />
              {s.label}
            </div>
            <p className="mt-1 text-lg font-bold tabular-nums text-ink">{s.value}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
