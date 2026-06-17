"use client";

import { usePathname } from "next/navigation";
import type { AccessibleOrg } from "@/lib/org-admin";
import { OrgAdminToolbar } from "@/components/org/org-admin-toolbar";

export function OrgAdminToolbarShell({
  slug,
  organizations,
  isPlatformAdmin,
}: {
  slug: string;
  organizations: AccessibleOrg[];
  isPlatformAdmin: boolean;
}) {
  const pathname = usePathname();

  const active = pathname.endsWith("/settings")
    ? "settings"
    : pathname.endsWith("/members")
      ? "members"
      : pathname.endsWith("/users")
        ? "users"
        : "dashboard";

  return (
    <OrgAdminToolbar
      organizations={organizations}
      currentSlug={slug}
      active={active}
      isPlatformAdmin={isPlatformAdmin}
    />
  );
}
