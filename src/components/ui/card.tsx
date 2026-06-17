import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({
  className,
  glass = false,
  ...props
}: HTMLAttributes<HTMLDivElement> & { glass?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-panel shadow-card transition-all duration-300 ease-out motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-card-hover",
        glass && "glass-card",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pb-0", className)} {...props} />;
}

export function CardContent({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6", className)} {...props} />;
}
