"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function OrgLogoUpload({
  organizationId,
  organizationName,
  logoUrl,
}: {
  organizationId: string;
  organizationName: string;
  logoUrl: string | null;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentLogo, setCurrentLogo] = useState(logoUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setSuccess("");
    setLoading(true);

    const formData = new FormData();
    formData.append("logo", file);

    const res = await fetch(`/api/org/${organizationId}/logo`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Failed to upload logo");
      return;
    }

    const nextUrl = data.organization.logoUrl as string;
    setCurrentLogo(`${nextUrl}${nextUrl.startsWith("data:") ? "" : `?t=${Date.now()}`}`);
    setSuccess("Organization logo updated. It will appear on certificates for your org courses.");
    router.refresh();
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-lg font-bold text-ink">Organization logo</h2>
        <p className="mt-1 text-sm text-muted">
          Upload your company logo for certificates issued on {organizationName}{" "}
          training courses. Recommended: horizontal PNG on a transparent or white
          background, at least 400px wide.
        </p>

        <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className="flex h-28 w-56 items-center justify-center rounded-lg border border-border bg-surface p-4">
            {currentLogo ? (
              // eslint-disable-next-line @next/next/no-img-element -- org logos may be data URLs
              <img
                src={currentLogo}
                alt={`${organizationName} logo`}
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted">
                <Building2 className="h-10 w-10" />
                <span className="text-xs font-medium">No logo yet</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleLogoChange}
              className="sr-only"
              id="org-logo-upload"
            />
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => fileInputRef.current?.click()}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
              {currentLogo ? "Replace logo" : "Upload logo"}
            </Button>
            <p className="text-xs text-muted">JPEG, PNG, WebP, or GIF · max 2MB</p>
          </div>
        </div>

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        {success ? <p className="mt-4 text-sm text-emerald-600">{success}</p> : null}
      </CardContent>
    </Card>
  );
}
