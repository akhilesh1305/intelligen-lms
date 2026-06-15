import Link from "next/link";
import { Calendar, CalendarRange } from "lucide-react";
import { cn } from "@/lib/utils";

export function CorporatePeriodTabs({
  active,
}: {
  active: "daily" | "weekly";
}) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <Link
        href="/corporate-games/leaderboard?period=daily"
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
          active === "daily"
            ? "bg-brand-600 text-white"
            : "bg-slate-100 text-ink hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
        )}
      >
        <Calendar className="h-4 w-4" />
        Daily
      </Link>
      <Link
        href="/corporate-games/leaderboard?period=weekly"
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
          active === "weekly"
            ? "bg-brand-600 text-white"
            : "bg-slate-100 text-ink hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
        )}
      >
        <CalendarRange className="h-4 w-4" />
        Weekly
      </Link>
    </div>
  );
}
