"use client";

import Image from "next/image";
import { Award, Globe, PlayCircle, TrendingUp } from "lucide-react";
import { AnimateOnScroll } from "@/components/motion/animate-on-scroll";
import { HOME_SECTION_IMAGES } from "@/lib/home-images";
import { cn } from "@/lib/utils";

const benefits = [
  {
    icon: PlayCircle,
    title: "Learn at your own pace",
    description:
      "Access course materials anytime. Pause, rewind, and revisit lessons whenever you need.",
    color: "from-brand-500 to-brand-600",
  },
  {
    icon: Award,
    title: "Expert instructors",
    description:
      "Courses created by industry professionals with real-world experience.",
    color: "from-violet-500 to-violet-600",
  },
  {
    icon: TrendingUp,
    title: "Track your progress",
    description:
      "Visual progress tracking keeps you motivated and on path to completion.",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    icon: Globe,
    title: "Learn anywhere",
    description:
      "Responsive platform works seamlessly on desktop, tablet, and mobile.",
    color: "from-amber-500 to-amber-600",
  },
];

export function HomeBenefits() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-brand-50 via-panel to-accent-violet-light shadow-card dark:from-brand-500/10 dark:via-panel dark:to-accent-violet-light">
        <div className="grid lg:grid-cols-2">
          <div className="relative hidden min-h-[320px] lg:block">
            <Image
              src={HOME_SECTION_IMAGES.benefits}
              alt="Learning on any device"
              fill
              className="object-cover"
              sizes="50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-panel/90 dark:to-panel/80" />
          </div>

          <div className="p-8 sm:p-12 lg:p-16">
            <AnimateOnScroll>
              <h2 className="text-3xl font-bold text-ink">
                Why learners choose IntelliGen
              </h2>
              <p className="mt-3 text-muted">
                A learning experience designed for real results
              </p>
            </AnimateOnScroll>

            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              {benefits.map((benefit, i) => (
                <AnimateOnScroll key={benefit.title} delay={i * 100} animation="fade-up">
                  <div className="group text-left">
                    <div
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-elevated transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
                        benefit.color
                      )}
                    >
                      <benefit.icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-bold text-ink">{benefit.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {benefit.description}
                    </p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
