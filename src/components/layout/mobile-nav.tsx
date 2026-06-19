"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Award,
  BookOpen,
  Briefcase,
  Building2,
  Camera,
  CreditCard,
  Gamepad2,
  LayoutDashboard,
  LogOut,
  Map,
  Menu,
  MessageSquare,
  MonitorPlay,
  Rss,
  Sparkles,
  Target,
  User,
  Video,
  X,
  ClipboardList,
  Shield,
} from "lucide-react";
import { Role } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/user-avatar";
import { LeaderboardNavSwitch } from "@/components/layout/leaderboard-nav-switch";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { DemoEnvironmentBadge } from "@/components/demo/demo-environment-badge";

type MobileNavSession = {
  name: string;
  email: string;
  role: Role;
};

export function MobileNav({
  session,
  avatarUrl,
  orgAdminHref,
  showDemoBadge = false,
}: {
  session: MobileNavSession | null;
  avatarUrl?: string | null;
  orgAdminHref?: string | null;
  showDemoBadge?: boolean;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = [
    { href: "/courses", label: "Explore courses", icon: BookOpen },
    { href: "/pricing", label: "Pricing", icon: CreditCard },
    { href: "/paths", label: "Learning paths", icon: Map },
    { href: "/competency", label: "Skill assessment", icon: Target },
    { href: "/coach", label: "Corporate Coach", icon: Briefcase },
    { href: "/ai", label: "AI Tools", icon: Sparkles },
    { href: "/assistant", label: "AI Chat", icon: MessageSquare },
    { href: "/webinars", label: "Webinars", icon: Video },
    { href: "/feed", label: "Community feed", icon: Rss },
    { href: "/games", label: "Games", icon: Gamepad2 },
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="touch-target flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-ink hover:bg-surface lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-[60] bg-black/40 lg:hidden"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <nav
            className="safe-top safe-bottom fixed inset-y-0 right-0 z-[70] flex w-[min(100%,320px)] flex-col bg-panel shadow-elevated lg:hidden"
            aria-label="Mobile navigation"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-4">
              <div className="flex min-w-0 flex-col gap-2">
                <span className="text-lg font-bold text-ink">Menu</span>
                {showDemoBadge ? (
                  <div data-screenshot-clutter>
                    <DemoEnvironmentBadge size="sm" className="w-fit" />
                  </div>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="touch-target flex h-11 w-11 items-center justify-center rounded-lg text-ink hover:bg-surface"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {session ? (
              <div className="border-b border-border bg-surface/60 px-4 py-4">
                <div className="flex items-center gap-3">
                  <UserAvatar
                    name={session.name}
                    avatarUrl={avatarUrl}
                    size="md"
                  />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-ink">{session.name}</p>
                    <p className="truncate text-xs text-muted">{session.email}</p>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="flex-1 overflow-y-auto px-3 py-4">
              <div className="mb-2 px-1">
                <ThemeToggle showLabel className="w-full justify-start" />
              </div>

              {session ? (
                <>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="mb-1 flex min-h-12 items-center gap-3 rounded-xl bg-surface px-3 py-3 text-base font-semibold text-ink active:bg-brand-50 dark:active:bg-brand-950/30"
                >
                  <LayoutDashboard className="h-5 w-5 text-brand-600" />
                  My Learning
                </Link>
                <Link
                  href="/certificates"
                  onClick={() => setOpen(false)}
                  className="mb-1 flex min-h-12 items-center gap-3 rounded-xl bg-surface px-3 py-3 text-base font-semibold text-ink active:bg-brand-50 dark:active:bg-brand-950/30"
                >
                  <Award className="h-5 w-5 text-brand-600" />
                  Certificates
                </Link>
                </>
              ) : null}

              {session && orgAdminHref ? (
                <Link
                  href={
                    orgAdminHref === "/org" ? "/org" : orgAdminHref
                  }
                  onClick={() => setOpen(false)}
                  className="mb-1 flex min-h-12 items-center gap-3 rounded-xl bg-surface px-3 py-3 text-base font-semibold text-ink active:bg-brand-50 dark:active:bg-brand-950/30"
                >
                  <Building2 className="h-5 w-5 text-brand-600" />
                  Organization admin
                </Link>
              ) : null}

              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="mb-1 flex items-center gap-3 rounded-xl bg-surface px-3 py-3 text-base font-semibold text-ink active:bg-brand-50 dark:active:bg-brand-950/30"
                >
                  <link.icon className="h-5 w-5 text-brand-600" />
                  {link.label}
                </Link>
              ))}

              <LeaderboardNavSwitch
                variant="mobile"
                onNavigate={() => setOpen(false)}
              />

              {session ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="mb-1 flex items-center gap-3 rounded-xl bg-surface px-3 py-3 text-base font-semibold text-ink active:bg-brand-50 dark:active:bg-brand-950/30"
                  >
                    <User className="h-5 w-5 text-brand-600" />
                    Profile settings
                  </Link>
                  <Link
                    href="/settings/security"
                    onClick={() => setOpen(false)}
                    className="mb-1 flex items-center gap-3 rounded-xl bg-surface px-3 py-3 text-base font-semibold text-ink active:bg-brand-50 dark:active:bg-brand-950/30"
                  >
                    <Shield className="h-5 w-5 text-brand-600" />
                    Security & privacy
                  </Link>
                  {session.role === "ADMIN" && (
                    <>
                      <Link
                        href="/admin/security"
                        onClick={() => setOpen(false)}
                        className="mb-1 flex items-center gap-3 rounded-xl bg-surface px-3 py-3 text-base font-semibold text-ink active:bg-brand-50 dark:active:bg-brand-950/30"
                      >
                        <Shield className="h-5 w-5 text-brand-600" />
                        Enterprise security
                      </Link>
                      <Link
                        href="/admin/audit-logs"
                        onClick={() => setOpen(false)}
                        className="mb-1 flex items-center gap-3 rounded-xl bg-surface px-3 py-3 text-base font-semibold text-ink active:bg-brand-50 dark:active:bg-brand-950/30"
                      >
                        <ClipboardList className="h-5 w-5 text-brand-600" />
                        Audit logs
                      </Link>
                      <Link
                        href="/admin/screenshots-guide"
                        onClick={() => setOpen(false)}
                        className="mb-1 flex items-center gap-3 rounded-xl bg-surface px-3 py-3 text-base font-semibold text-ink active:bg-brand-50 dark:active:bg-brand-950/30"
                      >
                        <Camera className="h-5 w-5 text-brand-600" />
                        Screenshot guide
                      </Link>
                      <Link
                        href="/admin/recording-mode"
                        onClick={() => setOpen(false)}
                        className="mb-1 flex items-center gap-3 rounded-xl bg-surface px-3 py-3 text-base font-semibold text-ink active:bg-brand-50 dark:active:bg-brand-950/30"
                      >
                        <MonitorPlay className="h-5 w-5 text-brand-600" />
                        Recording mode
                      </Link>
                    </>
                  )}
                </>
              ) : null}
            </div>

            <div className="border-t border-border p-4">
              {session ? (
                <form action="/api/auth/logout" method="POST">
                  <Button type="submit" variant="outline" className="w-full">
                    <LogOut className="h-4 w-4" />
                    Log out
                  </Button>
                </form>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link href="/login" onClick={() => setOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setOpen(false)}>
                    <Button className="w-full">Join for Free</Button>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </>
      )}
    </>
  );
}
