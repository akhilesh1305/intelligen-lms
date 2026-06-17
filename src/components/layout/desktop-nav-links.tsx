"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  BarChart3,
  BookOpen,
  Briefcase,
  Building2,
  Check,
  Map,
  Sparkles,
} from "lucide-react";
import { HeaderMoreMenu } from "@/components/layout/header-more-menu";
import { cn } from "@/lib/utils";

const PRIMARY_LINKS = [
  { href: "/courses", label: "Explore", icon: BookOpen },
  { href: "/paths", label: "Paths", icon: Map },
  { href: "/coach", label: "Coach", icon: Briefcase },
  { href: "/ai", label: "AI", icon: Sparkles },
] as const;

export function DesktopNavLinks() {
  const pathname = usePathname();

  return (
    <div className="hidden min-w-0 items-center gap-0.5 lg:flex">
      {PRIMARY_LINKS.map((link, i) => {
        const Icon = link.icon;
        const active =
          pathname === link.href || pathname.startsWith(`${link.href}/`);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "header-nav-stagger nav-link-hover group inline-flex items-center gap-1.5 rounded-[12px] px-2.5 py-2 text-sm font-semibold transition-colors duration-150 xl:px-3",
              active
                ? "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300"
                : "text-ink hover:bg-surface dark:hover:bg-slate-800/60"
            )}
            title={link.label}
            style={{ animationDelay: `${120 + i * 45}ms` }}
          >
            <Icon
              className={cn(
                "h-4 w-4 shrink-0 transition-transform duration-200 motion-safe:group-hover:scale-110",
                active
                  ? "text-brand-600 dark:text-brand-400"
                  : "text-brand-600 dark:text-brand-400"
              )}
            />
            <span className="hidden xl:inline">{link.label}</span>
          </Link>
        );
      })}

      <HeaderMoreMenu
        variant="desktop"
        style={{ animationDelay: `${120 + PRIMARY_LINKS.length * 45}ms` }}
      />
    </div>
  );
}

const TRUST_ITEMS = [
  { icon: Sparkles, label: "AI Course Builder" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Award, label: "Certificates" },
  { icon: Building2, label: "Corporate Training" },
  { icon: Check, label: "Gamification" },
] as const;

export function HeroTrustStrip() {
  return (
    <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 lg:justify-start">
      {TRUST_ITEMS.map((item) => (
        <li
          key={item.label}
          className="flex items-center gap-2 text-sm text-slate-200/90"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-[10px] bg-white/10 backdrop-blur-sm">
            <item.icon className="h-3.5 w-3.5 text-cyan-200" />
          </span>
          {item.label}
        </li>
      ))}
    </ul>
  );
}
