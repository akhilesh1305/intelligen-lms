import type { LucideIcon } from "lucide-react";
import { BarChart3, Medal, Target, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GamesPlayerProfile } from "@/lib/games-player-profile";

function StatTile({
  icon: Icon,
  label,
  value,
  sublabel,
  gradient,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  sublabel?: string;
  gradient: string;
}) {
  return (
    <div className="glass-card rounded-[20px] p-5 transition-all duration-300 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-card-hover">
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-[12px] bg-gradient-to-br text-white shadow-md",
          gradient
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 text-2xl font-bold tabular-nums text-ink">{value}</p>
      <p className="text-sm font-semibold text-ink">{label}</p>
      {sublabel ? <p className="mt-0.5 text-xs text-muted">{sublabel}</p> : null}
    </div>
  );
}

export function PersonalStatsDashboard({
  profile,
  className,
}: {
  profile: GamesPlayerProfile;
  className?: string;
}) {
  const { stats, weekLabel } = profile;

  return (
    <section className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-brand-500" />
        <div>
          <h3 className="text-lg font-bold text-ink">Personal stats</h3>
          <p className="text-sm text-muted">All-time game performance</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          icon={Target}
          label="Games played"
          value={stats.gamesPlayed}
          sublabel="Quizzes · corporate · knowledge"
          gradient="from-brand-500 to-accent-cyan"
        />
        <StatTile
          icon={Medal}
          label="Games won"
          value={stats.gamesWon}
          sublabel="Passed challenges & completions"
          gradient="from-violet-500 to-brand-500"
        />
        <StatTile
          icon={TrendingUp}
          label="Best score"
          value={stats.bestScore > 0 ? `${stats.bestScore}%` : "—"}
          sublabel="Highest single-game score"
          gradient="from-emerald-500 to-teal-500"
        />
        <StatTile
          icon={BarChart3}
          label="Weekly points"
          value={stats.weeklyPoints}
          sublabel={weekLabel}
          gradient="from-amber-500 to-orange-500"
        />
      </div>
    </section>
  );
}
