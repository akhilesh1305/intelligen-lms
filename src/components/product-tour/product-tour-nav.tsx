"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PRODUCT_TOUR_NAV } from "@/lib/product-tour";
import { cn } from "@/lib/utils";

export function ProductTourNav() {
  const [activeId, setActiveId] = useState<string>(PRODUCT_TOUR_NAV[0].id);

  useEffect(() => {
    const sections = PRODUCT_TOUR_NAV.map((item) =>
      document.getElementById(item.id)
    ).filter(Boolean) as HTMLElement[];

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
      { rootMargin: "-35% 0px -45% 0px", threshold: [0, 0.2, 0.5, 0.75] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Product tour sections"
      className="sticky top-14 z-30 border-b border-border/80 bg-panel/95 shadow-sm backdrop-blur-md dark:bg-slate-950/95 sm:top-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 py-2.5">
          <span className="hidden shrink-0 text-[10px] font-bold uppercase tracking-wider text-muted sm:inline sm:text-xs">
            Tour
          </span>
          <div className="flex flex-1 gap-1 overflow-x-auto pb-0.5 scrollbar-hide">
            {PRODUCT_TOUR_NAV.map((link) => {
              const active = activeId === link.id;
              return (
                <Link
                  key={link.id}
                  href={`#${link.id}`}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors sm:text-sm",
                    active
                      ? "bg-brand-600 text-white shadow-sm dark:bg-brand-500"
                      : "text-muted hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-brand-950/50 dark:hover:text-brand-300",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
