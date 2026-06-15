"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./footer";

export function ConditionalFooter() {
  const pathname = usePathname();
  if (
    pathname.startsWith("/learn") ||
    pathname.startsWith("/login") ||
    pathname === "/register"
  ) {
    return null;
  }
  return <Footer />;
}
