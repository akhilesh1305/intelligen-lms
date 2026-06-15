import Link from "next/link";
import type { FeedPostType } from "@prisma/client";
import { Rss } from "lucide-react";
import { getSession } from "@/lib/auth";
import { getFeedPosts } from "@/lib/feed";
import { SectionHeader } from "@/components/ui/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FeedCard } from "@/components/feed/feed-card";
import { FeedFilters } from "@/components/feed/feed-filters";
import { AnnouncementForm } from "@/components/feed/announcement-form";

type PageProps = {
  searchParams: Promise<{ type?: string }>;
};

const validTypes: FeedPostType[] = [
  "ACHIEVEMENT",
  "CERTIFICATION",
  "ANNOUNCEMENT",
];

export default async function FeedPage({ searchParams }: PageProps) {
  const session = await getSession();
  const params = await searchParams;
  const type = validTypes.includes(params.type as FeedPostType)
    ? (params.type as FeedPostType)
    : undefined;

  const posts = await getFeedPosts({
    type,
    viewerId: session?.id,
  });

  const canAnnounce =
    session?.role === "ADMIN" || session?.role === "INSTRUCTOR";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        title="Community feed"
        description="Celebrate achievements, certifications, and platform announcements — like LinkedIn inside your LMS."
        action={
          !session ? (
            <Link href="/login">
              <Button>Sign in to celebrate</Button>
            </Link>
          ) : null
        }
      />

      {canAnnounce ? <AnnouncementForm /> : null}

      <FeedFilters active={type} />

      {posts.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Rss className="mx-auto h-14 w-14 text-slate-300" />
            <h3 className="mt-4 text-xl font-bold text-ink">No posts yet</h3>
            <p className="mt-2 text-sm text-muted">
              Complete courses, earn badges, or check back for announcements.
            </p>
            <Link href="/courses" className="mt-6 inline-block">
              <Button variant="outline">Browse courses</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <FeedCard
              key={post.id}
              {...post}
              viewerId={session?.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
