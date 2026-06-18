import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, CheckCircle, Circle, MessageSquare } from "lucide-react";
import { ensureEnrollment, getCourseAccess } from "@/lib/access";
import { requireAuth } from "@/lib/auth";
import { getCourseWithContent } from "@/lib/courses";
import { canUserViewCourse } from "@/lib/organizations";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import { getCourseProgressDetails } from "@/lib/progress";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ProgressTracker } from "@/components/courses/progress-tracker";
import { QuizTaker } from "@/components/courses/quiz-taker";
import { AssignmentForm } from "@/components/courses/assignment-form";
import { LessonVideo } from "@/components/courses/lesson-video";
import { CompleteLessonButton } from "./complete-button";
import { LessonAiTools } from "@/components/ai/lesson-ai-tools";
import { LearnLessonSidebar } from "@/components/learn/learn-lesson-sidebar";

export default async function LearnPage({
  params,
  searchParams,
}: {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{ lesson?: string; tab?: string }>;
}) {
  const session = await requireAuth();
  const { courseId } = await params;
  const { lesson: lessonId, tab } = await searchParams;

  const course = await getCourseWithContent(courseId);
  if (!course) notFound();

  const mayView = await canUserViewCourse(
    { id: session.id, role: session.role },
    course
  );
  if (!mayView && session.role !== "ADMIN" && course.instructorId !== session.id) {
    notFound();
  }

  const access = await getCourseAccess(session.id, courseId, session.role);
  if (!access.canLearn && session.role === "STUDENT") {
    redirect(`/courses/${courseId}`);
  }

  if (access.canLearn) {
    await ensureEnrollment(session.id, courseId);
  }

  const progressDetails = await getCourseProgressDetails(session.id, courseId);
  if (!progressDetails) notFound();

  const allLessons = course.modules.flatMap((m) => m.lessons);
  const progressRecords = await db.lessonProgress.findMany({
    where: { userId: session.id, lessonId: { in: allLessons.map((l) => l.id) } },
  });
  const completedSet = new Set(
    progressRecords.filter((p) => p.completed).map((p) => p.lessonId)
  );

  const quizAttempts = await db.quizAttempt.findMany({
    where: { userId: session.id, quizId: { in: course.quizzes.map((q) => q.id) } },
  });
  const attemptMap = new Map(quizAttempts.map((a) => [a.quizId, a]));

  const submissions = await db.assignmentSubmission.findMany({
    where: {
      userId: session.id,
      assignmentId: { in: course.assignments.map((a) => a.id) },
    },
  });
  const submissionMap = new Map(submissions.map((s) => [s.assignmentId, s]));

  const certificate = await db.certificate.findUnique({
    where: { userId_courseId: { userId: session.id, courseId } },
  });

  const activeLesson = allLessons.find((l) => l.id === lessonId) ?? allLessons[0];
  const activeTab = tab ?? "lessons";

  return (
    <div className="min-h-screen bg-surface">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">My Learning</span>
              <span className="sm:hidden">Back</span>
            </Link>
            <p className="min-w-0 flex-1 truncate text-sm font-medium text-ink sm:text-base">
              {course.title}
            </p>
            <div className="flex w-full items-center gap-3 sm:ml-auto sm:w-auto">
              <Link
                href={`/courses/${courseId}/forum`}
                className="touch-target flex items-center justify-center text-muted hover:text-brand-600"
                aria-label="Course forum"
              >
                <MessageSquare className="h-5 w-5" />
              </Link>
              <span className="text-sm font-semibold text-brand-600">
                {progressDetails.percent}%
              </span>
              <ProgressBar
                value={progressDetails.percent}
                className="min-w-0 flex-1 sm:w-32 sm:flex-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row">
        <aside className="w-full shrink-0 border-b border-slate-200 bg-white lg:w-72 lg:border-b-0 lg:border-r">
          <div className="p-4">
            <nav className="scrollbar-hide -mx-4 flex gap-1 overflow-x-auto border-b border-slate-100 px-4 pb-3">
              {[
                { key: "lessons", label: "Lessons" },
                { key: "quizzes", label: "Quizzes" },
                { key: "assignments", label: "Tasks" },
                { key: "progress", label: "Progress" },
              ].map((t) => (
                <Link
                  key={t.key}
                  href={`/learn/${courseId}?tab=${t.key}${lessonId ? `&lesson=${lessonId}` : ""}`}
                  className={cn(
                    "shrink-0 rounded-sm px-3 py-2 text-xs font-semibold sm:text-sm",
                    activeTab === t.key
                      ? "bg-brand-50 text-brand-700"
                      : "text-muted hover:bg-slate-50"
                  )}
                >
                  {t.label}
                </Link>
              ))}
            </nav>

            {activeTab === "lessons" && (
              <LearnLessonSidebar lessonCount={allLessons.length}>
              <nav className="mt-4 max-h-[50vh] space-y-4 overflow-y-auto lg:mt-4 lg:max-h-[70vh]">
                {course.modules.map((mod) => (
                  <div key={mod.id}>
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">
                      {mod.title}
                    </p>
                    <ul className="space-y-0.5">
                      {mod.lessons.map((lesson) => {
                        const done = completedSet.has(lesson.id);
                        const active = activeLesson?.id === lesson.id;
                        return (
                          <li key={lesson.id}>
                            <Link
                              href={`/learn/${courseId}?lesson=${lesson.id}&tab=lessons`}
                              className={cn(
                                "flex min-h-11 items-center gap-2 rounded-sm px-3 py-2.5 text-sm",
                                active
                                  ? "bg-brand-50 font-semibold text-brand-700"
                                  : "text-muted hover:bg-slate-50"
                              )}
                            >
                              {done ? (
                                <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
                              ) : (
                                <Circle className="h-4 w-4 shrink-0 text-slate-300" />
                              )}
                              <span className="line-clamp-2">{lesson.title}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </nav>
              </LearnLessonSidebar>
            )}
          </div>
        </aside>

        <div className="min-w-0 flex-1 p-4 sm:p-6 lg:p-10">
          {activeTab === "lessons" && activeLesson && (
            <article className="mx-auto max-w-3xl">
              <h1 className="text-xl font-bold text-ink sm:text-2xl">{activeLesson.title}</h1>
              {activeLesson.videoUrl ? (
                <div className="mt-6 aspect-video overflow-hidden rounded-sm bg-ink shadow-elevated">
                  <LessonVideo
                    videoUrl={activeLesson.videoUrl}
                    title={activeLesson.title}
                  />
                </div>
              ) : null}
              <div
                className={`rounded-sm border border-slate-200 bg-white p-6 shadow-card ${activeLesson.videoUrl ? "mt-8" : "mt-6"}`}
              >
                <div className="whitespace-pre-wrap leading-relaxed text-ink/90">
                  {activeLesson.content}
                </div>
              </div>
              <LessonAiTools
                lessonId={activeLesson.id}
                lessonTitle={activeLesson.title}
                content={activeLesson.content}
              />
              <div className="mt-6">
                <CompleteLessonButton
                  key={activeLesson.id}
                  lessonId={activeLesson.id}
                  completed={completedSet.has(activeLesson.id)}
                />
              </div>
            </article>
          )}

          {activeTab === "quizzes" && (
            <div className="mx-auto max-w-3xl space-y-6">
              {course.quizzes.length === 0 ? (
                <p className="text-muted">No quizzes for this course.</p>
              ) : (
                course.quizzes.map((quiz) => {
                  const attempt = attemptMap.get(quiz.id);
                  return (
                    <QuizTaker
                      key={quiz.id}
                      quizId={quiz.id}
                      title={quiz.title}
                      passingScore={quiz.passingScore}
                      questions={quiz.questions.map((q) => ({
                        ...q,
                        options: JSON.parse(q.options) as string[],
                      }))}
                      previousScore={attempt?.score}
                      passed={attempt?.passed}
                    />
                  );
                })
              )}
            </div>
          )}

          {activeTab === "assignments" && (
            <div className="mx-auto max-w-3xl space-y-6">
              {course.assignments.length === 0 ? (
                <p className="text-muted">No assignments for this course.</p>
              ) : (
                course.assignments.map((a) => {
                  const sub = submissionMap.get(a.id);
                  return (
                    <AssignmentForm
                      key={a.id}
                      assignmentId={a.id}
                      title={a.title}
                      description={a.description}
                      submitted={Boolean(sub)}
                      grade={sub?.grade}
                      feedback={sub?.feedback}
                    />
                  );
                })
              )}
            </div>
          )}

          {activeTab === "progress" && (
            <div className="mx-auto max-w-md space-y-6">
              <ProgressTracker progress={progressDetails} />
              {certificate && (
                <Link
                  href={`/certificates/${certificate.id}`}
                  className="block rounded-sm border border-brand-200 bg-brand-50 p-5 text-center font-semibold text-brand-700 hover:bg-brand-100"
                >
                  View your certificate →
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
