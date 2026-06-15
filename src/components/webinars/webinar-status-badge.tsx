import type { WebinarStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { getEffectiveStatus } from "@/lib/webinars";

const variants: Record<string, "success" | "warning" | "info" | "default" | "brand"> = {
  UPCOMING: "info",
  LIVE: "success",
  ENDED: "default",
  COMPLETED: "default",
  SCHEDULED: "info",
  CANCELLED: "warning",
};

export function WebinarStatusBadge({
  scheduledAt,
  durationMinutes,
  status,
}: {
  scheduledAt: Date;
  durationMinutes: number;
  status: WebinarStatus;
}) {
  const effective = getEffectiveStatus(scheduledAt, durationMinutes, status);
  const label =
    effective === "UPCOMING"
      ? "Upcoming"
      : effective === "LIVE"
        ? "Live now"
        : effective === "ENDED"
          ? "Ended"
          : effective.charAt(0) + effective.slice(1).toLowerCase();

  return <Badge variant={variants[effective] ?? "default"}>{label}</Badge>;
}
