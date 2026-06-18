"use client";

import { TrendingDown, TrendingUp, Zap } from "lucide-react";
import { AnimateOnScroll } from "@/components/motion/animate-on-scroll";
import { cn } from "@/lib/utils";

const METRICS = [
  {
    value: "95%",
    label: "Completion increase",
    detail: "Teams using gamification + AI nudges",
    icon: TrendingUp,
    color: "text-emerald-500",
  },
  {
    value: "40%",
    label: "Training cost reduction",
    detail: "Less manual course creation & admin",
    icon: TrendingDown,
    color: "text-brand-500",
  },
  {
    value: "3x",
    label: "Faster onboarding",
    detail: "AI-generated paths for new hires",
    icon: Zap,
    color: "text-violet-500",
  },
] as const;

export function HomeSuccessMetrics() {
  return (
    <section className="border-b border-border bg-gradient-to-b from-panel to-canvas py-20 dark:from-slate-950/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">
            Customer outcomes
          </p>
          <h2 className="mt-3 text-3xl font-bold text-ink sm:text-4xl">
            Results teams report after switching
          </h2>
          <p className="mt-3 text-muted">
            IntelliGen LMS combines AI automation with engagement mechanics designed for
            modern enterprise learning.
          </p>
        </AnimateOnScroll>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {METRICS.map((metric, i) => {
            const Icon = metric.icon;
            return (
              <AnimateOnScroll key={metric.label} delay={i * 80} animation="fade-up">
                <div className="glass-card h-full rounded-[20px] border border-border/80 p-6 text-center transition-all duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-card-hover">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-950/40">
                    <Icon className={cn("h-5 w-5", metric.color)} aria-hidden />
                  </div>
                  <p className="mt-4 text-4xl font-extrabold tabular-nums text-ink">
                    {metric.value}
                  </p>
                  <p className="mt-1 text-base font-bold text-ink">{metric.label}</p>
                  <p className="mt-2 text-sm text-muted">{metric.detail}</p>
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
