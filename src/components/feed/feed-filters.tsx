import Link from "next/link";
import type { FeedPostType } from "@prisma/client";
import { cn } from "@/lib/utils";

const filters: { value?: FeedPostType; label: string }[] = [
  { label: "All" },
  { value: "ACHIEVEMENT", label: "Achievements" },
  { value: "CERTIFICATION", label: "Certifications" },
  { value: "ANNOUNCEMENT", label: "Announcements" },
];

export function FeedFilters({ active }: { active?: FeedPostType }) {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {filters.map((filter) => {
        const href = filter.value ? `/feed?type=${filter.value}` : "/feed";
        const isActive = active === filter.value || (!active && !filter.value);

        return (
          <Link
            key={filter.label}
            href={href}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              isActive
                ? "bg-brand-600 text-white"
                : "bg-slate-100 text-ink hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
            )}
          >
            {filter.label}
          </Link>
        );
      })}
    </div>
  );
}
