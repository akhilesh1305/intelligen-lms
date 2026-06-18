"use client";

import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { AnimateOnScroll } from "@/components/motion/animate-on-scroll";
import { HOME_SECTION } from "@/components/home/home-polish";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DEMO_MAILTO = "mailto:hello@intelligenlms.com?subject=Book%20a%20Demo";

export function HomeCta({ isLoggedIn }: { isLoggedIn: boolean }) {
  const primaryHref = isLoggedIn ? "/dashboard" : "/register";
  const primaryLabel = isLoggedIn ? "Go to dashboard" : "Start Learning Today";

  return (
    <section className={cn("cta-gradient relative overflow-hidden", HOME_SECTION)}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.12),transparent_60%)]" />

      <div className="relative mx-auto max-w-3xl text-center">
        <AnimateOnScroll>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            {isLoggedIn ? "Pick up where you left off" : "Start learning today"}
          </h2>
          <p className="mt-3 text-base text-blue-100 sm:text-lg">
            {isLoggedIn
              ? "Your courses, progress, and certificates are ready in your dashboard."
              : "Join teams using IntelliGen for AI-powered courses, certificates, and measurable results."}
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link href={primaryHref}>
              <Button
                size="lg"
                className="w-full min-w-[200px] bg-white text-brand-700 shadow-elevated hover:bg-brand-50 hover:text-brand-800 motion-safe:hover:scale-[1.02] sm:w-auto"
              >
                {primaryLabel}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            {!isLoggedIn && (
              <a href={DEMO_MAILTO}>
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full min-w-[200px] border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 motion-safe:hover:scale-[1.02] sm:w-auto"
                >
                  <Calendar className="h-4 w-4" />
                  Book Demo
                </Button>
              </a>
            )}
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
