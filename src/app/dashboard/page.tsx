import Link from "next/link";
import { BookOpen, ClipboardList, Plus, Shield, TrendingUp, Users } from "lucide-react";
import { requireAuth } from "@/lib/auth";
import {
  countLessons,
  getInstructorCourses,
  getPendingCourses,
  getStudentEnrollments,
} from "@/lib/courses";
import { db } from "@/lib/db";
import { getPlatformAnalytics, getInstructorAnalytics } from "@/lib/analytics";
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
  RoleDistributionChart,
  TopCoursesChart,
} from "@/components/analytics/charts";

export default async function DashboardPage() {
  const session = await requireAuth();

  if (session.role === "ADMIN") {
    const [analytics, pending] = await Promise.all([
      getPlatformAnalytics(),
      getPendingCourses(),
    ]);

    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeader
          title="Analytics dashboard"
          description="Platform insights and course management"
          action={
            <div className="flex flex-wrap gap-2">
              <Link href="/admin/audit-logs">
                <Button variant="outline">
                  <ClipboardList className="h-4 w-4" />
                  Audit logs
                </Button>
              </Link>
              {pending.length > 0 ? (
                <Link href="/admin/approvals">
                  <Button variant="outline">
                    <Shield className="h-4 w-4" />
                    {pending.length} pending approval{pending.length !== 1 ? "s" : ""}
                  </Button>
                </Link>
              ) : null}
            </div>
          }
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Total enrollments",
              value: analytics.totalEnrollments,
              icon: Users,
            },
            {
              label: "Completion rate",
              value: `${analytics.completionRate}%`,
              icon: TrendingUp,
            },
            {
              label: "New users (30d)",
              value: analytics.newUsersThisMonth,
              icon: Users,
            },
            {
              label: "Pending approvals",
              value: pending.length,
              icon: Shield,
            },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4 py-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-brand-100 text-brand-600">
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-ink">{stat.value}</p>
                  <p className="text-sm text-muted">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-ink">Enrollment trend</h3>
              <div className="mt-4 h-[220px] sm:h-[280px]">
                <EnrollmentTrendChart data={analytics.enrollmentTrend} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-ink">Top courses</h3>
              <div className="mt-4 h-[220px] sm:h-[280px]">
                <TopCoursesChart data={analytics.topCourses} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-ink">Users by role</h3>
              <div className="mt-4 h-[220px] sm:h-[280px]">
                <RoleDistributionChart data={analytics.usersByRole} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-bold text-ink">Courses by status</h3>
              <div className="mt-4 h-[220px] sm:h-[280px]">
                <CourseStatusChart data={analytics.coursesByStatus} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (session.role === "INSTRUCTOR") {
    const [courses, analytics] = await Promise.all([
      getInstructorCourses(session.id),
      getInstructorAnalytics(session.id),
    ]);

    return (
      <div>
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-ink">Instructor dashboard</h1>
                <p className="mt-2 text-muted">
                  {analytics.totalStudents} students · {analytics.avgProgress}% avg progress
                </p>
              </div>
              <Link href="/instructor/courses/new">
                <Button>
                  <Plus className="h-4 w-4" />
                  Create course
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {analytics.courses.length > 0 && (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h3 className="font-bold text-ink">Course performance</h3>
                <div className="mt-4 space-y-4">
                  {analytics.courses.map((c) => (
                    <div key={c.id}>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-ink">{c.title}</span>
                        <span className="text-muted">
                          {c.enrollments} students · {c.avgProgress}%
                        </span>
                      </div>
                      <ProgressBar value={c.avgProgress} className="mt-1" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {courses.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <BookOpen className="mx-auto h-14 w-14 text-slate-300" />
                <h3 className="mt-4 text-xl font-bold text-ink">No courses yet</h3>
                <Link href="/instructor/courses/new" className="mt-8 inline-block">
                  <Button size="lg">Create your first course</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  title={course.title}
                  description={course.description}
                  instructorName={session.name}
                  lessonCount={countLessons(course.modules)}
                  published={course.published}
                  href={`/instructor/courses/${course.id}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  const [enrollments, recommendations, certificates] = await Promise.all([
    getStudentEnrollments(session.id),
    getRecommendedCourses(session.id),
    db.certificate.findMany({
      where: { userId: session.id },
      include: { course: { select: { title: true } } },
    }),
  ]);

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
    <div>
      <section className="border-b border-slate-200 bg-gradient-to-r from-brand-600 to-brand-700 text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">
                Welcome back, {session.name.split(" ")[0]}
              </h1>
              <p className="mt-2 text-brand-100">
                {user?.points ?? 0} points · {user?.userBadges.length ?? 0} badges ·{" "}
                {certificates.length} certificates
              </p>
            </div>
            <Link href="/leaderboard">
              <Button variant="accent" className="bg-white/10 text-white hover:bg-white/20">
                View leaderboard
              </Button>
            </Link>
          </div>
          {enrollments.length > 0 && (
            <div className="mt-6 max-w-md">
              <div className="mb-2 flex justify-between text-sm text-brand-100">
                <span>Overall progress</span>
                <span>{avgProgress}%</span>
              </div>
              <ProgressBar value={avgProgress} className="bg-brand-500/30 [&>div]:bg-white" />
            </div>
          )}
          {user && user.userBadges.length > 0 && (
            <div className="mt-4 flex gap-2">
              {user.userBadges.map((ub) => (
                <span
                  key={ub.badge.id}
                  title={ub.badge.name}
                  className="rounded-sm bg-white/10 px-2 py-1 text-sm"
                >
                  {ub.badge.icon} {ub.badge.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {certificates.length > 0 && (
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
        )}

        <SectionHeader
          title="My courses"
          action={
            <Link href="/courses">
              <Button variant="outline">Explore courses</Button>
            </Link>
          }
        />

        {enrollments.length === 0 ? (
          <Card className="mt-8">
            <CardContent className="py-16 text-center">
              <BookOpen className="mx-auto h-14 w-14 text-slate-300" />
              <h3 className="mt-4 text-xl font-bold text-ink">No courses yet</h3>
              <Link href="/courses" className="mt-8 inline-block">
                <Button size="lg">Browse courses</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {enrollments.map((e) => (
              <CourseCard
                key={e.id}
                id={e.course.id}
                title={e.course.title}
                description={e.course.description}
                instructorName={e.course.instructor.name}
                lessonCount={e.lessonCount}
                enrolled
                progress={e.progress}
              />
            ))}
          </div>
        )}

        <Recommendations courses={recommendations} />
      </div>
    </div>
  );
}
