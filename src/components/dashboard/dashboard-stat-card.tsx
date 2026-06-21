"use client";

import {
  BookOpen,
  ClipboardList,
  GraduationCap,
  Shield,
  TrendingDown,
  TrendingUp,
  Trophy,
  UserCheck,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardFade } from "@/components/dashboard/dashboard-motion";
import { cn } from "@/lib/utils";

export type DashboardStatIcon =
  | "users"
  | "trending-up"
  | "shield"
  | "zap"
  | "trophy"
  | "user-check"
  | "book-open"
  | "graduation-cap"
  | "clipboard-list";

const STAT_ICONS: Record<DashboardStatIcon, LucideIcon> = {
  users: Users,
  "trending-up": TrendingUp,
  shield: Shield,
  zap: Zap,
  trophy: Trophy,
  "user-check": UserCheck,
  "book-open": BookOpen,
  "graduation-cap": GraduationCap,
  "clipboard-list": ClipboardList,
};

export function DashboardStatCard({
  label,
  value,
  icon,
  iconClass,
  trend,
  delay = 0,
}: {
  label: string;
  value: string | number;
  icon: DashboardStatIcon;
  iconClass: string;
  trend?: { value: string; positive?: boolean };
  delay?: number;
}) {
  const Icon = STAT_ICONS[icon];
  const TrendIcon = trend?.positive === false ? TrendingDown : TrendingUp;

  return (
    <DashboardFade delay={delay} animation="scale-in">
      <Card
        glass
        data-cursor-hover
        className="group h-full min-h-[7.5rem] overflow-hidden rounded-[20px]"
      >
        <CardContent className="relative flex items-start justify-between gap-4 py-5">
          <div className="flex min-w-0 items-center gap-4">
            <div
              className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br shadow-lg transition-all duration-300 motion-safe:group-hover:scale-110 motion-safe:group-hover:shadow-glow",
                iconClass
              )}
            >
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold tracking-tight text-ink">{value}</p>
              <p className="text-sm text-muted">{label}</p>
            </div>
          </div>
          {trend ? (
            <span
              className={cn(
                "inline-flex shrink-0 items-center gap-1 rounded-[10px] px-2 py-1 text-xs font-semibold",
                trend.positive === false
                  ? "bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
                  : "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
              )}
            >
              <TrendIcon className="h-3 w-3" />
              {trend.value}
            </span>
          ) : null}
        </CardContent>
      </Card>
    </DashboardFade>
  );
}

export function DashboardStatGrid({
  stats,
  baseDelay = 0,
}: {
  stats: {
    label: string;
    value: string | number;
    icon: DashboardStatIcon;
    iconClass: string;
    trend?: { value: string; positive?: boolean };
  }[];
  baseDelay?: number;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <DashboardStatCard
          key={stat.label}
          {...stat}
          delay={baseDelay + index * 70}
        />
      ))}
    </div>
  );
}
