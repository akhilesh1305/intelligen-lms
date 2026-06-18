"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
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
                  "rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition-colors",
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

      <CertificateProgressTracker items={hub.locked} />

      {showEarned ? (
        <section>
          <h2 className="text-lg font-bold text-ink">
            Earned certificates
            <span className="ml-2 text-sm font-medium text-muted">({filteredEarned.length})</span>
          </h2>
          {filteredEarned.length === 0 ? (
            <p className="mt-4 text-sm text-muted">No earned certificates match your filters.</p>
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
            <p className="mt-4 text-sm text-muted">No locked certificates match your filters.</p>
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
    </div>
  );
}
