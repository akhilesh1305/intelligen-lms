"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MEMBER_CSV_TEMPLATE } from "@/lib/org-member-csv";

type ImportSummary = {
  created: number;
  linked: number;
  updated: number;
  failed: number;
};

type ImportRow = {
  line: number;
  email: string;
  employeeId: string;
  status: string;
  message?: string;
};

export function OrgMemberCsvUpload({ organizationId }: { organizationId: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState<ImportSummary | null>(null);
  const [results, setResults] = useState<ImportRow[]>([]);
  const [parseErrors, setParseErrors] = useState<{ line: number; message: string }[]>(
    []
  );

  function downloadTemplate() {
    const blob = new Blob([MEMBER_CSV_TEMPLATE], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "organization-members-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleFile(file: File) {
    setLoading(true);
    setError("");
    setSummary(null);
    setResults([]);
    setParseErrors([]);

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch(`/api/org/${organizationId}/members/import`, {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Import failed");
        return;
      }
      setSummary(data.summary);
      setResults(data.results ?? []);
      setParseErrors(data.parseErrors ?? []);
      router.refresh();
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-dashed border-border bg-surface/50 p-5">
        <p className="text-sm font-medium text-ink">Bulk upload (CSV)</p>
        <p className="mt-1 text-sm text-muted">
          Required columns: <code className="text-xs">email</code>,{" "}
          <code className="text-xs">employee_id</code>. Optional:{" "}
          <code className="text-xs">name</code>, <code className="text-xs">role</code>,{" "}
          <code className="text-xs">department</code>,{" "}
          <code className="text-xs">location</code>,{" "}
          <code className="text-xs">phone_number</code>.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={downloadTemplate}>
            <Download className="h-4 w-4" />
            Download template
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={loading}
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="h-4 w-4" />
            {loading ? "Uploading…" : "Upload CSV"}
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
            }}
          />
        </div>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {summary ? (
        <div className="rounded-lg border border-border bg-panel p-4 text-sm">
          <p className="font-semibold text-ink">Import complete</p>
          <ul className="mt-2 space-y-1 text-muted">
            <li>{summary.created} new accounts created</li>
            <li>{summary.linked} existing users linked</li>
            <li>{summary.updated} members updated</li>
            <li>{summary.failed} failed</li>
          </ul>
        </div>
      ) : null}

      {(parseErrors.length > 0 || results.some((r) => r.status === "error")) && (
        <div className="max-h-48 overflow-y-auto rounded-lg border border-red-200 bg-red-50 p-3 text-sm dark:border-red-900 dark:bg-red-950/30">
          <p className="font-semibold text-red-800 dark:text-red-300">Issues</p>
          <ul className="mt-2 space-y-1 text-red-700 dark:text-red-200">
            {parseErrors.map((e) => (
              <li key={`p-${e.line}`}>
                Line {e.line}: {e.message}
              </li>
            ))}
            {results
              .filter((r) => r.status === "error")
              .map((r) => (
                <li key={`r-${r.line}`}>
                  Line {r.line} ({r.email}): {r.message}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
