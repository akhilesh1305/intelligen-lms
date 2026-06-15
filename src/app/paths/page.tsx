import Link from "next/link";
import { ArrowRight, Map } from "lucide-react";
import { getSession } from "@/lib/auth";
import { getPublishedPaths } from "@/lib/learning-paths";
import { SectionHeader } from "@/components/ui/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function LearningPathsPage() {
  const session = await getSession();
  const paths = await getPublishedPaths();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        title="Learning paths"
        description="Structured journeys that guide you from fundamentals to job-ready skills."
        action={
          session ? (
            <Link href="/competency">
              <Button variant="outline">Skill gap analysis</Button>
            </Link>
          ) : null
        }
      />

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {paths.map((path) => (
          <Link key={path.id} href={`/paths/${path.slug}`}>
            <Card className="h-full transition-all hover:-translate-y-1 hover:shadow-card-hover">
              <CardContent className="flex h-full flex-col p-6">
                <span className="text-4xl">{path.icon}</span>
                <h2 className="mt-4 text-xl font-bold text-ink">{path.name}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {path.description}
                </p>
                <p className="mt-4 text-sm font-semibold text-brand-600">
                  {path._count.pathCourses} courses in path
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-ink">
                  View path <ArrowRight className="h-4 w-4" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {paths.length === 0 ? (
        <Card className="mt-8">
          <CardContent className="py-16 text-center">
            <Map className="mx-auto h-12 w-12 text-slate-300" />
            <p className="mt-4 text-muted">Learning paths will appear here soon.</p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
