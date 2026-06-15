"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type BackupState = {
  primaryEmail: string;
  altEmail: string | null;
  altEmailVerified: boolean;
  altEmailMasked: string | null;
  altPhone: string | null;
  altPhoneVerified: boolean;
  altPhoneMasked: string | null;
  emailEnabled: boolean;
  smsEnabled: boolean;
  hasAuthenticator: boolean;
  twoFactorEnabled: boolean;
};

export function TwoFactorBackupSetup() {
  const [state, setState] = useState<BackupState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [emailInput, setEmailInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [emailPending, setEmailPending] = useState(false);
  const [phonePending, setPhonePending] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/auth/2fa/backup");
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Failed to load backup methods");
      return;
    }

    setState(data);
    setEmailInput(data.altEmail ?? "");
    setPhoneInput(data.altPhone ?? "");
    setEmailPending(Boolean(data.altEmail && !data.altEmailVerified));
    setPhonePending(Boolean(data.altPhone && !data.altPhoneVerified));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function sendBackupCode(channel: "email" | "sms") {
    setError("");
    setMessage("");
    setBusy(true);

    const res = await fetch("/api/auth/2fa/backup/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        channel,
        email: channel === "email" ? emailInput : undefined,
        phone: channel === "sms" ? phoneInput : undefined,
      }),
    });

    const data = await res.json();
    setBusy(false);

    if (!res.ok) {
      setError(data.error || "Failed to send code");
      return;
    }

    if (channel === "email") {
      setEmailPending(true);
      setEmailCode("");
    } else {
      setPhonePending(true);
      setPhoneCode("");
    }
    setMessage(
      channel === "email"
        ? "Verification code sent to your alternate email."
        : "Verification code sent to your alternate phone."
    );
  }

  async function verifyBackup(channel: "email" | "sms") {
    setError("");
    setMessage("");
    setBusy(true);

    const res = await fetch("/api/auth/2fa/backup/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        channel,
        code: channel === "email" ? emailCode : phoneCode,
      }),
    });

    const data = await res.json();
    setBusy(false);

    if (!res.ok) {
      setError(data.error || "Verification failed");
      return;
    }

    setMessage(
      channel === "email"
        ? "Alternate email verified. You can now use it for sign-in verification."
        : "Alternate phone verified. You can now use it for sign-in verification."
    );
    await load();
  }

  async function toggleBackup(channel: "email" | "sms", enabled: boolean) {
    setError("");
    setMessage("");
    setBusy(true);

    const res = await fetch("/api/auth/2fa/backup/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channel, enabled }),
    });

    const data = await res.json();
    setBusy(false);

    if (!res.ok) {
      setError(data.error || "Failed to update setting");
      return;
    }

    setMessage(
      enabled
        ? `${channel === "email" ? "Email" : "SMS"} verification enabled for sign-in.`
        : `${channel === "email" ? "Email" : "SMS"} verification disabled for sign-in.`
    );
    await load();
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading backup methods…
      </div>
    );
  }

  if (!state) {
    return <p className="text-sm text-red-600">{error || "Unable to load settings."}</p>;
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

      <p className="text-sm text-muted">
        Add a backup email or phone number for two-step verification at sign-in.
        Your login email is <span className="font-medium text-ink">{state.primaryEmail}</span>.
      </p>

      <div className="rounded-lg border border-border p-4">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-brand-600" />
          <h3 className="text-sm font-semibold text-ink">Alternate email</h3>
        </div>

        {state.altEmailVerified && state.altEmailMasked ? (
          <p className="mt-2 text-sm text-muted">
            Verified: <span className="font-medium text-ink">{state.altEmailMasked}</span>
          </p>
        ) : null}

        {!state.altEmailVerified || emailPending ? (
          <div className="mt-4 space-y-3">
            <Input
              label="Alternate email address"
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="backup@example.com"
              disabled={busy}
            />
            {!emailPending ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={busy || !emailInput}
                onClick={() => sendBackupCode("email")}
              >
                Send verification code
              </Button>
            ) : (
              <div className="space-y-3">
                <Input
                  label="Email verification code"
                  value={emailCode}
                  onChange={(e) => setEmailCode(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                />
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    disabled={busy || emailCode.length !== 6}
                    onClick={() => verifyBackup("email")}
                  >
                    Confirm email
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={busy}
                    onClick={() => sendBackupCode("email")}
                  >
                    Resend code
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={state.emailEnabled}
                disabled={busy}
                onChange={(e) => toggleBackup("email", e.target.checked)}
              />
              Use for sign-in verification
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={busy}
              onClick={() => {
                setEmailPending(true);
                setEmailInput(state.altEmail ?? "");
              }}
            >
              Change email
            </Button>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-border p-4">
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-brand-600" />
          <h3 className="text-sm font-semibold text-ink">Alternate phone</h3>
        </div>

        {state.altPhoneVerified && state.altPhoneMasked ? (
          <p className="mt-2 text-sm text-muted">
            Verified: <span className="font-medium text-ink">{state.altPhoneMasked}</span>
          </p>
        ) : null}

        {!state.altPhoneVerified || phonePending ? (
          <div className="mt-4 space-y-3">
            <Input
              label="Alternate phone number"
              type="tel"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              placeholder="+1 555 123 4567"
              disabled={busy}
            />
            {!phonePending ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={busy || !phoneInput}
                onClick={() => sendBackupCode("sms")}
              >
                Send verification code
              </Button>
            ) : (
              <div className="space-y-3">
                <Input
                  label="SMS verification code"
                  value={phoneCode}
                  onChange={(e) => setPhoneCode(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                />
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    disabled={busy || phoneCode.length !== 6}
                    onClick={() => verifyBackup("sms")}
                  >
                    Confirm phone
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={busy}
                    onClick={() => sendBackupCode("sms")}
                  >
                    Resend code
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={state.smsEnabled}
                disabled={busy}
                onChange={(e) => toggleBackup("sms", e.target.checked)}
              />
              Use for sign-in verification
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={busy}
              onClick={() => {
                setPhonePending(true);
                setPhoneInput(state.altPhone ?? "");
              }}
            >
              Change phone
            </Button>
          </div>
        )}
      </div>

      {state.twoFactorEnabled ? (
        <p className="text-xs text-muted">
          Active sign-in methods:{" "}
          {[
            state.hasAuthenticator && "Authenticator app",
            state.emailEnabled && "Alternate email",
            state.smsEnabled && "Alternate phone",
          ]
            .filter(Boolean)
            .join(" · ") || "None"}
        </p>
      ) : (
        <p className="text-xs text-muted">
          Enable at least one sign-in method above, or set up an authenticator app.
        </p>
      )}
    </div>
  );
}
