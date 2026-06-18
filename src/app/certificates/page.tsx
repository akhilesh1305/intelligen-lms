import Link from "next/link";
import { Award } from "lucide-react";
import { requireAuth } from "@/lib/auth";
import { getCertificateHubData } from "@/lib/certificate-hub";
import { CertificateCollection } from "@/components/certificates/certificate-collection";
import { DashboardShell } from "@/components/dashboard/dashboard-motion";

export const metadata = {
  title: "Certificates | IntelliGen LMS",
  description: "View earned credentials, track progress, and unlock new certificates",
};

export default async function CertificatesPage() {
  const session = await requireAuth();
  const hub = await getCertificateHubData(session.id);

  const serialized = {
    earned: hub.earned.map((e) => ({
      ...e,
      issuedAt: e.issuedAt.toISOString(),
    })),
    locked: hub.locked,
    stats: hub.stats,
  };

  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-10">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-sm">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                Certificate collection
              </h1>
              <p className="mt-1 text-sm text-muted sm:text-base">
                {hub.stats.earnedCount} earned · {hub.stats.inProgressCount} in progress ·{" "}
                {hub.stats.lockedCount} locked
              </p>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-sm text-muted">
            Premium verified credentials for every course you complete. Search, filter, and track
            your path to the next certificate.
          </p>
          <Link
            href="/dashboard"
            className="mt-4 inline-flex text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
          >
            ← Back to dashboard
          </Link>
        </header>

        <CertificateCollection hub={serialized} />
      </div>
    </DashboardShell>
  );
}
