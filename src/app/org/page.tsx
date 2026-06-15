import Link from "next/link";
import { redirect } from "next/navigation";
import { Building2, LayoutDashboard, Shield } from "lucide-react";
import { requireAuth } from "@/lib/auth";
import {
  getAccessibleOrganizations,
  getOrgAdminMemberships,
} from "@/lib/org-admin";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Badge } from "@/components/ui/badge";
import {
  DashboardFade,
  DashboardShell,
} from "@/components/dashboard/dashboard-motion";

export default async function OrgHubPage() {
  const session = await requireAuth();
  const isPlatformAdmin = session.role === "ADMIN";

  if (!isPlatformAdmin) {
    const memberships = await getOrgAdminMemberships(session.id);
    if (memberships.length === 0) {
      redirect("/dashboard");
    }
    redirect(`/org/${memberships[0].organization.slug}`);
  }

  const organizations = await getAccessibleOrganizations(session);

  return (
    <DashboardShell>
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <DashboardFade>
      <SectionHeader
        title="Organization analytics"
        description="Select a company to view its private analytics, users, and member data separately."
        action={
          <Badge variant="brand">
            <Shield className="mr-1 h-3 w-3" />
            Platform admin
          </Badge>
        }
      />
      </DashboardFade>
      <div className="mt-8 space-y-3">
        {organizations.length === 0 ? (
          <DashboardFade delay={100}>
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted">
              <Shield className="mx-auto h-8 w-8 text-muted" />
              <p className="mt-3">
                No organizations yet. Create one from the admin panel.
              </p>
              <Link
                href="/admin/organizations"
                className="mt-4 inline-block font-semibold text-brand-600 hover:underline"
              >
                Manage organizations →
              </Link>
            </CardContent>
          </Card>
          </DashboardFade>
        ) : (
          organizations.map((org, index) => (
            <DashboardFade key={org.id} delay={80 + index * 70} animation="slide-right">
            <Link href={`/org/${org.slug}`}>
              <Card className="transition-all duration-300 motion-safe:hover:-translate-y-0.5 motion-safe:hover:border-brand-400/40 motion-safe:hover:shadow-card-hover">
                <CardContent className="flex items-center gap-3 py-4">
                  <Building2 className="h-5 w-5 text-brand-600" />
                  <div className="flex-1">
                    <span className="font-semibold text-ink">{org.name}</span>
                    <p className="text-xs text-muted">
                      /{org.slug} · Analytics & member management
                    </p>
                  </div>
                  <LayoutDashboard className="h-4 w-4 text-muted" />
                </CardContent>
              </Card>
            </Link>
            </DashboardFade>
          ))
        )}
      </div>
    </div>
    </DashboardShell>
  );
}
