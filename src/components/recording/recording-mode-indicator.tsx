"use client";

import { X } from "lucide-react";
import { useRecordingMode } from "./recording-mode-provider";
import { Button } from "@/components/ui/button";

export function RecordingModeIndicator() {
  const { enabled, disable } = useRecordingMode();

  if (!enabled) return null;

  return (
    <div
      data-recording-exempt
      className="fixed left-1/2 top-4 z-[100] flex -translate-x-1/2 items-center gap-3 rounded-full border border-rose-200/90 bg-panel/95 px-4 py-2 shadow-elevated backdrop-blur-sm dark:border-rose-900/50"
      role="status"
      aria-live="polite"
    >
      <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden>
        <span className="recording-mode-dot absolute inline-flex h-full w-full rounded-full bg-rose-500" />
      </span>
      <p className="text-sm font-semibold text-ink">Recording Mode Enabled</p>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={disable}
        className="h-8 shrink-0 px-2"
        aria-label="Exit recording mode"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
