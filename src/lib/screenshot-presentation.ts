export type ScreenshotCalloutAccent = "brand" | "emerald" | "amber" | "violet" | "cyan";

/** Percentage-based anchor on the screenshot canvas (0–100). */
export type ScreenshotCallout = {
  id: string;
  /** Short label — scannable in under 1s */
  label: string;
  /** Outcome line — completes the value story */
  value: string;
  top: number;
  left: number;
  align?: "left" | "right";
  accent?: ScreenshotCalloutAccent;
};

export type ScreenshotPresentationMeta = {
  /** One-line value read in ~3 seconds */
  valueHeadline: string;
  /** Badge on the browser chrome */
  sceneLabel?: string;
  callouts: ScreenshotCallout[];
};

export const CALLOUT_ACCENT_CLASS: Record<
  ScreenshotCalloutAccent,
  { dot: string; ring: string; badge: string; line: string }
> = {
  brand: {
    dot: "bg-brand-500",
    ring: "ring-brand-400/60",
    badge: "border-brand-300/80 bg-brand-600/95 text-white dark:border-brand-700",
    line: "from-brand-500/80",
  },
  emerald: {
    dot: "bg-emerald-500",
    ring: "ring-emerald-400/60",
    badge: "border-emerald-300/80 bg-emerald-600/95 text-white dark:border-emerald-700",
    line: "from-emerald-500/80",
  },
  amber: {
    dot: "bg-amber-500",
    ring: "ring-amber-400/60",
    badge: "border-amber-300/80 bg-amber-600/95 text-white dark:border-amber-700",
    line: "from-amber-500/80",
  },
  violet: {
    dot: "bg-violet-500",
    ring: "ring-violet-400/60",
    badge: "border-violet-300/80 bg-violet-600/95 text-white dark:border-violet-700",
    line: "from-violet-500/80",
  },
  cyan: {
    dot: "bg-cyan-500",
    ring: "ring-cyan-400/60",
    badge: "border-cyan-300/80 bg-cyan-600/95 text-white dark:border-cyan-700",
    line: "from-cyan-500/80",
  },
};
