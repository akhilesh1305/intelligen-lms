"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Award,
  BarChart3,
  Check,
  ClipboardCheck,
  Play,
  Sparkles,
  Trophy,
} from "lucide-react";
import { AnimateOnScroll } from "@/components/motion/animate-on-scroll";
import {
  HOME_CARD,
  HOME_CARD_FOCUS,
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

const VIDEO_POSTER = "/promo/poster.png";
const VIDEO_HREF = "/promo";

const HIGHLIGHTS = [
  {
    icon: Sparkles,
    label: "AI Course Generation",
    description: "Build full courses from outlines or documents in minutes.",
    gradient: "from-brand-500 to-violet-600",
  },
  {
    icon: ClipboardCheck,
    label: "AI Quiz Builder",
    description: "Auto-generate assessments aligned to your lesson content.",
    gradient: "from-violet-500 to-fuchsia-500",
  },
  {
    icon: Award,
    label: "Certificates",
    description: "Issue verifiable credentials learners can share instantly.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: Trophy,
    label: "Gamification",
    description: "XP, badges, and leaderboards that keep teams engaged.",
    gradient: "from-cyan-500 to-brand-500",
  },
  {
    icon: BarChart3,
    label: "Analytics Dashboard",
    description: "Track completion, engagement, and training ROI in real time.",
    gradient: "from-emerald-500 to-teal-500",
  },
] as const;

function AnimatedPlayButton() {
  return (
    <span className="relative flex h-[4.5rem] w-[4.5rem] items-center justify-center sm:h-20 sm:w-20">
      <span
        className="absolute inset-0 rounded-full bg-white/30 motion-safe:animate-ping"
        aria-hidden
      />
      <span
        className="absolute inset-1 rounded-full bg-white/20 motion-safe:animate-pulse"
        aria-hidden
      />
      <span className="relative flex h-full w-full items-center justify-center rounded-full bg-white text-brand-700 shadow-elevated ring-4 ring-white/40 transition-transform duration-300 motion-safe:group-hover:scale-110 motion-safe:group-active:scale-95">
        <Play className="ml-1 h-7 w-7 fill-current sm:h-8 sm:w-8" aria-hidden />
      </span>
    </span>
  );
}

export function HomeDemoVideo() {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-y border-border bg-gradient-to-b from-panel via-canvas to-panel dark:from-slate-950/80 dark:via-canvas dark:to-slate-950/50",
        HOME_SECTION
      )}
    >
      <div className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-brand-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-1/4 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

      <div className={cn(HOME_INNER, "relative grid items-center gap-10 lg:grid-cols-2 lg:gap-14")}>
        {/* Video thumbnail */}
        <AnimateOnScroll animation="fade-up">
          <div className="relative mx-auto w-full max-w-xl lg:mx-0">
            <div
              className={cn(
                HOME_CARD,
                "group relative overflow-hidden rounded-[24px] p-1 shadow-card transition-shadow duration-500 motion-safe:hover:shadow-card-hover"
              )}
            >
              <div className="relative aspect-video overflow-hidden rounded-[20px] bg-slate-950">
                <Image
                  src={VIDEO_POSTER}
                  alt="IntelliGen LMS product tour — dashboard, courses, and AI tools"
                  fill
                  className="object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 92vw, 42vw"
                  priority={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-brand-900/25 to-brand-900/10" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_40%,rgba(15,23,42,0.35)_100%)]" />

                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md">
                    Product tour
                  </span>
                  <span className="rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                    90 sec
                  </span>
                </div>

                <Link
                  href={VIDEO_HREF}
                  className={cn(
                    HOME_CARD_FOCUS,
                    "absolute inset-0 flex flex-col items-center justify-center gap-3 focus-visible:ring-white/80"
                  )}
                  aria-label="Watch 90-second IntelliGen LMS product tour"
                >
                  <AnimatedPlayButton />
                  <span className="rounded-full bg-black/35 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-md transition-colors motion-safe:group-hover:bg-black/50">
                    Play video
                  </span>
                </Link>

                <div className="pointer-events-none absolute bottom-0 left-0 right-0 border-t border-white/10 bg-gradient-to-t from-black/60 to-transparent px-4 py-3">
                  <p className="text-xs font-medium text-white/90 sm:text-sm">
                    Trusted by L&D teams for demos & onboarding
                  </p>
                </div>
              </div>
            </div>
          </div>
        </AnimateOnScroll>

        {/* Highlights */}
        <div className="min-w-0 text-center lg:text-left">
          <AnimateOnScroll animation="fade-up">
            <p className={HOME_EYEBROW}>See it in action</p>
            <h2 className={cn("mt-2 text-balance", HOME_TITLE)}>
              Watch 90-Second Product Tour
            </h2>
            <p className={HOME_DESCRIPTION}>
              A quick walkthrough of how IntelliGen LMS helps you create training,
              motivate learners, and prove impact — without switching tools.
            </p>
          </AnimateOnScroll>

          <ul className="mt-8 space-y-3">
            {HIGHLIGHTS.map((item, i) => {
              const Icon = item.icon;
              return (
                <AnimateOnScroll key={item.label} delay={homeStaggerDelay(i, 50)} animation="fade-up">
                  <li
                    className={cn(
                      HOME_CARD,
                      "flex items-start gap-3 p-3.5 text-left transition-colors motion-safe:hover:border-brand-400/30 sm:p-4"
                    )}
                  >
                    <div className={cn(HOME_ICON_TILE, item.gradient, "h-10 w-10 rounded-xl")}>
                      <Icon className="h-4 w-4" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-2 font-semibold text-ink">
                        <Check
                          className="h-4 w-4 shrink-0 text-emerald-500"
                          aria-hidden
                        />
                        {item.label}
                      </p>
                      <p className="mt-0.5 text-sm leading-relaxed text-muted">
                        {item.description}
                      </p>
                    </div>
                  </li>
                </AnimateOnScroll>
              );
            })}
          </ul>

          <AnimateOnScroll delay={280} animation="fade-up">
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <Link href={VIDEO_HREF}>
                <Button size="lg" className="w-full min-w-0 motion-safe:hover:scale-[1.02] sm:min-w-[200px] sm:w-auto">
                  <Play className="h-4 w-4 fill-current" />
                  Watch 90-second tour
                </Button>
              </Link>
              <Link href="/product-tour">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full min-w-0 motion-safe:hover:scale-[1.02] sm:min-w-[200px] sm:w-auto"
                >
                  Interactive product tour
                </Button>
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
