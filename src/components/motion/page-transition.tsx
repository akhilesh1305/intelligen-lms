"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ScrollRevealEnhancer } from "./scroll-reveal-enhancer";

export function PageTransition({
  children,
  className,
  authPage = false,
}: {
  children: ReactNode;
  className?: string;
  authPage?: boolean;
}) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return (
    <div
      className={cn(
        "page-transition-root transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
        visible ? "page-transition-visible" : "page-transition-hidden",
        authPage && "min-h-dvh",
        className
      )}
    >
      {children}
      <ScrollRevealEnhancer />
    </div>
  );
}
