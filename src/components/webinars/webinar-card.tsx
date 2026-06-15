import Link from "next/link";
import { Calendar, Clock, Users, Video } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { UserAvatar } from "@/components/ui/user-avatar";
import { formatDateTime } from "@/lib/utils";
import { WebinarStatusBadge } from "./webinar-status-badge";
import type { WebinarStatus } from "@prisma/client";

type WebinarCardProps = {
  id: string;
  title: string;
  description: string;
  scheduledAt: Date;
  durationMinutes: number;
  status: WebinarStatus;
  host: { name: string; avatarUrl: string | null };
  registrationCount: number;
  courseTitle?: string | null;
};

export function WebinarCard({
  id,
  title,
  description,
  scheduledAt,
  durationMinutes,
  status,
  host,
  registrationCount,
  courseTitle,
}: WebinarCardProps) {
  return (
    <Link href={`/webinars/${id}`}>
      <Card className="h-full transition-all hover:-translate-y-1 hover:shadow-card-hover">
        <CardContent className="flex h-full flex-col p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-brand-100 text-brand-600">
              <Video className="h-5 w-5" />
            </div>
            <WebinarStatusBadge
              scheduledAt={scheduledAt}
              durationMinutes={durationMinutes}
              status={status}
            />
          </div>
          <h2 className="mt-4 text-lg font-bold text-ink">{title}</h2>
          <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted">
            {description}
          </p>
          {courseTitle ? (
            <p className="mt-2 text-xs font-semibold text-brand-600">
              Related: {courseTitle}
            </p>
          ) : null}
          <div className="mt-4 space-y-2 text-sm text-muted">
            <p className="flex items-center gap-2">
              <Calendar className="h-4 w-4 shrink-0" />
              {formatDateTime(scheduledAt)}
            </p>
            <p className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0" />
              {durationMinutes} minutes
            </p>
            <p className="flex items-center gap-2">
              <Users className="h-4 w-4 shrink-0" />
              {registrationCount} registered
            </p>
          </div>
          <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
            <UserAvatar name={host.name} avatarUrl={host.avatarUrl} size="sm" />
            <span className="text-sm font-medium text-ink">{host.name}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
