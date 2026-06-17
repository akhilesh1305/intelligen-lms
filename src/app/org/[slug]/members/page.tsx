import Link from "next/link";
import { Upload, Users } from "lucide-react";
import {
  getOrgMembersForAdmin,
  requireOrganizationAdminBySlug,
} from "@/lib/org-admin";
import { formatPhoneForDisplay } from "@/lib/phone";
import { OrgMemberCsvUpload } from "@/components/org/org-member-csv-upload";
import { TableScroll } from "@/components/ui/table-scroll";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";

const roleLabels = {
  ORG_ADMIN: "Admin",
  ORG_INSTRUCTOR: "Instructor",
  ORG_LEARNER: "Learner",
} as const;

export default async function OrgMembersPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { org, isPlatformAdmin } = await requireOrganizationAdminBySlug(slug);

  const members = await getOrgMembersForAdmin(org.id);
  const instructors = members.filter((m) => m.role === "ORG_INSTRUCTOR");
  const learners = members.filter((m) => m.role === "ORG_LEARNER");
  const admins = members.filter((m) => m.role === "ORG_ADMIN");

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        title={`${org.name} — members`}
        description={
          isPlatformAdmin
            ? "Platform admin view — manage members for the selected organization only."
            : "Mass import users with employee ID and manage your organization roster"
        }
      />

      <Card className="mt-6 border-brand-200 bg-brand-50/50 dark:border-brand-900 dark:bg-brand-950/20">
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
                <Upload className="h-5 w-5 text-brand-600" />
                Mass user upload (CSV)
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-muted">
                Upload a spreadsheet to create or link many users at once. Each row
                needs <strong>email</strong> and <strong>employee_id</strong>.
                Optional columns: <strong>name</strong>, <strong>role</strong>{" "}
                (ORG_LEARNER, ORG_INSTRUCTOR, ORG_ADMIN), <strong>department</strong>,{" "}
                <strong>location</strong>, and <strong>phone_number</strong>.
              </p>
            </div>
            <Badge variant="brand" className="shrink-0">
              {members.length} members
            </Badge>
          </div>
          <div className="mt-5">
            <OrgMemberCsvUpload organizationId={org.id} />
          </div>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardContent className="pt-6">
          <h3 className="flex items-center gap-2 font-bold text-ink">
            <Users className="h-5 w-5 text-brand-600" />
            All members ({members.length})
          </h3>
          <p className="mt-1 text-sm text-muted">
            Organization users only — includes admins, instructors, and learners
          </p>
          <TableScroll className="mt-4">
            <table className="w-full min-w-[640px] text-left text-sm md:min-w-[1100px]">
              <thead>
                <tr className="border-b border-border text-muted">
                  <th className="pb-2 pr-4 font-semibold">Employee ID</th>
                  <th className="pb-2 pr-4 font-semibold">Name</th>
                  <th className="pb-2 pr-4 font-semibold">Email</th>
                  <th className="pb-2 pr-4 font-semibold">Department</th>
                  <th className="pb-2 pr-4 font-semibold">Location</th>
                  <th className="pb-2 pr-4 font-semibold">Phone</th>
                  <th className="pb-2 pr-4 font-semibold">Role</th>
                  <th className="pb-2 font-semibold">Org course progress</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => {
                  const orgEnrollments = member.user.enrollments.filter(
                    (e) => e.course.organizationId === org.id
                  );
                  const avg =
                    orgEnrollments.length > 0
                      ? Math.round(
                          orgEnrollments.reduce((s, e) => s + e.progressPercent, 0) /
                            orgEnrollments.length
                        )
                      : null;

                  return (
                    <tr key={member.id} className="border-b border-border/60">
                      <td className="py-3 pr-4 font-mono text-xs">
                        {member.employeeId ?? "—"}
                      </td>
                      <td className="py-3 pr-4 font-medium text-ink">
                        {member.user.name}
                      </td>
                      <td className="py-3 pr-4 text-muted">{member.user.email}</td>
                      <td className="py-3 pr-4 text-muted">
                        {member.department ?? "—"}
                      </td>
                      <td className="py-3 pr-4 text-muted">
                        {member.location ?? "—"}
                      </td>
                      <td className="py-3 pr-4 text-muted">
                        {member.user.phoneNumber
                          ? formatPhoneForDisplay(member.user.phoneNumber)
                          : "—"}
                      </td>
                      <td className="py-3 pr-4">
                        <Badge variant="brand">{roleLabels[member.role]}</Badge>
                      </td>
                      <td className="py-3 text-muted">
                        {avg != null
                          ? `${avg}% (${orgEnrollments.length} courses)`
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </TableScroll>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {[
          { title: "Admins", rows: admins },
          { title: "Instructors", rows: instructors },
          { title: "Learners", rows: learners },
        ].map((group) => (
          <Card key={group.title}>
            <CardContent className="pt-6">
              <h3 className="font-bold text-ink">
                {group.title} ({group.rows.length})
              </h3>
              <ul className="mt-3 space-y-2 text-sm">
                {group.rows.length > 0 ? (
                  group.rows.map((member) => (
                    <li key={member.id} className="rounded-md border border-border/60 px-3 py-2">
                      <p className="font-medium text-ink">{member.user.name}</p>
                      <p className="text-xs text-muted">
                        {member.employeeId ?? "—"} · {member.user.email}
                      </p>
                    </li>
                  ))
                ) : (
                  <li className="text-muted">None yet</li>
                )}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Link href={`/org/${slug}`}>
          <Button variant="outline" size="sm">
            Back to analytics dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
