import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";
import { requireAuth } from "@/lib/auth";
import { getOrganizationsForAdmin } from "@/lib/organizations";
import {
  getOrganizationLifecycle,
  getOrganizationLifecycleLabel,
} from "@/lib/organization-lifecycle";
import { CreateOrganizationForm } from "@/components/admin/create-organization-form";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Badge } from "@/components/ui/badge";

export default async function AdminOrganizationsPage() {
  await requireAuth(["ADMIN"]);
  const organizations = await getOrganizationsForAdmin();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <div className="mt-4">
        <SectionHeader
          title="Corporate organizations"
          description="Create companies, add members, and manage private course access"
        />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <h2 className="font-bold text-ink">New organization</h2>
            <p className="mt-1 text-sm text-muted">
              Org courses are hidden from public users and only visible to members.
            </p>
            <div className="mt-4">
              <CreateOrganizationForm />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="font-bold text-ink">How it works</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>· Set up the company and its first org admin in one step</li>
              <li>· Add more members by email or set allowed domains for auto-join</li>
              <li>· Assign ORG_INSTRUCTOR to create private org courses</li>
              <li>· Org courses use ORGANIZATION visibility — never public</li>
              <li>· Uncheck public courses to show only company content</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10 space-y-3">
        <h2 className="text-lg font-bold text-ink">Organizations</h2>
        {organizations.length === 0 ? (
          <p className="text-sm text-muted">No organizations yet.</p>
        ) : (
          organizations.map((org) => {
            const lifecycle = getOrganizationLifecycle(org);
            const lifecycleVariant =
              lifecycle === "active"
                ? "success"
                : lifecycle === "pending"
                  ? "info"
                  : lifecycle === "expired"
                    ? "warning"
                    : "danger";

            return (
            <Link key={org.id} href={`/admin/organizations/${org.id}`}>
              <Card className="transition-colors hover:border-brand-400/40">
                <CardContent className="flex items-center justify-between gap-4 py-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-brand-600" />
                    <div>
                      <p className="font-semibold text-ink">{org.name}</p>
                      <p className="text-sm text-muted">/{org.slug}</p>
                      <div className="mt-1">
                        <Badge variant={lifecycleVariant}>
                          {getOrganizationLifecycleLabel(lifecycle)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted">
                    <p>{org._count.members} members</p>
                    <p>{org._count.courses} private courses</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
