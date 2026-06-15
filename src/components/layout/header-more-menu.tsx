"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  CreditCard,
  Gamepad2,
  MoreHorizontal,
  Rss,
  Target,
  Video,
  X,
} from "lucide-react";
import { LeaderboardNavSwitch } from "@/components/layout/leaderboard-nav-switch";
import { cn } from "@/lib/utils";

export const NAV_MORE_LINKS = [
  { href: "/pricing", label: "Pricing", icon: CreditCard },
  { href: "/competency", label: "Skills", icon: Target },
  { href: "/webinars", label: "Webinars", icon: Video },
  { href: "/feed", label: "Feed", icon: Rss },
  { href: "/games", label: "Games", icon: Gamepad2 },
] as const;

const linkClass =
  "more-menu-link flex min-h-12 w-full items-center gap-3 rounded-xl bg-surface px-4 py-3 text-base font-semibold text-ink transition-colors active:bg-brand-100 dark:active:bg-brand-950/40";

const dropdownLinkClass =
  "more-menu-link flex min-h-11 w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-surface active:bg-brand-50 dark:active:bg-brand-950/30";

const moreItemCount = NAV_MORE_LINKS.length;

function moreItemStyle(index: number): React.CSSProperties {
  return { "--more-item-index": index } as React.CSSProperties;
}

const morePanelStyle = {
  "--more-menu-item-count": moreItemCount,
} as React.CSSProperties;

export function HeaderMoreMenu({
  variant = "mobile",
  buttonClassName,
  style,
}: {
  variant?: "mobile" | "desktop";
  buttonClassName?: string;
  style?: React.CSSProperties;
}) {
  const isMobileHeader = variant === "mobile";
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [useDesktopDropdown, setUseDesktopDropdown] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(min-width: 1280px)");
    const update = () => setUseDesktopDropdown(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const updateDropdownPos = useCallback(() => {
    const button = buttonRef.current;
    if (!button) return;
    const rect = button.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + 6,
      right: Math.max(8, window.innerWidth - rect.right),
    });
  }, []);

  useLayoutEffect(() => {
    if (!open || isMobileHeader || !useDesktopDropdown) return;
    updateDropdownPos();
    window.addEventListener("resize", updateDropdownPos);
    window.addEventListener("scroll", updateDropdownPos, true);
    return () => {
      window.removeEventListener("resize", updateDropdownPos);
      window.removeEventListener("scroll", updateDropdownPos, true);
    };
  }, [open, isMobileHeader, useDesktopDropdown, updateDropdownPos]);

  const showBottomSheet = open && (isMobileHeader || !useDesktopDropdown);
  const showDesktopDropdown = open && !isMobileHeader && useDesktopDropdown;

  useEffect(() => {
    if (!showBottomSheet) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showBottomSheet]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node;
      if (buttonRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const bottomSheet = showBottomSheet ? (
    <>
      <div
        className="more-menu-overlay-enter fixed inset-0 z-[200] bg-black/60"
        onClick={close}
        aria-hidden
      />
      <div
        ref={panelRef}
        className={cn(
          "more-menu-sheet-enter fixed inset-x-0 bottom-0 z-[210] flex max-h-[92dvh] flex-col rounded-t-2xl border border-b-0 border-border bg-panel shadow-elevated",
          isMobileHeader && "lg:hidden"
        )}
        style={morePanelStyle}
        role="menu"
        aria-label="More navigation"
      >
        <div className="shrink-0 border-b border-border px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <span className="more-menu-sheet-title-enter text-lg font-bold text-ink">
              More
            </span>
            <button
              type="button"
              onClick={close}
              className="touch-target flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-ink hover:bg-surface"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-4 py-3 [webkit-overflow-scrolling:touch]">
          <div className="space-y-1.5">
            {NAV_MORE_LINKS.map((link, index) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={close}
                  role="menuitem"
                  className={cn(linkClass, "more-menu-item-enter")}
                  style={moreItemStyle(index)}
                >
                  <Icon className="more-menu-link-icon h-5 w-5 shrink-0 text-brand-600 dark:text-brand-400" />
                  <span className="truncate">{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="more-menu-leaderboard-enter mt-3 border-t border-border pt-3">
            <LeaderboardNavSwitch
              variant="mobile"
              onNavigate={close}
              compact
            />
          </div>
        </div>

        <div
          className="shrink-0"
          style={{ height: "max(0.75rem, env(safe-area-inset-bottom))" }}
        />
      </div>
    </>
  ) : null;

  const desktopDropdown = showDesktopDropdown ? (
    <div
      ref={panelRef}
      className="more-menu-dropdown-enter fixed z-[210] w-64 rounded-xl border border-border bg-panel p-2 shadow-elevated"
      style={{
        top: dropdownPos.top,
        right: dropdownPos.right,
        ...morePanelStyle,
      }}
      role="menu"
      aria-label="More navigation"
    >
      <div className="space-y-0.5">
        {NAV_MORE_LINKS.map((link, index) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={close}
              role="menuitem"
              className={cn(dropdownLinkClass, "more-menu-item-enter")}
              style={moreItemStyle(index)}
            >
              <Icon className="more-menu-link-icon h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" />
              {link.label}
            </Link>
          );
        })}
      </div>
      <div className="more-menu-leaderboard-enter mt-2 border-t border-border/60 pt-2">
        <LeaderboardNavSwitch variant="dropdown" onNavigate={close} />
      </div>
    </div>
  ) : null;

  const portalContent =
    showBottomSheet || showDesktopDropdown ? (
      <>
        {bottomSheet}
        {desktopDropdown}
      </>
    ) : null;

  return (
    <>
      <div
        className={cn(
          "relative",
          isMobileHeader ? "lg:hidden" : "hidden lg:block"
        )}
      >
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            isMobileHeader
              ? "touch-target flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-ink hover:bg-surface"
              : "header-nav-stagger nav-link-hover flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-ink hover:bg-surface",
            open && "bg-surface",
            buttonClassName
          )}
          style={style}
          aria-expanded={open}
          aria-haspopup="true"
          aria-label="More navigation"
          title="More"
        >
          <MoreHorizontal className="h-5 w-5 shrink-0 text-brand-600 dark:text-brand-400" />
        </button>
      </div>

      {mounted && portalContent
        ? createPortal(portalContent, document.body)
        : null}
    </>
  );
}
