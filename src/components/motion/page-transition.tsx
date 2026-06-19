"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { useRecordingMode } from "@/components/recording/recording-mode-provider";
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
  const recording = useRecordingMode();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (recording.enabled) {
      setVisible(true);
      return;
    }

    setVisible(false);
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, recording.enabled]);

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
