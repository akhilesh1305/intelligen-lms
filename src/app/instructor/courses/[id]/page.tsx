import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  ClipboardList,
  Layers,
  PlayCircle,
  Plus,
} from "lucide-react";
import { requireAuth } from "@/lib/auth";
import { requireApprovedInstructorPage } from "@/lib/instructor";
import { getCourseWithContent } from "@/lib/courses";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CourseForm } from "../course-form";
import { ModuleForm } from "./module-form";
import { LessonForm } from "./lesson-form";
import { AiQuizGenerator } from "@/components/instructor/ai-quiz-generator";
import { AiCourseGenerator } from "@/components/instructor/ai-course-generator";

export default async function ManageCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireAuth(["INSTRUCTOR", "ADMIN"]);
  await requireApprovedInstructorPage(session);
  const { id } = await params;
  const course = await getCourseWithContent(id);

  if (!course || (course.instructorId !== session.id && session.role !== "ADMIN")) {
    notFound();
  }

  const statusBadge =
    course.status === "APPROVED"
      ? "success"
      : course.status === "PENDING_APPROVAL"
        ? "warning"
        : course.status === "REJECTED"
          ? "default"
          : "info";

  const totalLessons = course.modules.reduce((s, m) => s + m.lessons.length, 0);

  const prerequisiteOptions = await db.course.findMany({
    where: {
      published: true,
      status: "APPROVED",
      id: { not: course.id },
    },
    select: { id: true, title: true },
    orderBy: { title: "asc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-ink">{course.title}</h1>
        <Badge variant={statusBadge as "success" | "warning" | "info" | "default"}>
          {course.status.replace("_", " ")}
        </Badge>
      </div>

      {/* ── Course content FIRST (most important for instructors) ── */}
      <section className="mt-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold text-ink">
              <Layers className="h-5 w-5 text-brand-600" />
              Course content
            </h2>
            <p className="mt-1 text-sm text-muted">
              {course.modules.length} module{course.modules.length !== 1 ? "s" : ""} ·{" "}
              {totalLessons} lesson{totalLessons !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Step guide */}
        <div className="mt-4 rounded-sm border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-800">
          <strong>How to build your course:</strong>{" "}
          1. Add a module → 2. Add lessons inside each module → 3. Generate a quiz → 4. Submit for approval
        </div>

        {/* Add module */}
        <Card className="mt-6 border-2 border-dashed border-slate-300">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4 text-brand-600" />
              <span className="text-sm font-semibold text-ink">Add new module</span>
            </div>
            <p className="mt-1 text-xs text-muted">
              Modules group related lessons (e.g. &quot;Week 1&quot;, &quot;Basics&quot;)
            </p>
            <div className="mt-4">
              <ModuleForm courseId={course.id} nextOrder={course.modules.length + 1} />
            </div>
          </CardContent>
        </Card>

        {course.modules.length === 0 ? (
          <Card className="mt-6">
            <CardContent className="py-10 text-center">
              <Layers className="mx-auto h-12 w-12 text-slate-300" />
              <p className="mt-3 font-semibold text-ink">No modules yet</p>
              <p className="mt-1 text-sm text-muted">
                Use the form above to add your first module, then add lessons below it.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-6 space-y-6">
            {course.modules.map((mod, idx) => (
              <Card key={mod.id} className="overflow-hidden">
                <CardHeader className="border-b border-slate-100 bg-slate-50">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-sm bg-brand-600 text-xs font-bold text-white">
                      {idx + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold text-ink">{mod.title}</h3>
                      <p className="text-xs text-muted">
                        {mod.lessons.length} lesson{mod.lessons.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 pt-5">
                  {/* Lessons list */}
                  <div>
                    <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted">
                      <BookOpen className="h-3.5 w-3.5" />
                      Lessons
                    </p>

                    {mod.lessons.length > 0 ? (
                      <ul className="divide-y divide-slate-100 rounded-sm border border-slate-200 bg-white">
                        {mod.lessons.map((lesson, li) => (
                          <li
                            key={lesson.id}
                            className="flex items-center gap-3 px-4 py-3 text-sm"
                          >
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-muted">
                              {li + 1}
                            </span>
                            <span className="flex-1 text-ink">{lesson.title}</span>
                            {lesson.videoUrl ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">
                                <PlayCircle className="h-3 w-3" />
                                Video
                              </span>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="rounded-sm border border-dashed border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        No lessons in this module yet — add your first lesson below.
                      </div>
                    )}
                  </div>

                  {/* Add lesson — always visible */}
                  <LessonForm
                    moduleId={mod.id}
                    moduleTitle={mod.title}
                    lessonCount={mod.lessons.length}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* ── AI Course Generator ── */}
      <section className="mt-12">
        <AiCourseGenerator
          courseId={course.id}
          courseTitle={course.title}
          courseDescription={course.description}
        />
      </section>

      {/* ── AI Quiz Generator ── */}
      <section className="mt-8">
        <AiQuizGenerator
          courseId={course.id}
          modules={course.modules.map((m) => ({
            id: m.id,
            title: m.title,
            lessonCount: m.lessons.length,
          }))}
        />
      </section>

      {/* ── Existing quizzes ── */}
      {course.quizzes.length > 0 && (
        <section className="mt-8">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-ink">
            <ClipboardList className="h-5 w-5" />
            Course quizzes ({course.quizzes.length})
          </h2>
          <div className="mt-4 space-y-3">
            {course.quizzes.map((quiz) => (
              <Card key={quiz.id}>
                <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <div>
                    <p className="font-semibold text-ink">{quiz.title}</p>
                    <p className="text-sm text-muted">
                      {quiz.questions.length} questions · Pass: {quiz.passingScore}%
                    </p>
                  </div>
                  <Badge variant="brand">{quiz._count?.attempts ?? 0} attempts</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* ── Course settings ── */}
      <section className="mt-12">
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-ink">Course settings</h2>
            <p className="text-sm text-muted">Update title, description, and publish status</p>
          </CardHeader>
          <CardContent>
            <CourseForm
              course={{
                id: course.id,
                title: course.title,
                description: course.description,
                published: course.published,
                pricePaise: course.pricePaise,
                thumbnail: course.thumbnail,
                skillLevel: course.skillLevel,
                prerequisiteCourseId: course.prerequisiteCourseId,
              }}
              prerequisiteOptions={prerequisiteOptions}
            />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
