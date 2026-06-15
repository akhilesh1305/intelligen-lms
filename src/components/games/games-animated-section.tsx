"use client";

import { AnimateOnScroll } from "@/components/motion/animate-on-scroll";
import type { ReactNode } from "react";

export function GamesAnimatedSection({
  children,
  delay = 0,
  animation = "fade-up" as const,
}: {
  children: ReactNode;
  delay?: number;
  animation?: "fade-up" | "fade-in" | "slide-left" | "slide-right" | "scale-in";
}) {
  return (
    <AnimateOnScroll delay={delay} animation={animation}>
      {children}
    </AnimateOnScroll>
  );
}
