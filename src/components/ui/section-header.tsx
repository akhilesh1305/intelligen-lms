import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  description,
  className,
  action,
  gradient = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  action?: React.ReactNode;
  gradient?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between",
        className
      )}
      data-section-header
    >
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">
            {eyebrow}
          </p>
        ) : null}
        <h2
          className={cn(
            eyebrow ? "mt-2" : "",
            "text-balance text-2xl font-bold tracking-tight sm:text-3xl",
            gradient ? "gradient-text" : "text-ink"
          )}
        >
          {title}
        </h2>
        {description && (
          <p className="mt-2 max-w-2xl text-pretty text-base leading-relaxed text-muted">
            {description}
          </p>
        )}
      </div>
      {action ? (
        <div className="-mx-1 flex w-full shrink-0 flex-wrap gap-2 overflow-x-auto px-1 pb-1 sm:w-auto sm:overflow-visible">
          {action}
        </div>
      ) : null}
    </div>
  );
}
