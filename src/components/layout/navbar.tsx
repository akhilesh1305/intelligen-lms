import Link from "next/link";

import { LayoutDashboard, LogOut, Sparkles, Trophy } from "lucide-react";
import { Logo } from "@/components/brand/logo";

import { getSession } from "@/lib/auth";

import { db } from "@/lib/db";

import { Button } from "@/components/ui/button";

import { UserAvatar } from "@/components/ui/user-avatar";

import { MobileNav } from "./mobile-nav";

import { NotificationsBell } from "./notifications-bell";



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



  return (

    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">

      <div className="border-b border-slate-100 bg-ink text-white">

        <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-2 text-center text-xs sm:text-sm">

          <span className="hidden sm:inline">

            Learn without limits — start your free learning journey today on{" "}

          </span>

          <span className="sm:hidden">Learn without limits on </span>

          <strong className="font-semibold">IntelliGen LMS</strong>

        </div>

      </div>



      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="flex h-14 items-center justify-between gap-2 sm:h-16 sm:gap-4">

          <Logo variant="icon" size="sm" className="sm:hidden" />

          <Logo variant="full" size="md" className="hidden sm:block" />



          <nav className="ml-auto flex items-center gap-0.5 sm:gap-1 md:gap-2">

            <div className="hidden items-center gap-1 md:flex md:gap-2">

              <Link

                href="/courses"

                className="rounded-sm px-3 py-2 text-sm font-semibold text-ink hover:bg-slate-100"

              >

                Explore

              </Link>

              <Link

                href="/assistant"

                className="inline-flex items-center gap-1 rounded-sm px-3 py-2 text-sm font-semibold text-ink hover:bg-slate-100"

              >

                <Sparkles className="h-4 w-4" />

                AI Assistant

              </Link>

              <Link

                href="/leaderboard"

                className="inline-flex items-center gap-1 rounded-sm px-3 py-2 text-sm font-semibold text-ink hover:bg-slate-100"

              >

                <Trophy className="h-4 w-4" />

                Leaderboard

              </Link>

            </div>



            {session ? (

              <>

                <NotificationsBell />

                <Link

                  href="/dashboard"

                  className="flex h-10 w-10 items-center justify-center rounded-sm text-ink hover:bg-slate-100 sm:h-auto sm:w-auto sm:gap-1.5 sm:px-3 sm:py-2"

                  title="My Learning"

                >

                  <LayoutDashboard className="h-5 w-5" />

                  <span className="hidden text-sm font-semibold lg:inline">

                    My Learning

                  </span>

                </Link>

                <div className="hidden h-8 w-px bg-slate-200 md:block" />

                <Link

                  href="/profile"

                  className="hidden items-center gap-2 rounded-sm px-2 py-1 hover:bg-slate-100 sm:flex"

                  title="Profile settings"

                >

                  <UserAvatar

                    name={session.name}

                    avatarUrl={avatarUrl}

                    size="sm"

                  />

                  <span className="hidden max-w-[120px] truncate text-sm font-medium text-ink lg:inline">

                    {session.name}

                  </span>

                </Link>

                <form action="/api/auth/logout" method="POST" className="hidden sm:block">

                  <Button type="submit" variant="ghost" size="sm" className="text-muted">

                    <LogOut className="h-4 w-4" />

                  </Button>

                </form>

              </>

            ) : (

              <div className="hidden items-center gap-1 sm:flex sm:gap-2">

                <Link href="/login">

                  <Button variant="ghost" size="sm" className="font-semibold">

                    Log In

                  </Button>

                </Link>

                <Link href="/register">

                  <Button size="sm">Join for Free</Button>

                </Link>

              </div>

            )}



            <MobileNav

              session={session}

              avatarUrl={avatarUrl}

            />

          </nav>

        </div>

      </div>

    </header>

  );

}

