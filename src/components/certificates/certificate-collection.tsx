"use client";

import { useMemo, useState } from "react";
import { Award, Lock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { CertificateCard } from "@/components/certificates/certificate-card";
import { CertificateProgressTracker } from "@/components/certificates/certificate-progress-tracker";
import type { CertificateHubData } from "@/lib/certificate-hub";
import type { CertificateTemplateId } from "@/lib/certificate-templates";
import { cn } from "@/lib/utils";

type FilterTab = "all" | "earned" | "locked";
type TemplateFilter = "all" | CertificateTemplateId;

type SerializedHub = {
  earned: Array<{
    id: string;
    certificateNo: string;
    issuedAt: string;
    courseId: string;
    courseTitle: string;
    skillLevel: string;
    template: CertificateTemplateId;
    organizationName: string | null;
  }>;
  locked: Array<{
    courseId: string;
    courseTitle: string;
    description: string;
    progressPercent: number;
    template: CertificateTemplateId;
    requirements: CertificateHubData["locked"][0]["requirements"];
    remainingSummary: string[];
    estimatedCompletionLabel: string | null;
  }>;
  stats: CertificateHubData["stats"];
};

const TEMPLATE_FILTERS: { id: TemplateFilter; label: string }[] = [
  { id: "all", label: "All templates" },
  { id: "classic", label: "Classic" },
  { id: "corporate", label: "Corporate" },
  { id: "ai-professional", label: "AI Professional" },
  { id: "technical-expert", label: "Technical Expert" },
];

export function CertificateCollection({ hub }: { hub: SerializedHub }) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<FilterTab>("all");
  const [templateFilter, setTemplateFilter] = useState<TemplateFilter>("all");

  const normalizedQuery = query.trim().toLowerCase();

  const filteredEarned = useMemo(() => {
    return hub.earned.filter((item) => {
      if (templateFilter !== "all" && item.template !== templateFilter) return false;
      if (!normalizedQuery) return true;
      return (
        item.courseTitle.toLowerCase().includes(normalizedQuery) ||
        item.certificateNo.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [hub.earned, normalizedQuery, templateFilter]);

  const filteredLocked = useMemo(() => {
    return hub.locked.filter((item) => {
      if (templateFilter !== "all" && item.template !== templateFilter) return false;
      if (!normalizedQuery) return true;
      return item.courseTitle.toLowerCase().includes(normalizedQuery);
    });
  }, [hub.locked, normalizedQuery, templateFilter]);

  const showEarned = tab === "all" || tab === "earned";
  const showLocked = tab === "all" || tab === "locked";
  const isHubEmpty = hub.earned.length === 0 && hub.locked.length === 0;

  return (
    <div className="space-y-10">
      <div className="glass-card rounded-[20px] p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by course or certificate ID…"
              className="pl-10"
              aria-label="Search certificates"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {(["all", "earned", "locked"] as const).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-2",
                  tab === id
                    ? "bg-brand-600 text-white"
                    : "border border-border bg-panel text-muted hover:text-ink"
                )}
              >
                {id}
                <span className="ml-1 opacity-70">
                  ({id === "all" ? hub.stats.earnedCount + hub.stats.lockedCount : id === "earned" ? hub.stats.earnedCount : hub.stats.lockedCount})
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {TEMPLATE_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setTemplateFilter(f.id)}
              className={cn(
                "rounded-[10px] px-3 py-1 text-[11px] font-semibold transition-colors",
                templateFilter === f.id
                  ? "bg-violet-600 text-white"
                  : "border border-border/80 text-muted hover:text-ink"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {isHubEmpty ? (
        <EmptyState
          icon={Award}
          title="No certificates yet"
          description="Complete a course to earn verified, shareable credentials."
          action={{ label: "Browse courses", href: "/courses" }}
          secondaryAction={{ label: "View demo certificates", href: "/certificates/demo" }}
        />
      ) : (
        <>
      <CertificateProgressTracker items={hub.locked} />

      {showEarned ? (
        <section>
          <h2 className="text-lg font-bold text-ink">
            Earned certificates
            <span className="ml-2 text-sm font-medium text-muted">({filteredEarned.length})</span>
          </h2>
          {filteredEarned.length === 0 ? (
            <EmptyState
              size="compact"
              icon={Award}
              title={hub.earned.length === 0 ? "No earned certificates yet" : "No matches found"}
              description={
                hub.earned.length === 0
                  ? "Finish a course to unlock your first certificate."
                  : "Try a different search term or template filter."
              }
              action={
                hub.earned.length === 0
                  ? { label: "Browse courses", href: "/courses" }
                  : undefined
              }
              className="mt-5"
            />
          ) : (
            <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredEarned.map((item) => (
                <CertificateCard
                  key={item.id}
                  variant="earned"
                  id={item.id}
                  courseTitle={item.courseTitle}
                  certificateNo={item.certificateNo}
                  issuedAt={item.issuedAt}
                  template={item.template}
                  organizationName={item.organizationName}
                />
              ))}
            </div>
          )}
        </section>
      ) : null}

      {showLocked ? (
        <section>
          <h2 className="text-lg font-bold text-ink">
            Locked certificates
            <span className="ml-2 text-sm font-medium text-muted">({filteredLocked.length})</span>
          </h2>
          <p className="mt-1 text-sm text-muted">
            Complete these courses to unlock verified credentials
          </p>
          {filteredLocked.length === 0 ? (
            <EmptyState
              size="compact"
              icon={Lock}
              title="No locked certificates match"
              description="Adjust your filters or enroll in more courses to unlock credentials."
              action={{ label: "Explore courses", href: "/courses" }}
              className="mt-5"
            />
          ) : (
            <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredLocked.map((item) => (
                <CertificateCard
                  key={item.courseId}
                  variant="locked"
                  courseId={item.courseId}
                  courseTitle={item.courseTitle}
                  progressPercent={item.progressPercent}
                  template={item.template}
                  remainingSummary={item.remainingSummary}
                />
              ))}
            </div>
          )}
        </section>
      ) : null}
        </>
      )}
    </div>
  );
}
