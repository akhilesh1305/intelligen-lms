import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Lock,
  PlayCircle,
} from "lucide-react";
import { getSession } from "@/lib/auth";
import { formatSkillLevel } from "@/lib/skills";
import {
  ensurePathEnrollment,
  getPathBySlug,
  getPathProgress,
} from "@/lib/learning-paths";
import { getPrerequisiteStatus } from "@/lib/prerequisites";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StartPathButton } from "./start-path-button";

export default async function LearningPathDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getSession();
  const path = await getPathBySlug(slug);

  if (!path || !path.published) notFound();

  const progress = session
    ? await getPathProgress(session.id, path.id)
    : null;

  if (session) {
    await ensurePathEnrollment(session.id, path.id);
  }

  const courseStatuses = session
    ? await Promise.all(
        path.pathCourses.map(async (pc) => {
          const prereq = await getPrerequisiteStatus(session.id, pc.course.id);
          const enrollment = await db.enrollment.findUnique({
            where: {
              userId_courseId: {
                userId: session.id,
                courseId: pc.course.id,
              },
            },
          });
          const completed =
            enrollment?.completedAt !== null ||
            (enrollment?.progressPercent ?? 0) >= 100;
          return {
            courseId: pc.course.id,
            completed,
            enrolled: Boolean(enrollment),
            prereqMet: prereq.met,
            prereqTitle: prereq.prerequisite?.title,
          };
        })
      )
    : [];

  const statusMap = new Map(courseStatuses.map((s) => [s.courseId, s]));

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/paths"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        All learning paths
      </Link>

      <div className="mt-6">
        <span className="text-5xl">{path.icon}</span>
        <h1 className="mt-4 text-3xl font-bold text-ink">{path.name}</h1>
        <p className="mt-3 text-lg text-muted">{path.description}</p>
      </div>

      {progress && progress.total > 0 ? (
        <Card className="mt-8">
          <CardContent className="py-5">
            <div className="mb-2 flex justify-between text-sm font-semibold">
              <span className="text-muted">Your path progress</span>
              <span className="text-brand-600">
                {progress.completed}/{progress.total} courses
              </span>
            </div>
            <ProgressBar value={progress.percent} />
          </CardContent>
        </Card>
      ) : null}

      {!session ? (
        <Card className="mt-8 border-brand-200 bg-brand-50 dark:border-brand-800 dark:bg-brand-500/10">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 py-5">
            <p className="text-sm text-brand-800 dark:text-brand-200">
              Log in to track your progress on this learning path.
            </p>
            <Link href="/login">
              <Button size="sm">Log in</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-6">
          <StartPathButton slug={path.slug} />
        </div>
      )}

      <section className="mt-10">
        <h2 className="text-xl font-bold text-ink">Courses in this path</h2>
        <p className="mt-1 text-sm text-muted">
          Complete courses in order. Prerequisites must be finished before enrolling.
        </p>

        <ol className="mt-6 space-y-4">
          {path.pathCourses.map((pc, index) => {
            const course = pc.course;
            const lessonCount = course.modules.reduce(
              (sum, m) => sum + m._count.lessons,
              0
            );
            const status = statusMap.get(course.id);
            const locked = status && !status.prereqMet && !status.enrolled;
            const completed = status?.completed;

            return (
              <li key={pc.id}>
                <Card className={locked ? "opacity-75" : undefined}>
                  <CardContent className="flex flex-wrap items-center gap-4 py-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700 dark:bg-brand-500/20 dark:text-brand-300">
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-ink">{course.title}</h3>
                        <Badge>{formatSkillLevel(course.skillLevel)}</Badge>
                        {completed ? (
                          <Badge variant="success">Completed</Badge>
                        ) : status?.enrolled ? (
                          <Badge variant="info">In progress</Badge>
                        ) : null}
                      </div>
                      <p className="mt-1 text-sm text-muted">
                        {lessonCount} lessons · {course.instructor.name}
                      </p>
                      {course.prerequisiteCourse ? (
                        <p className="mt-1 text-xs text-muted">
                          Prerequisite: {course.prerequisiteCourse.title}
                        </p>
                      ) : null}
                      {locked && status?.prereqTitle ? (
                        <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
                          <Lock className="h-3.5 w-3.5" />
                          Complete &quot;{status.prereqTitle}&quot; first
                        </p>
                      ) : null}
                    </div>
                    {locked ? (
                      <Button variant="outline" size="sm" disabled>
                        Locked
                      </Button>
                    ) : (
                      <Link href={`/courses/${course.id}`}>
                        <Button size="sm" variant={completed ? "outline" : "primary"}>
                          {completed ? (
                            <>
                              <CheckCircle2 className="h-4 w-4" />
                              Review
                            </>
                          ) : status?.enrolled ? (
                            <>
                              <PlayCircle className="h-4 w-4" />
                              Continue
                            </>
                          ) : (
                            "View course"
                          )}
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
