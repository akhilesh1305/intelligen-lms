"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type VerifyMethod = "authenticator" | "email" | "sms";

export function TwoFactorForm() {
  const router = useRouter();
  const [methods, setMethods] = useState<VerifyMethod[]>([]);
  const [method, setMethod] = useState<VerifyMethod>("authenticator");
  const [maskedEmail, setMaskedEmail] = useState<string | null>(null);
  const [maskedPhone, setMaskedPhone] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMethods, setLoadingMethods] = useState(true);
  const [codeSent, setCodeSent] = useState(false);

  useEffect(() => {
    async function loadMethods() {
      const res = await fetch("/api/auth/2fa/methods");
      const data = await res.json();
      setLoadingMethods(false);

      if (!res.ok) {
        setError(data.error || "Unable to load verification options");
        return;
      }

      setMethods(data.methods ?? []);
      setMaskedEmail(data.maskedEmail ?? null);
      setMaskedPhone(data.maskedPhone ?? null);
      setMethod(data.methods?.[0] ?? "authenticator");
    }

    loadMethods();
  }, []);

  async function sendCode() {
    if (method !== "email" && method !== "sms") return;

    setError("");
    setMessage("");
    setLoading(true);

    const res = await fetch("/api/auth/2fa/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ method }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Failed to send code");
      return;
    }

    setCodeSent(true);
    setMessage(
      method === "email"
        ? `Code sent to ${maskedEmail ?? "your alternate email"}.`
        : `Code sent to ${maskedPhone ?? "your alternate phone"}.`
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/2fa/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, method }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Verification failed");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  const methodButtonClass = (active: boolean) =>
    cn(
      "rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition-all duration-200",
      active
        ? "border-brand-500 bg-brand-50 text-brand-800 dark:bg-brand-950/40 dark:text-brand-200"
        : "border-border text-muted hover:border-brand-300 hover:bg-surface"
    );

  if (loadingMethods) {
    return <p className="text-center text-sm text-muted">Loading verification options…</p>;
  }

  if (methods.length === 0) {
    return (
      <p className="text-center text-sm text-red-600 dark:text-red-400">
        No verification methods are available. Contact support.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      ) : null}
      {message ? (
        <div className="rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-800 dark:border-brand-800 dark:bg-brand-950/40 dark:text-brand-200">
          {message}
        </div>
      ) : null}

      {methods.length > 1 ? (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-ink">Verification method</p>
          <div className="grid gap-2">
            {methods.includes("authenticator") ? (
              <button
                type="button"
                onClick={() => {
                  setMethod("authenticator");
                  setCodeSent(false);
                  setMessage("");
                }}
                className={methodButtonClass(method === "authenticator")}
              >
                Authenticator app
              </button>
            ) : null}
            {methods.includes("email") ? (
              <button
                type="button"
                onClick={() => {
                  setMethod("email");
                  setCodeSent(false);
                  setMessage("");
                }}
                className={methodButtonClass(method === "email")}
              >
                Alternate email {maskedEmail ? `(${maskedEmail})` : ""}
              </button>
            ) : null}
            {methods.includes("sms") ? (
              <button
                type="button"
                onClick={() => {
                  setMethod("sms");
                  setCodeSent(false);
                  setMessage("");
                }}
                className={methodButtonClass(method === "sms")}
              >
                Alternate phone {maskedPhone ? `(${maskedPhone})` : ""}
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      {method === "authenticator" ? (
        <Input
          id="code"
          label="Authenticator code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="000000"
          maxLength={6}
          required
          className="text-center text-lg tracking-widest"
        />
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted">
            {method === "email"
              ? `We'll send a code to ${maskedEmail ?? "your alternate email"}.`
              : `We'll send a code to ${maskedPhone ?? "your alternate phone"}.`}
          </p>
          {!codeSent ? (
            <Button
              type="button"
              className="h-11 w-full"
              disabled={loading}
              onClick={sendCode}
            >
              {loading ? "Sending…" : "Send verification code"}
            </Button>
          ) : (
            <div className="space-y-3">
              <Input
                id="code"
                label="Verification code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="000000"
                maxLength={6}
                required
                className="text-center text-lg tracking-widest"
              />
              <button
                type="button"
                onClick={sendCode}
                disabled={loading}
                className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
              >
                Resend code
              </button>
            </div>
          )}
        </div>
      )}

      <Button
        type="submit"
        className="h-11 w-full"
        disabled={
          loading ||
          code.length !== 6 ||
          ((method === "email" || method === "sms") && !codeSent)
        }
      >
        {loading ? "Verifying…" : "Verify & sign in"}
      </Button>
    </form>
  );
}
