"use client";

import Link from "next/link";
import { Flame, Medal, Star, Trophy } from "lucide-react";
import { AnimateOnScroll } from "@/components/motion/animate-on-scroll";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GradientOrbs } from "@/components/decorative/gradient-orbs";

const DEMO_STATS = [
  { icon: Star, label: "XP points", value: "2,480", color: "from-amber-400 to-orange-500" },
  { icon: Medal, label: "Badges earned", value: "12", color: "from-violet-500 to-brand-500" },
  { icon: Flame, label: "Day streak", value: "7", color: "from-rose-500 to-orange-500" },
  { icon: Trophy, label: "Leaderboard rank", value: "#8", color: "from-cyan-500 to-brand-500" },
];

export function HomeGamification() {
  return (
    <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
      <GradientOrbs variant="subtle" />
      <div className="relative mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[20px] border border-border bg-gradient-to-br from-brand-50/80 via-panel to-accent-cyan-light/40 p-8 shadow-card dark:from-brand-950/30 dark:via-panel dark:to-cyan-950/20 sm:p-12">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <AnimateOnScroll animation="slide-right">
              <Badge variant="brand" className="mb-4 normal-case tracking-normal">
                Example learner profile
              </Badge>
              <p className="text-sm font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">
                Gamification built in
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                Motivate learners with{" "}
                <span className="gradient-text">XP, badges & streaks</span>
              </h2>
              <p className="mt-4 text-lg text-muted">
                Turn completion into momentum. Leaderboards, achievements, and
                corporate games keep teams engaged and accountable.
              </p>
              <Link href="/leaderboard" className="mt-8 inline-block">
                <Button size="lg">View leaderboard</Button>
              </Link>
            </AnimateOnScroll>

            <div className="grid grid-cols-2 gap-4">
              {DEMO_STATS.map((stat, i) => (
                <AnimateOnScroll key={stat.label} delay={i * 80} animation="scale-in">
                  <div className="glass-card rounded-[20px] p-5 transition-transform duration-300 motion-safe:hover:-translate-y-1">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-[14px] bg-gradient-to-br ${stat.color} text-white shadow-lg`}
                    >
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <p className="mt-4 text-2xl font-bold text-ink">{stat.value}</p>
                    <p className="mt-1 text-sm text-muted">{stat.label}</p>
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
