import Link from "next/link";
import { ArrowLeft, Bell, Lock, Monitor, ShieldCheck } from "lucide-react";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { DeviceList } from "@/components/security/device-list";
import { GdprTools } from "@/components/security/gdpr-tools";
import { TwoFactorBackupSetup } from "@/components/security/two-factor-backup-setup";
import { PushNotificationToggle } from "@/components/mobile/push-notification-toggle";
import { SecuritySettingsClient } from "./security-client";

export default async function SecuritySettingsPage() {
  const session = await requireAuth();
  const user = await db.user.findUnique({
    where: { id: session.id },
    select: { twoFactorEnabled: true, privacyConsentAt: true },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/profile"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to profile
      </Link>

      <div className="mt-4">
        <SectionHeader
          title="Security & privacy"
          description="Manage authentication, devices, and your personal data"
        />
      </div>

      <div className="mt-8 space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-brand-600" />
              <h2 className="text-lg font-semibold text-ink">Two-factor authentication</h2>
            </div>
            <p className="mt-2 text-sm text-muted">
              Use an authenticator app, alternate email, or alternate phone at sign-in.
            </p>
            <div className="mt-4">
              <SecuritySettingsClient enabled={user?.twoFactorEnabled ?? false} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-ink">Alternate verification contacts</h2>
            <p className="mt-2 text-sm text-muted">
              Verify a backup email or phone number to use for two-step sign-in.
            </p>
            <div className="mt-4">
              <TwoFactorBackupSetup />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Monitor className="h-5 w-5 text-brand-600" />
              <h2 className="text-lg font-semibold text-ink">Device management</h2>
            </div>
            <p className="mt-2 text-sm text-muted">
              Review devices that have accessed your account and revoke access.
            </p>
            <div className="mt-4">
              <DeviceList />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-brand-600" />
              <h2 className="text-lg font-semibold text-ink">Push notifications</h2>
            </div>
            <p className="mt-2 text-sm text-muted">
              Get alerts for course updates, deadlines, and achievements on this device.
            </p>
            <div className="mt-4">
              <PushNotificationToggle />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-brand-600" />
              <h2 className="text-lg font-semibold text-ink">GDPR & data rights</h2>
            </div>
            <p className="mt-2 text-sm text-muted">
              Export or delete your personal data in line with GDPR requirements.
              {user?.privacyConsentAt
                ? ` Privacy consent recorded ${user.privacyConsentAt.toLocaleDateString()}.`
                : ""}
            </p>
            <div className="mt-4">
              <GdprTools />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
