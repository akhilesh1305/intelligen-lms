"use client";

import { useState } from "react";
import { ChevronDown, List } from "lucide-react";
import { cn } from "@/lib/utils";

export function LearnLessonSidebar({
  lessonCount,
  children,
}: {
  lessonCount: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:contents">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-surface/80 px-3 py-3 text-left text-sm font-semibold text-ink lg:hidden"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <List className="h-4 w-4 text-brand-600" />
          Course lessons ({lessonCount})
        </span>
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 text-muted transition-transform", open && "rotate-180")}
        />
      </button>
      <div className={cn(!open && "hidden lg:block")}>{children}</div>
    </div>
  );
}
