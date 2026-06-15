import Link from "next/link";
import { ArrowLeft, Activity, KeyRound, Network, Shield } from "lucide-react";
import { requireAuth } from "@/lib/auth";
import { getAuditLogs } from "@/lib/audit";
import { getSecuritySettings } from "@/lib/security/settings";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { SecuritySettingsForm } from "@/components/admin/security-settings-form";
import { Badge } from "@/components/ui/badge";
import { TableScroll } from "@/components/ui/table-scroll";

export default async function AdminSecurityPage() {
  await requireAuth(["ADMIN"]);
  const [settings, { logs }] = await Promise.all([
    getSecuritySettings(),
    getAuditLogs({ limit: 20 }),
  ]);

  const securityLogs = logs.filter((log) =>
    [
      "SSO_LOGIN",
      "TWO_FACTOR_ENABLED",
      "TWO_FACTOR_DISABLED",
      "TWO_FACTOR_VERIFIED",
      "DEVICE_REVOKED",
      "IP_BLOCKED",
      "GDPR_EXPORT",
      "GDPR_DELETION",
      "SECURITY_SETTINGS_UPDATED",
      "LOGIN_FAILED",
    ].includes(log.action)
  );

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
          title="Security & enterprise controls"
          description="SSO, 2FA policy, IP restrictions, encryption, and activity monitoring"
        />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: KeyRound, label: "SSO providers", value: "Google, Microsoft, Okta" },
          { icon: Shield, label: "2FA", value: settings.requireAdmin2fa ? "Required for admins" : "Optional" },
          { icon: Network, label: "IP restriction", value: settings.ipRestrictionEnabled ? "Enabled" : "Disabled" },
          { icon: Activity, label: "Activity logs", value: `${securityLogs.length} recent events` },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="flex items-start gap-3 p-5">
              <item.icon className="mt-0.5 h-5 w-5 text-brand-600" />
              <div>
                <p className="text-sm text-muted">{item.label}</p>
                <p className="font-semibold text-ink">{item.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-ink">Enterprise settings</h2>
          <p className="mt-1 text-sm text-muted">
            Sensitive data (2FA secrets) is encrypted at rest using AES-256-GCM.
          </p>
          <div className="mt-6">
            <SecuritySettingsForm initial={settings} />
          </div>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-ink">User activity monitoring</h2>
            <Link href="/admin/audit-logs" className="text-sm font-semibold text-brand-600 hover:underline">
              View all audit logs
            </Link>
          </div>
          <TableScroll className="mt-4">
            <table className="w-full min-w-[480px] text-left text-sm md:min-w-[640px]">
              <thead className="border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-2 py-2">Time</th>
                  <th className="px-2 py-2">Action</th>
                  <th className="px-2 py-2">User</th>
                  <th className="px-2 py-2">IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {securityLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-2 py-2 text-muted">
                      {log.createdAt.toLocaleString()}
                    </td>
                    <td className="px-2 py-2">
                      <Badge variant="default">{log.action}</Badge>
                    </td>
                    <td className="px-2 py-2">{log.userEmail ?? "—"}</td>
                    <td className="px-2 py-2 font-mono text-xs">{log.ipAddress ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableScroll>
        </CardContent>
      </Card>
    </div>
  );
}
