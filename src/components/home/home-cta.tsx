"use client";

import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { AnimateOnScroll } from "@/components/motion/animate-on-scroll";
import { LogoWatermark } from "@/components/brand/logo-watermark";
import { Button } from "@/components/ui/button";
import { HOME_SECTION_IMAGES } from "@/lib/home-images";

export function HomeCta({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <section className="cta-gradient relative overflow-hidden py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.12),transparent_50%)]" />
      <div className="pointer-events-none absolute -right-20 top-0 h-64 w-64 animate-float rounded-full bg-white/10 blur-3xl" />
      <LogoWatermark
        tone="dark"
        size={260}
        opacity={0.1}
        position="bottom-left"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <AnimateOnScroll animation="slide-right">
          <div className="relative mx-auto aspect-video max-w-md overflow-hidden rounded-2xl border border-white/20 shadow-elevated lg:mx-0">
            <Image
              src={HOME_SECTION_IMAGES.cta}
              alt="Start your learning journey"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 80vw, 40vw"
            />
            <div className="absolute inset-0 bg-brand-900/30" />
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll animation="slide-left" className="text-center lg:text-left">
          <BookOpen className="mx-auto h-12 w-12 text-brand-200 lg:mx-0" />
          <h2 className="mt-6 text-3xl font-bold text-white">
            Take the next step toward your goals
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Join IntelliGen LMS today. It&apos;s free to get started.
          </p>
          <Link href={isLoggedIn ? "/dashboard" : "/register"} className="mt-8 inline-block">
            <Button
              size="lg"
              className="bg-white text-brand-700 shadow-elevated transition-transform hover:scale-105 hover:bg-brand-50 hover:text-brand-800"
            >
              {isLoggedIn ? "Continue Learning" : "Start Learning Today"}
            </Button>
          </Link>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
