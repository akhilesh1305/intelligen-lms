"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import {
  ADMIN_EXPORT_DESCRIPTIONS,
  ADMIN_EXPORT_LABELS,
  ADMIN_EXPORT_TYPES,
  AdminExportType,
} from "@/lib/admin-export";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function DataExportPanel() {
  const [loading, setLoading] = useState<AdminExportType | null>(null);
  const [error, setError] = useState("");

  async function download(type: AdminExportType) {
    setError("");
    setLoading(type);

    try {
      const res = await fetch(`/api/admin/export/${type}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Download failed");
      }

      const blob = await res.blob();
      const disposition = res.headers.get("Content-Disposition");
      const match = disposition?.match(/filename="([^"]+)"/);
      const filename = match?.[1] ?? `intelligen-${type}.csv`;

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed");
    } finally {
      setLoading(null);
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold text-ink">Download data (CSV)</h2>
        <p className="mt-2 text-sm text-muted">
          Export platform records for reporting or backup. Files open in Excel,
          Google Sheets, or any spreadsheet app.
        </p>

        {error ? (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {ADMIN_EXPORT_TYPES.map((type) => (
            <div
              key={type}
              className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface/50 p-4"
            >
              <div className="min-w-0">
                <p className="font-medium text-ink">{ADMIN_EXPORT_LABELS[type]}</p>
                <p className="mt-0.5 text-xs text-muted">
                  {ADMIN_EXPORT_DESCRIPTIONS[type]}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="shrink-0"
                disabled={loading !== null}
                onClick={() => download(type)}
              >
                {loading === type ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                CSV
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
