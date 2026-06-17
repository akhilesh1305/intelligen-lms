"use client";

import Image from "next/image";
import { Award, Globe, PlayCircle, TrendingUp } from "lucide-react";
import { AnimateOnScroll } from "@/components/motion/animate-on-scroll";
import { FeatureCard } from "@/components/ui/feature-card";
import { GradientOrbs } from "@/components/decorative/gradient-orbs";
import { HOME_SECTION_IMAGES } from "@/lib/home-images";

const benefits = [
  {
    icon: PlayCircle,
    title: "Learn at your own pace",
    description:
      "Access course materials anytime. Pause, rewind, and revisit lessons whenever you need.",
    gradient: "from-brand-500 to-accent-cyan",
  },
  {
    icon: Award,
    title: "Expert instructors",
    description:
      "Courses created by industry professionals with real-world experience.",
    gradient: "from-violet-500 to-brand-500",
  },
  {
    icon: TrendingUp,
    title: "Track your progress",
    description:
      "Visual progress tracking keeps you motivated and on path to completion.",
    gradient: "from-emerald-500 to-accent-cyan",
  },
  {
    icon: Globe,
    title: "Learn anywhere",
    description:
      "Responsive platform works seamlessly on desktop, tablet, and mobile.",
    gradient: "from-amber-500 to-orange-500",
  },
];

export function HomeBenefits() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <GradientOrbs variant="section" className="opacity-60" />
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-brand-50/80 via-panel to-accent-cyan-light/50 shadow-elevated backdrop-blur-sm dark:from-brand-500/10 dark:via-panel dark:to-accent-cyan-light">
        <div className="grid lg:grid-cols-2">
          <div className="relative hidden min-h-[320px] lg:block">
            <Image
              src={HOME_SECTION_IMAGES.benefits}
              alt="Learning on any device"
              fill
              className="object-cover"
              sizes="50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-panel/95 dark:to-panel/85" />
          </div>

          <div className="p-8 sm:p-12 lg:p-16">
            <AnimateOnScroll>
              <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                Why learners choose{" "}
                <span className="gradient-text">IntelliGen</span>
              </h2>
              <p className="mt-3 text-lg text-muted">
                A learning experience designed for real results
              </p>
            </AnimateOnScroll>

            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {benefits.map((benefit, i) => (
                <AnimateOnScroll
                  key={benefit.title}
                  delay={i * 100}
                  animation="fade-up"
                >
                  <FeatureCard {...benefit} className="h-full bg-panel/70" />
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
