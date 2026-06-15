import Link from "next/link";
import {
  Gamepad2,
  GraduationCap,
  Trophy,
  UserCheck,
  Users,
} from "lucide-react";
import {
  getOrgAnalytics,
  getOrgUserDirectory,
  requireOrganizationAdminBySlug,
} from "@/lib/org-admin";
import { OrgAdminToolbar } from "@/components/org/org-admin-toolbar";
import { OrgUserDirectory } from "@/components/org/org-user-directory";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";

export default async function OrgUsersPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { org, isPlatformAdmin, accessibleOrgs } =
    await requireOrganizationAdminBySlug(slug);

  const [users, analytics] = await Promise.all([
    getOrgUserDirectory(org.id),
    getOrgAnalytics(org.id),
  ]);

  const activeCount = users.filter((u) => u.isActive).length;
  const withQuizActivity = users.filter((u) => u.weeklyQuizzes > 0).length;
  const withCorporate = users.filter((u) => u.corporateGamesPlayed > 0).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        title={`${org.name} — user directory`}
        description={
          isPlatformAdmin
            ? "Platform admin view — user data for the selected organization only."
            : "Search, filter, and export learning data for your organization members. Org admins only."
        }
      />

      <div className="mt-6">
        <OrgAdminToolbar
          organizations={accessibleOrgs}
          currentSlug={slug}
          active="users"
          isPlatformAdmin={isPlatformAdmin}
        />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total members",
            value: users.length,
            icon: Users,
            iconClass:
              "bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400",
          },
          {
            label: "Active learners",
            value: activeCount,
            icon: GraduationCap,
            iconClass:
              "bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400",
          },
          {
            label: "Quiz players (week)",
            value: withQuizActivity,
            icon: Trophy,
            iconClass:
              "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
          },
          {
            label: "Instructors",
            value: analytics.instructorCount,
            icon: UserCheck,
            iconClass:
              "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
          },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 py-5">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.iconClass}`}
              >
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-ink">{stat.value}</p>
                <p className="text-sm text-muted">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Learners", value: analytics.learnerCount },
          { label: "Avg course progress", value: `${analytics.avgProgress}%` },
          {
            label: "Corporate game players",
            value: withCorporate,
            icon: Gamepad2,
          },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="py-4">
              <p className="text-2xl font-bold text-ink">{stat.value}</p>
              <p className="text-sm text-muted">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardContent className="pt-6">
          <h2 className="text-lg font-bold text-ink">Organization user data</h2>
          <p className="mt-1 text-sm text-muted">
            Expand any row for per-course progress, quiz points, corporate games,
            and instructor stats. Export filtered results to CSV.
          </p>
          <div className="mt-6">
            <OrgUserDirectory users={users} orgSlug={slug} />
          </div>
        </CardContent>
      </Card>

      <p className="mt-6 text-sm text-muted">
        <Link href={`/org/${slug}`} className="font-semibold text-brand-600 hover:underline">
          ← Back to analytics dashboard
        </Link>
      </p>
    </div>
  );
}
