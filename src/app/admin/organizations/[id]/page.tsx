import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Lock } from "lucide-react";
import { requireAuth } from "@/lib/auth";
import { getOrganizationById } from "@/lib/organizations";
import { OrganizationMemberForm } from "@/components/admin/organization-member-form";
import { OrganizationMemberActions } from "@/components/admin/organization-member-actions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const roleLabels = {
  ORG_ADMIN: "Admin",
  ORG_INSTRUCTOR: "Instructor",
  ORG_LEARNER: "Learner",
} as const;

export default async function AdminOrganizationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAuth(["ADMIN"]);
  const { id } = await params;
  const org = await getOrganizationById(id);
  if (!org) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/admin/organizations"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        All organizations
      </Link>

      <div className="mt-4">
        <h1 className="text-3xl font-bold text-ink">{org.name}</h1>
        <p className="mt-1 text-muted">/{org.slug}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="brand">
            {org.allowPublicCourses ? "Public + org courses" : "Org courses only"}
          </Badge>
          {org.allowedDomains.length > 0 ? (
            <Badge variant="info">Domains: {org.allowedDomains.join(", ")}</Badge>
          ) : null}
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <h2 className="font-bold text-ink">Add member</h2>
            <p className="mt-1 text-sm text-muted">
              User must already have an IntelliGen account.
            </p>
            <div className="mt-4">
              <OrganizationMemberForm organizationId={org.id} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="font-bold text-ink">Members ({org.members.length})</h2>
            <ul className="mt-4 divide-y divide-border">
              {org.members.length === 0 ? (
                <li className="py-3 text-sm text-muted">No members yet.</li>
              ) : (
                org.members.map((member) => (
                  <li
                    key={member.id}
                    className="flex items-center justify-between gap-3 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-ink">
                        {member.user.name}
                      </p>
                      <p className="truncate text-sm text-muted">{member.user.email}</p>
                      <p className="text-xs text-muted">
                        {roleLabels[member.role]}
                        {member.employeeId ? ` · ${member.employeeId}` : ""}
                      </p>
                    </div>
                    <OrganizationMemberActions
                      organizationId={org.id}
                      userId={member.user.id}
                      userName={member.user.name}
                    />
                  </li>
                ))
              )}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-brand-600" />
            <h2 className="font-bold text-ink">
              Private courses ({org.courses.length})
            </h2>
          </div>
          <p className="mt-1 text-sm text-muted">
            Only members of {org.name} can see these courses.
          </p>
          <ul className="mt-4 divide-y divide-border">
            {org.courses.length === 0 ? (
              <li className="py-3 text-sm text-muted">
                No org courses yet. Assign ORG_INSTRUCTOR and have them create a
                course while in this organization.
              </li>
            ) : (
              org.courses.map((course) => (
                <li key={course.id} className="flex items-center justify-between py-3">
                  <div>
                    <Link
                      href={`/courses/${course.id}`}
                      className="font-medium text-ink hover:text-brand-600"
                    >
                      {course.title}
                    </Link>
                    <p className="text-sm text-muted">
                      {course.instructor.name} · {course._count.enrollments} enrolled ·{" "}
                      {course.status}
                    </p>
                  </div>
                  <Badge variant="brand">Organization only</Badge>
                </li>
              ))
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
