import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "h-1.5 w-full overflow-hidden rounded-full bg-surface dark:bg-slate-700",
        className
      )}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400 transition-[width] duration-700 ease-out motion-safe:transition-all"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
