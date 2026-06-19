"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ShowcaseBrowserFrame({
  children,
  url = "intelligenlms.com",
  className,
}: {
  children: ReactNode;
  url?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[20px] border border-border/80 bg-panel shadow-card ring-1 ring-black/5 dark:ring-white/10",
        className
      )}
    >
      <div className="flex items-center gap-3 border-b border-border bg-surface/80 px-4 py-3 dark:bg-slate-900/80">
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-3 w-3 rounded-full bg-red-400/90" />
          <span className="h-3 w-3 rounded-full bg-amber-400/90" />
          <span className="h-3 w-3 rounded-full bg-emerald-400/90" />
        </div>
        <div className="min-w-0 flex-1 rounded-lg border border-border/60 bg-panel px-3 py-1 text-center text-[11px] text-muted sm:text-xs">
          <span className="truncate">{url}</span>
        </div>
      </div>
      <div className="relative bg-slate-950/95">{children}</div>
    </div>
  );
}
