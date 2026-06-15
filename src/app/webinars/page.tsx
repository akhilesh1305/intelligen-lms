import Link from "next/link";
import { Video } from "lucide-react";
import { getSession } from "@/lib/auth";
import { getWebinars } from "@/lib/webinars";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { WebinarCard } from "@/components/webinars/webinar-card";

export default async function WebinarsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const session = await getSession();
  const params = await searchParams;
  const filter = params.filter === "past" ? "past" : "upcoming";
  const webinars = await getWebinars(filter);

  const canManage =
    session?.role === "INSTRUCTOR" || session?.role === "ADMIN";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        title="Webinars"
        description="Live sessions with instructors — register and track your attendance."
        action={
          canManage ? (
            <Link href="/webinars/manage">
              <Button>Schedule webinar</Button>
            </Link>
          ) : null
        }
      />

      <div className="mt-6 flex gap-2">
        <Link
          href="/webinars"
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            filter === "upcoming"
              ? "bg-brand-600 text-white"
              : "bg-slate-100 text-ink dark:bg-slate-800"
          }`}
        >
          Upcoming
        </Link>
        <Link
          href="/webinars?filter=past"
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            filter === "past"
              ? "bg-brand-600 text-white"
              : "bg-slate-100 text-ink dark:bg-slate-800"
          }`}
        >
          Past
        </Link>
      </div>

      {webinars.length === 0 ? (
        <Card className="mt-8">
          <CardContent className="py-16 text-center">
            <Video className="mx-auto h-14 w-14 text-slate-300" />
            <h3 className="mt-4 text-xl font-bold text-ink">No webinars yet</h3>
            <p className="mt-2 text-sm text-muted">
              {filter === "past"
                ? "Past webinars will appear here."
                : "Check back soon for live learning sessions."}
            </p>
            {canManage ? (
              <Link href="/webinars/manage" className="mt-6 inline-block">
                <Button>Schedule your first webinar</Button>
              </Link>
            ) : null}
          </CardContent>
        </Card>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {webinars.map((webinar) => (
            <WebinarCard
              key={webinar.id}
              id={webinar.id}
              title={webinar.title}
              description={webinar.description}
              scheduledAt={webinar.scheduledAt}
              durationMinutes={webinar.durationMinutes}
              status={webinar.status}
              host={webinar.host}
              registrationCount={webinar._count.registrations}
              courseTitle={webinar.course?.title}
            />
          ))}
        </div>
      )}
    </div>
  );
}
