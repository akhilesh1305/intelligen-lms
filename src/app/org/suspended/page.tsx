import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function OrgSuspendedPage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string }>;
}) {
  const { slug } = await searchParams;

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <Card className="border-amber-200 dark:border-amber-900/40">
        <CardContent className="py-10 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-amber-600" />
          <h1 className="mt-4 text-2xl font-bold text-ink">
            Organization access unavailable
          </h1>
          <p className="mt-3 text-sm text-muted">
            {slug
              ? `Access to /${slug} is currently unavailable because the contract has ended or the organization was terminated.`
              : "Your organization access is currently unavailable because the contract has ended or the organization was terminated."}
          </p>
          <p className="mt-2 text-sm text-muted">
            Contact your platform administrator if you believe this is a mistake.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/dashboard">
              <Button>Back to dashboard</Button>
            </Link>
            <Link href="/courses">
              <Button variant="outline">Browse public courses</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
