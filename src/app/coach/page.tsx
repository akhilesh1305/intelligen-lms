import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { requireAuth } from "@/lib/auth";
import { getCoachContext } from "@/lib/coach/context";
import { getDailyInsight } from "@/lib/coach/insights";
import { CoachProfileForm } from "@/components/coach/coach-profile-form";
import { CoachChatPanel } from "@/components/coach/coach-chat-panel";
import { CoachActionPlan } from "@/components/coach/coach-action-plan";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { formatSkillLevel } from "@/lib/competency";

export default async function CorporateCoachPage() {
  const session = await requireAuth();
  const [ctx, dailyInsight] = await Promise.all([
    getCoachContext(session.id),
    getDailyInsight(session.id),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        title="AI Corporate Coach"
        description="Personalized learning and career guidance powered by your progress, skills, and goals."
        action={
          <Link
            href="/competency"
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:underline"
          >
            View skill gaps
            <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            icon: Briefcase,
            label: "Target role",
            value: ctx.profile.targetRole ?? "Set in profile",
          },
          {
            icon: Target,
            label: "Skill gaps",
            value: `${ctx.gapSummary.gapCount} to develop`,
          },
          {
            icon: TrendingUp,
            label: "In progress",
            value: `${ctx.inProgress.length} course${ctx.inProgress.length !== 1 ? "s" : ""}`,
          },
          {
            icon: Sparkles,
            label: "Achievement",
            value: ctx.stats.achievementLevel,
          },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-start gap-3 p-5">
              <stat.icon className="mt-0.5 h-5 w-5 text-brand-600" />
              <div>
                <p className="text-sm text-muted">{stat.label}</p>
                <p className="font-semibold text-ink">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-ink">Your coach profile</h2>
              <p className="mt-1 text-sm text-muted">
                Tell your coach about your role and ambitions for tailored guidance.
              </p>
              <div className="mt-4">
                <CoachProfileForm initial={ctx.profile} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-panel">
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-semibold text-ink">Today&apos;s coaching tip</h2>
                <Badge variant="brand">{dailyInsight.source}</Badge>
              </div>
              <p className="mt-3 text-sm font-medium text-ink">{dailyInsight.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted whitespace-pre-wrap">
                {dailyInsight.content.replace(/\*\*/g, "")}
              </p>
              <ul className="mt-4 space-y-1.5">
                {dailyInsight.actions.map((action) => (
                  <li key={action} className="flex items-start gap-2 text-sm text-ink">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                    {action}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {ctx.gapItems.length > 0 ? (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-ink">Priority skill gaps</h2>
                <p className="mt-1 text-sm text-muted">{ctx.gapSummary.summary}</p>
                <div className="mt-4 space-y-3">
                  {ctx.gapItems.map((gap) => (
                    <div
                      key={gap.skillId}
                      className="rounded-lg border border-slate-200 p-3"
                    >
                      <p className="font-medium text-ink">{gap.name}</p>
                      <p className="text-xs text-muted">
                        {gap.category} · Target {formatSkillLevel(gap.targetLevel)}
                        {gap.achievedLevel
                          ? ` · Achieved ${formatSkillLevel(gap.achievedLevel)}`
                          : ""}
                      </p>
                      {gap.recommendedCourses[0] ? (
                        <Link
                          href={`/courses/${gap.recommendedCourses[0].id}`}
                          className="mt-2 inline-block text-sm font-semibold text-brand-600 hover:underline"
                        >
                          {gap.recommendedCourses[0].title} →
                        </Link>
                      ) : null}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>

        <div className="space-y-6 lg:col-span-3">
          <CoachChatPanel userName={session.name} />

          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-ink">Weekly action plan</h2>
              <p className="mt-1 text-sm text-muted">
                AI-generated priorities based on your enrollments, gaps, and goals.
              </p>
              <div className="mt-4">
                <CoachActionPlan />
              </div>
            </CardContent>
          </Card>

          {ctx.recommendations.length > 0 ? (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-ink">Recommended for you</h2>
                <div className="mt-4 space-y-3">
                  {ctx.recommendations.map((course) => (
                    <div
                      key={course.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 p-3"
                    >
                      <div>
                        <Link
                          href={`/courses/${course.id}`}
                          className="font-medium text-brand-600 hover:underline"
                        >
                          {course.title}
                        </Link>
                        <p className="text-xs text-muted">{course.matchReason}</p>
                      </div>
                      <Badge variant="brand">{course.confidence}% match</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
