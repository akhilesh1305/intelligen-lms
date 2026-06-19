"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useRecordingMode } from "@/components/recording/recording-mode-provider";

const REVEAL_SELECTOR = [
  "main section",
  "main h1",
  "main [data-section-header]",
  "main .shadow-card",
  "main .shadow-elevated",
  "main table",
  "main .rounded-2xl.border",
  "main .rounded-xl.border",
].join(", ");

const AUTH_REVEAL_SELECTOR = [
  "h1",
  "form",
  ".shadow-card",
  ".rounded-xl.border",
  ".rounded-lg.border",
].join(", ");

const CUSTOM_ANIMATED_PATHS = new Set(["/", "/games"]);

function isCustomAnimatedPath(pathname: string) {
  return (
    CUSTOM_ANIMATED_PATHS.has(pathname) ||
    pathname.startsWith("/login") ||
    pathname === "/register" ||
    pathname === "/dashboard" ||
    pathname.startsWith("/org")
  );
}

export function ScrollRevealEnhancer() {
  const pathname = usePathname();
  const recording = useRecordingMode();

  useEffect(() => {
    if (recording.enabled) return;

    if (isCustomAnimatedPath(pathname)) return;

    const root = document.querySelector("main") ?? document.querySelector(".page-transition-root");
    if (!root) return;

    const isAuth =
      pathname.startsWith("/login") || pathname === "/register" || pathname.startsWith("/login/");
    const selector = isAuth ? AUTH_REVEAL_SELECTOR : REVEAL_SELECTOR;

    const elements = Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(
      (el) => !el.closest("[data-no-reveal]") && !el.dataset.revealBound
    );

    const footer = document.querySelector<HTMLElement>("footer");
    if (footer && !footer.dataset.revealBound) {
      elements.push(footer);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("scroll-reveal-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    elements.forEach((el, index) => {
      el.dataset.revealBound = "true";
      el.classList.add("scroll-reveal");
      el.style.setProperty("--reveal-index", String(Math.min(index % 10, 9)));
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
      for (const el of elements) {
        delete el.dataset.revealBound;
        el.classList.remove("scroll-reveal", "scroll-reveal-visible");
        el.style.removeProperty("--reveal-index");
      }
    };
  }, [pathname, recording.enabled]);

  return null;
}
