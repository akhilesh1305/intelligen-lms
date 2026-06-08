"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./footer";

export function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/learn")) return null;
  return <Footer />;
}
