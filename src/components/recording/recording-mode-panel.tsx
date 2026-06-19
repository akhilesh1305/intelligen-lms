"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BarChart3,
  CheckCircle2,
  GraduationCap,
  Loader2,
  MonitorPlay,
  Video,
} from "lucide-react";
import { DEMO_ACCOUNTS } from "@/lib/demo/accounts";
import { useRecordingMode } from "./recording-mode-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const RECORDING_ROUTES = [
  { label: "Homepage", href: "/" },
  { label: "Admin dashboard", href: "/dashboard" },
  { label: "Certificates", href: "/certificates" },
  { label: "AI tools", href: "/ai" },
  { label: "Games hub", href: "/games" },
  { label: "Product tour", href: "/product-tour" },
];

const demoIcons = {
  ADMIN: BarChart3,
  STUDENT: GraduationCap,
} as const;

export function RecordingModePanel() {
  const router = useRouter();
  const { enabled, enable, disable } = useRecordingMode();
  const [loadingEmail, setLoadingEmail] = useState<string | null>(null);
  const [loginError, setLoginError] = useState("");
  const [justEnabled, setJustEnabled] = useState(false);

  async function signInAsDemo(email: string, password: string) {
    setLoginError("");
    setLoadingEmail(email);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: email, password }),
    });

    const data = (await res.json()) as { error?: string; requires2FA?: boolean };

    setLoadingEmail(null);

    if (!res.ok) {
      setLoginError(data.error ?? "Could not sign in. Run npm run db:seed if demo accounts are missing.");
      return;
    }

    if (data.requires2FA) {
      setLoginError("Demo accounts should not require 2FA. Check security settings.");
      router.push("/login/2fa");
      return;
    }

    router.refresh();
  }

  function handleEnable() {
    enable();
    setJustEnabled(true);
    window.setTimeout(() => setJustEnabled(false), 4000);
  }

  return (
    <div className="space-y-8">
      <Card className="border-rose-200/60 bg-gradient-to-br from-rose-50/80 via-panel to-brand-50/40 shadow-card dark:border-rose-900/40 dark:from-rose-950/30 dark:via-panel dark:to-brand-950/20">
        <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-rose-600 dark:text-rose-400">
              Demo recording
            </p>
            <h2 className="mt-2 text-xl font-bold text-ink">Demo Recording Toggle</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Client-only presentation layer for screen recordings. Disables distracting motion,
              hides notifications and promo chrome, expands dashboard charts, and waits for analytics
              to render — without changing backend data or affecting other users.
            </p>
            {(justEnabled || enabled) && (
              <p
                className={cn(
                  "mt-3 flex items-center gap-2 text-sm font-medium",
                  enabled ? "text-emerald-700 dark:text-emerald-300" : "text-muted"
                )}
                role="status"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
                {enabled
                  ? "Recording Mode Enabled — navigate to your scene and start capturing."
                  : "Enabling…"}
              </p>
            )}
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:items-end">
            {enabled ? (
              <Button type="button" variant="outline" size="lg" onClick={disable} className="gap-2">
                <MonitorPlay className="h-5 w-5" aria-hidden />
                Stop Recording Mode
              </Button>
            ) : (
              <Button type="button" size="lg" onClick={handleEnable} className="gap-2">
                <Video className="h-5 w-5" aria-hidden />
                Enable Recording Mode
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-ink">1 · Load realistic demo data</h3>
          <p className="mt-2 text-sm text-muted">
            Sign in with a demo account so dashboards, certificates, and games show rich sample
            content. Uses existing demo accounts — no API or database changes.
          </p>
          {loginError ? (
            <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
              {loginError}
            </p>
          ) : null}
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {DEMO_ACCOUNTS.map((account) => {
              const Icon = demoIcons[account.role];
              const loading = loadingEmail === account.email;
              return (
                <button
                  key={account.email}
                  type="button"
                  disabled={loading}
                  onClick={() => signInAsDemo(account.email, account.password)}
                  className="flex items-start gap-3 rounded-xl border border-border bg-surface/50 p-4 text-left transition-colors hover:border-brand-300 hover:bg-brand-50/50 disabled:opacity-60 dark:hover:border-brand-700 dark:hover:bg-brand-950/30"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                    ) : (
                      <Icon className="h-5 w-5" aria-hidden />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-ink">{account.label}</p>
                    <p className="mt-0.5 text-xs text-muted">{account.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-ink">2 · What Recording Mode does</h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              "Disables looping floats, pulses, and scroll-reveal distractions",
              "Keeps smooth UI transitions (hover, theme, panels)",
              "Hides promo bars, demo badges, notifications, and assistant widget",
              "Expands dashboard chart areas for clearer analytics shots",
              "Waits for Recharts SVGs before marking charts ready",
              "Shows a Recording Mode Enabled indicator while active",
            ].map((item) => (
              <li key={item} className="flex gap-2 text-sm text-muted">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-ink">3 · Suggested recording routes</h3>
          <p className="mt-2 text-sm text-muted">
            Enable Recording Mode first, then open each scene in a new tab at 1440×900.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {RECORDING_ROUTES.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  if (!enabled) enable();
                }}
                className="inline-flex h-9 items-center rounded-lg border border-border bg-panel px-3 text-sm font-medium text-ink transition-colors hover:bg-surface"
              >
                {route.label}
              </Link>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted">
            Also see{" "}
            <Link href="/admin/screenshots-guide" className="font-medium text-brand-600 hover:underline">
              Screenshot guide
            </Link>{" "}
            for static capture framing.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
