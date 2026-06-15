import Link from "next/link";
import { Gamepad2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function LeaderboardTabs({
  active,
}: {
  active: "quiz" | "corporate";
}) {
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      <Link
        href="/leaderboard"
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
          active === "quiz"
            ? "bg-brand-600 text-white"
            : "bg-slate-100 text-ink hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
        )}
      >
        <Zap className="h-4 w-4" />
        Quiz leaderboard
      </Link>
      <Link
        href="/corporate-games/leaderboard"
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
          active === "corporate"
            ? "bg-brand-600 text-white"
            : "bg-slate-100 text-ink hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
        )}
      >
        <Gamepad2 className="h-4 w-4" />
        Corporate leaderboard
      </Link>
    </div>
  );
}
