"use client";

import Link from "next/link";
import { ArrowRight, Medal, Star, Trophy } from "lucide-react";
import { AnimateOnScroll } from "@/components/motion/animate-on-scroll";
import {
  HOME_CARD,
  HOME_DESCRIPTION,
  HOME_EYEBROW,
  HOME_ICON_TILE,
  HOME_INNER,
  HOME_SECTION,
  HOME_TITLE,
  homeStaggerDelay,
} from "@/components/home/home-polish";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PILLARS = [
  {
    icon: Star,
    title: "Earn recognition",
    description: "Reward consistent learning with points for lessons, quizzes, and streaks.",
    color: "from-amber-400 to-orange-500",
  },
  {
    icon: Medal,
    title: "Celebrate milestones",
    description: "Unlock achievements as learners hit goals and complete programs.",
    color: "from-violet-500 to-brand-500",
  },
  {
    icon: Trophy,
    title: "Drive friendly competition",
    description: "Leaderboards motivate teams across departments and organizations.",
    color: "from-cyan-500 to-brand-500",
  },
] as const;

export function HomeGamification() {
  return (
    <section className={HOME_SECTION}>
      <div className={HOME_INNER}>
        <div className="overflow-hidden rounded-[20px] border border-border bg-gradient-to-br from-brand-50/70 via-panel to-accent-cyan-light/30 p-5 shadow-card dark:from-brand-950/25 dark:via-panel dark:to-cyan-950/15 sm:p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
            <AnimateOnScroll className="min-w-0 max-w-md text-center lg:text-left">
              <p className={HOME_EYEBROW}>Engagement</p>
              <h2 className={cn("mt-2", HOME_TITLE)}>Keep learners coming back</h2>
              <p className={HOME_DESCRIPTION}>
                Increase learner engagement through points, badges, and challenges
                built into every course.
              </p>
              <Link href="/games" className="mt-4 inline-block">
                <Button size="md" className="motion-safe:hover:scale-[1.02]">
                  Explore Game Hub
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </AnimateOnScroll>

            <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-3 lg:max-w-2xl">
              {PILLARS.map((pillar, i) => {
                const Icon = pillar.icon;
                return (
                  <AnimateOnScroll key={pillar.title} delay={homeStaggerDelay(i)} animation="fade-up">
                    <div className={cn(HOME_CARD, "group flex h-full items-start gap-3 p-3.5")}>
                      <div className={cn(HOME_ICON_TILE, pillar.color)}>
                        <Icon className="h-4 w-4" aria-hidden />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-ink">{pillar.title}</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-muted">
                          {pillar.description}
                        </p>
                      </div>
                    </div>
                  </AnimateOnScroll>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
