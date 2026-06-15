"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimateOnScroll } from "@/components/motion/animate-on-scroll";
import { SectionHeader } from "@/components/ui/section-header";
import { HOME_CATEGORY_IMAGES } from "@/lib/home-images";
import { cn } from "@/lib/utils";

export function HomeCategories() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <AnimateOnScroll>
        <SectionHeader
          title="Explore top categories"
          description="Find the right course to achieve your goals"
        />
      </AnimateOnScroll>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {HOME_CATEGORY_IMAGES.map((cat, i) => (
          <AnimateOnScroll key={cat.name} delay={i * 80} animation="scale-in">
            <Link
              href={`/courses?q=${cat.query}`}
              className={cn(
                "group relative flex h-full flex-col overflow-hidden rounded-xl border border-border shadow-card transition-all duration-500 hover:-translate-y-1 hover:shadow-card-hover",
                cat.hover
              )}
            >
              <div className="relative h-24 overflow-hidden sm:h-28">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, 16vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-panel via-panel/40 to-transparent" />
              </div>
              <div className="flex flex-1 flex-col items-center p-4">
                <span
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg bg-surface text-lg ring-2 transition-transform duration-300 group-hover:scale-110",
                    cat.ring
                  )}
                >
                  {cat.emoji}
                </span>
                <span
                  className={cn(
                    "mt-2 text-center text-sm font-semibold text-ink transition-colors",
                    cat.text
                  )}
                >
                  {cat.name}
                </span>
              </div>
            </Link>
          </AnimateOnScroll>
        ))}
      </div>
    </section>
  );
}
