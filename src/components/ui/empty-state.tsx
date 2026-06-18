import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EmptyStateSize = "default" | "compact" | "inline";

const sizeStyles: Record<
  EmptyStateSize,
  { shell: string; iconBox: string; icon: string; title: string; description: string; actions: string }
> = {
  default: {
    shell: "px-6 py-16",
    iconBox: "h-14 w-14 rounded-[14px]",
    icon: "h-7 w-7",
    title: "text-xl",
    description: "text-sm max-w-md",
    actions: "mt-8",
  },
  compact: {
    shell: "px-5 py-10",
    iconBox: "h-11 w-11 rounded-xl",
    icon: "h-5 w-5",
    title: "text-base",
    description: "text-sm max-w-sm",
    actions: "mt-5",
  },
  inline: {
    shell: "px-4 py-8",
    iconBox: "h-9 w-9 rounded-lg",
    icon: "h-4 w-4",
    title: "text-sm",
    description: "text-xs max-w-xs",
    actions: "mt-4",
  },
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  size = "default",
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  className?: string;
  size?: EmptyStateSize;
}) {
  const s = sizeStyles[size];

  return (
    <div
      className={cn(
        "rounded-[20px] border border-dashed border-border bg-panel text-center shadow-card",
        s.shell,
        className
      )}
    >
      <div
        className={cn(
          "mx-auto flex items-center justify-center bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400",
          s.iconBox
        )}
      >
        <Icon className={s.icon} aria-hidden />
      </div>
      <h3 className={cn("mt-4 font-bold text-ink", s.title)}>{title}</h3>
      <p className={cn("mx-auto mt-1.5 text-muted", s.description)}>{description}</p>
      {(action || secondaryAction) && (
        <div
          className={cn(
            "flex flex-col items-center justify-center gap-3 sm:flex-row",
            s.actions
          )}
        >
          {action ? (
            <Link href={action.href}>
              <Button size={size === "inline" ? "sm" : "md"}>{action.label}</Button>
            </Link>
          ) : null}
          {secondaryAction ? (
            <Link href={secondaryAction.href}>
              <Button variant="outline" size={size === "inline" ? "sm" : "md"}>
                {secondaryAction.label}
              </Button>
            </Link>
          ) : null}
        </div>
      )}
    </div>
  );
}
