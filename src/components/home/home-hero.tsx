"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoWatermark } from "@/components/brand/logo-watermark";
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
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 animate-float rounded-full bg-brand-400/20 blur-3xl" />
      <div
        className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 animate-float rounded-full bg-accent-violet/25 blur-3xl"
        style={{ animationDelay: "2s" }}
      />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-40 w-40 -translate-x-1/2 animate-pulse-glow rounded-full bg-white/5 blur-2xl" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40" />
      <LogoWatermark
        tone="dark"
        size={300}
        opacity={0.12}
        position="top-right"
        className="hidden sm:block"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div
          className={`text-center transition-all duration-1000 ease-out lg:text-left ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <h1 className="text-balance text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Learn without limits
          </h1>
          <p className="mt-6 text-lg text-blue-100/90 sm:text-xl">
            Start, switch, or advance your career with expert-led courses on
            IntelliGen LMS — built for teams and individuals.
          </p>

          <div className="mx-auto mt-10 max-w-xl lg:mx-0">
            <SearchBar className="[&_input]:rounded-xl [&_input]:border-white/20 [&_input]:bg-white/10 [&_input]:text-white [&_input]:placeholder:text-blue-200/70 [&_input]:backdrop-blur-sm [&_input]:focus:border-white/40 [&_input]:focus:ring-white/20" />
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
            {isLoggedIn ? (
              <Link href="/dashboard">
                <Button size="lg" className="w-full min-w-0 shadow-glow transition-transform hover:scale-105 sm:min-w-[200px] sm:w-auto">
                  Go to My Learning
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/register">
                  <Button size="lg" className="w-full min-w-0 shadow-glow transition-transform hover:scale-105 sm:min-w-[200px] sm:w-auto">
                    Join for Free
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full min-w-0 border-white/40 text-white transition-transform hover:scale-105 hover:bg-white/15 sm:min-w-[200px] sm:w-auto"
                  >
                    Explore Courses
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
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/20 shadow-elevated">
            <Image
              src={HOME_SECTION_IMAGES.heroMain}
              alt="Professionals learning together"
              fill
              priority
              className="object-cover transition-transform duration-700 hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-900/60 via-transparent to-transparent" />
          </div>

          <div className="animate-float absolute -bottom-4 -left-4 hidden overflow-hidden rounded-xl border border-white/20 shadow-elevated sm:block lg:-left-8">
            <Image
              src={HOME_SECTION_IMAGES.heroAccent}
              alt="Online learning on laptop"
              width={160}
              height={120}
              className="h-28 w-40 object-cover"
            />
          </div>

          <div
            className="animate-float absolute -right-2 top-4 rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-md sm:-right-6"
            style={{ animationDelay: "1.5s" }}
          >
            <p className="text-2xl font-bold text-white">4.9★</p>
            <p className="text-xs text-blue-100">Learner rating</p>
          </div>
        </div>
      </div>
    </section>
  );
}
