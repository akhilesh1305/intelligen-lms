import Link from "next/link";
import { cn } from "@/lib/utils";
import { LogoMark } from "./logo-mark";

type LogoProps = {
  variant?: "full" | "icon";
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
  showText?: boolean;
  inverted?: boolean;
  animated?: boolean;
  /** Icon mark without embedded SVG wordmark — pairs with BrandWordmark. */
  iconOnlyMark?: boolean;
};

const sizes = {
  sm: { icon: 36, text: "text-base sm:text-lg" },
  md: { icon: 40, text: "text-lg sm:text-xl" },
  lg: { icon: 48, text: "text-xl sm:text-2xl" },
};

export function BrandWordmark({
  className,
  inverted = false,
  animated = true,
  size = "md",
}: {
  className?: string;
  inverted?: boolean;
  animated?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass = {
    sm: "text-lg sm:text-xl",
    md: "text-xl sm:text-2xl",
    lg: "text-2xl sm:text-3xl",
  }[size];

  return (
    <span className={cn("inline-flex flex-col leading-none", className)}>
      <span className={cn("font-extrabold tracking-tight", sizeClass)}>
        <span
          className={
            inverted
              ? "bg-gradient-to-r from-sky-200 via-brand-100 to-violet-200 bg-clip-text text-transparent"
              : "bg-gradient-to-r from-brand-600 via-brand-500 to-violet-600 bg-clip-text text-transparent"
          }
        >
          Intelli
        </span>
        <span
          className={cn(
            inverted
              ? "bg-gradient-to-r from-brand-300 via-cyan-300 to-sky-400 bg-clip-text text-transparent"
              : "bg-gradient-to-r from-brand-700 to-cyan-600 bg-clip-text text-transparent",
            animated && "logo-wordmark-gen"
          )}
        >
          Gen
        </span>
      </span>
      <span
        className={cn(
          "mt-1 font-bold uppercase tracking-[0.28em]",
          size === "lg" ? "text-[0.6rem] sm:text-xs" : "text-[0.55rem] sm:text-[0.65rem]",
          inverted ? "text-cyan-300/90" : "text-brand-500 dark:text-cyan-400"
        )}
      >
        LMS
      </span>
    </span>
  );
}

export function Logo({
  variant = "full",
  size = "md",
  href = "/",
  className,
  showText = true,
  inverted = false,
  animated = true,
  iconOnlyMark = false,
}: LogoProps) {
  const dim = sizes[size];
  const useIconOnly = variant === "icon" || !showText;
  const showBesideWordmark = iconOnlyMark && showText;

  const mark = (
    <LogoMark
      size={dim.icon}
      animated={animated}
      inverted={inverted}
      iconOnly={showBesideWordmark}
      className={useIconOnly && !showBesideWordmark ? className : undefined}
    />
  );

  const content = showBesideWordmark ? (
    <>
      {mark}
      <BrandWordmark
        size={size}
        inverted={inverted}
        animated={animated}
      />
    </>
  ) : (
    mark
  );

  const wrapperClass = cn(
    "inline-flex items-center",
    showBesideWordmark
      ? cn("gap-3", className)
      : useIconOnly
        ? className
        : cn("gap-2.5", className)
  );

  const inner = <span className={wrapperClass}>{content}</span>;

  if (!href) return inner;

  return (
    <Link
      href={href}
      className={wrapperClass}
      aria-label="IntelliGen LMS home"
    >
      {content}
    </Link>
  );
}
