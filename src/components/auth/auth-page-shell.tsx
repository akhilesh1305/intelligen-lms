"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { AuthDivider } from "@/components/auth/auth-divider";
import { cn } from "@/lib/utils";

export function AuthPageShell({
  image,
  imageAlt,
  heroTitle,
  heroSubtitle,
  perks,
  title,
  subtitle,
  error,
  children,
  footer,
  extra,
  sso,
}: {
  image: string;
  imageAlt: string;
  heroTitle: string;
  heroSubtitle?: string;
  perks?: string[];
  title: string;
  subtitle: ReactNode;
  error?: string | null;
  children: ReactNode;
  footer?: ReactNode;
  extra?: ReactNode;
  sso?: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="relative flex min-h-dvh overflow-hidden bg-surface">
      {/* Hero panel */}
      <div className="relative hidden w-[46%] overflow-hidden lg:block xl:w-[50%]">
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          className="object-cover transition-transform duration-[2s] ease-out motion-safe:scale-105"
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950/92 via-brand-900/78 to-violet-950/85" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40" />

        <div className="pointer-events-none absolute -left-16 top-20 h-64 w-64 animate-float rounded-full bg-brand-400/20 blur-3xl" />
        <div
          className="pointer-events-none absolute -right-10 bottom-24 h-72 w-72 animate-float rounded-full bg-violet-400/15 blur-3xl"
          style={{ animationDelay: "2s" }}
        />

        <div className="relative flex h-full flex-col justify-between p-10 xl:p-14">
          <Link href="/" className="logo-hover inline-block w-fit">
            <Logo variant="icon" size="lg" inverted className="h-14 w-auto xl:h-16" />
          </Link>

          <div
            className={cn(
              "max-w-lg transition-all duration-1000 ease-out",
              mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            )}
          >
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand-200">
              <Sparkles className="h-4 w-4 animate-pulse" />
              IntelliGen LMS
            </p>
            <h1 className="mt-4 text-3xl font-bold leading-tight text-white xl:text-4xl">
              {heroTitle}
            </h1>
            {heroSubtitle ? (
              <p className="mt-4 text-base text-blue-100/90">{heroSubtitle}</p>
            ) : null}
            {perks && perks.length > 0 ? (
              <ul className="mt-8 space-y-3">
                {perks.map((perk, i) => (
                  <li
                    key={perk}
                    className={cn(
                      "flex items-center gap-3 text-sm text-white/90 transition-all duration-700 xl:text-base",
                      mounted ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
                    )}
                    style={{ transitionDelay: `${200 + i * 100}ms` }}
                  >
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-300" />
                    {perk}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div
            className={cn(
              "animate-float flex gap-4 transition-opacity duration-1000",
              mounted ? "opacity-100" : "opacity-0"
            )}
            style={{ animationDelay: "1s", transitionDelay: "600ms" }}
          >
            <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-md">
              <p className="text-2xl font-bold text-white">7+</p>
              <p className="text-xs text-brand-100">Expert courses</p>
            </div>
            <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-md">
              <p className="text-2xl font-bold text-white">13+</p>
              <p className="text-xs text-brand-100">Games & quizzes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="relative flex w-full flex-col lg:w-[54%] xl:w-[50%]">
        <div className="pointer-events-none absolute -right-20 top-0 h-56 w-56 animate-pulse-glow rounded-full bg-brand-500/10 blur-3xl lg:hidden" />

        {/* Mobile hero strip */}
        <div className="relative h-36 overflow-hidden lg:hidden">
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-950/90 to-violet-950/80" />
          <div className="absolute inset-0 flex items-end p-5">
            <div>
              <Logo variant="icon" size="sm" inverted className="h-10 w-auto" />
              <p className="mt-2 text-lg font-bold text-white">{heroTitle}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-8 sm:py-12">
          <div
            className={cn(
              "w-full max-w-md transition-all duration-700 ease-out",
              mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            )}
            style={{ transitionDelay: "120ms" }}
          >
            <div className="mb-6 hidden lg:block">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-brand-600"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to home
              </Link>
            </div>

            <h2 className="text-2xl font-bold text-ink sm:text-3xl">{title}</h2>
            <p className="mt-2 text-sm text-muted sm:text-base">{subtitle}</p>

            {error ? (
              <div
                className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                data-no-reveal
              >
                {error}
              </div>
            ) : null}

            <div className="mt-8 rounded-[20px] border border-border bg-panel p-6 shadow-elevated sm:p-8">
              {sso ? (
                <>
                  {sso}
                  <AuthDivider />
                </>
              ) : null}
              {children}
            </div>

            {extra ? <div className="mt-6">{extra}</div> : null}

            {footer ? (
              <div className="mt-8 text-center text-sm text-muted lg:hidden">{footer}</div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
