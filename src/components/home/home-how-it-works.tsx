"use client";

import { Award, BookOpen, UserPlus } from "lucide-react";
import { AnimateOnScroll } from "@/components/motion/animate-on-scroll";
import {
  HOME_CARD,
  HOME_GRID,
  HOME_INNER,
  HOME_SECTION,
  HOME_SECTION_HEADER_CENTERED,
  homeStaggerDelay,
} from "@/components/home/home-polish";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create your account",
    description: "Sign up in minutes. Invite your team or start solo — no credit card required.",
    gradient: "from-brand-500 to-violet-600",
  },
  {
    icon: BookOpen,
    step: "02",
    title: "Enroll & learn with AI",
    description: "Browse courses, get AI tutoring, quizzes, and personalized learning paths.",
    gradient: "from-cyan-500 to-brand-500",
  },
  {
    icon: Award,
    step: "03",
    title: "Earn credentials",
    description: "Complete courses, collect badges, and issue branded certificates to your team.",
    gradient: "from-emerald-500 to-cyan-500",
  },
];

export function HomeHowItWorks() {
  return (
    <section className={cn("border-y border-border bg-panel/40", HOME_SECTION)}>
      <div className={HOME_INNER}>
        <AnimateOnScroll>
          <SectionHeader
            eyebrow="Getting started"
            gradient
            title="How it works"
            description="From signup to certified teams in three steps."
            className={HOME_SECTION_HEADER_CENTERED}
          />
        </AnimateOnScroll>

        <div className={cn(HOME_GRID, "md:grid-cols-3")}>
          {STEPS.map((item, i) => (
            <AnimateOnScroll key={item.step} delay={homeStaggerDelay(i)} animation="fade-up">
              <article className={cn(HOME_CARD, "group relative h-full p-5")}>
                <span className="text-xs font-bold uppercase tracking-widest text-brand-500">
                  Step {item.step}
                </span>
                <div
                  className={cn(
                    "mt-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm transition-transform duration-300 motion-safe:group-hover:scale-105",
                    item.gradient
                  )}
                >
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-bold text-ink sm:text-lg">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
              </article>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
