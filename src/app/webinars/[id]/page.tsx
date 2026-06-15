import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Video } from "lucide-react";
import { getSession } from "@/lib/auth";
import {
  getAttendanceReport,
  getEffectiveStatus,
  getWebinar,
  isWebinarLive,
} from "@/lib/webinars";
import { formatDateTime } from "@/lib/utils";
import { UserAvatar } from "@/components/ui/user-avatar";
import { Card, CardContent } from "@/components/ui/card";
import { WebinarStatusBadge } from "@/components/webinars/webinar-status-badge";
import { WebinarActions } from "@/components/webinars/webinar-actions";
import { AttendanceReport } from "@/components/webinars/attendance-report";

export default async function WebinarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  const { id } = await params;
  const webinar = await getWebinar(id);
  if (!webinar || webinar.status === "CANCELLED") notFound();

  const isRegistered = session
    ? webinar.registrations.some((r) => r.userId === session.id)
    : false;

  const userAttendance = session
    ? webinar.attendance.find((a) => a.userId === session.id)
    : null;

  const live = isWebinarLive(
    webinar.scheduledAt,
    webinar.durationMinutes,
    webinar.status
  );

  const isHost =
    session?.id === webinar.hostId || session?.role === "ADMIN";

  const report = isHost ? await getAttendanceReport(id) : null;

  const effective = getEffectiveStatus(
    webinar.scheduledAt,
    webinar.durationMinutes,
    webinar.status
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/webinars"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        All webinars
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-brand-100 text-brand-600">
              <Video className="h-6 w-6" />
            </div>
            <WebinarStatusBadge
              scheduledAt={webinar.scheduledAt}
              durationMinutes={webinar.durationMinutes}
              status={webinar.status}
            />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-ink">{webinar.title}</h1>
          {webinar.course ? (
            <Link
              href={`/courses/${webinar.course.id}`}
              className="mt-2 inline-block text-sm font-semibold text-brand-600 hover:underline"
            >
              Related course: {webinar.course.title}
            </Link>
          ) : null}
        </div>
        {isHost ? (
          <Link
            href="/webinars/manage"
            className="text-sm font-semibold text-brand-600 hover:underline"
          >
            Manage webinars
          </Link>
        ) : null}
      </div>

      <Card className="mt-8">
        <CardContent className="pt-6">
          <p className="whitespace-pre-wrap leading-relaxed text-ink/90">
            {webinar.description}
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <p className="flex items-center gap-2 text-sm text-muted">
              <Calendar className="h-4 w-4" />
              {formatDateTime(webinar.scheduledAt)}
            </p>
            <p className="flex items-center gap-2 text-sm text-muted">
              <Clock className="h-4 w-4" />
              {webinar.durationMinutes} minutes
            </p>
          </div>
          <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
            <UserAvatar
              name={webinar.host.name}
              avatarUrl={webinar.host.avatarUrl}
            />
            <div>
              <p className="text-sm font-semibold text-ink">Hosted by</p>
              <p className="text-sm text-muted">{webinar.host.name}</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted">
            {webinar._count.registrations} registered ·{" "}
            {webinar._count.attendance} joined
            {webinar.maxAttendees ? ` · max ${webinar.maxAttendees}` : ""}
          </p>
        </CardContent>
      </Card>

      {session && effective !== "ENDED" && effective !== "COMPLETED" ? (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <h2 className="font-bold text-ink">Your participation</h2>
            <div className="mt-4">
              <WebinarActions
                webinarId={webinar.id}
                isRegistered={isRegistered}
                isLive={live}
                meetingUrl={webinar.meetingUrl}
                hasAttendance={Boolean(userAttendance)}
                attended={userAttendance?.present ?? false}
              />
            </div>
          </CardContent>
        </Card>
      ) : null}

      {!session ? (
        <Card className="mt-6">
          <CardContent className="py-8 text-center">
            <p className="text-muted">Sign in to register for this webinar.</p>
            <Link href="/login" className="mt-4 inline-block text-sm font-semibold text-brand-600 hover:underline">
              Sign in
            </Link>
          </CardContent>
        </Card>
      ) : null}

      {report ? (
        <div className="mt-10">
          <h2 className="text-xl font-bold text-ink">Attendance tracking</h2>
          <p className="mt-1 text-sm text-muted">
            Present = attended at least 50% of session duration (min 15 min).
          </p>
          <div className="mt-6">
            <AttendanceReport
              stats={report.stats}
              attendance={report.webinar.attendance}
              registrations={report.webinar.registrations}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
