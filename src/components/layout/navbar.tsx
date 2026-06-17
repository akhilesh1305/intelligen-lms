import Link from "next/link";
import {
  LayoutDashboard,
  LogIn,
  LogOut,
  Building2,
  UserPlus,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { getOrgAdminMemberships } from "@/lib/org-admin";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/user-avatar";
import { MobileNav } from "./mobile-nav";
import { HeaderMoreMenu } from "./header-more-menu";
import { DesktopNavLinks } from "./desktop-nav-links";
import { NotificationsBell } from "./notifications-bell";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { NavbarShell } from "./navbar-shell";
import { PromoBanner } from "./promo-banner";

export async function Navbar() {
  const session = await getSession();

  const avatarUrl = session
    ? (
        await db.user.findUnique({
          where: { id: session.id },
          select: { avatarUrl: true },
        })
      )?.avatarUrl
    : null;

  const orgAdminMemberships = session
    ? await getOrgAdminMemberships(session.id)
    : [];

  const orgAdminHref =
    session?.role === "ADMIN"
      ? "/org"
      : orgAdminMemberships[0]
        ? `/org/${orgAdminMemberships[0].organization.slug}`
        : null;

  return (
    <NavbarShell>
      <PromoBanner />

      <div className="animate-header-enter-delayed mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 min-w-0 items-center justify-between gap-2 sm:h-16">
          <div className="logo-hover shrink-0">
            <Logo variant="icon" size="md" className="h-11 w-auto sm:h-12" />
          </div>

          <nav className="flex min-w-0 shrink items-center justify-end gap-0.5 sm:gap-1">
            <DesktopNavLinks />

            {session ? (
              <>
                <NotificationsBell />
                <div className="hidden lg:block">
                  <ThemeToggle />
                </div>
                <Link
                  href="/dashboard"
                  className="nav-link-hover touch-target flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-ink hover:bg-surface lg:h-auto lg:w-auto lg:gap-1.5 lg:px-2 lg:py-2"
                  title="My Learning"
                >
                  <LayoutDashboard className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                  <span className="hidden text-sm font-semibold 2xl:inline">
                    My Learning
                  </span>
                </Link>
                {orgAdminHref ? (
                  <Link
                    href={orgAdminHref === "/org" ? orgAdminHref : orgAdminHref}
                    className="nav-link-hover hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg text-ink hover:bg-surface sm:flex lg:h-auto lg:w-auto lg:gap-1.5 lg:px-2 lg:py-2"
                    title="Organization admin"
                  >
                    <Building2 className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                    <span className="hidden text-sm font-semibold 2xl:inline">
                      Org admin
                    </span>
                  </Link>
                ) : null}
                <div className="hidden h-8 w-px shrink-0 bg-border lg:block" />
                <Link
                  href="/profile"
                  className="nav-link-hover hidden shrink-0 items-center gap-2 rounded-lg px-2 py-1 hover:bg-surface sm:flex"
                  title="Profile settings"
                >
                  <UserAvatar
                    name={session.name}
                    avatarUrl={avatarUrl}
                    size="sm"
                  />
                  <span className="hidden max-w-[100px] truncate text-sm font-medium text-ink 2xl:inline">
                    {session.name}
                  </span>
                </Link>
                <form action="/api/auth/logout" method="POST" className="hidden shrink-0 sm:block">
                  <Button type="submit" variant="ghost" size="sm" className="text-muted">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </form>
              </>
            ) : (
              <div className="hidden shrink-0 items-center gap-1 sm:flex sm:gap-2">
                <ThemeToggle />
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="font-semibold">
                    <LogIn className="h-4 w-4" />
                    <span className="hidden lg:inline">Log In</span>
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">
                    <UserPlus className="h-4 w-4" />
                    <span className="hidden lg:inline">Join</span>
                    <span className="hidden xl:inline"> for Free</span>
                  </Button>
                </Link>
              </div>
            )}

            <HeaderMoreMenu variant="mobile" />

            <MobileNav
              session={session}
              avatarUrl={avatarUrl}
              orgAdminHref={orgAdminHref}
            />
          </nav>
        </div>
      </div>
    </NavbarShell>
  );
}
