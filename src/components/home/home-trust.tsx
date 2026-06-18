"use client";

import {
  BarChart3,
  Check,
  CreditCard,
  Shield,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import { AnimateOnScroll } from "@/components/motion/animate-on-scroll";
import { AnimatedCounter } from "@/components/motion/animated-counter";
import {
  HOME_CARD,
  HOME_DESCRIPTION,
  HOME_EYEBROW,
  HOME_GRID,
  HOME_INNER,
  HOME_SECTION,
  HOME_SECTION_CENTERED,
  HOME_TITLE,
  homeStaggerDelay,
} from "@/components/home/home-polish";
import { cn } from "@/lib/utils";

const ENTERPRISE_SIGNALS = [
  { icon: Shield, label: "Enterprise-ready" },
  { icon: Sparkles, label: "AI-native platform" },
  { icon: CreditCard, label: "No credit card" },
  { icon: Check, label: "Free tier available" },
] as const;

const TRUST_ORGS = [
  "Northwind Logistics",
  "Globex Industries",
  "Acme Corp",
] as const;

const OUTCOME_METRICS = [
  {
    value: "95",
    suffix: "%",
    label: "Completion increase",
    detail: "Gamification and AI nudges keep learners on track",
    icon: TrendingUp,
    color: "text-emerald-500",
    iconBg: "bg-emerald-50 dark:bg-emerald-950/40",
  },
  {
    value: "40",
    suffix: "%",
    label: "Training cost reduction",
    detail: "Less manual course creation and admin overhead",
    icon: TrendingDown,
    color: "text-brand-500",
    iconBg: "bg-brand-50 dark:bg-brand-950/40",
  },
  {
    value: "3",
    suffix: "x",
    label: "Faster onboarding",
    detail: "AI-generated paths for new hires",
    icon: Zap,
    color: "text-violet-500",
    iconBg: "bg-violet-50 dark:bg-violet-950/40",
  },
  {
    value: "10000",
    suffix: "+",
    label: "Learning sessions",
    detail: "Active practice across courses and AI tools",
    icon: BarChart3,
    color: "text-accent-cyan",
    iconBg: "bg-cyan-50 dark:bg-cyan-950/40",
    plusInValue: true,
  },
] as const;

const PLATFORM_STATS = [
  { value: "7+", label: "Expert-led courses", color: "text-brand-500" },
  { value: "50+", label: "Lessons available", color: "text-accent-violet" },
  { value: "5+", label: "AI learning tools", color: "text-accent-emerald" },
  { value: "Free & paid", label: "Courses for every budget", color: "text-accent-amber" },
] as const;

export function HomeTrust() {
  return (
    <section className="border-y border-border bg-panel/60 backdrop-blur-sm">
      <div className={cn(HOME_INNER, HOME_SECTION)}>
        <AnimateOnScroll className={HOME_SECTION_CENTERED}>
          <p className={HOME_EYEBROW}>Proof at a glance</p>
          <h2 className={cn("mt-2", HOME_TITLE)}>Trusted by growing teams</h2>
          <p className={HOME_DESCRIPTION}>
            Enterprise-ready infrastructure, measurable outcomes, and a catalog that
            scales with your workforce.
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll delay={homeStaggerDelay(1)} className="mt-6">
          <ul className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {ENTERPRISE_SIGNALS.map((item) => {
              const Icon = item.icon;
              return (
                <li
                  key={item.label}
                  className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-panel/80 px-3 py-1.5 text-sm font-medium text-ink shadow-sm"
                >
                  <Icon className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" aria-hidden />
                  {item.label}
                </li>
              );
            })}
          </ul>
        </AnimateOnScroll>

        <AnimateOnScroll delay={100} className="mt-6">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted">
            Used by learning teams at
          </p>
          <ul className="mt-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {TRUST_ORGS.map((org) => (
              <li
                key={org}
                className="text-sm font-semibold text-ink/70 dark:text-ink/60"
              >
                {org}
              </li>
            ))}
          </ul>
        </AnimateOnScroll>

        <div className={cn(HOME_GRID, "sm:grid-cols-2 lg:grid-cols-4")}>
          {OUTCOME_METRICS.map((metric, i) => {
            const Icon = metric.icon;
            const counterValue =
              "plusInValue" in metric && metric.plusInValue
                ? `${metric.value}+`
                : metric.value;
            const counterSuffix =
              "plusInValue" in metric && metric.plusInValue ? "" : metric.suffix;

            return (
              <AnimateOnScroll key={metric.label} delay={homeStaggerDelay(i, 60) + 120} animation="fade-up">
                <div className={cn(HOME_CARD, "flex h-full flex-col p-4 text-center")}>
                  <div
                    className={cn(
                      "mx-auto flex h-9 w-9 items-center justify-center rounded-xl",
                      metric.iconBg
                    )}
                  >
                    <Icon className={cn("h-4 w-4", metric.color)} aria-hidden />
                  </div>
                  <div className="mt-2 [&_p:first-child]:text-3xl [&_p:first-child]:font-extrabold">
                    <AnimatedCounter
                      value={counterValue}
                      suffix={counterSuffix}
                      label={metric.label}
                      color={metric.color}
                      compact
                    />
                  </div>
                  <p className="-mt-1 flex-1 text-xs leading-relaxed text-muted">
                    {metric.detail}
                  </p>
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>
      </div>

      <div className="border-t border-border/80 px-4 sm:px-6 lg:px-8">
        <div className={cn(HOME_INNER, "grid grid-cols-2 divide-x divide-border sm:grid-cols-4")}>
          {PLATFORM_STATS.map((stat) => (
            <AnimatedCounter
              key={stat.label}
              value={stat.value}
              label={stat.label}
              color={stat.color}
              compact
            />
          ))}
        </div>
      </div>
    </section>
  );
}
