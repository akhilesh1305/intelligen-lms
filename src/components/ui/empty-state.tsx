import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[20px] border border-dashed border-border bg-panel px-6 py-16 text-center shadow-card",
        className
      )}
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[14px] bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="mt-5 text-xl font-bold text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">{description}</p>
      {(action || secondaryAction) && (
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {action ? (
            <Link href={action.href}>
              <Button>{action.label}</Button>
            </Link>
          ) : null}
          {secondaryAction ? (
            <Link href={secondaryAction.href}>
              <Button variant="outline">{secondaryAction.label}</Button>
            </Link>
          ) : null}
        </div>
      )}
    </div>
  );
}
