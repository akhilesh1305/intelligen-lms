"use client";

import {
  BookOpen,
  ClipboardList,
  GraduationCap,
  Shield,
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
  delay = 0,
}: {
  label: string;
  value: string | number;
  icon: DashboardStatIcon;
  iconClass: string;
  delay?: number;
}) {
  const Icon = STAT_ICONS[icon];

  return (
    <DashboardFade delay={delay} animation="scale-in">
      <Card className="transition-all duration-300 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-card-hover">
        <CardContent className="flex items-center gap-4 py-5">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-lg transition-transform duration-300 motion-safe:group-hover:scale-105",
              iconClass
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-ink">{value}</p>
            <p className="text-sm text-muted">{label}</p>
          </div>
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
