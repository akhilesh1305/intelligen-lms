"use client";

import type { ReactNode } from "react";
import {
  CALLOUT_ACCENT_CLASS,
  type ScreenshotCallout,
  type ScreenshotPresentationMeta,
} from "@/lib/screenshot-presentation";
import { ShowcaseBrowserFrame } from "@/components/showcase/showcase-browser-frame";
import { cn } from "@/lib/utils";

function ScreenshotCalloutPin({
  callout,
  index,
}: {
  callout: ScreenshotCallout;
  index: number;
}) {
  const accent = CALLOUT_ACCENT_CLASS[callout.accent ?? "brand"];
  const alignRight = callout.align === "right" || callout.left > 58;

  return (
    <div
      className="pointer-events-none absolute z-10"
      style={{
        top: `${callout.top}%`,
        left: `${callout.left}%`,
        transform: "translate(-50%, -50%)",
      }}
      aria-hidden
    >
      {/* Highlight ring on the UI region */}
      <span
        className={cn(
          "absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 motion-safe:animate-pulse sm:h-12 sm:w-12",
          accent.ring,
          "bg-white/5 backdrop-blur-[1px]"
        )}
      />

      {/* Connector dot */}
      <span
        className={cn(
          "absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-md ring-2 ring-white/90",
          accent.dot
        )}
      />

      {/* Callout badge */}
      <div
        className={cn(
          "absolute top-1/2 w-[max(9rem,38vw)] max-w-[11rem] -translate-y-1/2 rounded-xl border px-2.5 py-2 shadow-elevated backdrop-blur-md sm:w-44 sm:max-w-none sm:px-3 sm:py-2.5",
          accent.badge,
          alignRight ? "right-full mr-3 text-right" : "left-full ml-3 text-left"
        )}
        style={{ animationDelay: `${index * 120}ms` }}
      >
        <p className="text-[10px] font-bold uppercase tracking-wide opacity-90 sm:text-[11px]">
          {callout.label}
        </p>
        <p className="mt-0.5 text-[11px] font-semibold leading-snug sm:text-xs">
          {callout.value}
        </p>
      </div>

      {/* Connector line */}
      <span
        className={cn(
          "absolute top-1/2 h-px w-6 -translate-y-1/2 bg-gradient-to-r to-transparent opacity-80",
          accent.line,
          alignRight ? "right-1 origin-right" : "left-1 origin-left"
        )}
        aria-hidden
      />
    </div>
  );
}

function ScreenshotCalloutLayer({
  callouts,
  surface = "dark",
}: {
  callouts: ScreenshotCallout[];
  surface?: "dark" | "light";
}) {
  if (callouts.length === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
      <div
        className={cn(
          "absolute inset-0",
          surface === "light"
            ? "bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(15,23,42,0.08)_100%)]"
            : "bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(15,23,42,0.35)_100%)]"
        )}
        aria-hidden
      />
      {callouts.map((callout, index) => (
        <ScreenshotCalloutPin key={callout.id} callout={callout} index={index} />
      ))}
    </div>
  );
}

function ValueHeadlineStrip({ text }: { text: string }) {
  return (
    <div className="border-t border-white/10 bg-gradient-to-r from-brand-950/90 via-slate-950/95 to-violet-950/90 px-4 py-2.5 sm:px-5 sm:py-3">
      <p className="text-center text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-200/90 sm:text-xs">
        {text}
      </p>
    </div>
  );
}

export function ScreenshotPresentation({
  url,
  sceneLabel,
  valueHeadline,
  callouts = [],
  children,
  className,
}: ScreenshotPresentationMeta & {
  url: string;
  children: ReactNode;
  className?: string;
  /** @deprecated Reserved — callouts auto-align by position */
  compactCallouts?: boolean;
}) {
  return (
    <div className={cn("group/screenshot relative", className)}>
      <div className="pointer-events-none absolute -inset-3 -z-10 rounded-[28px] bg-gradient-to-br from-brand-500/15 via-transparent to-violet-500/15 opacity-0 blur-2xl transition-opacity duration-500 motion-safe:group-hover/screenshot:opacity-100" />
      <ShowcaseBrowserFrame url={url} badge={sceneLabel}>
        <div className="relative">
          {children}
          <ScreenshotCalloutLayer callouts={callouts} />
        </div>
        {valueHeadline ? <ValueHeadlineStrip text={valueHeadline} /> : null}
      </ShowcaseBrowserFrame>
    </div>
  );
}

/** Inline panel framing for product-tour section mocks (no browser chrome) */
export function ScreenshotStoryPanel({
  sceneLabel,
  valueHeadline,
  callouts = [],
  children,
  className,
  surface = "light",
}: ScreenshotPresentationMeta & {
  children: ReactNode;
  className?: string;
  surface?: "dark" | "light";
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[20px] border border-border/80 bg-panel shadow-card ring-1 ring-black/5 dark:ring-white/10",
        className
      )}
    >
      {sceneLabel ? (
        <div className="flex items-center justify-between border-b border-border bg-surface/80 px-4 py-2 dark:bg-slate-900/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
            {sceneLabel}
          </span>
          <span className="rounded-full bg-brand-600/10 px-2 py-0.5 text-[10px] font-semibold text-brand-700 dark:text-brand-300">
            Live preview
          </span>
        </div>
      ) : null}
      <div className="relative">
        {children}
        <ScreenshotCalloutLayer callouts={callouts} surface={surface} />
      </div>
      {valueHeadline ? (
        <div className="border-t border-border bg-gradient-to-r from-brand-50/90 via-panel to-violet-50/50 px-4 py-2.5 dark:from-brand-950/40 dark:via-panel dark:to-violet-950/30 sm:px-5 sm:py-3">
          <p className="text-center text-[11px] font-bold uppercase tracking-[0.12em] text-brand-700 dark:text-brand-300 sm:text-xs">
            {valueHeadline}
          </p>
        </div>
      ) : null}
    </div>
  );
}

/** Wireframe-style preview for screenshot capture guides */
export function ScreenshotCaptureWireframe({
  valueHeadline,
  sceneLabel,
  callouts,
  viewportLabel,
}: ScreenshotPresentationMeta & { viewportLabel?: string }) {
  return (
    <ScreenshotPresentation
      url={viewportLabel ?? "capture frame"}
      sceneLabel={sceneLabel}
      valueHeadline={valueHeadline}
      callouts={callouts}
      compactCallouts
    >
      <div className="relative aspect-[16/10] w-full bg-gradient-to-br from-slate-900 via-slate-950 to-brand-950/40">
        <div className="absolute inset-4 rounded-xl border border-dashed border-white/15 bg-white/[0.03]" />
        <div className="absolute inset-x-6 top-6 h-8 rounded-lg bg-white/10" />
        <div className="absolute inset-x-6 top-16 grid grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 rounded-lg bg-white/8" />
          ))}
        </div>
        <div className="absolute bottom-6 left-6 right-6 top-[42%] rounded-xl border border-white/10 bg-white/5" />
        <p className="absolute bottom-3 left-0 right-0 text-center text-[10px] font-medium uppercase tracking-widest text-white/30">
          Crop to highlighted regions
        </p>
      </div>
    </ScreenshotPresentation>
  );
}
