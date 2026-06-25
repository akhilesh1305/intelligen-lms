"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useTransition } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most popular" },
  { value: "price-low", label: "Price: low to high" },
  { value: "price-high", label: "Price: high to low" },
] as const;

const LEVELS = ["All", "BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;

const LEVEL_LABELS: Record<string, string> = {
  All: "All levels",
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

export function CoursesCatalogToolbar({
  query,
  sort,
  level,
}: {
  query: string;
  category: string;
  sort: string;
  level: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  function push(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (!value || value === "All" || (key === "sort" && value === "newest")) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `/courses?${qs}` : "/courses");
    });
  }

  return (
    <div
      className={cn(
        "sticky top-[4.25rem] z-30 -mx-4 mb-8 border-b border-border bg-background/80 px-4 py-4 backdrop-blur-xl sm:top-[4.5rem] sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:mb-6 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none",
        pending && "opacity-80"
      )}
    >
      <form
        className="flex flex-col gap-4 lg:flex-row lg:items-end"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          push({ q: String(fd.get("q") ?? "").trim() || undefined });
        }}
      >
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-[2.35rem] h-4 w-4 text-muted" />
          <Input
            id="course-search"
            name="q"
            label="Search courses"
            defaultValue={query}
            placeholder="Title, instructor, or topic…"
            className="pl-10"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:w-auto lg:shrink-0">
          <div className="space-y-1.5">
            <label htmlFor="course-sort" className="block text-sm font-semibold text-ink">
              Sort by
            </label>
            <select
              id="course-sort"
              value={sort}
              onChange={(e) => push({ sort: e.target.value })}
              className="flex h-11 w-full rounded-[12px] border border-border bg-panel px-3.5 text-sm text-ink shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/25 dark:bg-panel"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="hidden h-11 rounded-[14px] bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700 sm:block lg:mb-0"
          >
            Search
          </button>
        </div>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {LEVELS.map((lvl) => (
          <button
            key={lvl}
            type="button"
            onClick={() => push({ level: lvl === "All" ? undefined : lvl })}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors duration-150",
              (level === lvl || (lvl === "All" && level === "All"))
                ? "bg-brand-600 text-white shadow-sm"
                : "bg-panel text-muted ring-1 ring-border hover:text-ink"
            )}
          >
            {LEVEL_LABELS[lvl]}
          </button>
        ))}
      </div>
    </div>
  );
}
