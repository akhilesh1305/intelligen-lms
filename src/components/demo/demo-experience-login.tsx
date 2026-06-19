"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, GraduationCap, Loader2 } from "lucide-react";
import { DEMO_ACCOUNTS } from "@/lib/demo/accounts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DemoEnvironmentBadge } from "./demo-environment-badge";

const icons = {
  ADMIN: BarChart3,
  STUDENT: GraduationCap,
};

export function DemoExperienceLogin() {
  const router = useRouter();
  const [loadingEmail, setLoadingEmail] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function signInAs(email: string, password: string) {
    setError("");
    setLoadingEmail(email);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: email, password }),
    });

    const data = await res.json();
    setLoadingEmail(null);

    if (!res.ok) {
      setError(data.error || "Demo sign-in failed. Run npm run db:seed to create demo accounts.");
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
    <div className="mt-8 border-t border-border pt-8" data-screenshot-clutter>
      <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
        <DemoEnvironmentBadge />
        <p className="text-center text-sm text-muted">
          Explore the platform instantly — no setup required
        </p>
      </div>

      {error ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        {DEMO_ACCOUNTS.map((account) => {
          const Icon = icons[account.role];
          const loading = loadingEmail === account.email;

          return (
            <Card
              key={account.email}
              className="overflow-hidden border-amber-200/60 bg-gradient-to-br from-amber-50/50 to-panel dark:border-amber-900/40 dark:from-amber-950/20"
            >
              <CardContent className="flex h-full flex-col p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-ink">{account.label}</p>
                    <p className="mt-0.5 text-xs text-muted">{account.description}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="soft"
                  size="sm"
                  className="mt-4 w-full border-amber-200/80 bg-white/80 dark:border-amber-800 dark:bg-amber-950/30"
                  disabled={!!loadingEmail}
                  onClick={() => signInAs(account.email, account.password)}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    `Enter as ${account.label}`
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <p className="mt-3 text-center text-xs text-muted">
        Password: <code className="rounded bg-surface px-1.5 py-0.5">password123</code>
      </p>
    </div>
  );
}
