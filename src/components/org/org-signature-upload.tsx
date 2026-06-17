"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, PenLine, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function OrgSignatureUpload({
  organizationId,
  organizationName,
  signatoryName: initialName,
  signatureUrl: initialSignatureUrl,
  defaultSignatoryName,
}: {
  organizationId: string;
  organizationName: string;
  signatoryName: string | null;
  signatureUrl: string | null;
  defaultSignatoryName: string;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [signatoryName, setSignatoryName] = useState(
    initialName ?? defaultSignatoryName
  );
  const [signatureUrl, setSignatureUrl] = useState(initialSignatureUrl);
  const [savingName, setSavingName] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function saveName() {
    const trimmed = signatoryName.trim();
    if (!trimmed) {
      setError("Enter the name that should appear on certificates.");
      return;
    }

    setError("");
    setSuccess("");
    setSavingName(true);

    const res = await fetch(`/api/org/${organizationId}/signature`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ signatoryName: trimmed }),
    });

    const data = await res.json();
    setSavingName(false);

    if (!res.ok) {
      setError(data.error || "Failed to save name");
      return;
    }

    setSignatoryName(data.organization.signatoryName ?? trimmed);
    setSuccess("Signatory name saved.");
    router.refresh();
  }

  async function handleSignatureChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const trimmed = signatoryName.trim();
    if (!trimmed) {
      setError("Enter your name before uploading a signature.");
      return;
    }

    setError("");
    setSuccess("");
    setUploading(true);

    const formData = new FormData();
    formData.append("signature", file);
    formData.append("signatoryName", trimmed);

    const res = await fetch(`/api/org/${organizationId}/signature`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setUploading(false);

    if (!res.ok) {
      setError(data.error || "Failed to upload signature");
      return;
    }

    const nextUrl = data.organization.signatureUrl as string;
    setSignatureUrl(
      `${nextUrl}${nextUrl.startsWith("data:") ? "" : `?t=${Date.now()}`}`
    );
    if (data.organization.signatoryName) {
      setSignatoryName(data.organization.signatoryName);
    }
    setSuccess("Digital signature saved. It will appear on org certificates.");
    router.refresh();
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-lg font-bold text-ink">Certificate signatory</h2>
        <p className="mt-1 text-sm text-muted">
          Add your name and digital signature for {organizationName} completion
          certificates. Learners will see this in the footer alongside the
          verification seal.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="signatory-name"
              className="text-sm font-medium text-ink"
            >
              Name on certificate
            </label>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
              <Input
                id="signatory-name"
                value={signatoryName}
                onChange={(e) => setSignatoryName(e.target.value)}
                placeholder="e.g. Jane Smith"
                className="sm:max-w-sm"
              />
              <Button
                type="button"
                variant="outline"
                disabled={savingName}
                onClick={saveName}
              >
                {savingName ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <PenLine className="h-4 w-4" />
                )}
                Save name
              </Button>
            </div>
          </div>

          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <div className="flex h-24 w-56 items-end justify-center rounded-lg border border-dashed border-border bg-white px-4 pb-2 pt-3">
              {signatureUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- signatures may be data URLs
                <img
                  src={signatureUrl}
                  alt="Digital signature preview"
                  className="max-h-16 max-w-full object-contain"
                />
              ) : (
                <p className="text-center text-xs text-muted">
                  No signature uploaded
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleSignatureChange}
                className="sr-only"
                id="org-signature-upload"
              />
              <Button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {signatureUrl ? "Replace signature" : "Upload signature"}
              </Button>
              <p className="text-xs text-muted">
                PNG with transparent background works best · max 1MB
              </p>
            </div>
          </div>
        </div>

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        {success ? <p className="mt-4 text-sm text-emerald-600">{success}</p> : null}
      </CardContent>
    </Card>
  );
}
