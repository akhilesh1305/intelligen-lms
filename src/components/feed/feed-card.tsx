import Link from "next/link";
import type { FeedPostType, Role } from "@prisma/client";
import { Award, Megaphone, Trophy } from "lucide-react";
import { UserAvatar } from "@/components/ui/user-avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { FeedMetadata } from "@/lib/feed";
import { formatTimeAgo } from "@/lib/feed";
import { formatRole } from "@/lib/roles";
import { FeedLikeButton } from "./feed-like-button";

type FeedCardProps = {
  id: string;
  type: FeedPostType;
  title: string;
  content: string;
  metadata: FeedMetadata | null;
  createdAt: Date;
  author: {
    id: string;
    name: string;
    avatarUrl: string | null;
    role: Role;
  };
  likeCount: number;
  likedByViewer: boolean;
  viewerId?: string;
};

const typeConfig: Record<
  FeedPostType,
  { label: string; icon: typeof Trophy; accent: string; badge: string }
> = {
  ACHIEVEMENT: {
    label: "Achievement",
    icon: Trophy,
    accent: "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/40",
    badge: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  },
  CERTIFICATION: {
    label: "Certification",
    icon: Award,
    accent: "border-brand-200 bg-brand-50 dark:border-brand-900 dark:bg-brand-950/40",
    badge: "bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200",
  },
  ANNOUNCEMENT: {
    label: "Announcement",
    icon: Megaphone,
    accent: "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/40",
    badge: "bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200",
  },
};

export function FeedCard({
  id,
  type,
  title,
  content,
  metadata,
  createdAt,
  author,
  likeCount,
  likedByViewer,
  viewerId,
}: FeedCardProps) {
  const config = typeConfig[type];
  const Icon = config.icon;
  const isOwnPost = viewerId === author.id;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex items-start gap-4 p-5">
          <UserAvatar name={author.name} avatarUrl={author.avatarUrl} size="md" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-ink">{author.name}</span>
              <span className="text-sm text-muted">· {formatRole(author.role)}</span>
              <span className="text-sm text-muted">· {formatTimeAgo(createdAt)}</span>
            </div>
            <Badge className={cn("mt-2", config.badge)}>{config.label}</Badge>
          </div>
        </div>

        <div className={cn("mx-5 mb-5 rounded-sm border p-4", config.accent)}>
          <div className="flex items-start gap-3">
            {type === "ACHIEVEMENT" && metadata?.badgeIcon ? (
              <span className="text-3xl">{metadata.badgeIcon}</span>
            ) : (
              <Icon className="mt-0.5 h-6 w-6 shrink-0 text-ink" />
            )}
            <div className="min-w-0">
              <h3 className="font-bold text-ink">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{content}</p>
              {metadata?.link ? (
                <Link
                  href={metadata.link}
                  className="mt-3 inline-block text-sm font-semibold text-brand-600 hover:underline"
                >
                  {type === "CERTIFICATION" ? "View certificate" : "Learn more"}
                </Link>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 dark:border-slate-800">
          <FeedLikeButton
            postId={id}
            initialLiked={likedByViewer}
            initialCount={likeCount}
            canLike={Boolean(viewerId) && !isOwnPost}
          />
          {isOwnPost ? (
            <span className="text-xs text-muted">Your post</span>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
