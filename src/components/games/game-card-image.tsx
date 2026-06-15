import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function GameCardImage({
  src,
  alt,
  gradient,
  badge,
  height = "h-32 sm:h-36",
}: {
  src: string;
  alt: string;
  gradient: string;
  badge?: ReactNode;
  height?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden", height)}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      <div className={cn("absolute inset-0 bg-gradient-to-t", gradient)} />
      <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.14)_50%,transparent_75%)] bg-[length:200%_100%] opacity-0 transition-opacity duration-500 group-hover:animate-shimmer group-hover:opacity-100" />
      {badge ? <div className="absolute left-3 top-3">{badge}</div> : null}
    </div>
  );
}
