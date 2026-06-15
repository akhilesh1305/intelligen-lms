"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { ArrowRight, Brain, Gamepad2, Sparkles, Trophy, Zap } from "lucide-react";
import { AnimateOnScroll } from "@/components/motion/animate-on-scroll";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import type { CorporateGameMeta } from "@/lib/corporate-games";
import {
  HOME_CORPORATE_GAME_IMAGES,
  HOME_MIND_GAME_IMAGES,
} from "@/lib/home-images";
import { cn } from "@/lib/utils";

const quizHighlights = [
  "Daily weekday quizzes",
  "Weekly timed challenge",
  "Leaderboard rankings",
];

function MindGameCardImage({
  src,
  alt,
  gradient,
  badge,
}: {
  src: string;
  alt: string;
  gradient: string;
  badge: ReactNode;
}) {
  return (
    <div className="relative h-28 overflow-hidden sm:h-32">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
      <div className={cn("absolute inset-0 bg-gradient-to-t", gradient)} />
      <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.12)_50%,transparent_75%)] bg-[length:200%_100%] opacity-0 transition-opacity duration-500 group-hover:animate-shimmer group-hover:opacity-100" />
      <div className="absolute left-3 top-3">{badge}</div>
    </div>
  );
}

export function HomeMindGames({ games }: { games: CorporateGameMeta[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <section className="relative overflow-hidden border-b border-border bg-panel/50 py-10 dark:bg-panel/30 sm:py-12">
      <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 animate-float rounded-full bg-brand-500/10 blur-3xl" />
      <div
        className="pointer-events-none absolute -right-16 bottom-8 h-72 w-72 animate-float rounded-full bg-cyan-500/10 blur-3xl"
        style={{ animationDelay: "2.5s" }}
      />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 animate-pulse-glow rounded-full bg-violet-500/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll>
          <SectionHeader
            title="Mind games"
            description="Sharpen skills with timed quizzes and scenario-based corporate simulations"
            action={
              <Link href="/challenges">
                <Button
                  variant="outline"
                  size="sm"
                  className="group/btn transition-all duration-300 hover:scale-105 hover:border-brand-400 hover:shadow-glow"
                >
                  Play now
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </Link>
            }
          />
        </AnimateOnScroll>

        <AnimateOnScroll delay={60} animation="scale-in">
          <div
            className={cn(
              "relative mt-6 overflow-hidden rounded-xl border border-border shadow-card transition-all duration-1000",
              mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            )}
          >
            <div className="relative h-24 sm:h-28">
              <Image
                src={HOME_MIND_GAME_IMAGES.showcase}
                alt="Mind games and interactive learning"
                fill
                className="object-cover"
                sizes="100vw"
                priority={false}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-900/85 via-brand-900/50 to-cyan-900/70" />
              <div className="absolute inset-0 flex items-center justify-between px-4 sm:px-6">
                <div>
                  <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-brand-200 sm:text-xs">
                    <Sparkles className="h-3 w-3 animate-pulse sm:h-3.5 sm:w-3.5" />
                    Interactive challenges
                  </p>
                  <p className="mt-1 text-lg font-bold text-white sm:text-xl">
                    Train your brain. Win the week.
                  </p>
                </div>
                <div
                  className="animate-float hidden rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-center backdrop-blur-md sm:block"
                  style={{ animationDelay: "1s" }}
                >
                  <p className="text-xl font-bold text-white">{games.length + 1}+</p>
                  <p className="text-[10px] text-brand-100">Mind games</p>
                </div>
              </div>
            </div>
          </div>
        </AnimateOnScroll>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <AnimateOnScroll delay={100} animation="slide-right">
            <Link href="/games#quiz-games" className="group block h-full">
              <Card className="h-full overflow-hidden border-brand-400/25 bg-panel transition-all duration-500 hover:-translate-y-1 hover:border-brand-400/50 hover:shadow-card-hover">
                <MindGameCardImage
                  src={HOME_MIND_GAME_IMAGES.quizGames}
                  alt="Quiz games and timed challenges"
                  gradient="from-brand-900/80 via-brand-900/20 to-transparent"
                  badge={
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-brand-500/30 text-brand-100 shadow-lg backdrop-blur-sm transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                      <Zap className="h-4 w-4" />
                    </span>
                  }
                />
                <div className="flex h-full flex-col p-4">
                  <div className="flex items-center gap-1.5">
                    <Brain className="h-3.5 w-3.5 text-brand-500" />
                    <h3 className="text-base font-bold text-ink">Quiz games</h3>
                  </div>
                  <p className="mt-0.5 text-xs text-muted">Daily & weekly timed challenges</p>
                  <p className="mt-2 flex-1 text-xs text-muted sm:text-sm">
                    Answer fast under the clock, climb the quiz leaderboard, and unlock weekly
                    achievement ranks.
                  </p>
                  <ul className="mt-3 space-y-1.5">
                    {quizHighlights.map((item, i) => (
                      <li
                        key={item}
                        className="flex items-center gap-1.5 text-xs text-brand-700 transition-all duration-500 dark:text-brand-300 sm:text-sm"
                        style={{ transitionDelay: `${i * 80}ms` }}
                      >
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500 transition-transform group-hover:scale-125" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 transition-all duration-300 group-hover:gap-2 sm:text-sm">
                    Start quiz
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Card>
            </Link>
          </AnimateOnScroll>

          <AnimateOnScroll delay={180} animation="slide-left">
            <Link href="/games" className="group block h-full">
              <Card className="h-full overflow-hidden border-cyan-500/25 bg-panel transition-all duration-500 hover:-translate-y-1 hover:border-cyan-500/50 hover:shadow-card-hover">
                <MindGameCardImage
                  src={HOME_MIND_GAME_IMAGES.corporateGames}
                  alt="Corporate scenario simulations"
                  gradient="from-cyan-900/80 via-cyan-900/20 to-transparent"
                  badge={
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-cyan-500/30 text-cyan-100 shadow-lg backdrop-blur-sm transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                      <Gamepad2 className="h-4 w-4" />
                    </span>
                  }
                />
                <div className="flex h-full flex-col p-4">
                  <div className="flex items-center gap-1.5">
                    <Gamepad2 className="h-3.5 w-3.5 text-cyan-600" />
                    <h3 className="text-base font-bold text-ink">Corporate games</h3>
                  </div>
                  <p className="mt-0.5 text-xs text-muted">{games.length} scenario simulations</p>
                  <p className="mt-2 flex-1 text-xs text-muted sm:text-sm">
                    Practice real workplace decisions in cybersecurity, compliance, sales, and
                    leadership. Scenarios rotate daily.
                  </p>
                  <div className="mt-3 grid grid-cols-3 gap-1.5 sm:gap-2">
                    {games.map((game, i) => {
                      const thumb =
                        HOME_CORPORATE_GAME_IMAGES[game.slug] ??
                        HOME_MIND_GAME_IMAGES.corporateGames;
                      return (
                        <div
                          key={game.slug}
                          className={cn(
                            "group/tile relative overflow-hidden rounded-md border border-border/60 transition-all duration-500",
                            "hover:-translate-y-0.5 hover:border-cyan-400/40 hover:shadow-md",
                            mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                          )}
                          style={{ transitionDelay: `${300 + i * 70}ms` }}
                          title={game.title}
                        >
                          <div className="relative aspect-[5/4]">
                            <Image
                              src={thumb}
                              alt={game.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover/tile:scale-110"
                              sizes="80px"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/45 to-black/70" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-0.5">
                              <span className="text-sm drop-shadow-md transition-transform duration-300 group-hover/tile:scale-110 sm:text-base">
                                {game.icon}
                              </span>
                              <span className="mt-0.5 line-clamp-1 text-center text-[8px] font-semibold leading-tight text-white">
                                {game.title.split(" ")[0]}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-cyan-700 transition-all duration-300 group-hover:gap-2 dark:text-cyan-400 sm:text-sm">
                    Play corporate games
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Card>
            </Link>
          </AnimateOnScroll>
        </div>

        <AnimateOnScroll delay={280} animation="fade-up">
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <Link
              href="/leaderboard"
              className="group/link inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/80 px-3 py-1.5 text-xs font-medium text-muted shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-400/40 hover:text-brand-600 hover:shadow-md sm:px-4 sm:py-2 sm:text-sm"
            >
              <Trophy className="h-3.5 w-3.5 text-amber-500 transition-transform group-hover/link:rotate-12 sm:h-4 sm:w-4" />
              Quiz leaderboard
            </Link>
            <Link
              href="/corporate-games/leaderboard"
              className="group/link inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/80 px-3 py-1.5 text-xs font-medium text-muted shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-400/40 hover:text-brand-600 hover:shadow-md sm:px-4 sm:py-2 sm:text-sm"
            >
              <Trophy className="h-3.5 w-3.5 text-amber-500 transition-transform group-hover/link:rotate-12 sm:h-4 sm:w-4" />
              Corporate leaderboard
            </Link>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
