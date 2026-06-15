import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function GamesSectionBanner({
  src,
  alt,
  gradient,
  children,
  className,
}: {
  src: string;
  alt: string;
  gradient: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative mb-8 overflow-hidden rounded-2xl border border-border shadow-card",
        className
      )}
    >
      <div className="relative h-28 sm:h-32">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 1200px) 100vw, 1152px"
        />
        <div className={cn("absolute inset-0", gradient)} />
        <div className="absolute inset-0 flex items-end p-4 sm:p-5">{children}</div>
      </div>
    </div>
  );
}
