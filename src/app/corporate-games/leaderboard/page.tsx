import Link from "next/link";
import { Award, Gamepad2, Medal, Trophy } from "lucide-react";
import { getSession } from "@/lib/auth";
import {
  getCorporateGamesDailyLeaderboard,
  getCorporateGamesLeaderboard,
  getDayLabel,
  getUserCorporateGamesDailyEntry,
  getUserCorporateGamesLeaderboardEntry,
  getWeekLabel,
} from "@/lib/corporate-games-leaderboard";
import { CORPORATE_GAMES } from "@/lib/corporate-games";
import { CORPORATE_SCENARIOS_PER_GAME } from "@/lib/corporate-game-scenarios";
import { CorporateAchievementLevels } from "@/components/corporate-games/corporate-achievement-levels";
import { CorporateBadgeRank } from "@/components/corporate-games/corporate-badge-rank";
import { CorporatePeriodTabs } from "@/components/corporate-games/corporate-period-tabs";
import { CorporateRankBadge } from "@/components/corporate-games/corporate-rank-badge";
import { getUserCorporateBadgeRank } from "@/lib/corporate-game-badges";
import { LeaderboardTabs } from "@/components/leaderboard/leaderboard-tabs";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TableScroll } from "@/components/ui/table-scroll";
import { cn } from "@/lib/utils";
import { shouldUseDemoData } from "@/lib/demo/config";
import {
  getDemoCorporateBadgeRank,
  getDemoCorporateLeaderboard,
} from "@/lib/demo";

const rankIcons = [Trophy, Medal, Award];

