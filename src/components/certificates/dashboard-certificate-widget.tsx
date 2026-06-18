import Link from "next/link";
import { Award, ChevronRight, Lock, Sparkles } from "lucide-react";
import { CERTIFICATE_TEMPLATES } from "@/lib/certificate-templates";
import type { CertificateHubData } from "@/lib/certificate-hub";
import { cn, formatDate } from "@/lib/utils";

export function DashboardCertificateWidget({
  hub,
  className,
}: {
  hub: Pick<CertificateHubData, "stats" | "latestEarned" | "upcoming">;
  className?: string;
}) {
  const { stats, latestEarned, upcoming } = hub;

  return (
    <section
      className={cn(
        "glass-card overflow-hidden rounded-[20px] border border-brand-500/15 bg-gradient-to-br from-brand-50/50 via-panel to-violet-50/30 p-6 dark:from-brand-950/20 dark:via-panel dark:to-violet-950/15",
        className
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-sm">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-ink">Certificates</h2>
            <p className="text-sm text-muted">Your credentials and next milestones</p>
          </div>
        </div>
        <Link
          href="/certificates"
          className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
        >
          View collection
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-[14px] border border-border/70 bg-panel/60 p-4 backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Earned</p>
          <p className="mt-1 text-3xl font-bold text-ink">{stats.earnedCount}</p>
        </div>

        <div className="rounded-[14px] border border-border/70 bg-panel/60 p-4 backdrop-blur-sm sm:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            Latest certificate
          </p>
          {latestEarned ? (
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-semibold text-ink">{latestEarned.courseTitle}</p>
                <p className="text-xs text-muted">
                  {formatDate(latestEarned.issuedAt)} ·{" "}
                  {CERTIFICATE_TEMPLATES[latestEarned.template].label}
                </p>
              </div>
              <Link
                href={`/certificates/${latestEarned.id}`}
                className="shrink-0 rounded-[10px] bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700"
              >
                Open
              </Link>
            </div>
          ) : (
            <p className="mt-2 text-sm text-muted">Complete a course to earn your first certificate</p>
          )}
        </div>
      </div>

      <div className="mt-4 rounded-[14px] border border-dashed border-border/80 bg-panel/40 p-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
          <Sparkles className="h-3.5 w-3.5" />
          Upcoming certificate
        </div>
        {upcoming ? (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-semibold text-ink">{upcoming.courseTitle}</p>
              <p className="text-xs text-muted">
                {upcoming.progressPercent}% complete
                {upcoming.estimatedCompletionLabel
                  ? ` · ${upcoming.estimatedCompletionLabel}`
                  : ""}
              </p>
            </div>
            <Link
              href={`/courses/${upcoming.courseId}`}
              className="inline-flex items-center gap-1.5 rounded-[10px] border border-brand-300 px-3 py-1.5 text-xs font-semibold text-brand-700 dark:border-brand-800 dark:text-brand-300"
            >
              <Lock className="h-3.5 w-3.5" />
              Continue
            </Link>
          </div>
        ) : stats.earnedCount > 0 ? (
          <p className="mt-2 text-sm text-muted">All enrolled courses completed — great work!</p>
        ) : (
          <p className="mt-2 text-sm text-muted">
            {stats.lockedCount} credential{stats.lockedCount === 1 ? "" : "s"} available to unlock
          </p>
        )}
      </div>
    </section>
  );
}
