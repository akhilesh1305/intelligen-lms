import type { Metadata } from "next";

import { requireOrganizationAdminBySlug } from "@/lib/org-admin";
import { OrgAdminToolbarShell } from "@/components/org/org-admin-toolbar-shell";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function OrgAdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { accessibleOrgs, isPlatformAdmin } =
    await requireOrganizationAdminBySlug(slug);

  return (
    <>
      <div className="sticky top-16 z-30 border-b border-border/80 bg-surface/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <OrgAdminToolbarShell
            slug={slug}
            organizations={accessibleOrgs}
            isPlatformAdmin={isPlatformAdmin}
          />
        </div>
      </div>
      {children}
    </>
  );
}
