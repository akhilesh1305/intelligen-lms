"use client";

import { SsoProvider } from "@prisma/client";
import { Button } from "@/components/ui/button";

const PROVIDER_LABELS: Record<SsoProvider, string> = {
  GOOGLE: "Continue with Google",
  MICROSOFT: "Continue with Microsoft",
  OKTA: "Continue with Okta",
};

export function SsoButtons({
  providers,
  variant = "light",
}: {
  providers: SsoProvider[];
  variant?: "light" | "dark";
}) {
  if (providers.length === 0) return null;

  const isDark = variant === "dark";

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span
            className={`w-full border-t ${isDark ? "border-slate-700" : "border-slate-200"}`}
          />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span
            className={`px-2 ${isDark ? "bg-[#1a1a1a] text-slate-500" : "bg-panel text-muted"}`}
          >
            Or continue with
          </span>
        </div>
      </div>
      <div className="space-y-2">
        {providers.map((provider) => (
          <Button
            key={provider}
            type="button"
            variant="outline"
            className={
              isDark
                ? "w-full border-slate-600 bg-transparent text-white hover:bg-slate-800"
                : "w-full"
            }
            onClick={() => {
              window.location.href = `/api/auth/sso/${provider.toLowerCase()}`;
            }}
          >
            {PROVIDER_LABELS[provider]}
          </Button>
        ))}
      </div>
    </div>
  );
}
