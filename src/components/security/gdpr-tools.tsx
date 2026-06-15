"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function GdprTools() {
  const router = useRouter();
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function exportData() {
    setError("");
    setLoading(true);
    const res = await fetch("/api/gdpr/export", { method: "POST" });
    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Export failed");
      return;
    }

    const data = await res.json();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `intelligen-data-export-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setMessage("Your data export has been downloaded.");
  }

  async function deleteAccount() {
    setError("");
    setLoading(true);
    const res = await fetch("/api/gdpr/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confirm }),
    });
    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Deletion failed");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {message ? (
        <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      ) : null}
      {error ? (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="space-y-3">
        <h3 className="font-semibold text-ink">Export your data</h3>
        <p className="text-sm text-muted">
          Download a JSON copy of your profile, enrollments, certificates, and
          activity.
        </p>
        <Button variant="outline" onClick={exportData} disabled={loading}>
          Download my data
        </Button>
      </div>

      <div className="space-y-3 border-t border-slate-200 pt-6">
        <h3 className="font-semibold text-ink">Delete your account</h3>
        <p className="text-sm text-muted">
          Permanently anonymize your account. This action cannot be undone.
        </p>
        <Input
          label='Type "DELETE MY ACCOUNT" to confirm'
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="DELETE MY ACCOUNT"
        />
        <Button
          variant="outline"
          className="text-red-600 hover:text-red-700"
          onClick={deleteAccount}
          disabled={loading || confirm !== "DELETE MY ACCOUNT"}
        >
          Delete account
        </Button>
      </div>
    </div>
  );
}
