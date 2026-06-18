"use client";

import { AnimateOnScroll } from "@/components/motion/animate-on-scroll";
import type { ReactNode } from "react";

export function GamesAnimatedSection({
  children,
  delay = 0,
  animation = "fade-up" as const,
  className,
}: {
  children: ReactNode;
  delay?: number;
  animation?: "fade-up" | "fade-in" | "slide-left" | "slide-right" | "scale-in";
  className?: string;
}) {
  return (
    <AnimateOnScroll delay={delay} animation={animation} className={className}>
      {children}
    </AnimateOnScroll>
  );
}
