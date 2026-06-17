"use client";

import { useEffect, useState } from "react";
import { X, Sparkles } from "lucide-react";

const STORAGE_KEY = "intelligen-promo-dismissed";

export function PromoBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(sessionStorage.getItem(STORAGE_KEY) !== "1");
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  function dismiss() {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  return (
    <div className="header-promo-shine header-promo-bar relative text-white">
      <div className="relative z-[1] mx-auto flex max-w-7xl items-center justify-center gap-2 px-10 py-2 text-center text-xs sm:text-sm">
        <Sparkles
          className="header-promo-icon h-3.5 w-3.5 shrink-0 text-brand-200 sm:h-4 sm:w-4"
          aria-hidden
        />
        <p className="header-promo-text">
          <span className="hidden sm:inline">
            AI-powered learning for teams — start your free trial on
          </span>
          <span className="sm:hidden">Start free on</span>{" "}
          <strong className="font-semibold text-white">IntelliGen LMS</strong>
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Dismiss promotion"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
