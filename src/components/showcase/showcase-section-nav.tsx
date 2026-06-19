"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SHOWCASE_NAV } from "@/lib/showcase-screens";
import { cn } from "@/lib/utils";

export function ShowcaseSectionNav() {
  const [activeId, setActiveId] = useState(SHOWCASE_NAV[0]?.id ?? "");

  useEffect(() => {
    const sections = SHOWCASE_NAV.map((item) => document.getElementById(item.id)).filter(
      Boolean
    ) as HTMLElement[];

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-40% 0px -45% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Showcase sections"
      className="sticky top-14 z-30 border-b border-border/80 bg-panel/95 shadow-sm backdrop-blur-md dark:bg-slate-950/95 sm:top-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 py-2.5">
          <span className="hidden shrink-0 text-xs font-semibold uppercase tracking-wider text-muted sm:inline">
            Jump to
          </span>
          <div className="flex flex-1 gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
            {SHOWCASE_NAV.map((link, index) => {
              const active = activeId === link.id;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors sm:px-3.5 sm:text-sm",
                    active
                      ? "bg-brand-600 text-white shadow-sm dark:bg-brand-500"
                      : "text-muted hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-brand-950/50 dark:hover:text-brand-300"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
                      active ? "bg-white/20 text-white" : "bg-surface text-muted"
                    )}
                    aria-hidden
                  >
                    {index + 1}
                  </span>
                  <span className="whitespace-nowrap">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
