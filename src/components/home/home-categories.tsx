"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimateOnScroll } from "@/components/motion/animate-on-scroll";
import {
  HOME_CARD,
  HOME_CARD_FOCUS,
  HOME_GRID,
  HOME_INNER,
  HOME_SECTION,
  homeStaggerDelay,
} from "@/components/home/home-polish";
import { SectionHeader } from "@/components/ui/section-header";
import { HOME_CATEGORY_IMAGES } from "@/lib/home-images";
import { cn } from "@/lib/utils";

export function HomeCategories() {
  return (
    <section className={HOME_SECTION}>
      <div className={HOME_INNER}>
        <AnimateOnScroll>
          <SectionHeader
            eyebrow="Catalog"
            title="Explore top categories"
            description="Find the right course to achieve your goals"
          />
        </AnimateOnScroll>
        <div className={cn(HOME_GRID, "grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6")}>
          {HOME_CATEGORY_IMAGES.map((cat, i) => (
            <AnimateOnScroll key={cat.name} delay={homeStaggerDelay(i)} animation="fade-up">
              <Link
                href={`/courses?q=${cat.query}`}
                className={cn(
                  HOME_CARD,
                  HOME_CARD_FOCUS,
                  "group relative flex h-full min-w-0 flex-col overflow-hidden p-0",
                  cat.hover
                )}
              >
                <div className="relative h-20 overflow-hidden sm:h-24">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, 16vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-panel via-panel/40 to-transparent" />
                </div>
                <div className="flex flex-1 flex-col items-center p-3">
                  <span
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg bg-surface text-lg ring-2 transition-transform duration-300 motion-safe:group-hover:scale-105",
                      cat.ring
                    )}
                  >
                    {cat.emoji}
                  </span>
                  <span
                    className={cn(
                      "mt-2 line-clamp-2 text-center text-xs font-semibold leading-snug text-ink sm:text-sm",
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
      </div>
    </section>
  );
}
