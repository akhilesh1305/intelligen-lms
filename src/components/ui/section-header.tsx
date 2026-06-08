import { cn } from "@/lib/utils";

export function SectionHeader({
  title,
  description,
  className,
  action,
}: {
  title: string;
  description?: string;
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between", className)}>
      <div className="min-w-0">
        <h2 className="text-xl font-bold text-ink sm:text-2xl lg:text-3xl">{title}</h2>
        {description && (
          <p className="mt-2 max-w-2xl text-base text-muted">{description}</p>
        )}
      </div>
      {action ? <div className="flex shrink-0 flex-wrap gap-2">{action}</div> : null}
    </div>
  );
}
