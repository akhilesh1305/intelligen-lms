"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Building2, LayoutDashboard, Plus, ScrollText, Upload, Users } from "lucide-react";
import type { AccessibleOrg } from "@/lib/org-admin";
import { cn } from "@/lib/utils";

export function OrgAdminToolbar({
  organizations,
  currentSlug,
  active,
  isPlatformAdmin = false,
}: {
  organizations: AccessibleOrg[];
  currentSlug: string;
  active: "dashboard" | "users" | "members" | "settings";
  isPlatformAdmin?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const showFilter = isPlatformAdmin && organizations.length >= 1;

  const basePath = `/org/${currentSlug}`;
  const pathSuffix = pathname.startsWith(basePath)
    ? pathname.slice(basePath.length)
    : "";

  const navItems = [
    {
      id: "dashboard" as const,
      href: `/org/${currentSlug}`,
      label: "Analytics",
      icon: LayoutDashboard,
    },
    {
      id: "users" as const,
      href: `/org/${currentSlug}/users`,
      label: "All users",
      icon: Users,
    },
    {
      id: "members" as const,
      href: `/org/${currentSlug}/members`,
      label: "Mass upload",
      icon: Upload,
    },
    {
      id: "settings" as const,
      href: `/org/${currentSlug}/settings`,
      label: "Certificates",
      icon: ScrollText,
    },
  ];

  const currentOrg = organizations.find((o) => o.slug === currentSlug);

  return (
    <div className="space-y-2.5 border-b border-border pb-3">
      {showFilter ? (
        <div className="org-toolbar-bar rounded-lg p-px motion-safe:shadow-sm">
          <div
            className={cn(
              "flex flex-wrap items-center gap-2 rounded-[calc(0.5rem-1px)] px-2.5 py-1.5",
              "glass-panel bg-panel/95 dark:bg-panel/90"
            )}
          >
            <Building2
              className="h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400"
              aria-hidden
            />

            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 sm:flex-initial">
              <label className="sr-only" htmlFor="org-filter-select">
                Organization
              </label>
              <select
                id="org-filter-select"
                value={currentSlug}
                onChange={(e) =>
                  router.push(`/org/${e.target.value}${pathSuffix}`)
                }
                className={cn(
                  "h-9 min-w-0 max-w-full rounded-md border border-border bg-surface/80 px-2.5 text-sm font-medium text-ink",
                  "transition-colors duration-200 motion-safe:transition-shadow",
                  "focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20",
                  "sm:min-w-[160px] sm:max-w-[220px]"
                )}
              >
                {organizations.map((org) => (
                  <option key={org.id} value={org.slug}>
                    {org.name}
                  </option>
                ))}
              </select>

              {currentOrg ? (
                <span
                  key={currentSlug}
                  className={cn(
                    "inline-flex max-w-[140px] items-center truncate rounded-full",
                    "border border-brand-200/60 bg-brand-50/80 px-2 py-0.5",
                    "text-[11px] font-semibold text-brand-700",
                    "motion-safe:animate-org-toolbar-fade",
                    "dark:border-brand-800/50 dark:bg-brand-950/40 dark:text-brand-300",
                    "sm:max-w-[180px]"
                  )}
                  title={`Viewing ${currentOrg.name}`}
                >
                  {currentOrg.name}
                </span>
              ) : null}
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-1.5 sm:ml-auto">
              <Link
                href="/org"
                className={cn(
                  "inline-flex h-8 items-center justify-center rounded-md border border-border",
                  "bg-surface/80 px-2.5 text-xs font-semibold text-ink",
                  "transition-colors duration-200 motion-safe:hover:bg-surface",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30"
                )}
              >
                All orgs
              </Link>
              <Link
                href="/admin/organizations"
                className={cn(
                  "inline-flex h-8 items-center justify-center gap-1 rounded-md",
                  "bg-brand-600 px-2.5 text-xs font-semibold text-white",
                  "transition-colors duration-200 motion-safe:hover:bg-brand-700",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40"
                )}
              >
                <Plus className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Create org</span>
                <span className="sm:hidden">New</span>
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      <nav
        aria-label="Organization admin"
        className="-mx-1 overflow-x-auto px-1 pb-1"
      >
        <div className="flex min-w-max flex-wrap gap-0.5 sm:gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "group relative inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5",
                "text-sm font-semibold transition-colors duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30",
                isActive
                  ? "text-brand-700 dark:text-brand-300"
                  : "text-muted motion-safe:hover:bg-surface motion-safe:hover:text-ink"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-transform duration-200",
                  "motion-safe:group-hover:scale-105",
                  isActive
                    ? "text-brand-600 dark:text-brand-400"
                    : "text-muted group-hover:text-ink"
                )}
              />
              {item.label}
              {isActive ? (
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-x-2 -bottom-px h-0.5 origin-center rounded-full",
                    "bg-brand-600 dark:bg-brand-400",
                    "motion-safe:animate-org-tab-indicator"
                  )}
                />
              ) : null}
            </Link>
          );
        })}
        </div>
      </nav>
    </div>
  );
}
