"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoWatermark } from "@/components/brand/logo-watermark";
import { GradientOrbs } from "@/components/decorative/gradient-orbs";
import { HeroDashboardPreview } from "@/components/home/hero-dashboard-preview";

export function HomeHero({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <section className="hero-gradient relative overflow-hidden text-white">
      <GradientOrbs variant="hero" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGUtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
      <LogoWatermark
        tone="dark"
        size={300}
        opacity={0.1}
        position="top-right"
        className="hidden sm:block"
      />

      <div className="relative mx-auto grid min-w-0 max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 sm:py-14 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-20">
        <div
          className={`min-w-0 text-center transition-all duration-1000 ease-out lg:text-left ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-cyan-100 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-cyan-300" />
            AI-Powered Learning Platform
          </div>

          <h1 className="text-balance mx-auto max-w-xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:mx-0 lg:text-6xl">
            AI-Powered Learning That{" "}
            <span className="bg-gradient-to-r from-cyan-200 via-white to-violet-200 bg-clip-text text-transparent">
              Drives Results
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-200/90 sm:text-lg lg:mx-0">
            Create courses, generate quizzes, track progress, and accelerate
            workforce learning with AI.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
            {isLoggedIn ? (
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="w-full min-w-0 sm:min-w-[200px] sm:w-auto"
                >
                  Go to dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Link href="/courses">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full min-w-0 border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 sm:min-w-[200px] sm:w-auto"
                >
                  Explore courses
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div
          className={`relative min-w-0 overflow-hidden lg:overflow-visible ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          } transition-all duration-1000 ease-out`}
          style={{ transitionDelay: "200ms" }}
        >
          <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-br from-brand-400/30 via-cyan-400/20 to-violet-500/25 blur-3xl" />
          <HeroDashboardPreview className="relative" />
        </div>
      </div>
    </section>
  );
}
