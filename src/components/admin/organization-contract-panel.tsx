"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { OrganizationStatus } from "@prisma/client";
import {
  AlertTriangle,
  CalendarRange,
  Loader2,
  RotateCcw,
  Save,
  ShieldOff,
} from "lucide-react";
import {
  formatContractDate,
  getOrganizationLifecycle,
  getOrganizationLifecycleDescription,
  getOrganizationLifecycleLabel,
  toContractDateInputValue,
} from "@/lib/organization-lifecycle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type OrganizationContractPanelProps = {
  organization: {
    id: string;
    name: string;
    status: OrganizationStatus;
    contractStartsAt: string | null;
    contractEndsAt: string | null;
    terminatedAt: string | null;
    terminationNote: string | null;
  };
};

export function OrganizationContractPanel({
  organization,
}: OrganizationContractPanelProps) {
  const router = useRouter();
  const lifecycle = getOrganizationLifecycle(organization);

  const [contractStartsAt, setContractStartsAt] = useState(
    toContractDateInputValue(organization.contractStartsAt)
  );
  const [contractEndsAt, setContractEndsAt] = useState(
    toContractDateInputValue(organization.contractEndsAt)
  );
  const [terminationNote, setTerminationNote] = useState(
    organization.terminationNote ?? ""
  );
  const [saving, setSaving] = useState(false);
  const [terminating, setTerminating] = useState(false);
  const [reactivating, setReactivating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function saveContract() {
    setError("");
    setSuccess("");
    setSaving(true);

    const res = await fetch(`/api/admin/organizations/${organization.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contractStartsAt: contractStartsAt || null,
        contractEndsAt: contractEndsAt || null,
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Failed to save contract dates");
      return;
    }

    setSuccess("Contract access window updated.");
    router.refresh();
  }

  async function terminateOrganization() {
    const confirmed = window.confirm(
      `Terminate ${organization.name}? Members will lose access to org courses and org admin tools immediately.`
    );
    if (!confirmed) return;

    setError("");
    setSuccess("");
    setTerminating(true);

    const res = await fetch(
      `/api/admin/organizations/${organization.id}/terminate`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          confirm: true,
          terminationNote: terminationNote.trim() || undefined,
        }),
      }
    );

    const data = await res.json();
    setTerminating(false);

    if (!res.ok) {
      setError(data.error || "Failed to terminate organization");
      return;
    }

    setSuccess("Organization terminated.");
    router.refresh();
  }

  async function reactivateOrganization() {
    const confirmed = window.confirm(
      `Reactivate ${organization.name}? Access will follow the saved contract dates.`
    );
    if (!confirmed) return;

    setError("");
    setSuccess("");
    setReactivating(true);

    const res = await fetch(
      `/api/admin/organizations/${organization.id}/reactivate`,
      { method: "POST" }
    );

    const data = await res.json();
    setReactivating(false);

    if (!res.ok) {
      setError(data.error || "Failed to reactivate organization");
      return;
    }

    setSuccess("Organization reactivated.");
    router.refresh();
  }

  const lifecycleVariant =
    lifecycle === "active"
      ? "success"
      : lifecycle === "pending"
        ? "info"
        : lifecycle === "expired"
          ? "warning"
          : "danger";

  return (
    <Card className="border-brand-200/60 dark:border-brand-900/40">
      <CardContent className="pt-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CalendarRange className="h-5 w-5 text-brand-600" />
              <h2 className="font-bold text-ink">Contract & access</h2>
            </div>
            <p className="mt-1 text-sm text-muted">
              Set time-based access for this organization and terminate when a
              contract ends.
            </p>
          </div>
          <Badge variant={lifecycleVariant}>
            {getOrganizationLifecycleLabel(lifecycle)}
          </Badge>
        </div>

        <p className="mt-4 rounded-lg bg-surface px-3 py-2 text-sm text-muted">
          {getOrganizationLifecycleDescription(organization)}
        </p>

        {organization.terminatedAt ? (
          <p className="mt-2 text-xs text-muted">
            Terminated on {formatContractDate(organization.terminatedAt)}
          </p>
        ) : null}

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink">
              Contract starts
            </label>
            <Input
              type="date"
              value={contractStartsAt}
              onChange={(e) => setContractStartsAt(e.target.value)}
              disabled={lifecycle === "terminated"}
            />
            <p className="mt-1 text-xs text-muted">
              Leave empty for immediate access.
            </p>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink">
              Contract ends
            </label>
            <Input
              type="date"
              value={contractEndsAt}
              onChange={(e) => setContractEndsAt(e.target.value)}
              disabled={lifecycle === "terminated"}
            />
            <p className="mt-1 text-xs text-muted">
              Leave empty for open-ended access.
            </p>
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-1.5 block text-sm font-semibold text-ink">
            Termination note (optional)
          </label>
          <Textarea
            value={terminationNote}
            onChange={(e) => setTerminationNote(e.target.value)}
            placeholder="e.g. Contract ended March 2026 — client offboarded"
            rows={3}
            disabled={lifecycle === "terminated"}
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button
            type="button"
            variant="soft"
            onClick={saveContract}
            disabled={saving || lifecycle === "terminated"}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save contract dates
          </Button>

          {lifecycle === "terminated" ? (
            <Button
              type="button"
              variant="primary"
              onClick={reactivateOrganization}
              disabled={reactivating}
            >
              {reactivating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RotateCcw className="h-4 w-4" />
              )}
              Reactivate organization
            </Button>
          ) : (
            <Button
              type="button"
              variant="danger"
              onClick={terminateOrganization}
              disabled={terminating}
            >
              {terminating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ShieldOff className="h-4 w-4" />
              )}
              Terminate organization
            </Button>
          )}
        </div>

        {lifecycle !== "terminated" ? (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50/80 px-3 py-2 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-100">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Termination immediately blocks org members from org courses and org
              admin pages. Contract end dates block access automatically when the
              end date passes.
            </span>
          </div>
        ) : null}

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        {success ? (
          <p className="mt-4 text-sm text-emerald-600">{success}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
