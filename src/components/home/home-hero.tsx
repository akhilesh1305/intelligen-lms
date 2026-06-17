"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoWatermark } from "@/components/brand/logo-watermark";
import { GradientOrbs } from "@/components/decorative/gradient-orbs";
import { SearchBar } from "@/components/layout/search-bar";
import { HOME_SECTION_IMAGES } from "@/lib/home-images";

export function HomeHero({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <section className="hero-gradient relative overflow-hidden text-white">
      <GradientOrbs variant="hero" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
      <LogoWatermark
        tone="dark"
        size={300}
        opacity={0.1}
        position="top-right"
        className="hidden sm:block"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
        <div
          className={`text-center transition-all duration-1000 ease-out lg:text-left ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-cyan-100 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-cyan-300" />
            AI-powered learning platform
          </div>

          <h1 className="text-balance text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
            Learn smarter with{" "}
            <span className="bg-gradient-to-r from-cyan-200 via-white to-violet-200 bg-clip-text text-transparent">
              IntelliGen
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-200/90 sm:text-xl">
            Enterprise-grade courses, AI coaching, and credentials — built for
            teams and ambitious learners.
          </p>

          <div className="mx-auto mt-10 max-w-xl lg:mx-0">
            <SearchBar className="[&_input]:rounded-xl [&_input]:border-white/20 [&_input]:bg-white/10 [&_input]:text-white [&_input]:placeholder:text-slate-300/70 [&_input]:backdrop-blur-md [&_input]:focus:border-cyan-300/50 [&_input]:focus:ring-cyan-400/25" />
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
            {isLoggedIn ? (
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="w-full min-w-0 sm:min-w-[200px] sm:w-auto"
                >
                  Go to My Learning
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
                    Start for free
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full min-w-0 border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 sm:min-w-[200px] sm:w-auto"
                  >
                    Explore courses
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        <div
          className={`relative mx-auto w-full max-w-lg transition-all duration-1000 ease-out lg:max-w-none ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/20 shadow-elevated ring-1 ring-white/10">
            <Image
              src={HOME_SECTION_IMAGES.heroMain}
              alt="Professionals learning together"
              fill
              priority
              className="object-cover transition-transform duration-700 hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
          </div>

          <div className="animate-float absolute -bottom-4 -left-4 hidden overflow-hidden rounded-2xl border border-white/20 shadow-elevated sm:block lg:-left-8">
            <Image
              src={HOME_SECTION_IMAGES.heroAccent}
              alt="Online learning on laptop"
              width={160}
              height={120}
              className="h-28 w-40 object-cover"
            />
          </div>

          <div
            className="animate-float absolute -right-2 top-4 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-xl sm:-right-6"
            style={{ animationDelay: "1.5s" }}
          >
            <p className="text-2xl font-bold text-white">4.9★</p>
            <p className="text-xs text-cyan-100">Learner rating</p>
          </div>
        </div>
      </div>
    </section>
  );
}
