"use client";

import { useTheme } from "@/components/theme/theme-provider";
import { cn } from "@/lib/utils";
import { LogoMark } from "./logo-mark";

type LogoWatermarkProps = {
  className?: string;
  size?: number;
  /** 0–1 decorative opacity */
  opacity?: number;
  /** Force light- or dark-background wordmark colors */
  tone?: "light" | "dark" | "auto";
  animated?: boolean;
  position?:
    | "center"
    | "top-right"
    | "bottom-right"
    | "top-left"
    | "bottom-left";
};

const positionClass = {
  center: "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
  "top-right": "right-0 top-0 translate-x-1/4 -translate-y-1/4",
  "bottom-right": "bottom-0 right-0 translate-x-1/4 translate-y-1/4",
  "top-left": "left-0 top-0 -translate-x-1/4 -translate-y-1/4",
  "bottom-left": "bottom-0 left-0 -translate-x-1/4 translate-y-1/4",
} as const;

/** Faint branded logo for backgrounds — certificates, heroes, auth panels. */
export function LogoWatermark({
  className,
  size = 240,
  opacity = 0.07,
  tone = "auto",
  animated = false,
  position = "center",
}: LogoWatermarkProps) {
  const { resolvedTheme } = useTheme();
  const inverted =
    tone === "dark" || (tone === "auto" && resolvedTheme === "dark");

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute z-0 select-none",
        positionClass[position],
        className
      )}
      style={{ opacity }}
    >
      <LogoMark size={size} inverted={inverted} animated={animated} />
    </div>
  );
}
