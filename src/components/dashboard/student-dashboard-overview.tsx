"use client";

import type { ComponentType, ReactNode } from "react";
import Link from "next/link";
import {
  Bot,
  BookOpen,
  Calendar,
  Clock,
  Flame,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardFade } from "@/components/dashboard/dashboard-motion";
import { DashboardStatGrid } from "@/components/dashboard/dashboard-stat-card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

type Enrollment = {
  id: string;
  progress: number;
  enrolledAt: Date;
  course: { id: string; title: string };
};

type Recommendation = {
  id: string;
  title: string;
  description: string;
};

function activeCount(total: number, enrollments: { progress: number }[]) {
  if (total === 0) return 0;
  return enrollments.filter((e) => e.progress > 0 && e.progress < 100).length;
}

export function StudentDashboardOverview({
  enrollments,
  points,
  badgeCount,
  certificateCount,
  recommendations,
}: {
  enrollments: Enrollment[];
  points: number;
  badgeCount: number;
  certificateCount: number;
  recommendations: Recommendation[];
}) {
  const total = enrollments.length;
  const completed = enrollments.filter((e) => e.progress >= 100).length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const streakDays = Math.min(30, Math.max(0, Math.floor(points / 40) || (total > 0 ? 1 : 0)));

  const stats = [
    {
      label: "Courses enrolled",
      value: total,
      icon: "book-open" as const,
      iconClass: "from-brand-500 to-accent-cyan",
      trend: total > 0 ? { value: `${activeCount(total, enrollments)} active`, positive: true } : undefined,
    },
    {
      label: "Completion rate",
      value: `${completionRate}%`,
      icon: "trending-up" as const,
      iconClass: "from-emerald-500 to-cyan-500",
      trend: completionRate > 0 ? { value: `${completed} done`, positive: true } : undefined,
    },
    {
      label: "Certificates earned",
      value: certificateCount,
      icon: "graduation-cap" as const,
      iconClass: "from-violet-500 to-brand-500",
      trend: certificateCount > 0 ? { value: "Verified", positive: true } : undefined,
    },
    {
      label: "Learning streak",
      value: `${streakDays}d`,
      icon: "zap" as const,
      iconClass: "from-amber-500 to-orange-500",
      trend: streakDays > 0 ? { value: `${points} XP`, positive: true } : undefined,
    },
  ];

  const recent = enrollments.slice(0, 4);
  const inProgress = enrollments.filter((e) => e.progress < 100).slice(0, 3);

  return (
    <div className="space-y-8">
      <DashboardStatGrid stats={stats} baseDelay={40} />

      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardFade delay={120}>
          <Card glass data-ai-cursor className="h-full rounded-[20px]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold text-ink">Completion overview</h3>
                <TrendingUp className="h-4 w-4 text-brand-500" />
              </div>
              <div className="mt-6 space-y-4">
                {enrollments.length === 0 ? (
                  <EmptyState
                    size="inline"
                    icon={BookOpen}
                    title="No progress yet"
                    description="Enroll in a course to track completion here."
                    action={{ label: "Browse courses", href: "/courses" }}
                    className="border-none bg-transparent shadow-none"
                  />
                ) : (
                  enrollments.slice(0, 5).map((e) => (
                    <div key={e.id}>
                      <div className="flex justify-between text-sm">
                        <span className="truncate font-medium text-ink pr-2">
                          {e.course.title}
                        </span>
                        <span className="shrink-0 text-muted">{e.progress}%</span>
                      </div>
                      <ProgressBar value={e.progress} className="mt-1.5" />
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </DashboardFade>

        <DashboardFade delay={160}>
          <Card glass data-ai-cursor className="h-full rounded-[20px]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold text-ink">Engagement</h3>
                <Flame className="h-4 w-4 text-orange-500" />
              </div>
              <div className="mt-6 flex h-32 items-end gap-2">
                {[35, 52, 48, 70, 62, 85, streakDays * 3].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-lg bg-gradient-to-t from-brand-600 to-accent-cyan opacity-90"
                    style={{ height: `${Math.min(100, h)}%` }}
                  />
                ))}
              </div>
              <p className="mt-4 text-sm text-muted">
                {streakDays}-day learning streak · {points} XP · {badgeCount} badges
              </p>
            </CardContent>
          </Card>
        </DashboardFade>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardFade delay={200}>
          <Widget title="Recent activity" icon={Clock}>
            {recent.length === 0 ? (
              <EmptyState
                size="inline"
                icon={Clock}
                title="No activity yet"
                description="Your recent learning activity will show up here."
                action={{ label: "Start learning", href: "/courses" }}
                className="border-none bg-transparent p-0 shadow-none"
              />
            ) : (
              <ul className="space-y-3">
                {recent.map((e) => (
                  <li key={e.id} className="text-sm">
                    <span className="font-medium text-ink">
                      {e.progress >= 100 ? "Completed" : "Continued"}
                    </span>{" "}
                    <Link
                      href={`/courses/${e.course.id}`}
                      className="text-brand-600 hover:underline dark:text-brand-400"
                    >
                      {e.course.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Widget>
        </DashboardFade>

        <DashboardFade delay={240}>
          <Widget title="Upcoming deadlines" icon={Calendar}>
            {inProgress.length === 0 ? (
              <p className="text-sm text-muted">You&apos;re all caught up.</p>
            ) : (
              <ul className="space-y-3">
                {inProgress.map((e) => (
                  <li key={e.id} className="flex items-start justify-between gap-2 text-sm">
                    <span className="truncate text-ink">{e.course.title}</span>
                    <span className="shrink-0 text-muted">{100 - e.progress}% left</span>
                  </li>
                ))}
              </ul>
            )}
          </Widget>
        </DashboardFade>

        <DashboardFade delay={280}>
          <Widget title="AI recommendations" icon={Bot}>
            {recommendations.length === 0 ? (
              <p className="text-sm text-muted">
                <Link href="/ai" className="text-brand-600 hover:underline dark:text-brand-400">
                  Explore AI tools
                </Link>{" "}
                for personalized paths.
              </p>
            ) : (
              <ul className="space-y-3">
                {recommendations.slice(0, 3).map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/courses/${c.id}`}
                      className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
                    >
                      {c.title}
                    </Link>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted">{c.description}</p>
                  </li>
                ))}
              </ul>
            )}
          </Widget>
        </DashboardFade>

        <DashboardFade delay={320}>
          <Widget title="Learning streak" icon={Flame}>
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-[14px] bg-gradient-to-br from-orange-500 to-rose-500 text-2xl font-bold text-white shadow-lg">
                {streakDays}
              </div>
              <div>
                <p className="font-semibold text-ink">Day streak</p>
                <p className="text-sm text-muted">{points} XP earned</p>
              </div>
            </div>
            <Link href="/leaderboard" className="mt-4 block">
              <Button variant="soft" size="sm" className="w-full">
                <Sparkles className="h-3.5 w-3.5" />
                Leaderboard
              </Button>
            </Link>
          </Widget>
        </DashboardFade>
      </div>
    </div>
  );
}

function Widget({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: ComponentType<{ className?: string }>;
  children: ReactNode;
}) {
  return (
    <Card glass data-ai-cursor className={cn("flex h-full min-h-[10rem] flex-col rounded-[20px]")}>
      <CardContent className="pt-6">
        <div className="mb-4 flex items-center gap-2">
          <Icon className="h-4 w-4 text-brand-500" />
          <h3 className="text-sm font-bold text-ink">{title}</h3>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}
