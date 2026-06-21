"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ShowcaseBrowserFrame({
  children,
  url = "intelligenlms.com",
  badge,
  className,
}: {
  children: ReactNode;
  url?: string;
  /** Scene label on the chrome — e.g. Dashboard, AI */
  badge?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[20px] border border-border/80 bg-panel shadow-elevated ring-1 ring-black/5 before:pointer-events-none before:absolute before:inset-0 before:rounded-[20px] before:ring-1 before:ring-inset before:ring-white/5 dark:ring-white/10",
        className
      )}
    >
      <div className="relative flex items-center gap-3 border-b border-border bg-gradient-to-r from-surface/90 via-panel to-surface/90 px-4 py-3 dark:from-slate-900/90 dark:via-slate-900/80 dark:to-slate-900/90">
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-3 w-3 rounded-full bg-red-400/90 shadow-sm" />
          <span className="h-3 w-3 rounded-full bg-amber-400/90 shadow-sm" />
          <span className="h-3 w-3 rounded-full bg-emerald-400/90 shadow-sm" />
        </div>
        <div className="min-w-0 flex-1 rounded-lg border border-border/60 bg-panel/80 px-3 py-1 text-center text-[11px] text-muted shadow-inner sm:text-xs">
          <span className="truncate">{url}</span>
        </div>
        {badge ? (
          <span className="shrink-0 rounded-full border border-brand-300/50 bg-brand-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white dark:border-brand-700">
            {badge}
          </span>
        ) : null}
      </div>
      <div className="relative bg-slate-950/95">{children}</div>
    </div>
  );
}
