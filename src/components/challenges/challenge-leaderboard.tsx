import Link from "next/link";
import { Trophy, Medal, Award } from "lucide-react";
import type { AchievementLevel } from "@prisma/client";
import { cn } from "@/lib/utils";
import { AchievementLevelBadge } from "./achievement-level-badge";
import { TableScroll } from "@/components/ui/table-scroll";

const rankIcons = [Trophy, Medal, Award];

type Leader = {
  rank: number;
  userId: string;
  name: string;
  score: number;
  pointsEarned: number;
  achievementLevel?: AchievementLevel | null;
};

export function ChallengeLeaderboard({
  leaders,
  currentUserId,
  title,
  scoreLabel = "%",
  showLevels = true,
  viewAllHref,
}: {
  leaders: Leader[];
  currentUserId?: string;
  title: string;
  scoreLabel?: string;
  showLevels?: boolean;
  viewAllHref?: string;
}) {
  return (
    <div>
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-bold text-ink">{title}</h3>
        {viewAllHref ? (
          <Link
            href={viewAllHref}
            className="shrink-0 text-xs font-semibold text-brand-600 hover:underline"
          >
            View all
          </Link>
        ) : null}
      </div>
      {leaders.length === 0 ? (
        <p className="mt-4 text-sm text-muted">No completions yet — be the first!</p>
      ) : (
        <TableScroll hint={false} className="mt-4">
          <div className="rounded-lg border border-border bg-panel">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-surface">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-bold uppercase text-muted">#</th>
                <th className="px-4 py-2 text-left text-xs font-bold uppercase text-muted">Learner</th>
                <th className="px-4 py-2 text-left text-xs font-bold uppercase text-muted">
                  {scoreLabel === "pts" ? "Points" : "Score"}
                </th>
                {showLevels ? (
                  <th className="hidden px-4 py-2 text-left text-xs font-bold uppercase text-muted sm:table-cell">
                    Level
                  </th>
                ) : null}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {leaders.map((row) => {
                const RankIcon = rankIcons[row.rank - 1] ?? null;
                const isYou = currentUserId === row.userId;
                return (
                  <tr key={row.userId} className={cn(isYou && "bg-brand-500/10 dark:bg-brand-500/15")}>
                    <td className="px-4 py-3">
                      {RankIcon ? (
                        <RankIcon
                          className={cn(
                            "h-4 w-4",
                            row.rank === 1 && "text-amber-500",
                            row.rank === 2 && "text-slate-400",
                            row.rank === 3 && "text-amber-700"
                          )}
                        />
                      ) : (
                        row.rank
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-ink">
                      {row.name}
                      {isYou ? <span className="ml-1 text-xs text-brand-600">(You)</span> : null}
                    </td>
                    <td className="px-4 py-3 font-bold text-brand-600">
                      {scoreLabel === "pts" ? row.score : `${row.score}%`}
                    </td>
                    {showLevels ? (
                      <td className="hidden px-4 py-3 sm:table-cell">
                        <AchievementLevelBadge level={row.achievementLevel ?? null} size="sm" />
                      </td>
                    ) : null}
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </TableScroll>
      )}
    </div>
  );
}
