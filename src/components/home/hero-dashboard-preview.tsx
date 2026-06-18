"use client";

import type { ReactNode } from "react";
import { Bot, BarChart3, TrendingUp, Users } from "lucide-react";
import { cn } from "@/lib/utils";

function FloatCard({
  className,
  children,
  delay = "0s",
}: {
  className?: string;
  children: ReactNode;
  delay?: string;
}) {
  return (
    <div
      className={cn(
        "animate-float rounded-2xl border border-white/20 bg-white/10 p-3 shadow-elevated backdrop-blur-xl sm:p-4",
        className
      )}
      style={{ animationDelay: delay }}
    >
      {children}
    </div>
  );
}

export function HeroDashboardPreview({ className }: { className?: string }) {
  return (
    <div className={cn("relative mx-auto w-full max-w-xl lg:max-w-none", className)}>
      <div className="relative overflow-hidden rounded-[20px] border border-white/15 bg-slate-950/40 p-4 shadow-elevated ring-1 ring-white/10 backdrop-blur-md sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-widest text-cyan-200/80">
              Live analytics
            </p>
            <p className="mt-1 truncate text-base font-semibold text-white sm:text-lg">
              Learning command center
            </p>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-brand-500 to-accent-cyan">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          {[
            { label: "Active learners", value: "2.4k", icon: Users },
            { label: "Completion", value: "87%", icon: TrendingUp },
            { label: "Courses", value: "124", icon: BarChart3 },
            { label: "AI sessions", value: "18k", icon: Bot },
          ].map((stat) => (
            <div
              key={stat.label}
              className="min-w-0 rounded-[14px] border border-white/10 bg-white/5 p-2.5 sm:p-3"
            >
              <stat.icon className="h-4 w-4 text-cyan-300" />
              <p className="mt-1.5 text-base font-bold text-white sm:mt-2 sm:text-lg">{stat.value}</p>
              <p className="truncate text-[10px] text-slate-300 sm:text-[11px]">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-5">
          <div className="rounded-[14px] border border-white/10 bg-white/5 p-3 sm:col-span-3 sm:p-4">
            <p className="text-xs font-medium text-slate-300">Completion trend</p>
            <div className="mt-3 flex h-20 items-end gap-1.5 sm:mt-4 sm:h-24 sm:gap-2">
              {[40, 55, 48, 72, 65, 88, 92].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-md bg-gradient-to-t from-brand-600 to-accent-cyan"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
          <div className="rounded-[14px] border border-white/10 bg-gradient-to-br from-brand-500/20 to-cyan-500/10 p-3 sm:col-span-2 sm:p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-500/30">
                <Bot className="h-4 w-4 text-cyan-200" />
              </div>
              <p className="text-sm font-semibold text-white">AI Tutor</p>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-300 sm:mt-3">
              &ldquo;Based on quiz results, I recommend Module 3 revision for your
              team.&rdquo;
            </p>
            <div className="mt-2 rounded-[12px] bg-white/10 px-3 py-2 text-[11px] text-cyan-100 sm:mt-3">
              Generate learning path →
            </div>
          </div>
        </div>
      </div>

      <FloatCard
        className="absolute left-2 top-6 hidden lg:left-4 lg:top-8 lg:block xl:-left-4"
        delay="1.2s"
      >
        <p className="text-xl font-bold text-white sm:text-2xl">+34%</p>
        <p className="text-xs text-cyan-100">Engagement this week</p>
      </FloatCard>

      <FloatCard
        className="absolute bottom-4 right-2 hidden lg:bottom-6 lg:right-4 lg:block xl:-right-2"
        delay="2s"
      >
        <p className="text-sm font-semibold text-white">Certificate issued</p>
        <p className="text-xs text-slate-200">Workplace Safety · 2m ago</p>
      </FloatCard>
    </div>
  );
}
