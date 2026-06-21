"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Award,
  BarChart3,
  Bot,
  Brain,
  Calendar,
  Check,
  ClipboardCheck,
  LineChart,
  Medal,
  Play,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { AnimateOnScroll } from "@/components/motion/animate-on-scroll";
import { GradientOrbs } from "@/components/decorative/gradient-orbs";
import { LogoWatermark } from "@/components/brand/logo-watermark";
import { HeroDashboardPreview } from "@/components/home/hero-dashboard-preview";
import {
  HOME_CARD,
  HOME_CARD_FOCUS,
  HOME_GRID,
  HOME_ICON_TILE,
  HOME_INNER,
  HOME_PAGE,
  STICKY_ANCHOR_MT,
  homeStaggerDelay,
} from "@/components/home/home-polish";
import { Button } from "@/components/ui/button";
import { ProductTourNav } from "@/components/product-tour/product-tour-nav";
import { TourSection } from "@/components/product-tour/tour-section";
import {
  ScreenshotPresentation,
  ScreenshotStoryPanel,
} from "@/components/showcase/screenshot-presentation";
import {
  STORY_FLOW,
  TOUR_AI_FEATURES,
  TOUR_ANALYTICS,
  TOUR_ANALYTICS_PRESENTATION,
  TOUR_BENEFITS,
  TOUR_CERTIFICATES,
  TOUR_DASHBOARD_PRESENTATION,
  TOUR_GAMIFICATION,
  TOUR_GAMIFICATION_PRESENTATION,
  TOUR_PROBLEMS,
  TOUR_SOLUTION_POINTS,
} from "@/lib/product-tour";
import { cn } from "@/lib/utils";

const DEMO_MAILTO = "mailto:hello@intelligenlms.com?subject=Book%20a%20Product%20Tour";

const AI_ICONS = [Sparkles, Brain, Bot] as const;
const CERT_ICONS = [ShieldCheck, Target, Award] as const;
const GAMIFICATION_ICONS = [Star, Trophy, Medal] as const;

