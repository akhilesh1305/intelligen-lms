"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Sparkles } from "lucide-react";
import { AnimateOnScroll } from "@/components/motion/animate-on-scroll";
import { Button } from "@/components/ui/button";
import { HOME_SECTION_IMAGES } from "@/lib/home-images";

export function HomeDemoVideo() {
  return (
    <section className="relative overflow-hidden bg-canvas py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <AnimateOnScroll animation="slide-right">
          <div className="relative mx-auto aspect-video max-w-xl overflow-hidden rounded-[20px] border border-border shadow-elevated lg:mx-0">
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
              className="absolute inset-0 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              aria-label="Watch IntelliGen LMS AI demo"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-brand-700 shadow-elevated transition-transform duration-300 motion-safe:hover:scale-105 motion-safe:active:scale-95">
                <Play className="ml-1 h-7 w-7 fill-current" aria-hidden />
              </span>
            </Link>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll animation="slide-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
            <Sparkles className="h-4 w-4" aria-hidden />
            Product tour
          </div>
          <h2 className="mt-4 text-3xl font-bold text-ink sm:text-4xl">
            See IntelliGen LMS in action
          </h2>
          <p className="mt-4 text-lg text-muted">
            Watch how teams generate courses with AI, track learner progress, issue
            verified certificates, and run corporate games — all from one premium
            dashboard.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-muted">
            <li>· AI course & quiz generation in minutes</li>
            <li>· Real-time analytics and completion tracking</li>
            <li>· Certificates, gamification, and org workspaces</li>
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/ai">
              <Button size="lg" className="motion-safe:hover:scale-[1.02]">
                <Play className="h-4 w-4" />
                Watch demo
              </Button>
            </Link>
            <a href="mailto:hello@intelligenlms.com?subject=Book%20a%20Demo">
              <Button size="lg" variant="outline">
                Book live walkthrough
              </Button>
            </a>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
