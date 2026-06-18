import Link from "next/link";
import { Calendar, Target } from "lucide-react";
import { CERTIFICATE_TEMPLATES } from "@/lib/certificate-templates";
import type { LockedCertificateItem } from "@/lib/certificate-hub";
import { cn } from "@/lib/utils";
import { ProgressBar } from "@/components/ui/progress-bar";

export function CertificateProgressTracker({
  items,
  className,
}: {
  items: LockedCertificateItem[];
  className?: string;
}) {
  const active = items.filter((i) => i.progressPercent > 0).slice(0, 3);

  if (active.length === 0) {
    return (
      <section className={cn("glass-card rounded-[20px] p-6", className)}>
        <h2 className="text-lg font-bold text-ink">Certificate progress</h2>
        <p className="mt-2 text-sm text-muted">
          Enroll in a course and complete all lessons, quizzes, and assignments to unlock
          your next credential.
        </p>
        <Link
          href="/courses"
          className="mt-4 inline-flex text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
        >
          Browse courses →
        </Link>
      </section>
    );
  }

  return (
    <section className={cn("glass-card rounded-[20px] p-6", className)}>
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 text-white">
          <Target className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-ink">Certificate progress</h2>
          <p className="mt-1 text-sm text-muted">
            Track requirements and estimated completion for in-progress credentials
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {active.map((item) => {
          const template = CERTIFICATE_TEMPLATES[item.template];
          return (
            <div
              key={item.courseId}
              className="rounded-[14px] border border-border/70 bg-panel/50 p-4 backdrop-blur-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-ink">{item.courseTitle}</p>
                  <p className="text-xs text-muted">{template.label} template</p>
                </div>
                <span className="text-lg font-bold text-brand-600 dark:text-brand-400">
                  {item.progressPercent}%
                </span>
              </div>

              <ProgressBar value={item.progressPercent} className="mt-3 h-2.5" />

              <div className="mt-4 grid gap-3 text-xs sm:grid-cols-3">
                <div>
                  <p className="font-semibold text-ink">Lessons</p>
                  <p className="text-muted">
                    {item.requirements.lessons.completed}/{item.requirements.lessons.total}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-ink">Quizzes</p>
                  <p className="text-muted">
                    {item.requirements.quizzes.passed}/{item.requirements.quizzes.total} passed
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-ink">Assignments</p>
                  <p className="text-muted">
                    {item.requirements.assignments.submitted}/
                    {item.requirements.assignments.total} submitted
                  </p>
                </div>
              </div>

              {item.remainingSummary.length > 0 ? (
                <ul className="mt-3 space-y-1 text-xs text-muted">
                  {item.remainingSummary.map((line) => (
                    <li key={line}>· {line}</li>
                  ))}
                </ul>
              ) : null}

              {item.estimatedCompletionLabel ? (
                <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-brand-700 dark:text-brand-300">
                  <Calendar className="h-3.5 w-3.5" />
                  {item.estimatedCompletionLabel}
                </p>
              ) : null}

              <Link
                href={`/courses/${item.courseId}`}
                className="mt-3 inline-flex text-xs font-semibold text-brand-600 hover:underline dark:text-brand-400"
              >
                Resume course
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
