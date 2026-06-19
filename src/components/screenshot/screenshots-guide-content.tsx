"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Camera,
  CheckCircle2,
  ExternalLink,
  Monitor,
  MousePointerClick,
  Sparkles,
} from "lucide-react";
import { SCREENSHOT_GUIDES, type ScreenshotGuide } from "@/lib/screenshot-mode/guides";
import { useScreenshotMode } from "./screenshot-mode-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function GuideCard({ guide }: { guide: ScreenshotGuide }) {
  const { enabled, enable } = useScreenshotMode();
  const [prepared, setPrepared] = useState(false);

  function handleOpen() {
    if (!enabled) {
      enable();
    }
    setPrepared(true);
  }

  return (
    <Card className="overflow-hidden border-border shadow-card">
      <CardContent className="p-0">
        <div className="border-b border-border bg-gradient-to-r from-brand-50/80 via-panel to-violet-50/50 px-6 py-5 dark:from-brand-950/40 dark:via-panel dark:to-violet-950/20">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-ink">{guide.title}</h3>
              <p className="mt-1 font-mono text-xs text-muted">{guide.href}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={guide.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleOpen}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-border bg-panel px-3 text-sm font-semibold text-ink shadow-sm transition-colors hover:bg-surface"
              >
                <ExternalLink className="h-4 w-4" />
                Open page
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-2">
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="flex items-center gap-2 font-semibold text-ink">
                <Monitor className="h-4 w-4 text-brand-600" aria-hidden />
                Recommended viewport
              </dt>
              <dd className="mt-1 text-muted">
                {guide.viewport.label}{" "}
                <span className="font-mono text-xs">
                  ({guide.viewport.width}×{guide.viewport.height})
                </span>
              </dd>
            </div>
            <div>
              <dt className="flex items-center gap-2 font-semibold text-ink">
                <MousePointerClick className="h-4 w-4 text-brand-600" aria-hidden />
                Recommended section
              </dt>
              <dd className="mt-1 text-muted">{guide.section}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-2 font-semibold text-ink">
                <Sparkles className="h-4 w-4 text-brand-600" aria-hidden />
                Recommended data state
              </dt>
              <dd className="mt-1 text-muted">{guide.dataState}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Theme</dt>
              <dd className="mt-1 capitalize text-muted">{guide.theme}</dd>
            </div>
          </dl>

          <div>
            <p className="text-sm font-semibold text-ink">Capture instructions</p>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted">
              {guide.instructions.map((step, i) => (
                <li key={i} className="text-pretty leading-relaxed">
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {prepared ? (
          <div className="flex items-center gap-2 border-t border-border bg-emerald-50/80 px-6 py-3 text-sm text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200">
            <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
            Page opened — Screenshot Mode {enabled ? "is active" : "will apply on next navigation"}.
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function ScreenshotsGuideContent() {
  const { enabled, enable, disable } = useScreenshotMode();
  const [justPrepared, setJustPrepared] = useState(false);

  function handlePrepare() {
    enable();
    setJustPrepared(true);
    window.setTimeout(() => setJustPrepared(false), 4000);
  }

  return (
    <div className="space-y-8">
      <Card className="border-brand-200/60 bg-gradient-to-br from-brand-50/90 via-panel to-cyan-50/40 shadow-card dark:border-brand-800/40 dark:from-brand-950/50 dark:via-panel dark:to-cyan-950/20">
        <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
              Portfolio capture
            </p>
            <h2 className="mt-2 text-xl font-bold text-ink">Prepare Screenshot Mode</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Hides promo bars, demo notices, PWA prompts, the floating assistant, notifications,
              and footer chrome. Applies only in this browser tab session — no server or production
              data changes.
            </p>
            {justPrepared || enabled ? (
              <p
                className={cn(
                  "mt-3 flex items-center gap-2 text-sm font-medium",
                  enabled
                    ? "text-emerald-700 dark:text-emerald-300"
                    : "text-muted"
                )}
                role="status"
              >
                <CheckCircle2 className="h-4 w-4" aria-hidden />
                {enabled
                  ? "Screenshot Mode is on — open any target page and capture."
                  : "Enabling…"}
              </p>
            ) : null}
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:items-end">
            <Button type="button" size="lg" onClick={handlePrepare} className="gap-2">
              <Camera className="h-5 w-5" aria-hidden />
              Prepare Screenshot Mode
            </Button>
            {enabled ? (
              <Button type="button" variant="ghost" size="sm" onClick={disable}>
                Turn off
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <div className="rounded-xl border border-border bg-panel/60 p-5 text-sm text-muted">
        <p className="font-semibold text-ink">Quick workflow</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>Click <strong className="text-ink">Prepare Screenshot Mode</strong>.</li>
          <li>Sign in with the recommended demo account if needed.</li>
          <li>Open each target page and use DevTools → device toolbar for exact viewport sizes.</li>
          <li>
            Capture with{" "}
            <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-xs">
              Ctrl+Shift+P
            </kbd>{" "}
            → “Capture screenshot” (Chrome).
          </li>
          <li>Save to <code className="text-xs">docs/screenshots/</code> for README assets.</li>
          <li>
            Recording video? Use{" "}
            <Link href="/admin/recording-mode" className="font-medium text-brand-600 hover:underline">
              Demo recording mode
            </Link>
            .
          </li>
        </ol>
      </div>

      <div className="space-y-6">
        {SCREENSHOT_GUIDES.map((guide) => (
          <GuideCard key={guide.id} guide={guide} />
        ))}
      </div>
    </div>
  );
}
