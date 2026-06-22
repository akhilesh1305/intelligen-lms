"use client";

import Link from "next/link";
import {
  BarChart3,
  Bot,
  Map,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { AnimateOnScroll } from "@/components/motion/animate-on-scroll";
import { GradientOrbs } from "@/components/decorative/gradient-orbs";
import {
  HOME_CARD,
  HOME_CARD_FOCUS,
  HOME_DESCRIPTION,
  HOME_EYEBROW,
  HOME_GRID,
  HOME_ICON_TILE,
  HOME_INNER,
  HOME_SECTION,
  HOME_SECTION_CENTERED,
  HOME_TITLE,
  homeStaggerDelay,
} from "@/components/home/home-polish";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const AI_CAPABILITIES = [
  {
    icon: Sparkles,
    title: "Create",
    description:
      "Generate full courses and quizzes from documents, outlines, or existing content — ready to publish in minutes.",
    gradient: "from-brand-500 to-violet-600",
    href: "/ai",
  },
  {
    icon: Bot,
    title: "Coach",
    description:
      "AI tutor and corporate coach deliver lesson help, career guidance, and answers grounded in learner context.",
    gradient: "from-cyan-500 to-brand-500",
    href: "/coach",
  },
  {
    icon: Map,
    title: "Personalize",
    description:
      "Adaptive learning paths and skill recommendations align training to each role and goal.",
    gradient: "from-emerald-500 to-teal-500",
    href: "/paths",
  },
  {
    icon: BarChart3,
    title: "Optimize",
    description:
      "AI-assisted analytics surface at-risk learners, engagement trends, and training ROI before deadlines slip.",
    gradient: "from-amber-500 to-orange-500",
    href: "/dashboard",
  },
] as const;

export function HomeAiShowcase() {
  return (
    <section className={cn("relative overflow-hidden border-y border-border bg-panel dark:bg-slate-950/50", HOME_SECTION)}>
      <GradientOrbs className="opacity-60" />
      <div className={HOME_INNER}>
        <AnimateOnScroll className={HOME_SECTION_CENTERED}>
          <p className={HOME_EYEBROW}>AI-native LMS</p>
          <h2 className={cn("mt-2", HOME_TITLE)}>The AI engine behind IntelliGen LMS</h2>
          <p className={HOME_DESCRIPTION}>
            One intelligent layer across creation, coaching, personalization, and
            optimization — so L&D ships faster and learners get more from every hour.
          </p>
        </AnimateOnScroll>

        <div className={cn(HOME_GRID, "sm:grid-cols-2 lg:grid-cols-4")}>
          {AI_CAPABILITIES.map((item, i) => {
            const Icon = item.icon;
            return (
              <AnimateOnScroll key={item.title} delay={homeStaggerDelay(i)} animation="fade-up">
                <Link
                  href={item.href}
                  data-ai-cursor
                  className={cn(
                    HOME_CARD,
                    HOME_CARD_FOCUS,
                    "group flex h-full min-w-0 flex-col p-5"
                  )}
                >
                  <div className={cn(HOME_ICON_TILE, item.gradient)}>
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="mt-3 text-base font-bold text-ink sm:text-lg">{item.title}</h3>
                  <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">
                    {item.description}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 transition-colors group-hover:text-brand-700 dark:text-brand-400">
                    Explore
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 motion-safe:group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </AnimateOnScroll>
            );
          })}
        </div>

        <AnimateOnScroll delay={180} className="mt-8 text-center">
          <Link href="/ai">
            <Button size="lg" className="motion-safe:hover:scale-[1.02]">
              <Sparkles className="h-4 w-4" />
              Explore AI in action
            </Button>
          </Link>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
