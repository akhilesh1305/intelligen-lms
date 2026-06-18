"use client";

import Image from "next/image";
import { Award, GraduationCap, Smartphone, TrendingUp } from "lucide-react";
import { AnimateOnScroll } from "@/components/motion/animate-on-scroll";
import { FeatureCard } from "@/components/ui/feature-card";
import { GradientOrbs } from "@/components/decorative/gradient-orbs";
import {
  HOME_DESCRIPTION,
  HOME_EYEBROW,
  HOME_GRID,
  HOME_INNER,
  HOME_SECTION,
  HOME_TITLE,
  homeStaggerDelay,
} from "@/components/home/home-polish";
import { HOME_SECTION_IMAGES } from "@/lib/home-images";
import { cn } from "@/lib/utils";

const benefits = [
  {
    icon: Smartphone,
    title: "Learn on your schedule",
    description:
      "Self-paced lessons on any device — start, pause, and resume whenever it fits your day.",
    gradient: "from-brand-500 to-accent-cyan",
  },
  {
    icon: GraduationCap,
    title: "Expert-led content",
    description:
      "Courses built by practitioners with real-world depth, not generic slide decks.",
    gradient: "from-violet-500 to-brand-500",
  },
  {
    icon: TrendingUp,
    title: "Progress you can see",
    description:
      "Clear milestones and completion tracking keep motivation high from first lesson to finish.",
    gradient: "from-emerald-500 to-accent-cyan",
  },
  {
    icon: Award,
    title: "Credentials that count",
    description:
      "Earn verified certificates you can share with managers, recruiters, and LinkedIn.",
    gradient: "from-amber-500 to-orange-500",
  },
];

export function HomeBenefits() {
  return (
    <section className={cn("relative", HOME_SECTION)}>
      <GradientOrbs variant="section" className="opacity-60" />
      <div className={HOME_INNER}>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-brand-50/80 via-panel to-accent-cyan-light/50 shadow-elevated backdrop-blur-sm dark:from-brand-500/10 dark:via-panel dark:to-accent-cyan-light">
          <div className="grid lg:grid-cols-2">
            <div className="relative hidden min-h-[240px] lg:block lg:min-h-[260px]">
              <Image
                src={HOME_SECTION_IMAGES.benefits}
                alt="Learning on any device"
                fill
                className="object-cover"
                sizes="50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-panel/95 dark:to-panel/85" />
            </div>

            <div className="p-6 sm:p-8 lg:p-10">
              <AnimateOnScroll>
                <p className={HOME_EYEBROW}>For learners</p>
                <h2 className={cn("mt-2", HOME_TITLE)}>
                  Why learners choose{" "}
                  <span className="gradient-text">IntelliGen</span>
                </h2>
                <p className={HOME_DESCRIPTION}>
                  A focused experience from enrollment to certificate
                </p>
              </AnimateOnScroll>

              <div className={cn(HOME_GRID, "grid-cols-1 sm:grid-cols-2")}>
                {benefits.map((benefit, i) => (
                  <AnimateOnScroll
                    key={benefit.title}
                    delay={homeStaggerDelay(i)}
                    animation="fade-up"
                  >
                    <FeatureCard {...benefit} compact className="h-full bg-panel/70" />
                  </AnimateOnScroll>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
