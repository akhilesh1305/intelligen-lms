import Link from "next/link";
import { Trophy, Medal, Award, Zap } from "lucide-react";
import { getSession } from "@/lib/auth";
import {
  getWeeklyLeaderboard,
  getWeekLabel,
  QUIZ_POINTS_CORRECT,
  QUIZ_POINTS_INCORRECT,
} from "@/lib/weekly-leaderboard";
import { LeaderboardTabs } from "@/components/leaderboard/leaderboard-tabs";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TableScroll } from "@/components/ui/table-scroll";
import { AchievementLevelBadge } from "@/components/challenges/achievement-level-badge";
import { ACHIEVEMENT_LEVELS, UNRANKED_INFO } from "@/lib/achievement-levels";
const rankIcons = [Trophy, Medal, Award];

export default async function LeaderboardPage() {
  const session = await getSession();
  const leaders = await getWeeklyLeaderboard(20);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        title="Quiz games leaderboard"
        description={`Daily & weekly quiz rankings for ${getWeekLabel()}. Resets every Monday UTC.`}
        action={
          <Link href="/challenges">
            <Button size="sm">
              <Zap className="h-4 w-4" />
              Play quizzes
            </Button>
          </Link>
        }
      />

      <LeaderboardTabs active="quiz" />

      <TableScroll className="mt-8 rounded-sm border border-slate-200 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full min-w-[520px]">
          <thead className="border-b border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted sm:px-6">
                Rank
              </th>
              <th className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted sm:px-6">
                Learner
              </th>
              <th className="hidden px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted sm:table-cell sm:px-6">
                Level
              </th>
              <th className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted sm:px-6">
                Points
              </th>
              <th className="hidden px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted sm:table-cell sm:px-6">
                Quizzes
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {leaders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted">
                  No quiz scores yet this week — be the first!
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
                      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                          {user.name.charAt(0)}
                        </div>
                        <span className="truncate font-semibold text-ink">
                          {user.name}
                          {isCurrentUser && (
                            <span className="ml-2 text-xs text-brand-600">
                              (You)
                            </span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="hidden px-3 py-4 sm:table-cell sm:px-6">
                      <AchievementLevelBadge
                        level={user.achievementLevel}
                        size="sm"
                      />
                    </td>
                    <td className="px-3 py-4 font-bold text-brand-600 sm:px-6">
                      {user.points.toLocaleString()}
                    </td>
                    <td className="hidden px-3 py-4 text-sm text-muted sm:table-cell sm:px-6">
                      {user.quizzesCompleted}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </TableScroll>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-bold text-ink">Weekly achievement levels</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center gap-3 text-sm">
                <span className="text-xl text-muted">{UNRANKED_INFO.icon}</span>
                <div>
                  <p className="font-semibold text-ink">{UNRANKED_INFO.label}</p>
                  <p className="text-muted">Below 25 pts this week</p>
                </div>
              </li>
              {ACHIEVEMENT_LEVELS.map((level) => (
                <li key={level.level} className="flex items-center gap-3 text-sm">
                  <span className="text-xl">{level.icon}</span>
                  <div>
                    <p className="font-semibold text-ink">{level.label}</p>
                    <p className="text-muted">
                      {level.minPoints}+ pts or {level.minWins}+ quizzes this week
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="font-bold text-ink">Quiz game scoring</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              <li>
                <strong className="text-ink">Daily quizzes</strong> — Mon–Sun (
                MTWTFSS), 5–10 questions per day
              </li>
              <li>
                <strong className="text-ink">Weekly quizzes</strong> — 10–20
                quizzes for the full week
              </li>
              <li>
                Correct answer — +{QUIZ_POINTS_CORRECT} pts
              </li>
              <li>
                Wrong answer — {QUIZ_POINTS_INCORRECT} pt
              </li>
              <li>Leaderboard resets every Monday UTC</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
