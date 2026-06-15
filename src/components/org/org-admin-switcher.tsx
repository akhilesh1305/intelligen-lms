"use client";

import { usePathname, useRouter } from "next/navigation";
import { Building2 } from "lucide-react";
import type { AccessibleOrg } from "@/lib/org-admin";
import { cn } from "@/lib/utils";

export function OrgAdminSwitcher({
  organizations,
  currentSlug,
  isPlatformAdmin,
}: {
  organizations: AccessibleOrg[];
  currentSlug: string;
  isPlatformAdmin?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();

  if (organizations.length <= 1) return null;

  const basePath = `/org/${currentSlug}`;
  const suffix = pathname.startsWith(basePath)
    ? pathname.slice(basePath.length)
    : "";

  return (
    <div className="rounded-xl border border-border bg-surface/60 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-ink">
            <Building2 className="h-4 w-4 text-brand-600 dark:text-brand-400" />
            {isPlatformAdmin ? "Switch organization" : "Your organizations"}
          </p>
          <p className="mt-1 text-xs text-muted">
            {isPlatformAdmin
              ? "View each company’s analytics and member data separately."
              : "Select a company workspace to manage."}
          </p>
        </div>
        <label className="w-full sm:w-auto sm:min-w-[240px]">
          <span className="sr-only">Select organization</span>
          <select
            value={currentSlug}
            onChange={(e) => router.push(`/org/${e.target.value}${suffix}`)}
            className={cn(
              "h-11 w-full rounded-lg border border-border bg-panel px-3 text-sm font-medium text-ink",
              "focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            )}
          >
            {organizations.map((org) => (
              <option key={org.id} value={org.slug}>
                {org.name}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
