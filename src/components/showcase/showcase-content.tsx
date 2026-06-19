"use client";

import Link from "next/link";
import { ArrowRight, Calendar, Images, Play, Presentation } from "lucide-react";
import { AnimateOnScroll } from "@/components/motion/animate-on-scroll";
import { GradientOrbs } from "@/components/decorative/gradient-orbs";
import { LogoWatermark } from "@/components/brand/logo-watermark";
import {
  HOME_INNER,
  HOME_PAGE,
  HOME_SECTION,
} from "@/components/home/home-polish";
import { ShowcaseGalleryItem } from "@/components/showcase/showcase-gallery-item";
import { ShowcaseSectionNav } from "@/components/showcase/showcase-section-nav";
import { SHOWCASE_SCREENS, SHOWCASE_STATS } from "@/lib/showcase-screens";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DEMO_MAILTO = "mailto:hello@intelligenlms.com?subject=Book%20a%20Demo";

export function ShowcaseContent({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <div className={HOME_PAGE}>
      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden text-white">
        <GradientOrbs variant="hero" />
        <LogoWatermark
          tone="dark"
          size={260}
          opacity={0.08}
          position="top-right"
          className="hidden lg:block"
        />

        <div className={cn(HOME_INNER, "relative px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20")}>
          <AnimateOnScroll className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-cyan-100 backdrop-blur-md">
              <Presentation className="h-4 w-4 text-cyan-300" aria-hidden />
              Client & recruiter showcase
            </div>
            <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Enterprise LMS value,{" "}
              <span className="bg-gradient-to-r from-cyan-200 via-white to-violet-200 bg-clip-text text-transparent">
                explained visually
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-200/90 sm:text-lg">
              Six presentation-ready surfaces with clear business outcomes — built
              for portfolio reviews, client decks, and stakeholder walkthroughs. No
              login required.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href="#homepage">
                <Button
                  size="lg"
                  className="w-full bg-white text-brand-700 hover:bg-brand-50 sm:w-auto"
                >
                  <Images className="h-4 w-4" aria-hidden />
                  View capabilities
                </Button>
              </a>
              <Link href="/product-tour">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 sm:w-auto"
                >
                  <Play className="h-4 w-4" aria-hidden />
                  90-second product tour
                </Button>
              </Link>
            </div>
          </AnimateOnScroll>

          {/* Stats strip */}
          <AnimateOnScroll delay={100} className="mx-auto mt-10 max-w-3xl">
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {SHOWCASE_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/15 bg-white/10 px-3 py-3 text-center backdrop-blur-sm sm:px-4 sm:py-4"
                >
                  <dt className="text-[10px] font-semibold uppercase tracking-wider text-cyan-100/90 sm:text-xs">
                    {stat.label}
                  </dt>
                  <dd className="mt-1 text-xl font-bold text-white sm:text-2xl">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Executive summary */}
      <section className="border-b border-border bg-surface/50 dark:bg-slate-900/30">
        <div className={cn(HOME_INNER, "px-4 py-8 sm:px-6 sm:py-10 lg:px-8")}>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-lg font-bold text-ink sm:text-xl">
              How to use this page
            </h2>
            <p className="mt-2 text-pretty text-sm leading-relaxed text-muted sm:text-base">
              Scroll through each capability for a{" "}
              <strong className="font-semibold text-ink">title</strong>,{" "}
              <strong className="font-semibold text-ink">description</strong>, and{" "}
              <strong className="font-semibold text-ink">business value</strong> you
              can quote in interviews or client meetings. Use the sticky nav to jump
              between sections during screen shares.
            </p>
          </div>
        </div>
      </section>

      <ShowcaseSectionNav />

      {/* Gallery */}
      <section className={cn(HOME_SECTION, "pb-4 pt-2 sm:pt-4")}>
        <div className={HOME_INNER}>
          {SHOWCASE_SCREENS.map((screen, index) => (
            <ShowcaseGalleryItem key={screen.id} screen={screen} index={index} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-gradient relative overflow-hidden px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.12),transparent_60%)]" />
        <div className="relative mx-auto max-w-3xl text-center">
          <AnimateOnScroll>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Ready for a live walkthrough?
            </h2>
            <p className="mt-3 text-base text-blue-100 sm:text-lg">
              Book a demo with our team or explore instantly with demo accounts —
              every surface above is live in the product.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href={isLoggedIn ? "/dashboard" : "/login"}>
                <Button
                  size="lg"
                  className="w-full min-w-[180px] bg-white text-brand-700 shadow-elevated hover:bg-brand-50 sm:w-auto"
                >
                  {isLoggedIn ? "Go to dashboard" : "Try demo accounts"}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
              </Link>
              <Link href="/product-tour">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full min-w-[180px] border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 sm:w-auto"
                >
                  <Play className="h-4 w-4" aria-hidden />
                  Product tour
                </Button>
              </Link>
              <a href={DEMO_MAILTO}>
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full min-w-[180px] border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 sm:w-auto"
                >
                  <Calendar className="h-4 w-4" aria-hidden />
                  Book demo
                </Button>
              </a>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  );
}