function StoryFlowBar() {
  return (
    <div className="border-b border-border bg-surface/60 dark:bg-slate-900/40">
      <div className={cn(HOME_INNER, "px-4 py-4 sm:px-6 lg:px-8")}>
        <ol
          className="flex flex-wrap items-center justify-center gap-2 overflow-x-auto pb-1 scrollbar-hide sm:gap-3"
          aria-label="Product story flow"
        >
          {STORY_FLOW.map((item, index) => (
            <li key={item.id} className="flex shrink-0 items-center gap-2">
              <a
                href={`#${item.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-panel px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-brand-300 hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-2 dark:hover:border-brand-700 dark:hover:bg-brand-950/40 sm:text-sm"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
                  {item.step}
                </span>
                {item.label}
              </a>
              {index < STORY_FLOW.length - 1 ? (
                <ArrowRight className="hidden h-3.5 w-3.5 text-muted sm:block" aria-hidden />
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  businessValue,
  bullets,
  gradient,
  href,
  delay,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  businessValue?: string;
  bullets?: readonly string[];
  gradient: string;
  href?: string;
  delay: number;
}) {
  const inner = (
    <div className={cn(HOME_CARD, HOME_CARD_FOCUS, "group flex h-full flex-col p-5 sm:p-6")}>
      <div className={cn(HOME_ICON_TILE, gradient)}>
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <h3 className="mt-4 text-lg font-bold text-ink">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{description}</p>
      {businessValue ? (
        <p className="mt-3 rounded-xl border border-emerald-200/80 bg-emerald-50/80 px-3 py-2 text-xs leading-relaxed text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200 sm:text-sm">
          <span className="font-semibold">Value: </span>
          {businessValue}
        </p>
      ) : null}
      {bullets?.length ? (
        <ul className="mt-4 space-y-2 border-t border-border pt-4">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm text-muted">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" aria-hidden />
              {b}
            </li>
          ))}
        </ul>
      ) : null}
      {href ? (
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 dark:text-brand-400">
          See it live
          <ArrowRight className="h-3.5 w-3.5 transition-transform motion-safe:group-hover:translate-x-0.5" />
        </span>
      ) : null}
    </div>
  );

  return (
    <AnimateOnScroll delay={delay} animation="fade-up">
      {href ? (
        <Link href={href} className="block h-full">
          {inner}
        </Link>
      ) : (
        inner
      )}
    </AnimateOnScroll>
  );
}

function MetricBar({ label, value, percent }: { label: string; value: string; percent: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span className="font-medium text-ink">{label}</span>
        <span className="font-bold text-brand-600 dark:text-brand-400">{value}</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-cyan transition-all duration-700"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export function ProductTourContent({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <div className={HOME_PAGE}>
      {/* Hero */}
      <section
        id="overview"
        className={cn("hero-gradient relative overflow-hidden text-white", STICKY_ANCHOR_MT)}
      >
        <GradientOrbs variant="hero" />
        <LogoWatermark tone="dark" size={280} opacity={0.08} position="top-right" className="hidden lg:block" />

        <div className="relative mx-auto grid min-w-0 max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-14 lg:px-8 lg:py-20">
          <AnimateOnScroll className="text-center lg:text-left">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-cyan-100 backdrop-blur-md">
              <Play className="h-4 w-4 text-cyan-300" aria-hidden />
              Sales & demo experience
            </div>
            <h1 className="text-balance text-3xl font-bold leading-[1.08] tracking-tight sm:text-4xl lg:text-5xl">
              The LMS story your{" "}
              <span className="bg-gradient-to-r from-cyan-200 via-white to-violet-200 bg-clip-text text-transparent">
                clients need to hear
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-200/90 sm:text-lg lg:mx-0">
              Follow a clear narrative from challenge to outcome — built for recruiter
              portfolios, enterprise demos, and stakeholder walkthroughs. No login
              required.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
              <a href="#problem">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 sm:w-auto"
                >
                  Start the story
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
              </a>
              <Link href="/login">
                <Button size="lg" className="w-full bg-white text-brand-700 hover:bg-brand-50 sm:w-auto">
                  Try demo accounts
                </Button>
              </Link>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={120} animation="slide-right">
            <ScreenshotPresentation
              url="intelligenlms.com/dashboard"
              {...TOUR_DASHBOARD_PRESENTATION}
            >
              <div className="p-3 sm:p-5 lg:p-6">
                <HeroDashboardPreview />
              </div>
            </ScreenshotPresentation>
          </AnimateOnScroll>
        </div>
      </section>

      <StoryFlowBar />
      <ProductTourNav />

      {/* Problem */}
      <TourSection
        id="problem"
        narrativeStep="Step 1 · Problem"
        eyebrow="The challenge"
        title="Legacy learning stacks slow teams down"
        description="Before IntelliGen LMS, organizations face the same three blockers in every evaluation — whether you're pitching to HR, IT, or a hiring manager."
        variant="problem"
      >
        <div className={cn(HOME_GRID, "mt-10 lg:grid-cols-3")}>
          {TOUR_PROBLEMS.map((item, index) => (
            <AnimateOnScroll key={item.title} delay={homeStaggerDelay(index)} animation="fade-up">
              <div className={cn(HOME_CARD, "h-full p-5 sm:p-6")}>
                <div className={cn(HOME_ICON_TILE, "from-rose-500 to-orange-500")}>
                  <AlertTriangle className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="mt-4 text-lg font-bold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </TourSection>

      {/* Solution */}
      <TourSection
        id="solution"
        narrativeStep="Step 2 · Solution"
        eyebrow="The platform"
        title="One AI-native LMS for the full learning lifecycle"
        description="IntelliGen LMS unifies authoring, delivery, engagement, credentials, and analytics — so you demo a complete product, not a patchwork of tools."
        variant="panel"
        className="relative overflow-hidden"
      >
        <GradientOrbs className="opacity-30" />
        <div className="relative mt-10 grid gap-8 lg:grid-cols-2 lg:items-center">
          <AnimateOnScroll animation="slide-right">
            <ul className="space-y-3">
              {TOUR_SOLUTION_POINTS.map((point) => (
                <li
                  key={point}
                  className={cn(HOME_CARD, "flex items-start gap-3 p-4 text-sm text-ink sm:text-base")}
                >
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden />
                  {point}
                </li>
              ))}
            </ul>
            <Link
              href="/showcase"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 dark:text-brand-400"
            >
              View visual showcase
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </AnimateOnScroll>
          <AnimateOnScroll delay={100} animation="slide-left">
            <ScreenshotPresentation
              url="intelligenlms.com/dashboard"
              {...TOUR_DASHBOARD_PRESENTATION}
            >
              <div className="p-3 sm:p-5 lg:p-6">
                <HeroDashboardPreview />
              </div>
            </ScreenshotPresentation>
          </AnimateOnScroll>
        </div>
      </TourSection>

      {/* AI Features */}
      <TourSection
        id="ai"
        narrativeStep="Step 3 · AI"
        eyebrow="Artificial intelligence"
        title="AI that ships content and supports learners"
        description="Launch training faster, scale learner support, and keep programs current — with production-ready AI built into the platform."
        variant="muted"
      >
        <div className={cn(HOME_GRID, "mt-10 lg:grid-cols-3")}>
          {TOUR_AI_FEATURES.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={AI_ICONS[index]}
              title={feature.title}
              description={feature.description}
              businessValue={feature.businessValue}
              bullets={feature.bullets}
              gradient={
                index === 0
                  ? "from-brand-500 to-violet-600"
                  : index === 1
                    ? "from-violet-500 to-fuchsia-500"
                    : "from-cyan-500 to-brand-500"
              }
              href={feature.href}
              delay={homeStaggerDelay(index)}
            />
          ))}
        </div>
      </TourSection>

      {/* Gamification */}
      <TourSection
        id="gamification"
        eyebrow="Engagement"
        title="Increase learner engagement through points, badges, and challenges"
        description="Turn mandatory training into habits learners choose — with recognition, competition, and rewards woven into every course."
        variant="panel"
        className="relative overflow-hidden"
      >
        <GradientOrbs className="opacity-25" />
        <div className="relative mt-10 overflow-hidden rounded-[24px] border border-border bg-gradient-to-br from-brand-50/80 via-panel to-violet-50/50 p-5 shadow-card dark:from-brand-950/30 dark:via-panel dark:to-violet-950/20 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
            <div className="grid gap-4">
              {TOUR_GAMIFICATION.map((item, index) => {
                const Icon = GAMIFICATION_ICONS[index];
                const colors = [
                  "from-amber-400 to-orange-500",
                  "from-cyan-500 to-brand-500",
                  "from-violet-500 to-brand-500",
                ];
                return (
                  <AnimateOnScroll key={item.title} delay={homeStaggerDelay(index)} animation="fade-up">
                    <div className={cn(HOME_CARD, "p-4 sm:p-5")}>
                      <div className="flex items-start gap-3">
                        <div className={cn(HOME_ICON_TILE, colors[index])}>
                          <Icon className="h-4 w-4" aria-hidden />
                        </div>
                        <div>
                          <h3 className="font-bold text-ink">{item.title}</h3>
                          <p className="mt-1 text-sm text-muted">{item.description}</p>
                          <p className="mt-2 text-xs font-medium text-emerald-800 dark:text-emerald-300 sm:text-sm">
                            {item.businessValue}
                          </p>
                        </div>
                      </div>
                    </div>
                  </AnimateOnScroll>
                );
              })}
            </div>

            <AnimateOnScroll delay={120} animation="slide-left">
              <ScreenshotStoryPanel {...TOUR_GAMIFICATION_PRESENTATION}>
                <div className={cn(HOME_CARD, "border-0 p-5 shadow-none sm:p-6")}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-ink">Weekly leaderboard</p>
                    <Zap className="h-4 w-4 text-amber-500" aria-hidden />
                  </div>
                  <ul className="mt-4 space-y-3">
                    {[
                    { rank: 1, name: "Marcus Rivera", pts: 485 },
                    { rank: 2, name: "Emily Parker", pts: 412 },
                    { rank: 3, name: "Sarah Johnson", pts: 312, you: true },
                    ].map((row) => (
                      <li
                        key={row.rank}
                        className={cn(
                          "flex items-center justify-between rounded-xl px-3 py-2 text-sm",
                          row.you
                            ? "bg-brand-50 ring-1 ring-brand-200 dark:bg-brand-950/40 dark:ring-brand-800"
                            : "bg-surface/60 dark:bg-slate-900/50"
                        )}
                      >
                        <span className="flex items-center gap-2 font-medium text-ink">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-panel text-xs font-bold text-muted">
                            {row.rank}
                          </span>
                          {row.name}
                          {row.you ? (
                            <span className="text-xs text-brand-600 dark:text-brand-400">(You)</span>
                          ) : null}
                        </span>
                        <span className="font-bold text-brand-600 dark:text-brand-400">
                          {row.pts} XP
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/games"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 dark:text-brand-400"
                  >
                    Explore Game Hub
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                </div>
              </ScreenshotStoryPanel>
            </AnimateOnScroll>
          </div>
        </div>
      </TourSection>

      {/* Certificates */}
      <TourSection
        id="certificates"
        eyebrow="Credentials"
        title="Certificates stakeholders can trust"
        description="Verification, progress tracking, and achievements — the proof layer every enterprise demo needs."
        variant="muted"
      >
        <div className={cn(HOME_GRID, "mt-10 lg:grid-cols-3")}>
          {TOUR_CERTIFICATES.map((item, index) => (
            <FeatureCard
              key={item.title}
              icon={CERT_ICONS[index]}
              title={item.title}
              description={item.description}
              businessValue={item.businessValue}
              gradient={
                index === 0
                  ? "from-emerald-500 to-teal-500"
                  : index === 1
                    ? "from-brand-500 to-accent-cyan"
                    : "from-amber-500 to-orange-500"
              }
              href={index === 0 ? "/certificates/demo" : "/certificates"}
              delay={homeStaggerDelay(index)}
            />
          ))}
        </div>
      </TourSection>

      {/* Analytics */}
      <TourSection
        id="analytics"
        eyebrow="Analytics & insights"
        title="Prove learning is working"
        description="Learning trends and performance insights give L&D leaders the narrative executives and clients expect."
        variant="panel"
        className="relative overflow-hidden"
      >
        <GradientOrbs className="opacity-25" />
        <div className="relative mt-10 grid gap-6 lg:grid-cols-2">
          {TOUR_ANALYTICS.map((item, index) => (
            <AnimateOnScroll key={item.title} delay={homeStaggerDelay(index)} animation="fade-up">
              <div className={cn(HOME_CARD, "h-full p-5 sm:p-6")}>
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      HOME_ICON_TILE,
                      index === 0 ? "from-brand-500 to-violet-600" : "from-emerald-500 to-teal-500"
                    )}
                  >
                    {index === 0 ? (
                      <TrendingUp className="h-5 w-5" aria-hidden />
                    ) : (
                      <BarChart3 className="h-5 w-5" aria-hidden />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-ink">{item.title}</h3>
                    <p className="mt-1 text-sm text-muted">{item.description}</p>
                    <p className="mt-3 text-xs font-medium text-emerald-800 dark:text-emerald-300 sm:text-sm">
                      {item.businessValue}
                    </p>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          ))}

          <AnimateOnScroll delay={homeStaggerDelay(2)} animation="fade-up" className="lg:col-span-2">
            <ScreenshotStoryPanel {...TOUR_ANALYTICS_PRESENTATION}>
              <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-2">
              <div className={cn(HOME_CARD, "border-0 p-0 shadow-none")}>
                <div className="flex items-start gap-3">
                  <div className={cn(HOME_ICON_TILE, "from-emerald-500 to-teal-500")}>
                    <Target className="h-5 w-5" aria-hidden />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-ink">Learner progress</h3>
                    <p className="mt-1 text-sm text-muted">Course completion rolled into one manager-friendly view.</p>
                  </div>
                </div>
                <div className="mt-6 space-y-4">
                  <MetricBar label="AI Fundamentals" value="100%" percent={100} />
                  <MetricBar label="Leadership Excellence" value="68%" percent={68} />
                  <MetricBar label="Data Analytics Mastery" value="42%" percent={42} />
                </div>
              </div>

              <div className={cn(HOME_CARD, "border-0 p-0 shadow-none")}>
                <div className="flex items-start gap-3">
                  <div className={cn(HOME_ICON_TILE, "from-brand-500 to-violet-600")}>
                    <LineChart className="h-5 w-5" aria-hidden />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-ink">Enrollment trend</h3>
                    <p className="mt-1 text-sm text-muted">Six-month growth curve for stakeholder decks.</p>
                  </div>
                </div>
                <div className="mt-6 flex h-36 items-end gap-2 sm:h-40">
                  {[42, 58, 52, 70, 64, 78].map((h, i) => (
                    <div key={i} className="flex flex-1 flex-col items-center gap-2">
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-brand-600 to-accent-cyan opacity-90"
                        style={{ height: `${h}%` }}
                      />
                      <span className="text-[10px] font-medium text-muted sm:text-xs">
                        {["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i]}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-4">
                  {[
                    { icon: BarChart3, label: "78% completion" },
                    { icon: ClipboardCheck, label: "1.7k enrollments" },
                    { icon: Users, label: "58 active learners" },
                  ].map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <div key={stat.label} className="text-center">
                        <Icon className="mx-auto h-4 w-4 text-brand-500" aria-hidden />
                        <p className="mt-1 text-xs font-semibold text-ink">{stat.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
              </div>
            </ScreenshotStoryPanel>
          </AnimateOnScroll>
        </div>
      </TourSection>

      {/* Benefits */}
      <TourSection
        id="benefits"
        narrativeStep="Step 4 · Benefits"
        eyebrow="Outcomes"
        title="Why teams choose IntelliGen LMS"
        description="Close every demo with outcomes — not feature lists. These are the results recruiters and enterprise buyers care about."
        variant="benefits"
      >
        <div className={cn(HOME_GRID, "mt-10 sm:grid-cols-2 lg:grid-cols-4")}>
          {TOUR_BENEFITS.map((item, index) => (
            <AnimateOnScroll key={item.title} delay={homeStaggerDelay(index)} animation="scale-in">
              <div className={cn(HOME_CARD, "h-full p-5 text-center sm:p-6")}>
                <p className="text-3xl font-bold text-brand-600 dark:text-brand-400">{item.stat}</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                  {item.statLabel}
                </p>
                <h3 className="mt-3 text-base font-bold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </TourSection>

      {/* CTA */}
      <section
        id="get-started"
        className={cn("cta-gradient relative overflow-hidden px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20", STICKY_ANCHOR_MT)}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.12),transparent_60%)]" />
        <div className="relative mx-auto max-w-3xl text-center">
          <AnimateOnScroll>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">
              Step 5 · Call to action
            </p>
            <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
              Ready to run your next demo?
            </h2>
            <p className="mt-3 text-base text-blue-100 sm:text-lg">
              Try demo accounts instantly, walk a live stakeholder through the product,
              or book a guided session with our team.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <Link href={isLoggedIn ? "/dashboard" : "/login"}>
                <Button
                  size="lg"
                  className="w-full min-w-[200px] bg-white text-brand-700 shadow-elevated hover:bg-brand-50 sm:w-auto"
                >
                  {isLoggedIn ? "Go to dashboard" : "Try demo accounts"}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
              </Link>
              <Link href="/showcase">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full min-w-[200px] border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 sm:w-auto"
                >
                  Visual showcase
                </Button>
              </Link>
              <a href={DEMO_MAILTO}>
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full min-w-[200px] border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 sm:w-auto"
                >
                  <Calendar className="h-4 w-4" aria-hidden />
                  Book enterprise demo
                </Button>
              </a>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  );
}
