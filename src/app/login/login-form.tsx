"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { cn } from "@/lib/utils";

type LoginMode = "email" | "phone";

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<LoginMode>("email");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const identifier = String(formData.get("identifier") ?? "").trim();

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identifier,
        password: formData.get("password"),
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Login failed");
      return;
    }

    if (data.requires2fa) {
      router.push("/login/2fa");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      ) : null}

      <div className="space-y-3">
        <p className="text-sm font-semibold text-ink">Sign in with</p>
        <div className="grid grid-cols-2 gap-2 rounded-xl border border-border bg-surface p-1">
          <button
            type="button"
            onClick={() => setMode("email")}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200",
              mode === "email"
                ? "bg-brand-600 text-white shadow-sm"
                : "text-muted hover:bg-panel hover:text-ink"
            )}
          >
            <Mail className="h-4 w-4" />
            Email
          </button>
          <button
            type="button"
            onClick={() => setMode("phone")}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200",
              mode === "phone"
                ? "bg-brand-600 text-white shadow-sm"
                : "text-muted hover:bg-panel hover:text-ink"
            )}
          >
            <Smartphone className="h-4 w-4" />
            Mobile
          </button>
        </div>
      </div>

      {mode === "email" ? (
        <Input
          id="login-email"
          name="identifier"
          type="email"
          label="Email address"
          autoComplete="email"
          placeholder="you@example.com"
          required
        />
      ) : (
        <PhoneInput
          id="login-phone"
          name="identifier"
          label="Mobile number"
          defaultCountry="IN"
          required
          helperText="Pick your country code, then enter your mobile number."
        />
      )}

      <Input
        id="password"
        name="password"
        type="password"
        label="Password"
        placeholder="••••••••"
        required
        autoComplete="current-password"
      />

      <Button type="submit" className="h-11 w-full" disabled={loading}>
        {loading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
