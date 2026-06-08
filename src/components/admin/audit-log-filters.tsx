"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { AuditAction } from "@prisma/client";
import { AUDIT_ACTION_LABELS } from "@/lib/audit";

const FILTER_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "", label: "All actions" },
  ...Object.entries(AUDIT_ACTION_LABELS).map(([value, label]) => ({
    value,
    label,
  })),
];

export function AuditLogFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("action") ?? "";

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("action", value);
    } else {
      params.delete("action");
    }
    router.push(`/admin/audit-logs?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label htmlFor="audit-action-filter" className="text-sm font-semibold text-ink">
        Filter by action
      </label>
      <select
        id="audit-action-filter"
        value={current}
        onChange={(e) => handleChange(e.target.value)}
        className="h-10 rounded-sm border border-slate-300 bg-white px-3 text-sm text-ink focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
      >
        {FILTER_OPTIONS.map((option) => (
          <option key={option.value || "all"} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function isAuditAction(value: string): value is AuditAction {
  return value in AUDIT_ACTION_LABELS;
}
