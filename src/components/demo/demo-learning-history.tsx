import { Award, BookOpen, Gamepad2, Sparkles, Trophy, Zap } from "lucide-react";
import type { DemoLearningHistoryEntry } from "@/lib/demo/learning-history";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardFade } from "@/components/dashboard/dashboard-motion";
import { cn } from "@/lib/utils";

const actionMeta = {
  completed: { icon: BookOpen, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40" },
  started: { icon: Sparkles, color: "text-brand-600 bg-brand-50 dark:bg-brand-950/40" },
  certificate: { icon: Award, color: "text-violet-600 bg-violet-50 dark:bg-violet-950/40" },
  quiz: { icon: Trophy, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40" },
  badge: { icon: Zap, color: "text-orange-600 bg-orange-50 dark:bg-orange-950/40" },
  game: { icon: Gamepad2, color: "text-cyan-600 bg-cyan-50 dark:bg-cyan-950/40" },
};

function formatHistoryDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function DemoLearningHistory({
  entries,
  className,
}: {
  entries: DemoLearningHistoryEntry[];
  className?: string;
}) {
  return (
    <DashboardFade delay={140}>
      <Card className={cn("rounded-[20px]", className)}>
        <CardContent className="pt-6">
          <h3 className="font-bold text-ink">Learning history</h3>
          <p className="mt-1 text-sm text-muted">
            Recent courses, certificates, quizzes, and achievements
          </p>
          <ul className="mt-5 space-y-4">
            {entries.map((entry) => {
              const meta = actionMeta[entry.action];
              const Icon = meta.icon;
              return (
                <li key={entry.id} className="flex gap-3">
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                      meta.color
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1 border-b border-border pb-4 last:border-0 last:pb-0">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-semibold text-ink">{entry.title}</p>
                      <time className="shrink-0 text-xs text-muted">
                        {formatHistoryDate(entry.date)}
                      </time>
                    </div>
                    <p className="mt-0.5 text-sm text-muted">{entry.detail}</p>
                    {entry.xp ? (
                      <p className="mt-1 text-xs font-semibold text-brand-600 dark:text-brand-400">
                        +{entry.xp} XP
                      </p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </DashboardFade>
  );
}
