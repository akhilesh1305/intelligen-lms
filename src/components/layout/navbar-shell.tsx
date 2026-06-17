"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function NavbarShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "safe-top sticky top-0 z-50 border-b border-transparent glass-panel transition-all duration-300",
        scrolled && "glass-panel-scrolled border-border/80"
      )}
    >
      {children}
    </header>
  );
}
