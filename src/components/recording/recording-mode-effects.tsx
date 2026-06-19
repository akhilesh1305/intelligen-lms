"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useRecordingMode } from "./recording-mode-provider";

function chartsLookReady(): boolean {
  const wrappers = document.querySelectorAll(".recharts-wrapper");
  if (wrappers.length === 0) return true;
  return [...wrappers].every((wrapper) => {
    const svg = wrapper.querySelector("svg");
    if (!svg) return false;
    const rect = wrapper.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  });
}

export function RecordingModeEffects() {
  const { enabled } = useRecordingMode();
  const pathname = usePathname();

  useEffect(() => {
    if (!enabled) return;

    document.querySelectorAll(".scroll-reveal").forEach((el) => {
      el.classList.add("scroll-reveal-visible");
    });
    document.querySelectorAll(".page-transition-root").forEach((el) => {
      el.classList.add("page-transition-visible");
      el.classList.remove("page-transition-hidden");
    });

    const root = document.documentElement;
    root.removeAttribute("data-charts-ready");

    let attempts = 0;
    const markReady = () => {
      if (chartsLookReady() || attempts > 60) {
        root.setAttribute("data-charts-ready", "true");
      }
      attempts += 1;
    };

    markReady();
    const interval = window.setInterval(markReady, 150);
    const observer = new MutationObserver(markReady);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.clearInterval(interval);
      observer.disconnect();
      root.removeAttribute("data-charts-ready");
    };
  }, [enabled, pathname]);

  return null;
}
