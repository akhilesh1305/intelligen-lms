"use client";

import { useEffect } from "react";

/** Scroll to hash anchor after navigation (server redirects cannot set hash). */
export function GamesHashScroll() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const id = hash.slice(1);
    const el = document.getElementById(id);
    if (el) {
      requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, []);

  return null;
}
