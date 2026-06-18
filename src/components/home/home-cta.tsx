"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";
import { AnimateOnScroll } from "@/components/motion/animate-on-scroll";
import { LogoWatermark } from "@/components/brand/logo-watermark";
import { Button } from "@/components/ui/button";
import { HOME_SECTION_IMAGES } from "@/lib/home-images";

export function HomeCta({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <section className="cta-gradient relative overflow-hidden py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.14),transparent_55%)]" />
      <div className="pointer-events-none absolute -right-20 top-0 h-72 w-72 animate-float rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-cyan-300/10 blur-3xl" />
      <LogoWatermark tone="dark" size={260} opacity={0.1} position="bottom-left" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <AnimateOnScroll animation="slide-right">
          <div className="relative mx-auto aspect-video max-w-md overflow-hidden rounded-[20px] border border-white/20 shadow-elevated lg:mx-0">
            <Image
              src={HOME_SECTION_IMAGES.cta}
              alt="Transform your team learning"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 80vw, 40vw"
            />
            <div className="absolute inset-0 bg-brand-900/30" />
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll animation="slide-left" className="text-center lg:text-left">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-cyan-100 backdrop-blur-md">
            <Sparkles className="h-4 w-4" />
            Enterprise-ready
          </div>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to Transform Learning?
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Join teams seeing 95% higher completion, 40% lower training costs, and 3x
            faster onboarding. Start free or book a walkthrough with our team.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
            <Link href={isLoggedIn ? "/dashboard" : "/register"}>
              <Button
                size="lg"
                className="w-full min-w-[200px] bg-white text-brand-700 shadow-elevated hover:bg-brand-50 hover:text-brand-800 motion-safe:hover:opacity-95 sm:w-auto"
              >
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="mailto:hello@intelligenlms.com?subject=Book%20a%20Demo">
              <Button
                size="lg"
                variant="secondary"
                className="w-full min-w-[200px] border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 sm:w-auto"
              >
                <Calendar className="h-4 w-4" />
                Book Demo
              </Button>
            </a>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
