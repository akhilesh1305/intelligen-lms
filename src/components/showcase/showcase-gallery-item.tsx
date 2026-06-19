"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Briefcase, Check, Sparkles } from "lucide-react";
import { AnimateOnScroll } from "@/components/motion/animate-on-scroll";
import { HeroDashboardPreview } from "@/components/home/hero-dashboard-preview";
import {
  HOME_CARD,
  HOME_CARD_FOCUS,
  HOME_ICON_TILE,
  STICKY_ANCHOR_MT,
} from "@/components/home/home-polish";
import { ShowcaseBrowserFrame } from "@/components/showcase/showcase-browser-frame";
import type { ShowcaseScreen } from "@/lib/showcase-screens";
import { cn } from "@/lib/utils";

function BusinessValueCallout({ value }: { value: string }) {
  return (
    <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/90 to-teal-50/50 p-4 dark:border-emerald-900/40 dark:from-emerald-950/30 dark:to-teal-950/20 sm:p-5">
      <div className="flex items-start gap-3">
        <span
          className={cn(
            HOME_ICON_TILE,
            "h-9 w-9 rounded-xl from-emerald-500 to-teal-600"
          )}
        >
          <Briefcase className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
            Business value
          </p>
          <p className="mt-1.5 text-pretty text-sm leading-relaxed text-ink sm:text-base">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function CapabilityCards({
  capabilities,
}: {
  capabilities: NonNullable<ShowcaseScreen["capabilities"]>;
}) {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2">
      {capabilities.map((cap) => (
        <div
          key={cap.title}
          className={cn(HOME_CARD, "flex h-full flex-col p-4 sm:p-5")}
        >
          <div className="flex items-start gap-2">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" aria-hidden />
            <h3 className="text-base font-bold text-ink">{cap.title}</h3>
          </div>
          <p className="mt-2 flex-1 text-pretty text-sm leading-relaxed text-muted">
            {cap.description}
          </p>
          <p className="mt-3 border-t border-border/80 pt-3 text-pretty text-xs leading-relaxed text-emerald-800 dark:text-emerald-300 sm:text-sm">
            <span className="font-semibold">Value: </span>
            {cap.businessValue}
          </p>
        </div>
      ))}
    </div>
  );
}

export function ShowcaseGalleryItem({
  screen,
  index,
}: {
  screen: ShowcaseScreen;
  index: number;
}) {
  const reversed = index % 2 === 1;
  const total = 6;

  return (
    <article
      id={screen.id}
      className={cn(STICKY_ANCHOR_MT, "border-b border-border py-12 last:border-b-0 sm:py-16 lg:py-20")}
    >
      <div className="mb-6 flex items-center gap-3 lg:hidden">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
          {index + 1}
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider text-muted">
          {index + 1} of {total}
        </span>
      </div>

      <div
        className={cn(
          "grid items-start gap-8 lg:grid-cols-12 lg:gap-12 xl:gap-14",
          reversed && "lg:[direction:rtl] lg:[&>*]:![direction:ltr]"
        )}
      >
        {/* Screenshot column */}
        <div className="lg:col-span-7">
          <AnimateOnScroll animation={reversed ? "slide-left" : "slide-right"}>
            <ShowcaseBrowserFrame
              url={`intelligenlms.com${screen.href === "/" ? "" : screen.href}`}
              className="motion-safe:lg:scale-[1.01] motion-safe:lg:transition-transform motion-safe:lg:duration-500"
            >
              {screen.variant === "dashboard-mock" ? (
                <div className="p-3 sm:p-5 lg:p-6">
                  <HeroDashboardPreview />
                </div>
              ) : (
                <div className="relative aspect-[16/10] w-full bg-slate-900">
                  <Image
                    src={screen.image}
                    alt={screen.imageAlt}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    priority={index < 2}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/50 via-slate-950/5 to-transparent" />
                </div>
              )}
            </ShowcaseBrowserFrame>
          </AnimateOnScroll>
        </div>

        {/* Copy column */}
        <div className="lg:col-span-5">
          <AnimateOnScroll delay={80} animation="fade-up">
            <div className="lg:sticky lg:top-36 lg:pt-2 xl:top-40">
              <span className="hidden items-center rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-700 dark:border-brand-800 dark:bg-brand-950/40 dark:text-brand-300 lg:inline-flex">
                Capability {index + 1} of {total}
              </span>

              <h2 className="mt-0 text-2xl font-bold tracking-tight text-ink sm:text-3xl lg:mt-4">
                {screen.title}
              </h2>

              <p className="mt-3 text-pretty text-sm leading-relaxed text-muted sm:text-base">
                {screen.description}
              </p>

              <div className="mt-5">
                <BusinessValueCallout value={screen.businessValue} />
              </div>

              <div className="mt-6">
                <p className="text-xs font-bold uppercase tracking-wider text-muted">
                  Key capabilities
                </p>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {screen.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-surface/50 px-3 py-2.5 text-sm text-ink"
                    >
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                        aria-hidden
                      />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={screen.href}
                className={cn(
                  HOME_CARD_FOCUS,
                  "mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-brand-200 bg-brand-50/80 px-4 py-3 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-100 sm:w-auto dark:border-brand-800 dark:bg-brand-950/30 dark:text-brand-300 dark:hover:bg-brand-950/50"
                )}
              >
                Open live {screen.title.toLowerCase()}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </div>

      {screen.capabilities && screen.capabilities.length > 0 ? (
        <AnimateOnScroll delay={120} animation="fade-up">
          <div className="mt-10 border-t border-border pt-10 lg:mt-12 lg:pt-12">
            <h3 className="text-lg font-bold text-ink sm:text-xl">
              AI capabilities in detail
            </h3>
            <p className="mt-2 max-w-2xl text-sm text-muted sm:text-base">
              Each tool is production-ready — ideal talking points for technical and
              business stakeholders.
            </p>
            <CapabilityCards capabilities={screen.capabilities} />
          </div>
        </AnimateOnScroll>
      ) : null}
    </article>
  );
}
