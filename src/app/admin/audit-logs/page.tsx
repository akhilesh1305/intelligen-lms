import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft, ClipboardList } from "lucide-react";
import { AuditAction } from "@prisma/client";
import { requireAuth } from "@/lib/auth";
import {
  AUDIT_ACTION_LABELS,
  formatAuditMetadata,
  getAuditLogs,
} from "@/lib/audit";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { TableScroll } from "@/components/ui/table-scroll";
import {
  AuditLogFilters,
  isAuditAction,
} from "@/components/admin/audit-log-filters";

const ACTION_VARIANTS: Partial<
  Record<AuditAction, "success" | "warning" | "info" | "default" | "brand">
> = {
  LOGIN: "success",
  LOGOUT: "info",
  REGISTER: "brand",
  COURSE_CREATED: "brand",
  COURSE_UPDATED: "info",
  USER_UPDATED: "warning",
  LOGIN_FAILED: "default",
  SSO_LOGIN: "success",
  TWO_FACTOR_ENABLED: "brand",
  TWO_FACTOR_DISABLED: "warning",
  TWO_FACTOR_VERIFIED: "success",
  DEVICE_REVOKED: "warning",
  IP_BLOCKED: "default",
  GDPR_EXPORT: "info",
  GDPR_DELETION: "warning",
  SECURITY_SETTINGS_UPDATED: "info",
};

export default async function AuditLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ action?: string }>;
}) {
  await requireAuth(["ADMIN"]);
  const { action: actionParam } = await searchParams;
  const action =
    actionParam && isAuditAction(actionParam) ? actionParam : undefined;

  const { logs, total } = await getAuditLogs({ action, limit: 100 });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <div className="mt-4">
        <SectionHeader
          title="Audit logs"
          description="Track login activity, course creation, and user updates"
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <Suspense fallback={null}>
          <AuditLogFilters />
        </Suspense>
        <p className="text-sm text-muted">
          Showing {logs.length} of {total} entries
        </p>
      </div>

      {logs.length === 0 ? (
        <Card className="mt-8">
          <CardContent className="py-16 text-center">
            <ClipboardList className="mx-auto h-12 w-12 text-slate-300" />
            <p className="mt-4 font-semibold text-ink">No audit logs yet</p>
            <p className="mt-1 text-sm text-muted">
              Activity will appear here when users log in, create courses, or
              update profiles.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="mt-6 overflow-hidden">
          <CardContent className="p-4 sm:p-6">
          <TableScroll>
            <table className="w-full min-w-[640px] text-left text-sm md:min-w-[800px]">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Target</th>
                  <th className="px-4 py-3">Details</th>
                  <th className="px-4 py-3">IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="bg-white hover:bg-slate-50/50">
                    <td className="whitespace-nowrap px-4 py-3 text-muted">
                      {log.createdAt.toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={ACTION_VARIANTS[log.action] ?? "default"}>
                        {AUDIT_ACTION_LABELS[log.action]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-ink">
                        {log.userName ?? log.user?.name ?? "—"}
                      </div>
                      <div className="text-xs text-muted">
                        {log.userEmail ?? log.user?.email ?? "—"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {log.targetType ? (
                        <span>
                          {log.targetType}
                          {log.targetId ? (
                            <span className="block font-mono text-xs text-slate-400">
                              {log.targetId.slice(0, 12)}…
                            </span>
                          ) : null}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="max-w-xs px-4 py-3 text-muted">
                      {formatAuditMetadata(log.metadata)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted">
                      {log.ipAddress ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableScroll>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
