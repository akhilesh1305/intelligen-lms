"use client";

import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { AnimateOnScroll } from "@/components/motion/animate-on-scroll";
import {
  HOME_DESCRIPTION,
  HOME_EYEBROW,
  HOME_INNER,
  HOME_SECTION,
  HOME_TITLE,
} from "@/components/home/home-polish";
import { Button } from "@/components/ui/button";
import { HOME_SECTION_IMAGES } from "@/lib/home-images";
import { cn } from "@/lib/utils";

export function HomeDemoVideo() {
  return (
    <section className={cn("relative overflow-hidden bg-canvas", HOME_SECTION)}>
      <div className={cn(HOME_INNER, "grid items-center gap-8 lg:grid-cols-2 lg:gap-10")}>
        <AnimateOnScroll animation="fade-up">
          <div className="relative mx-auto aspect-video w-full max-w-xl overflow-hidden rounded-[20px] border border-border/80 shadow-card transition-shadow duration-300 motion-safe:hover:shadow-card-hover lg:mx-0">
            <Image
              src={HOME_SECTION_IMAGES.heroMain}
              alt="IntelliGen LMS product preview"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 90vw, 45vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/70 via-brand-900/20 to-transparent" />
            <Link
              href="/ai"
              className="group absolute inset-0 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              aria-label="Watch IntelliGen LMS AI demo"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-brand-700 shadow-elevated transition-transform duration-300 motion-safe:group-hover:scale-105 motion-safe:active:scale-95 sm:h-16 sm:w-16">
                <Play className="ml-1 h-6 w-6 fill-current sm:h-7 sm:w-7" aria-hidden />
              </span>
            </Link>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll delay={80} animation="fade-up" className="text-center lg:text-left">
          <p className={HOME_EYEBROW}>Product tour</p>
          <h2 className={cn("mt-2", HOME_TITLE)}>See IntelliGen LMS in action</h2>
          <p className={HOME_DESCRIPTION}>
            Watch how teams generate courses with AI, track learner progress, issue
            verified certificates, and run corporate games — all from one premium
            dashboard.
          </p>
          <ul className="mx-auto mt-4 max-w-md space-y-1.5 text-left text-sm text-muted lg:mx-0">
            <li>· AI course & quiz generation in minutes</li>
            <li>· Real-time analytics and completion tracking</li>
            <li>· Certificates, gamification, and org workspaces</li>
          </ul>
          <div className="mt-6 flex justify-center lg:justify-start">
            <Link href="/ai">
              <Button size="lg" className="motion-safe:hover:scale-[1.02]">
                <Play className="h-4 w-4" />
                Watch demo
              </Button>
            </Link>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
