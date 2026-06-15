import Link from "next/link";
import {
  BookOpen,
  Building2,
  ClipboardList,
  Download,
  Plus,
  Shield,
  UserCheck,
  Users,
} from "lucide-react";
import { requireAuth } from "@/lib/auth";
import {
  countLessons,
  getInstructorCourses,
  getPendingCourses,
  getStudentEnrollments,
} from "@/lib/courses";
import {
  countPendingInstructors,
  getInstructorApprovalState,
  isInstructorApproved,
} from "@/lib/instructor";
import { db } from "@/lib/db";
import {
  getLeaderboardAnalytics,
  getPlatformAnalytics,
  getInstructorAnalytics,
} from "@/lib/analytics";
import { getUserOrganizationMemberships } from "@/lib/organizations";
import { getPublishedCoursesForUser } from "@/lib/courses";
import { getRecommendedCourses } from "@/lib/recommendations";
import { CourseCard } from "@/components/courses/course-card";
import { Recommendations } from "@/components/courses/recommendations";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { ProgressBar } from "@/components/ui/progress-bar";
import {
  CourseStatusChart,
  EnrollmentTrendChart,
  QuizActivityChart,
  RoleDistributionChart,
  TopCoursesChart,
  WeeklyLeaderboardChart,
} from "@/components/analytics/charts";
import {
  DashboardFade,
  DashboardHero,
  DashboardPageHeader,
  DashboardShell,
} from "@/components/dashboard/dashboard-motion";
import { DashboardStatGrid } from "@/components/dashboard/dashboard-stat-card";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ instructor?: string }>;
}) {
  const session = await requireAuth();
  const { instructor: instructorParam } = await searchParams;

  if (session.role === "ADMIN") {
    const [analytics, leaderboard, pending, pendingInstructors] =
      await Promise.all([
        getPlatformAnalytics(),
        getLeaderboardAnalytics(),
        getPendingCourses(),
        countPendingInstructors(),
      ]);

    return (
      <DashboardShell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <DashboardFade>
        <SectionHeader
          title="Analytics dashboard"
          description="Platform insights and course management"
          action={
            <div className="flex flex-wrap gap-2 [&_a]:min-h-11 [&_button]:min-h-11">
              <Link href="/admin/security">
                <Button variant="soft" size="sm">
                  <Shield className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                  Security
                </Button>
              </Link>
              <Link href="/admin/audit-logs">
                <Button variant="soft" size="sm">
                  <ClipboardList className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                  Audit logs
                </Button>
              </Link>
              <Link href="/admin/exports">
                <Button variant="soft" size="sm">
                  <Download className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  Export CSV
                </Button>
              </Link>
              <Link href="/org">
                <Button variant="soft" size="sm">
                  <Building2 className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                  Org analytics
                </Button>
              </Link>
              <Link href="/admin/organizations">
                <Button variant="soft" size="sm">
                  <Users className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                  Organizations
                </Button>
              </Link>
              <Link href="/admin/instructors">
                <Button
                  variant={pendingInstructors > 0 ? "primary" : "soft"}
                  size="sm"
                >
                  <UserCheck
                    className={
                      pendingInstructors > 0
                        ? "h-4 w-4"
                        : "h-4 w-4 text-amber-600 dark:text-amber-400"
                    }
                  />
                  Instructor management
                  {pendingInstructors > 0 ? (
                    <span className="rounded-full bg-white/25 px-2 py-0.5 text-xs font-bold">
                      {pendingInstructors}
                    </span>
                  ) : null}
                </Button>
              </Link>
              {pending.length > 0 ? (
                <Link href="/admin/approvals">
                  <Button variant="primary" size="sm">
                    <Shield className="h-4 w-4" />
                    {pending.length} course{pending.length !== 1 ? "s" : ""} pending
                  </Button>
                </Link>
              ) : null}
            </div>
          }
        />
        </DashboardFade>

        <div className="mt-8">
          <DashboardStatGrid
            stats={[
              {
                label: "Total enrollments",
                value: analytics.totalEnrollments,
                icon: "users",
                iconClass: "bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400",
              },
              {
                label: "Completion rate",
                value: `${analytics.completionRate}%`,
                icon: "trending-up",
                iconClass:
                  "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
              },
              {
                label: "New users (30d)",
                value: analytics.newUsersThisMonth,
                icon: "users",
                iconClass:
                  "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
              },
              {
                label: "Pending approvals",
                value: pending.length,
                icon: "shield",
                iconClass: "bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400",
              },
            ]}
            baseDelay={80}
          />
        </div>

        <DashboardFade delay={200}>
        <div className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-ink">Quiz leaderboard</h2>
              <p className="mt-1 text-sm text-muted">
                {leaderboard.weekLabel} · Resets every Monday UTC
              </p>
            </div>
            <Link href="/admin/exports">
              <Button variant="soft" size="sm">
                <Download className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Export leaderboard CSV
              </Button>
            </Link>
          </div>

          <div className="mt-4">
            <DashboardStatGrid
              stats={[
                {
                  label: "Players this week",
                  value: leaderboard.participants,
                  icon: "users",
                  iconClass:
                    "bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400",
                },
                {
                  label: "Quizzes played",
                  value: leaderboard.totalAttempts,
                  icon: "zap",
                  iconClass:
                    "bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400",
                },
                {
                  label: "Points awarded",
                  value: leaderboard.totalPoints,
                  icon: "trophy",
                  iconClass:
                    "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400",
                },
                {
                  label: "Active quizzes",
                  value: leaderboard.dailyQuizCount + leaderboard.weeklyQuizCount,
                  icon: "trending-up",
                  iconClass:
                    "bg-teal-100 text-teal-600 dark:bg-teal-950 dark:text-teal-400",
                },
              ]}
              baseDelay={120}
            />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <DashboardFade delay={280} animation="slide-right">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-bold text-ink">Top learners this week</h3>
                <div className="mt-4 h-[220px] sm:h-[280px]">
                  {leaderboard.topLearners.length > 0 ? (
                    <WeeklyLeaderboardChart data={leaderboard.topLearners} />
                  ) : (
                    <p className="flex h-full items-center justify-center text-sm text-muted">
                      No quiz scores yet this week
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
            </DashboardFade>
            <DashboardFade delay={360} animation="slide-left">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-bold text-ink">Quiz activity this week</h3>
                <div className="mt-4 h-[220px] sm:h-[280px]">
                  {leaderboard.quizActivity.length > 0 ? (
                    <QuizActivityChart data={leaderboard.quizActivity} />
                  ) : (
                    <p className="flex h-full items-center justify-center text-sm text-muted">
                      No quiz activity yet this week
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
            </DashboardFade>
          </div>
        </div>
        </DashboardFade>

        <DashboardFade delay={400}>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <DashboardFade delay={80} animation="scale-in">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-ink">Enrollment trend</h3>
              <div className="mt-4 h-[220px] sm:h-[280px]">
                <EnrollmentTrendChart data={analytics.enrollmentTrend} />
              </div>
            </CardContent>
          </Card>
          </DashboardFade>
          <DashboardFade delay={160} animation="scale-in">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-ink">Top courses</h3>
              <div className="mt-4 h-[220px] sm:h-[280px]">
                <TopCoursesChart data={analytics.topCourses} />
              </div>
            </CardContent>
          </Card>
          </DashboardFade>
          <DashboardFade delay={240} animation="scale-in">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-ink">Users by role</h3>
              <div className="mt-4 h-[220px] sm:h-[280px]">
                <RoleDistributionChart data={analytics.usersByRole} />
              </div>
            </CardContent>
          </Card>
          </DashboardFade>
          <DashboardFade delay={320} animation="scale-in">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-ink">Courses by status</h3>
              <div className="mt-4 h-[220px] sm:h-[280px]">
                <CourseStatusChart data={analytics.coursesByStatus} />
              </div>
            </CardContent>
          </Card>
          </DashboardFade>
        </div>
        </DashboardFade>
      </div>
      </DashboardShell>
    );
  }

  if (session.role === "INSTRUCTOR") {
    const approval = await getInstructorApprovalState(session.id);
    const approved = isInstructorApproved(
      session.role,
      approval?.instructorStatus
    );

    const [courses, analytics] = await Promise.all([
      getInstructorCourses(session.id),
      getInstructorAnalytics(session.id),
    ]);

    return (
      <DashboardShell>
        <DashboardPageHeader
          title="Instructor dashboard"
          subtitle={
            approved
              ? `${analytics.totalStudents} learners · ${analytics.avgProgress}% avg progress`
              : "Complete admin verification to start creating courses"
          }
          action={
            approved ? (
              <Link href="/instructor/courses/new">
                <Button>
                  <Plus className="h-4 w-4" />
                  Create course
                </Button>
              </Link>
            ) : null
          }
        />

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {!approved ? (
            <DashboardFade>
            <Card className="mb-8 border-amber-200 bg-amber-50/80 dark:border-amber-900/50 dark:bg-amber-950/30">
              <CardContent className="py-6">
                <h3 className="font-semibold text-ink">
                  {approval?.instructorStatus === "REJECTED" ||
                  instructorParam === "rejected"
                    ? "Instructor application not approved"
                    : "Awaiting admin verification"}
                </h3>
                <p className="mt-2 text-sm text-muted">
                  {approval?.instructorStatus === "REJECTED" ? (
                    <>
                      {approval.instructorRejectionReason
                        ? `Reason: ${approval.instructorRejectionReason}`
                        : "Your instructor application was declined."}{" "}
                      Contact the platform admin if you need help.
                    </>
                  ) : (
                    <>
                      Thanks for registering as an instructor. An administrator will
                      review your account shortly. You&apos;ll be notified once you can
                      create courses.
                    </>
                  )}
                </p>
              </CardContent>
            </Card>
            </DashboardFade>
          ) : null}
          {analytics.courses.length > 0 && (
            <DashboardFade delay={120}>
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h3 className="font-bold text-ink">Course performance</h3>
                <div className="mt-4 space-y-4">
                  {analytics.courses.map((c) => (
                    <div key={c.id}>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-ink">{c.title}</span>
                        <span className="text-muted">
                          {c.enrollments} learners · {c.avgProgress}%
                        </span>
                      </div>
                      <ProgressBar value={c.avgProgress} className="mt-1" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            </DashboardFade>
          )}

          {courses.length === 0 ? (
            <DashboardFade delay={180}>
            <Card>
              <CardContent className="py-16 text-center">
                <BookOpen className="mx-auto h-14 w-14 text-slate-300" />
                <h3 className="mt-4 text-xl font-bold text-ink">No courses yet</h3>
                {approved ? (
                  <Link href="/instructor/courses/new" className="mt-8 inline-block">
                    <Button size="lg">Create your first course</Button>
                  </Link>
                ) : (
                  <p className="mt-4 text-sm text-muted">
                    Course creation unlocks after admin approval.
                  </p>
                )}
              </CardContent>
            </Card>
            </DashboardFade>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course, index) => (
                <DashboardFade key={course.id} delay={100 + index * 80} animation="fade-up">
                <CourseCard
                  id={course.id}
                  title={course.title}
                  description={course.description}
                  instructorName={session.name}
                  lessonCount={countLessons(course.modules)}
                  published={course.published}
                  href={`/instructor/courses/${course.id}`}
                  pricePaise={course.pricePaise}
                  thumbnail={course.thumbnail}
                  skillLevel={course.skillLevel}
                />
                </DashboardFade>
              ))}
            </div>
          )}
        </div>
      </DashboardShell>
    );
  }

  const [enrollments, recommendations, certificates, orgMemberships, accessibleCourses] =
    await Promise.all([
    getStudentEnrollments(session.id),
    getRecommendedCourses(session.id, session.role),
    db.certificate.findMany({
      where: { userId: session.id },
      include: { course: { select: { title: true } } },
    }),
    getUserOrganizationMemberships(session.id),
    getPublishedCoursesForUser(session.id, session.role),
  ]);

  const enrolledIds = new Set(enrollments.map((e) => e.courseId));
  const orgOnlyCourses = accessibleCourses.filter(
    (c) => c.visibility === "ORGANIZATION" && !enrolledIds.has(c.id)
  );

  const user = await db.user.findUnique({
    where: { id: session.id },
    include: { userBadges: { include: { badge: true } } },
  });

  const avgProgress =
    enrollments.length > 0
      ? Math.round(
          enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length
        )
      : 0;

  return (
    <DashboardShell>
      <DashboardHero
        title={`Welcome back, ${session.name.split(" ")[0]}`}
        subtitle={`${user?.points ?? 0} points · ${user?.userBadges.length ?? 0} badges · ${certificates.length} certificates`}
        progress={enrollments.length > 0 ? avgProgress : undefined}
      >
        <Link href="/coach">
          <Button variant="accent" className="bg-white/10 text-white hover:bg-white/20">
            Corporate Coach
          </Button>
        </Link>
        <Link href="/leaderboard">
          <Button variant="accent" className="bg-white/10 text-white hover:bg-white/20">
            View leaderboard
          </Button>
        </Link>
      </DashboardHero>

      {user && user.userBadges.length > 0 ? (
        <DashboardFade delay={100}>
          <div className="border-b border-border bg-brand-50/50 px-4 py-3 dark:bg-brand-950/20 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-7xl flex-wrap gap-2">
              {user.userBadges.map((ub) => (
                <span
                  key={ub.badge.id}
                  title={ub.badge.name}
                  className="rounded-lg border border-brand-200 bg-panel px-2.5 py-1 text-sm shadow-sm dark:border-brand-800"
                >
                  {ub.badge.icon} {ub.badge.name}
                </span>
              ))}
            </div>
          </div>
        </DashboardFade>
      ) : null}

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {certificates.length > 0 && (
          <DashboardFade delay={120}>
          <section className="mb-10">
            <h2 className="text-lg font-bold text-ink">Your certificates</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {certificates.map((cert) => (
                <Link
                  key={cert.id}
                  href={`/certificates/${cert.id}`}
                  className="rounded-sm border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-100"
                >
                  {cert.course.title}
                </Link>
              ))}
            </div>
          </section>
          </DashboardFade>
        )}

        <DashboardFade delay={180}>
        <SectionHeader
          title="My courses"
          action={
            <Link href="/courses">
              <Button variant="outline">Explore courses</Button>
            </Link>
          }
        />

        {enrollments.length === 0 ? (
          <DashboardFade delay={240}>
          <Card className="mt-8">
            <CardContent className="py-16 text-center">
              <BookOpen className="mx-auto h-14 w-14 text-slate-300" />
              <h3 className="mt-4 text-xl font-bold text-ink">No courses yet</h3>
              <Link href="/courses" className="mt-8 inline-block">
                <Button size="lg">Browse courses</Button>
              </Link>
            </CardContent>
          </Card>
          </DashboardFade>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {enrollments.map((e, index) => (
              <DashboardFade key={e.id} delay={200 + index * 80} animation="fade-up">
              <CourseCard
                id={e.course.id}
                title={e.course.title}
                description={e.course.description}
                instructorName={e.course.instructor.name}
                lessonCount={e.lessonCount}
                enrolled
                progress={e.progress}
                pricePaise={e.course.pricePaise}
                thumbnail={e.course.thumbnail}
                skillLevel={e.course.skillLevel}
              />
              </DashboardFade>
            ))}
          </div>
        )}
        </DashboardFade>

        {orgMemberships.length > 0 ? (
          <DashboardFade delay={280}>
          <section className="mt-12">
            <SectionHeader
              title={`${orgMemberships[0].organization.name} courses`}
              description="Private training available only to your organization"
              action={
                <Link href="/courses">
                  <Button variant="outline">View all</Button>
                </Link>
              }
            />
            {orgOnlyCourses.length === 0 ? (
              <p className="mt-4 text-sm text-muted">
                No new company courses right now. Check back later.
              </p>
            ) : (
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {orgOnlyCourses.slice(0, 3).map((course, index) => (
                  <DashboardFade key={course.id} delay={index * 90} animation="scale-in">
                  <CourseCard
                    id={course.id}
                    title={course.title}
                    description={course.description}
                    instructorName={course.instructor.name}
                    lessonCount={countLessons(course.modules)}
                    pricePaise={course.pricePaise}
                    thumbnail={course.thumbnail}
                    skillLevel={course.skillLevel}
                  />
                  </DashboardFade>
                ))}
              </div>
            )}
          </section>
          </DashboardFade>
        ) : null}

        <DashboardFade delay={320}>
        <Recommendations courses={recommendations} />
        </DashboardFade>
      </div>
    </DashboardShell>
  );
}
