import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  variant?: "full" | "icon";
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
  showText?: boolean;
};

const sizes = {
  sm: { icon: 32, full: { w: 120, h: 40 } },
  md: { icon: 36, full: { w: 160, h: 48 } },
  lg: { icon: 48, full: { w: 220, h: 64 } },
};

export function Logo({
  variant = "full",
  size = "md",
  href = "/",
  className,
  showText = true,
}: LogoProps) {
  const dim = sizes[size];

  const content =
    variant === "icon" || !showText ? (
      <Image
        src="/logo-icon.png"
        alt="IntelliGen LMS"
        width={dim.icon}
        height={dim.icon}
        className={cn("shrink-0 object-contain", className)}
        priority
      />
    ) : (
      <Image
        src="/logo.png"
        alt="IntelliGen LMS"
        width={dim.full.w}
        height={dim.full.h}
        className={cn("h-auto w-auto max-h-10 shrink-0 object-contain sm:max-h-12", className)}
        priority
      />
    );

  if (!href) return content;

  return (
    <Link href={href} className="inline-flex items-center">
      {content}
    </Link>
  );
}
