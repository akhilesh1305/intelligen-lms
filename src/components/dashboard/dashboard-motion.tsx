"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRecordingMode } from "@/components/recording/recording-mode-provider";
import { readRecordingModeEnabled } from "@/lib/recording-mode/storage";
import { AnimateOnScroll } from "@/components/motion/animate-on-scroll";
import { cn } from "@/lib/utils";

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative overflow-hidden" data-no-reveal>
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 animate-float rounded-full bg-brand-500/8 blur-3xl" />
      <div
        className="pointer-events-none absolute -right-20 top-40 h-80 w-80 animate-float rounded-full bg-violet-500/8 blur-3xl"
        style={{ animationDelay: "2.5s" }}
      />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-56 w-56 animate-pulse-glow rounded-full bg-cyan-500/5 blur-3xl" />
      <div className="relative">{children}</div>
    </div>
  );
}

export function DashboardFade({
  children,
  delay = 0,
  animation = "fade-up",
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

export function DashboardHero({
  title,
  subtitle,
  progress,
  children,
}: {
  title: string;
  subtitle: string;
  progress?: number;
  children?: ReactNode;
}) {
  const recording = useRecordingMode();
  const [mounted, setMounted] = useState(() =>
    typeof window !== "undefined" ? readRecordingModeEnabled() : false
  );

  useEffect(() => {
    if (recording.enabled) {
      setMounted(true);
      return;
    }
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, [recording.enabled]);

  return (
    <section
      className="relative overflow-hidden border-b border-brand-700/30 bg-gradient-to-r from-brand-600 via-brand-600 to-brand-700 text-white"
      data-no-reveal
    >
      <div className="pointer-events-none absolute -left-16 top-0 h-48 w-48 animate-float rounded-full bg-white/10 blur-3xl" />
      <div
        className="pointer-events-none absolute -right-10 bottom-0 h-56 w-56 animate-float rounded-full bg-violet-400/15 blur-3xl"
        style={{ animationDelay: "1.5s" }}
      />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />

      <div
        className={cn(
          "relative mx-auto max-w-7xl px-4 py-10 transition-all duration-700 ease-out sm:px-6 lg:px-8",
          mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
            <p className="mt-2 text-brand-100">{subtitle}</p>
          </div>
          {children ? (
            <div
              className={cn(
                "flex flex-wrap gap-2 transition-all duration-700 delay-150",
                mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              )}
            >
              {children}
            </div>
          ) : null}
        </div>

        {progress !== undefined ? (
          <div
            className={cn(
              "mt-6 max-w-md transition-all duration-700 delay-200",
              mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            )}
          >
            <div className="mb-2 flex justify-between text-sm text-brand-100">
              <span>Overall progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-brand-500/30">
              <div
                className="h-full rounded-full bg-white transition-all duration-1000 ease-out"
                style={{ width: mounted ? `${progress}%` : "0%" }}
              />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function DashboardPageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
}) {
  const recording = useRecordingMode();
  const [mounted, setMounted] = useState(() =>
    typeof window !== "undefined" ? readRecordingModeEnabled() : false
  );

  useEffect(() => {
    if (recording.enabled) {
      setMounted(true);
      return;
    }
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, [recording.enabled]);

  return (
    <section className="border-b border-border bg-panel" data-no-reveal>
      <div
        className={cn(
          "mx-auto max-w-7xl px-4 py-10 transition-all duration-700 ease-out sm:px-6 lg:px-8",
          mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-ink">{title}</h1>
            <p className="mt-2 text-muted">{subtitle}</p>
          </div>
          {action ? (
            <div className="transition-all duration-700 delay-100">{action}</div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
