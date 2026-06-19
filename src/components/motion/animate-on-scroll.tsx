"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRecordingMode } from "@/components/recording/recording-mode-provider";
import { readRecordingModeEnabled } from "@/lib/recording-mode/storage";
import { cn } from "@/lib/utils";

type Animation = "fade-up" | "fade-in" | "slide-left" | "slide-right" | "scale-in";

const hidden: Record<Animation, string> = {
  "fade-up": "translate-y-8 opacity-0",
  "fade-in": "opacity-0",
  "slide-left": "-translate-x-8 opacity-0",
  "slide-right": "translate-x-8 opacity-0",
  "scale-in": "scale-95 opacity-0",
};

export function AnimateOnScroll({
  children,
  className,
  delay = 0,
  animation = "fade-up",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  animation?: Animation;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const recording = useRecordingMode();
  const [visible, setVisible] = useState(() =>
    typeof window !== "undefined" ? readRecordingModeEnabled() : false
  );

  useEffect(() => {
    if (recording.enabled) {
      setVisible(true);
    }
  }, [recording.enabled]);

  useEffect(() => {
    if (recording.enabled) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -32px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [recording.enabled]);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-all duration-600 ease-out will-change-transform",
        visible ? "translate-x-0 translate-y-0 scale-100 opacity-100" : hidden[animation],
        className
      )}
    >
      {children}
    </div>
  );
}
