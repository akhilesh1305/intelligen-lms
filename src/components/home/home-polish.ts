import { cn } from "@/lib/utils";

/** Prevent horizontal scroll from hero glow / float cards */
export const HOME_PAGE = "overflow-x-clip";

/** Shared homepage layout + motion tokens */
export const HOME_SECTION = "px-4 py-12 sm:px-6 lg:px-8";

export const HOME_INNER = "mx-auto w-full max-w-7xl";

export const HOME_GRID = "mt-8 grid gap-4";

export const HOME_SECTION_CENTERED = "mx-auto max-w-3xl text-center";

export const HOME_SECTION_HEADER_CENTERED =
  "text-center [&_h2]:mx-auto [&_p]:mx-auto [&_p]:text-center";

export const HOME_EYEBROW =
  "text-xs font-bold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400 sm:text-sm sm:tracking-[0.2em]";

export const HOME_TITLE =
  "text-balance text-2xl font-bold tracking-tight text-ink sm:text-3xl";

export const HOME_DESCRIPTION =
  "mt-2 text-pretty text-sm leading-relaxed text-muted sm:text-base";

export const HOME_CARD =
  "glass-card rounded-[20px] border border-border/80 bg-panel/90 shadow-card backdrop-blur-sm transition-all duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:border-brand-400/30 motion-safe:hover:shadow-card-hover dark:bg-panel/80";

export const HOME_CARD_FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas";

export const HOME_ICON_TILE =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm transition-transform duration-300 motion-safe:group-hover:scale-105";

export function homeStaggerDelay(index: number, step = 60) {
  return index * step;
}

export function homeSectionIntroClass(centered = false, className?: string) {
  return cn(centered && HOME_SECTION_CENTERED, className);
}
