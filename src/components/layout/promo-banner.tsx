import { Sparkles } from "lucide-react";

export function PromoBanner() {
  return (
    <div className="header-promo-shine header-promo-bar text-white">
      <div className="relative z-[1] mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-xs sm:text-sm">
        <Sparkles
          className="header-promo-icon h-3.5 w-3.5 shrink-0 text-brand-200 sm:h-4 sm:w-4"
          aria-hidden
        />
        <p className="header-promo-text">
          <span className="hidden sm:inline">
            Learn without limits — start your free learning journey today on
          </span>
          <span className="sm:hidden">Learn without limits on</span>{" "}
          <strong className="header-brand-glow font-semibold text-white">
            IntelliGen LMS
          </strong>
        </p>
      </div>
    </div>
  );
}
