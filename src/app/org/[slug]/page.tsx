import Link from "next/link";
import {
  BookOpen,
  GraduationCap,
  ScrollText,
  Shield,
  Trophy,
  UserCheck,
  Users,
} from "lucide-react";
import {
  getOrgAnalytics,
  getOrgUserDirectory,
  requireOrganizationAdminBySlug,
} from "@/lib/org-admin";
import { OrgUserDirectory } from "@/components/org/org-user-directory";
import {
  DashboardFade,
  DashboardShell,
} from "@/components/dashboard/dashboard-motion";
import {
  DashboardStatCard,
  type DashboardStatIcon,
} from "@/components/dashboard/dashboard-stat-card";
import {
  CourseStatusChart,
  EnrollmentTrendChart,
  LearnerProgressChart,
  NamedDistributionChart,
  QuizActivityChart,
  TopCoursesChart,
  WeeklyLeaderboardChart,
} from "@/components/analytics/charts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/section-header";
import { ProgressBar } from "@/components/ui/progress-bar";
import { TableScroll } from "@/components/ui/table-scroll";

const roleLabels = {
  ORG_ADMIN: "Admin",
  ORG_INSTRUCTOR: "Instructor",
  ORG_LEARNER: "Learner",
} as const;

function StatCard({
  label,
  value,
  icon,
  iconClass,
  delay = 0,
}: {
  label: string;
  value: string | number;
  icon: DashboardStatIcon;
  iconClass: string;
  delay?: number;
}) {
  return (
    <DashboardStatCard
      label={label}
      value={value}
      icon={icon}
      iconClass={iconClass}
      delay={delay}
    />
  );
}

