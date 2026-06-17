"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function NavbarShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "safe-top sticky top-0 z-50 border-b transition-all duration-300",
        scrolled
          ? "border-border/60 bg-background/70 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70"
          : "border-transparent bg-background/50 backdrop-blur-md dark:bg-slate-950/40"
      )}
    >
      {children}
    </header>
  );
}
