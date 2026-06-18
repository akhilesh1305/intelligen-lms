"use client";

import Link from "next/link";
import {
  BarChart3,
  Bot,
  Brain,
  Map,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { AnimateOnScroll } from "@/components/motion/animate-on-scroll";
import { GradientOrbs } from "@/components/decorative/gradient-orbs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const AI_CAPABILITIES = [
  {
    icon: Sparkles,
    title: "AI Course Generator",
    description:
      "Turn documents and outlines into structured modules, lessons, and publish-ready courses.",
    gradient: "from-brand-500 to-violet-600",
    href: "/ai",
  },
  {
    icon: Brain,
    title: "AI Quiz Builder",
    description:
      "Generate assessments from your content with difficulty tuning and instant learner feedback.",
    gradient: "from-violet-500 to-fuchsia-500",
    href: "/ai",
  },
  {
    icon: Bot,
    title: "AI Tutor",
    description:
      "Context-aware coaching, lesson help, and career guidance powered by your learning data.",
    gradient: "from-cyan-500 to-brand-500",
    href: "/coach",
  },
  {
    icon: Map,
    title: "AI Learning Paths",
    description:
      "Personalized roadmaps that adapt to roles, skills, and completion goals across your org.",
    gradient: "from-emerald-500 to-teal-500",
    href: "/paths",
  },
  {
    icon: BarChart3,
    title: "AI Analytics",
    description:
      "Surface completion risks, engagement trends, and training ROI with smart dashboards.",
    gradient: "from-amber-500 to-orange-500",
    href: "/dashboard",
  },
] as const;

export function HomeAiShowcase() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-panel py-24 dark:bg-slate-950/50">
      <GradientOrbs className="opacity-60" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-500/25 bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
            <Sparkles className="h-4 w-4" aria-hidden />
            AI-native LMS
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            The AI Engine Behind IntelliGen LMS
          </h2>
          <p className="mt-4 text-lg text-muted">
            Traditional LMS platforms store content. IntelliGen builds, coaches, and
            optimizes learning — so teams ship training faster and learners stay engaged.
          </p>
        </AnimateOnScroll>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {AI_CAPABILITIES.map((item, i) => {
            const Icon = item.icon;
            return (
              <AnimateOnScroll key={item.title} delay={i * 70} animation="fade-up">
                <Link
                  href={item.href}
                  className={cn(
                    "glass-card group flex h-full flex-col rounded-[20px] border border-border/80 p-6",
                    "transition-all duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-card-hover",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
                    i === 0 && "sm:col-span-2 lg:col-span-1"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm transition-transform duration-300 motion-safe:group-hover:scale-105",
                      item.gradient
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-ink">{item.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                    {item.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 transition-colors group-hover:text-brand-700 dark:text-brand-400">
                    Explore
                    <ArrowRight className="h-3.5 w-3.5 transition-transform motion-safe:group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </AnimateOnScroll>
            );
          })}
        </div>

        <AnimateOnScroll delay={200} className="mt-12 text-center">
          <Link href="/ai">
            <Button size="lg" className="motion-safe:hover:scale-[1.02]">
              <Sparkles className="h-4 w-4" />
              Explore AI tools
            </Button>
          </Link>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
