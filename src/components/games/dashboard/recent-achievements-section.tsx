import { Award, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GamesPlayerProfile } from "@/lib/games-player-profile";

function formatWhen(date: Date) {
  return date.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function RecentAchievementsSection({
  profile,
  className,
}: {
  profile: GamesPlayerProfile;
  className?: string;
}) {
  return (
    <section className={cn("glass-card rounded-[20px] p-6", className)}>
      <div className="flex items-center gap-2">
        <Award className="h-5 w-5 text-violet-500" />
        <div>
          <h3 className="text-lg font-bold text-ink">Recent achievements</h3>
          <p className="text-sm text-muted">Latest badges and milestones</p>
        </div>
      </div>

      {!profile.isLoggedIn || profile.recentBadges.length === 0 ? (
        <p className="mt-6 rounded-[14px] border border-dashed border-border px-4 py-10 text-center text-sm text-muted">
          {profile.isLoggedIn
            ? "Play games and complete quizzes to earn your first badge."
            : "Sign in to see your achievement timeline."}
        </p>
      ) : (
        <>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {profile.recentBadges.slice(0, 4).map((badge) => (
              <div
                key={badge.slug}
                className="rounded-[14px] border border-border/80 bg-panel/60 p-4 text-center transition-all motion-safe:hover:-translate-y-0.5"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[12px] bg-gradient-to-br from-brand-500/15 to-violet-500/15 text-2xl">
                  {badge.icon}
                </div>
                <p className="mt-2 text-sm font-bold text-ink">{badge.name}</p>
                <p className="mt-0.5 text-xs text-muted">+{badge.points} XP</p>
              </div>
            ))}
          </div>

          <ul className="mt-6 space-y-3 border-t border-border pt-6">
            {profile.milestones.map((m) => (
              <li key={m.id} className="flex gap-3">
                <div className="relative flex flex-col items-center">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500/10 text-sm">
                    {m.icon}
                  </span>
                  <span className="mt-1 w-px flex-1 bg-border" />
                </div>
                <div className="min-w-0 flex-1 pb-4">
                  <p className="font-semibold text-ink">{m.label}</p>
                  <p className="text-sm text-muted">{m.description}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted">
                    <Clock className="h-3 w-3" />
                    {formatWhen(m.earnedAt)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