export default async function OrgAdminDashboardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { org, isPlatformAdmin, accessibleOrgs } =
    await requireOrganizationAdminBySlug(slug);

  const [analytics, userDirectory] = await Promise.all([
    getOrgAnalytics(org.id),
    getOrgUserDirectory(org.id),
  ]);

  return (
    <DashboardShell>
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <DashboardFade>
      <SectionHeader
        title={`${org.name} analytics`}
        description={
          isPlatformAdmin
            ? "Platform admin view — data shown is scoped to the selected organization only."
            : "Private organization dashboard — visible only to org administrators. All data is scoped to your company."
        }
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="brand" className="shrink-0">
              <Shield className="mr-1 h-3 w-3" />
              {isPlatformAdmin ? "Platform admin" : "Org admins only"}
            </Badge>
            <Link href={`/org/${slug}/users`}>
              <Button variant="primary" size="sm">
                <Users className="h-4 w-4" />
                All user data
              </Button>
            </Link>
            <Link href={`/org/${slug}/settings`}>
              <Button variant="soft" size="sm">
                <ScrollText className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                Certificates
              </Button>
            </Link>
            <Link href="#all-users">
              <Button variant="soft" size="sm">
                <Users className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                User directory
              </Button>
            </Link>
            <Link href="#instructors">
              <Button variant="soft" size="sm">
                <UserCheck className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                Instructors
              </Button>
            </Link>
            <Link href="#learners">
              <Button variant="soft" size="sm">
                <GraduationCap className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                Learners
              </Button>
            </Link>
            <Link href="/courses">
              <Button variant="soft" size="sm">
                <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                View courses
              </Button>
            </Link>
          </div>
        }
      />
      </DashboardFade>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total enrollments"
          value={analytics.totalEnrollments}
          icon="users"
          iconClass="bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400"
          delay={100}
        />
        <StatCard
          label="Completion rate"
          value={`${analytics.completionRate}%`}
          icon="trending-up"
          iconClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
          delay={170}
        />
        <StatCard
          label="New members (30d)"
          value={analytics.newMembersThisMonth}
          icon="user-check"
          iconClass="bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
          delay={240}
        />
        <StatCard
          label="Pending approvals"
          value={analytics.pendingApprovals}
          icon="shield"
          iconClass="bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400"
          delay={310}
        />
      </div>

      <DashboardFade delay={200}>
      <div id="instructors" className="mt-10 scroll-mt-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-ink">Org instructors</h2>
            <p className="mt-1 text-sm text-muted">
              {analytics.instructorCount} instructor
              {analytics.instructorCount !== 1 ? "s" : ""} ·{" "}
              {analytics.instructorTotals.coursesCreated} org courses ·{" "}
              {analytics.instructorTotals.totalEnrollments} learner enrollments
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Instructors"
            value={analytics.instructorCount}
            icon="user-check"
            iconClass="bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400"
          />
          <StatCard
            label="Courses created"
            value={analytics.instructorTotals.coursesCreated}
            icon="book-open"
            iconClass="bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400"
          />
          <StatCard
            label="Learners taught"
            value={analytics.instructorTotals.totalEnrollments}
            icon="users"
            iconClass="bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400"
          />
          <StatCard
            label="Avg course progress"
            value={`${analytics.instructorTotals.avgProgress}%`}
            icon="trending-up"
            iconClass="bg-teal-100 text-teal-600 dark:bg-teal-950 dark:text-teal-400"
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-ink">Courses per instructor</h3>
              <p className="mt-1 text-sm text-muted">Org-private courses by creator</p>
              <div className="mt-4 h-[220px] sm:h-[280px]">
                {analytics.instructorCourseDistribution.length > 0 ? (
                  <NamedDistributionChart
                    data={analytics.instructorCourseDistribution}
                  />
                ) : (
                  <p className="flex h-full items-center justify-center text-sm text-muted">
                    No instructor courses yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-ink">Instructor course performance</h3>
              <div className="mt-4 max-h-[280px] space-y-4 overflow-y-auto pr-1">
                {analytics.instructorProfiles.length > 0 ? (
                  analytics.instructorProfiles.map((instructor) => (
                    <div
                      key={instructor.userId}
                      className="rounded-lg border border-border/70 bg-surface/40 p-3"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-ink">{instructor.name}</p>
                          <p className="text-xs text-muted">
                            {instructor.employeeId ?? "—"} · {instructor.email}
                          </p>
                        </div>
                        <Badge variant="brand">
                          {instructor.courseCount} course
                          {instructor.courseCount !== 1 ? "s" : ""}
                        </Badge>
                      </div>
                      <p className="mt-2 text-xs text-muted">
                        {instructor.totalEnrollments} enrollments ·{" "}
                        {instructor.avgProgress}% avg progress
                      </p>
                      {instructor.courses.length > 0 ? (
                        <div className="mt-2 space-y-2">
                          {instructor.courses.map((course) => (
                            <div key={course.id}>
                              <div className="flex justify-between gap-2 text-xs">
                                <Link
                                  href={`/courses/${course.id}`}
                                  className="font-medium text-ink hover:text-brand-600"
                                >
                                  {course.title}
                                </Link>
                                <span className="shrink-0 text-muted">
                                  {course.enrollments} · {course.avgProgress}%
                                </span>
                              </div>
                              <ProgressBar value={course.avgProgress} className="mt-1 h-1.5" />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-2 text-xs text-muted">No courses created yet</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted">No org instructors assigned yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardContent className="pt-6">
            <h3 className="font-bold text-ink">All org instructors</h3>
            <p className="mt-1 text-sm text-muted">
              Employee ID, courses, enrollments, and average learner progress
            </p>
            <TableScroll className="mt-4">
              <table className="w-full min-w-[640px] text-left text-sm md:min-w-[800px]">
                <thead>
                  <tr className="border-b border-border text-muted">
                    <th className="pb-2 pr-4 font-semibold">Employee ID</th>
                    <th className="pb-2 pr-4 font-semibold">Name</th>
                    <th className="pb-2 pr-4 font-semibold">Email</th>
                    <th className="pb-2 pr-4 font-semibold">Courses</th>
                    <th className="pb-2 pr-4 font-semibold">Enrollments</th>
                    <th className="pb-2 font-semibold">Avg progress</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.instructorProfiles.map((instructor) => (
                    <tr key={instructor.userId} className="border-b border-border/60">
                      <td className="py-3 pr-4 font-mono text-xs">
                        {instructor.employeeId ?? "—"}
                      </td>
                      <td className="py-3 pr-4 font-medium text-ink">
                        {instructor.name}
                      </td>
                      <td className="py-3 pr-4 text-muted">{instructor.email}</td>
                      <td className="py-3 pr-4">{instructor.courseCount}</td>
                      <td className="py-3 pr-4">{instructor.totalEnrollments}</td>
                      <td className="py-3">{instructor.avgProgress}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableScroll>
          </CardContent>
        </Card>
      </div>

      <div id="learners" className="mt-10 scroll-mt-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-ink">Org learners</h2>
            <p className="mt-1 text-sm text-muted">
              {analytics.learnerCount} learner{analytics.learnerCount !== 1 ? "s" : ""} ·{" "}
              {analytics.leaderboard.weekLabel} quiz week
            </p>
          </div>
          <Link href="/leaderboard">
            <Button variant="soft" size="sm">
              <Trophy className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              Full leaderboard
            </Button>
          </Link>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Learners"
            value={analytics.learnerCount}
            icon="graduation-cap"
            iconClass="bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400"
          />
          <StatCard
            label="Active learners"
            value={analytics.activeLearners}
            icon="users"
            iconClass="bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400"
          />
          <StatCard
            label="Course completions"
            value={analytics.learnerTotals.completions}
            icon="trophy"
            iconClass="bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400"
          />
          <StatCard
            label="Avg progress"
            value={`${analytics.learnerTotals.avgProgress}%`}
            icon="trending-up"
            iconClass="bg-teal-100 text-teal-600 dark:bg-teal-950 dark:text-teal-400"
          />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Quiz players this week"
            value={analytics.leaderboard.participants}
            icon="users"
            iconClass="bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400"
          />
          <StatCard
            label="Quizzes played"
            value={analytics.leaderboard.totalAttempts}
            icon="zap"
            iconClass="bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400"
          />
          <StatCard
            label="Quiz points earned"
            value={analytics.leaderboard.totalPoints}
            icon="trophy"
            iconClass="bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
          />
          <StatCard
            label="Total enrollments"
            value={analytics.learnerTotals.enrolled}
            icon="clipboard-list"
            iconClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-ink">Top learners by course progress</h3>
              <p className="mt-1 text-sm text-muted">Average progress on org courses</p>
              <div className="mt-4 h-[220px] sm:h-[280px]">
                {analytics.topLearners.length > 0 ? (
                  <LearnerProgressChart data={analytics.topLearners} />
                ) : (
                  <p className="flex h-full items-center justify-center text-sm text-muted">
                    No learning activity yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-ink">Top quiz performers this week</h3>
              <p className="mt-1 text-sm text-muted">Org learners only</p>
              <div className="mt-4 h-[220px] sm:h-[280px]">
                {analytics.leaderboard.topLearners.length > 0 ? (
                  <WeeklyLeaderboardChart data={analytics.leaderboard.topLearners} />
                ) : (
                  <p className="flex h-full items-center justify-center text-sm text-muted">
                    No quiz scores yet this week
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-ink">Learner enrollment trend</h3>
              <div className="mt-4 h-[220px] sm:h-[280px]">
                {analytics.enrollmentTrend.length > 0 ? (
                  <EnrollmentTrendChart data={analytics.enrollmentTrend} />
                ) : (
                  <p className="flex h-full items-center justify-center text-sm text-muted">
                    No enrollments yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-ink">Quiz activity this week</h3>
              <p className="mt-1 text-sm text-muted">Org learners only</p>
              <div className="mt-4 h-[220px] sm:h-[280px]">
                {analytics.leaderboard.quizActivity.length > 0 ? (
                  <QuizActivityChart data={analytics.leaderboard.quizActivity} />
                ) : (
                  <p className="flex h-full items-center justify-center text-sm text-muted">
                    No quiz activity yet this week
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardContent className="pt-6">
            <h3 className="font-bold text-ink">All org learners</h3>
            <p className="mt-1 text-sm text-muted">
              Employee ID, enrollments, completions, quiz points, and progress
            </p>
            <TableScroll className="mt-4">
              <table className="w-full min-w-[640px] text-left text-sm md:min-w-[880px]">
                <thead>
                  <tr className="border-b border-border text-muted">
                    <th className="pb-2 pr-4 font-semibold">Employee ID</th>
                    <th className="pb-2 pr-4 font-semibold">Name</th>
                    <th className="pb-2 pr-4 font-semibold">Email</th>
                    <th className="pb-2 pr-4 font-semibold">Enrolled</th>
                    <th className="pb-2 pr-4 font-semibold">Completed</th>
                    <th className="pb-2 pr-4 font-semibold">Avg progress</th>
                    <th className="pb-2 font-semibold">Quiz points</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.learnerProfiles.map((learner) => (
                    <tr key={learner.userId} className="border-b border-border/60">
                      <td className="py-3 pr-4 font-mono text-xs">
                        {learner.employeeId ?? "—"}
                      </td>
                      <td className="py-3 pr-4 font-medium text-ink">{learner.name}</td>
                      <td className="py-3 pr-4 text-muted">{learner.email}</td>
                      <td className="py-3 pr-4">{learner.enrolledCourses}</td>
                      <td className="py-3 pr-4">{learner.completedCourses}</td>
                      <td className="py-3 pr-4">{learner.avgProgress}%</td>
                      <td className="py-3">{learner.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableScroll>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-bold text-ink">Top org courses</h3>
            <div className="mt-4 h-[220px] sm:h-[280px]">
              {analytics.topCourses.length > 0 ? (
                <TopCoursesChart data={analytics.topCourses} />
              ) : (
                <p className="flex h-full items-center justify-center text-sm text-muted">
                  No org courses yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-bold text-ink">Members by role</h3>
            <div className="mt-4 h-[220px] sm:h-[280px]">
              {analytics.membersByRole.length > 0 ? (
                <NamedDistributionChart data={analytics.membersByRole} />
              ) : (
                <p className="flex h-full items-center justify-center text-sm text-muted">
                  No members yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-bold text-ink">Courses by status</h3>
            <div className="mt-4 h-[220px] sm:h-[280px]">
              {analytics.coursesByStatus.length > 0 ? (
                <CourseStatusChart data={analytics.coursesByStatus} />
              ) : (
                <p className="flex h-full items-center justify-center text-sm text-muted">
                  No courses created yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-bold text-ink">Course performance</h3>
            <div className="mt-4 space-y-4">
              {analytics.coursePerformance.length > 0 ? (
                analytics.coursePerformance.map((c) => (
                  <div key={c.id}>
                    <div className="flex justify-between gap-2 text-sm">
                      <div>
                        <Link
                          href={`/courses/${c.id}`}
                          className="font-medium text-ink hover:text-brand-600"
                        >
                          {c.title}
                        </Link>
                        <p className="text-xs text-muted">by {c.instructorName}</p>
                      </div>
                      <span className="shrink-0 text-muted">
                        {c.enrollments} learners · {c.avgProgress}%
                      </span>
                    </div>
                    <ProgressBar value={c.avgProgress} className="mt-1" />
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted">No org courses to show yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div id="all-users" className="mt-10 scroll-mt-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-ink">All organization users</h2>
            <p className="mt-1 text-sm text-muted">
              Complete roster with course progress, quiz points, corporate games, and
              instructor metrics
            </p>
          </div>
          <Link href={`/org/${slug}/users`}>
            <Button variant="soft" size="sm">
              <Users className="h-4 w-4" />
              Open full directory
            </Button>
          </Link>
        </div>
        <Card className="mt-4">
          <CardContent className="pt-6">
            <OrgUserDirectory users={userDirectory} orgSlug={slug} compact />
          </CardContent>
        </Card>
      </div>
      </DashboardFade>
    </div>
    </DashboardShell>
  );
}