export default async function CorporateGamesLeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const { period: periodParam } = await searchParams;
  const period = periodParam === "weekly" ? "weekly" : "daily";

  const session = await getSession();
  const demo = shouldUseDemoData(session?.email);
  const currentUser = session ? { id: session.id, name: session.name } : undefined;

  const [dailyLeaders, weeklyLeaders, dailyEntry, weeklyEntry, badgeRank] =
    demo
      ? [
          getDemoCorporateLeaderboard(20, currentUser),
          getDemoCorporateLeaderboard(20, currentUser),
          session ? { points: 180, gamesCompleted: 2 } : null,
          session ? { points: 680, gamesCompleted: 8 } : null,
          session ? getDemoCorporateBadgeRank() : null,
        ]
      : await Promise.all([
          getCorporateGamesDailyLeaderboard(20),
          getCorporateGamesLeaderboard(20),
          session ? getUserCorporateGamesDailyEntry(session.id) : null,
          session ? getUserCorporateGamesLeaderboardEntry(session.id) : null,
          session ? getUserCorporateBadgeRank(session.id) : null,
        ]);

  const leaders = period === "daily" ? dailyLeaders : weeklyLeaders;
  const userEntry = period === "daily" ? dailyEntry : weeklyEntry;
  const userRank = session
    ? leaders.find((l) => l.userId === session.id)?.rank
    : undefined;

  const periodLabel =
    period === "daily" ? getDayLabel() : getWeekLabel();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        title="Corporate games leaderboard"
        description={
          period === "daily"
            ? `Daily rankings for scenario simulations — ${periodLabel} (UTC). New scenarios every day.`
            : `Weekly rankings — ${periodLabel}. Resets every Monday UTC.`
        }
        action={
          <Link href="/games">
            <Button size="sm">
              <Gamepad2 className="h-4 w-4" />
              Play games
            </Button>
          </Link>
        }
      />

      <LeaderboardTabs active="corporate" />
      <CorporatePeriodTabs active={period} />

      {userEntry ? (
        <Card className="mt-8">
          <CardContent className="space-y-4 pt-6">
            <div className="flex flex-wrap items-center gap-4">
              <Gamepad2 className="h-8 w-8 text-brand-600" />
              <div className="flex-1">
                <p className="font-semibold text-ink">
                  Your rank: {userRank ? `#${userRank}` : "Unranked"} ·{" "}
                  {userEntry.points} pts · {userEntry.gamesCompleted}/
                  {CORPORATE_GAMES.length} games
                </p>
                <p className="text-sm text-muted">
                  {period === "daily"
                    ? "Today's corporate games"
                    : "This week's corporate games"}
                </p>
              </div>
              {period === "weekly" && weeklyEntry ? (
                <CorporateRankBadge
                  weeklyPoints={weeklyEntry.points}
                  gamesPlayed={weeklyEntry.gamesCompleted}
                />
              ) : null}
            </div>
            {badgeRank ? (
              <CorporateBadgeRank rank={badgeRank} size="sm" />
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      <TableScroll className="mt-8 rounded-sm border border-border bg-panel shadow-card">
        <table className="w-full min-w-[480px]">
          <thead className="border-b border-border bg-surface/80">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted sm:px-6">
                Rank
              </th>
              <th className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted sm:px-6">
                Learner
              </th>
              <th className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted sm:px-6">
                Points
              </th>
              <th className="hidden px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted sm:table-cell sm:px-6">
                Games
              </th>
              {period === "weekly" ? (
                <th className="hidden px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted md:table-cell md:px-6">
                  Rank tier
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {leaders.length === 0 ? (
              <tr>
                <td
                  colSpan={period === "weekly" ? 5 : 4}
                  className="px-6 py-12 text-center text-muted"
                >
                  {period === "daily"
                    ? "No corporate game scores yet today — be the first!"
                    : "No corporate game scores yet this week — be the first!"}
                </td>
              </tr>
            ) : (
              leaders.map((user, i) => {
                const RankIcon = rankIcons[i] ?? null;
                const isCurrentUser = session?.id === user.userId;

                return (
                  <tr
                    key={user.userId}
                    className={cn(
                      isCurrentUser && "bg-brand-50/50 dark:bg-brand-950/20"
                    )}
                  >
                    <td className="px-3 py-4 sm:px-6">
                      <div className="flex items-center gap-2">
                        {RankIcon ? (
                          <RankIcon
                            className={cn(
                              "h-5 w-5",
                              i === 0 && "text-amber-500",
                              i === 1 && "text-slate-400",
                              i === 2 && "text-amber-700"
                            )}
                          />
                        ) : (
                          <span className="w-5 text-center font-bold text-muted">
                            {i + 1}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                          {user.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-ink">
                          {user.name}
                          {isCurrentUser ? (
                            <span className="ml-2 text-xs text-brand-600">
                              (You)
                            </span>
                          ) : null}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-4 font-bold text-brand-600 sm:px-6">
                      {user.points.toLocaleString()}
                    </td>
                    <td className="hidden px-3 py-4 text-sm text-muted sm:table-cell sm:px-6">
                      {user.gamesCompleted}
                    </td>
                    {period === "weekly" ? (
                      <td className="hidden px-3 py-4 md:table-cell md:px-6">
                        <CorporateRankBadge
                          weeklyPoints={user.points}
                          gamesPlayed={user.gamesCompleted}
                          size="sm"
                        />
                      </td>
                    ) : null}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </TableScroll>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <CorporateAchievementLevels showPerformanceTiers />

        <Card>
          <CardContent className="pt-6">
            <h3 className="font-bold text-ink">Scoring</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              <li>
                <strong className="text-ink">6 corporate games</strong> — one
                attempt each per day (UTC)
              </li>
              <li>
                <strong className="text-ink">Scenarios rotate daily</strong> —{" "}
                {CORPORATE_SCENARIOS_PER_GAME} unique stories picked from a
                catalog of 16 per game
              </li>
              <li>Best scenario choice — up to 10 pts</li>
              <li>Good choice — 4 pts · Poor choice — 0 pts</li>
              <li>Up to 40 pts per game · 240 pts max per day</li>
              <li>
                <strong className="text-ink">Daily</strong> and{" "}
                <strong className="text-ink">weekly</strong> leaderboards —
                separate from quiz games
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
