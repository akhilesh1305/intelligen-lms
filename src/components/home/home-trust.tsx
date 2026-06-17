"use client";

import { AnimateOnScroll } from "@/components/motion/animate-on-scroll";
import { AnimatedCounter } from "@/components/motion/animated-counter";

const KPIS = [
  {
    value: "95",
    suffix: "%",
    label: "Course Completion Improvement",
    color: "text-brand-500",
  },
  {
    value: "40",
    suffix: "%",
    label: "Training Cost Reduction",
    color: "text-emerald-500",
  },
  {
    value: "3",
    suffix: "x",
    label: "Faster Onboarding",
    color: "text-accent-violet",
  },
  {
    value: "10000",
    suffix: "+",
    label: "Learning Sessions",
    color: "text-accent-cyan",
    plusInValue: true,
  },
] as const;

export function HomeTrust() {
  return (
    <section className="border-y border-border bg-panel/60 px-4 py-24 backdrop-blur-sm sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimateOnScroll className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Trusted by Growing Teams
          </h2>
          <p className="mt-4 text-lg text-muted">
            Organizations use IntelliGen LMS to streamline onboarding, compliance
            training, and workforce development.
          </p>
        </AnimateOnScroll>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {KPIS.map((kpi, i) => (
            <AnimateOnScroll key={kpi.label} delay={i * 70} animation="fade-up">
              <div className="glass-card rounded-[20px] p-6 text-center transition-all duration-300 motion-safe:hover:-translate-y-1.5 motion-safe:hover:shadow-card-hover">
                <AnimatedCounter
                  value={"plusInValue" in kpi && kpi.plusInValue ? `${kpi.value}+` : kpi.value}
                  suffix={"plusInValue" in kpi && kpi.plusInValue ? "" : kpi.suffix}
                  label={kpi.label}
                  color={kpi.color}
                  compact
                />
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
