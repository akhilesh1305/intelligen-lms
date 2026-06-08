import { requireAuth } from "@/lib/auth";
import { getPendingCourses } from "@/lib/courses";
import { SectionHeader } from "@/components/ui/section-header";
import { ApprovalActions } from "./approval-actions";

export default async function ApprovalsPage() {
  await requireAuth(["ADMIN"]);
  const courses = await getPendingCourses();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        title="Course approvals"
        description="Review and approve instructor-submitted courses"
      />

      {courses.length === 0 ? (
        <p className="mt-12 text-center text-muted">No courses pending approval.</p>
      ) : (
        <div className="mt-8 space-y-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="rounded-sm border border-slate-200 bg-white p-6 shadow-card"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-ink">{course.title}</h3>
                  <p className="mt-1 text-sm text-muted">
                    By {course.instructor.name} ·{" "}
                    {course.modules.reduce((s, m) => s + m._count.lessons, 0)} lessons
                  </p>
                  <p className="mt-3 text-sm text-ink/80 line-clamp-3">
                    {course.description}
                  </p>
                </div>
                <ApprovalActions courseId={course.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
