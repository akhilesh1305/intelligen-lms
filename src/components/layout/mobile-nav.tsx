"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Sparkles,
  Trophy,
  User,
  X,
  ClipboardList,
} from "lucide-react";
import { Role } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/user-avatar";

type MobileNavSession = {
  name: string;
  email: string;
  role: Role;
};

export function MobileNav({
  session,
  avatarUrl,
}: {
  session: MobileNavSession | null;
  avatarUrl?: string | null;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = [
    { href: "/courses", label: "Explore courses", icon: GraduationCap },
    { href: "/assistant", label: "AI Assistant", icon: Sparkles },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-sm text-ink hover:bg-slate-100 md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-[60] bg-black/40 md:hidden"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <nav
            className="fixed inset-y-0 right-0 z-[70] flex w-[min(100%,320px)] flex-col bg-white shadow-elevated md:hidden"
            aria-label="Mobile navigation"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
              <span className="font-bold text-ink">Menu</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-sm hover:bg-slate-100"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {session ? (
              <div className="border-b border-slate-100 px-4 py-4">
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
              {session ? (
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="mb-2 flex items-center gap-3 rounded-sm px-3 py-3 text-sm font-semibold text-ink hover:bg-slate-50"
                >
                  <LayoutDashboard className="h-5 w-5 text-brand-600" />
                  My Learning
                </Link>
              ) : null}

              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-sm px-3 py-3 text-sm font-semibold text-ink hover:bg-slate-50"
                >
                  <link.icon className="h-5 w-5 text-brand-600" />
                  {link.label}
                </Link>
              ))}

              {session ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-sm px-3 py-3 text-sm font-semibold text-ink hover:bg-slate-50"
                  >
                    <User className="h-5 w-5 text-brand-600" />
                    Profile settings
                  </Link>
                  {session.role === "ADMIN" && (
                    <Link
                      href="/admin/audit-logs"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-sm px-3 py-3 text-sm font-semibold text-ink hover:bg-slate-50"
                    >
                      <ClipboardList className="h-5 w-5 text-brand-600" />
                      Audit logs
                    </Link>
                  )}
                </>
              ) : null}
            </div>

            <div className="border-t border-slate-100 p-4">
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
