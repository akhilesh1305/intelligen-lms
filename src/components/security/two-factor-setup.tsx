"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function TwoFactorSetup({
  enabled,
  onChanged,
}: {
  enabled: boolean;
  onChanged: () => void;
}) {
  const [secret, setSecret] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function startSetup() {
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/2fa/setup", { method: "POST" });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Failed to start 2FA setup");
      return;
    }

    setSecret(data.secret);
    setQrCode(data.qrCode);
  }

  async function enable2fa() {
    if (!secret) return;
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/2fa/enable", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, code }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Failed to enable 2FA");
      return;
    }

    setSecret(null);
    setQrCode(null);
    setCode("");
    setMessage("Two-factor authentication is now enabled.");
    onChanged();
  }

  async function disable2fa() {
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/2fa/disable", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, password }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Failed to disable 2FA");
      return;
    }

    setCode("");
    setPassword("");
    setMessage("Two-factor authentication has been disabled.");
    onChanged();
  }

  return (
    <div className="space-y-4">
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

      {enabled ? (
        <div className="space-y-3">
          <p className="text-sm text-muted">
            Authenticator 2FA is active. You can also use verified alternate email or
            phone if enabled below.
          </p>
          <Input
            label="Authenticator code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="000000"
            maxLength={6}
          />
          <Input
            label="Password (if code fails)"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          <Button
            variant="outline"
            onClick={disable2fa}
            disabled={loading || code.length !== 6}
          >
            Disable 2FA
          </Button>
        </div>
      ) : secret ? (
        <div className="space-y-3">
          {qrCode ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qrCode}
              alt="2FA QR code"
              width={180}
              height={180}
              className="rounded-lg border border-slate-200"
            />
          ) : null}
          <p className="text-xs text-muted break-all">Manual key: {secret}</p>
          <Input
            label="Verification code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="000000"
            maxLength={6}
          />
          <Button onClick={enable2fa} disabled={loading || code.length !== 6}>
            Confirm & enable
          </Button>
        </div>
      ) : (
        <Button onClick={startSetup} disabled={loading}>
          Set up authenticator app
        </Button>
      )}
    </div>
  );
}
