import { Trophy, Medal, Award } from "lucide-react";
import { getLeaderboard, ensureBadgesExist } from "@/lib/gamification";
import { getSession } from "@/lib/auth";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";

const rankIcons = [Trophy, Medal, Award];

export default async function LeaderboardPage() {
  await ensureBadgesExist();
  const session = await getSession();
  const leaders = await getLeaderboard(20);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        title="Leaderboard"
        description="Top learners ranked by points, badges, and certificates"
      />

      <div className="mt-8 overflow-hidden rounded-sm border border-slate-200 bg-white shadow-card">
        <table className="w-full">
          <thead className="border-b border-slate-100 bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted">
                Learner
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted">
                Points
              </th>
              <th className="hidden px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted sm:table-cell">
                Badges
              </th>
              <th className="hidden px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted md:table-cell">
                Certificates
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leaders.map((user, i) => {
              const RankIcon = rankIcons[i] ?? null;
              const isCurrentUser = session?.id === user.id;

              return (
                <tr
                  key={user.id}
                  className={cn(isCurrentUser && "bg-brand-50/50")}
                >
                  <td className="px-6 py-4">
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
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-ink">
                        {user.name}
                        {isCurrentUser && (
                          <span className="ml-2 text-xs text-brand-600">(You)</span>
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-brand-600">
                    {user.points.toLocaleString()}
                  </td>
                  <td className="hidden px-6 py-4 sm:table-cell">
                    <div className="flex gap-1">
                      {user.userBadges.map((ub) => (
                        <span key={ub.badge.id} title={ub.badge.name}>
                          {ub.badge.icon}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="hidden px-6 py-4 md:table-cell text-muted">
                    {user._count.certificates}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-10 rounded-sm border border-slate-200 bg-white p-6 shadow-card">
        <h3 className="font-bold text-ink">How to earn points</h3>
        <ul className="mt-4 space-y-2 text-sm text-muted">
          <li>Complete a lesson — <strong className="text-ink">+10 pts</strong></li>
          <li>Pass a quiz — <strong className="text-ink">+50 pts</strong></li>
          <li>Submit an assignment — <strong className="text-ink">+25 pts</strong></li>
          <li>Complete a course — <strong className="text-ink">+100 pts</strong></li>
          <li>Earn badges for milestones — bonus points!</li>
        </ul>
      </div>
    </div>
  );
}
