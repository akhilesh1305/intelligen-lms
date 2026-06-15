import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Video } from "lucide-react";
import { requireAuth } from "@/lib/auth";
import { requireApprovedInstructorPage } from "@/lib/instructor";
import { db } from "@/lib/db";
import { getHostWebinars } from "@/lib/webinars";
import { formatDateTime } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WebinarForm } from "@/components/webinars/webinar-form";
import { WebinarStatusBadge } from "@/components/webinars/webinar-status-badge";

export default async function ManageWebinarsPage() {
  const session = await requireAuth(["INSTRUCTOR", "ADMIN"]);
  await requireApprovedInstructorPage(session);

  const [webinars, courses] = await Promise.all([
    getHostWebinars(session.id),
    db.course.findMany({
      where:
        session.role === "ADMIN"
          ? {}
          : { instructorId: session.id },
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    }),
  ]);

  if (session.role !== "INSTRUCTOR" && session.role !== "ADMIN") {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/webinars"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to webinars
      </Link>

      <div className="mt-4">
        <SectionHeader
          title="Schedule webinars"
          description="Create live sessions, share meeting links, and track attendance."
        />
      </div>

      <Card className="mt-8">
        <CardContent className="pt-6">
          <h2 className="font-bold text-ink">New webinar</h2>
          <div className="mt-4">
            <WebinarForm courses={courses} />
          </div>
        </CardContent>
      </Card>

      <div className="mt-10">
        <h2 className="text-xl font-bold text-ink">Your webinars</h2>
        {webinars.length === 0 ? (
          <Card className="mt-4">
            <CardContent className="py-12 text-center">
              <Video className="mx-auto h-12 w-12 text-slate-300" />
              <p className="mt-3 text-muted">No webinars scheduled yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-4 space-y-4">
            {webinars.map((webinar) => (
              <Card key={webinar.id}>
                <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-5">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/webinars/${webinar.id}`}
                        className="font-bold text-ink hover:text-brand-600"
                      >
                        {webinar.title}
                      </Link>
                      <WebinarStatusBadge
                        scheduledAt={webinar.scheduledAt}
                        durationMinutes={webinar.durationMinutes}
                        status={webinar.status}
                      />
                    </div>
                    <p className="mt-1 text-sm text-muted">
                      {formatDateTime(webinar.scheduledAt)} ·{" "}
                      {webinar.durationMinutes} min
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      {webinar._count.registrations} registered ·{" "}
                      {webinar._count.attendance} attended
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {webinar.course ? (
                      <Badge variant="brand">{webinar.course.title}</Badge>
                    ) : null}
                    <Link
                      href={`/webinars/${webinar.id}`}
                      className="text-sm font-semibold text-brand-600 hover:underline"
                    >
                      View & track →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
