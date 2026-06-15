import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { requireAuth } from "@/lib/auth";
import { DataExportPanel } from "@/components/admin/data-export-panel";
import { SectionHeader } from "@/components/ui/section-header";

export default async function AdminExportsPage() {
  await requireAuth(["ADMIN"]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <div className="mt-4">
        <SectionHeader
          title="Data exports"
          description="Download CSV reports for users, courses, enrollments, and activity"
        />
      </div>

      <p className="mt-4 flex items-center gap-2 text-sm text-muted">
        <Download className="h-4 w-4 shrink-0" />
        Exports exclude passwords and other sensitive secrets.
      </p>

      <div className="mt-8">
        <DataExportPanel />
      </div>
    </div>
  );
}
