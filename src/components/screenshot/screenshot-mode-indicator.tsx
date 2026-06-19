"use client";

import { Camera, X } from "lucide-react";
import { useScreenshotMode } from "./screenshot-mode-provider";
import { Button } from "@/components/ui/button";

export function ScreenshotModeIndicator() {
  const { enabled, disable } = useScreenshotMode();

  if (!enabled) return null;

  return (
    <div
      data-screenshot-exempt
      className="fixed bottom-4 left-4 z-[100] flex max-w-sm items-center gap-3 rounded-xl border border-brand-200/80 bg-panel/95 px-4 py-3 shadow-elevated backdrop-blur-sm dark:border-brand-800/60"
      role="status"
      aria-live="polite"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
        <Camera className="h-4 w-4" aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink">Screenshot Mode</p>
        <p className="text-xs text-muted">Clutter hidden · client-only</p>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={disable}
        className="shrink-0"
        aria-label="Exit screenshot mode"
      >
        <X className="h-4 w-4" />
        Exit
      </Button>
    </div>
  );
}
