"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  BarChart3,
  Gamepad2,
  Globe,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";
import { GAMES_PAGE_IMAGES } from "@/lib/game-images";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "#player-dashboard", label: "Your stats", icon: BarChart3 },
  { href: "#corporate-games", label: "Corporate", icon: Gamepad2 },
  { href: "#quiz-games", label: "Quiz", icon: Zap },
  { href: "#knowledge-games", label: "General knowledge", icon: Globe },
] as const;

export function GamesHero({
  totalGames,
  completedToday,
  isLoggedIn,
}: {
  totalGames: number;
  completedToday: number;
  isLoggedIn: boolean;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 animate-float rounded-full bg-brand-500/15 blur-3xl" />
      <div
        className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 animate-float rounded-full bg-violet-500/15 blur-3xl"
        style={{ animationDelay: "2s" }}
      />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 animate-pulse-glow rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div
          className={cn(
            "relative overflow-hidden rounded-2xl border border-border shadow-elevated transition-all duration-1000",
            mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          )}
        >
          <div className="relative min-h-[220px] sm:min-h-[260px]">
            <Image
              src={GAMES_PAGE_IMAGES.hero}
              alt="Games and interactive learning challenges"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1152px"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-950/92 via-brand-900/75 to-violet-950/80" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />

            <div className="relative flex h-full min-h-[220px] flex-col justify-between p-6 sm:min-h-[260px] sm:p-8">
              <div>
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand-200 sm:text-sm">
                  <Sparkles className="h-4 w-4 animate-pulse" />
                  Play · Learn · Compete
                </p>
                <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                  Games hub
                </h1>
                <p className="mt-3 max-w-xl text-sm text-blue-100/90 sm:text-base">
                  Corporate simulations, timed quizzes, and general knowledge puzzles —
                  each with daily challenges, leaderboards, and points.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap items-end gap-4">
                <div
                  className="animate-float rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-md"
                  style={{ animationDelay: "0.5s" }}
                >
                  <p className="text-2xl font-bold text-white">{totalGames}</p>
                  <p className="text-xs text-brand-100">Games to play</p>
                </div>
                {isLoggedIn ? (
                  <div
                    className="animate-float rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-md"
                    style={{ animationDelay: "1.2s" }}
                  >
                    <p className="text-2xl font-bold text-white">
                      {completedToday}/{totalGames}
                    </p>
                    <p className="text-xs text-brand-100">Done today</p>
                  </div>
                ) : null}
                <div
                  className="animate-float hidden rounded-xl border border-amber-400/30 bg-amber-500/20 px-4 py-3 backdrop-blur-md sm:block"
                  style={{ animationDelay: "1.8s" }}
                >
                  <Trophy className="h-5 w-5 text-amber-200" />
                  <p className="mt-1 text-xs text-amber-100">Daily leaderboards</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <nav
          className={cn(
            "mt-6 flex flex-wrap gap-2 transition-all duration-1000 delay-200",
            mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          )}
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group inline-flex items-center gap-2 rounded-full border border-border bg-panel/80 px-4 py-2 text-sm font-semibold text-ink shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-400/50 hover:shadow-md"
            >
              <item.icon className="h-4 w-4 text-brand-600 transition-transform duration-300 group-hover:scale-110 dark:text-brand-400" />
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}
