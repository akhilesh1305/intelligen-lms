import type { AchievementLevel } from "@prisma/client";
import { cn } from "@/lib/utils";
import { getLevelInfo, UNRANKED_INFO } from "@/lib/achievement-levels";

export function AchievementLevelBadge({
  level,
  size = "md",
  showLabel = true,
  className,
}: {
  level: AchievementLevel | null;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}) {
  const info = level === null ? UNRANKED_INFO : getLevelInfo(level);
  const sizeClass =
    size === "sm"
      ? "px-2 py-0.5 text-xs"
      : size === "lg"
        ? "px-4 py-2 text-base"
        : "px-3 py-1 text-sm";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-bold",
        info.bg,
        info.color,
        sizeClass,
        className
      )}
    >
      <span aria-hidden>{info.icon}</span>
      {showLabel ? info.label : null}
    </span>
  );
}
