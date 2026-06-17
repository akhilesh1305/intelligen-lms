"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoWatermark } from "@/components/brand/logo-watermark";
import { GradientOrbs } from "@/components/decorative/gradient-orbs";
import { HeroTrustStrip } from "@/components/layout/desktop-nav-links";
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

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8 lg:py-32">
        <div
          className={`text-center transition-all duration-1000 ease-out lg:text-left ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-cyan-100 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-cyan-300" />
            AI-Powered Learning Platform
          </div>

          <h1 className="text-balance text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl xl:text-[3.5rem]">
            AI-Powered Learning That{" "}
            <span className="bg-gradient-to-r from-cyan-200 via-white to-violet-200 bg-clip-text text-transparent">
              Drives Results
            </span>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-slate-200/90 sm:text-xl">
            Create courses, generate quizzes, track progress, and accelerate
            workforce learning with AI.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
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
              <>
                <Link href="/register">
                  <Button
                    size="lg"
                    className="w-full min-w-0 sm:min-w-[200px] sm:w-auto"
                  >
                    Start Free Trial
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <a href="mailto:hello@intelligenlms.com?subject=Book%20a%20Demo">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full min-w-0 border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 sm:min-w-[200px] sm:w-auto"
                  >
                    <Calendar className="h-4 w-4" />
                    Book Demo
                  </Button>
                </a>
              </>
            )}
          </div>

          <HeroTrustStrip />

          <p className="mt-8 text-sm text-slate-300/80">
            No credit card required · Enterprise-ready · Free tier available
          </p>
        </div>

        <div
          className={`relative transition-all duration-1000 ease-out ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          <div className="pointer-events-none absolute -inset-8 rounded-[28px] bg-gradient-to-br from-brand-400/30 via-cyan-400/20 to-violet-500/25 blur-3xl" />
          <HeroDashboardPreview className="relative" />
        </div>
      </div>
    </section>
  );
}
