import { FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

export function DemoEnvironmentBadge({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md";
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border border-amber-300/80 bg-gradient-to-r from-amber-50 to-orange-50 font-semibold text-amber-900 shadow-sm dark:border-amber-700/50 dark:from-amber-950/60 dark:to-orange-950/40 dark:text-amber-200",
        size === "sm" ? "px-2 py-0.5 text-[10px] uppercase tracking-wide" : "px-2.5 py-1 text-xs",
        className
      )}
      title="You are viewing the demo environment with sample data"
    >
      <FlaskConical className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} aria-hidden />
      Demo Environment
    </span>
  );
}
