"use client";

import type { ReactNode } from "react";
import { AnimateOnScroll } from "@/components/motion/animate-on-scroll";
import {
  HOME_DESCRIPTION,
  HOME_EYEBROW,
  HOME_INNER,
  HOME_SECTION,
  HOME_SECTION_CENTERED,
  HOME_TITLE,
  STICKY_ANCHOR_MT,
} from "@/components/home/home-polish";
import { cn } from "@/lib/utils";

export function TourSection({
  id,
  eyebrow,
  title,
  description,
  children,
  centered = true,
  className,
  variant = "default",
  narrativeStep,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  centered?: boolean;
  className?: string;
  variant?: "default" | "panel" | "muted" | "problem" | "benefits";
  narrativeStep?: string;
}) {
  const bg =
    variant === "panel"
      ? "border-y border-border bg-panel dark:bg-slate-950/50"
      : variant === "muted"
        ? "bg-surface/50 dark:bg-slate-950/30"
        : variant === "problem"
          ? "border-b border-border bg-gradient-to-b from-rose-50/40 to-panel dark:from-rose-950/15 dark:to-slate-950"
          : variant === "benefits"
            ? "border-y border-border bg-gradient-to-b from-emerald-50/40 via-panel to-brand-50/30 dark:from-emerald-950/15 dark:via-slate-950 dark:to-brand-950/20"
            : "";

  return (
    <section id={id} className={cn(HOME_SECTION, bg, STICKY_ANCHOR_MT, className)}>
      <div className={HOME_INNER}>
        <AnimateOnScroll className={centered ? HOME_SECTION_CENTERED : undefined}>
          {narrativeStep ? (
            <p className="mb-3 inline-flex items-center rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-700 dark:border-brand-800 dark:bg-brand-950/40 dark:text-brand-300">
              {narrativeStep}
            </p>
          ) : null}
          <p className={HOME_EYEBROW}>{eyebrow}</p>
          <h2 className={cn("mt-2", HOME_TITLE)}>{title}</h2>
          <p className={HOME_DESCRIPTION}>{description}</p>
        </AnimateOnScroll>
        {children}
      </div>
    </section>
  );
}
