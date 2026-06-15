"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";

type FeedLikeButtonProps = {
  postId: string;
  initialLiked: boolean;
  initialCount: number;
  canLike: boolean;
};

export function FeedLikeButton({
  postId,
  initialLiked,
  initialCount,
  canLike,
}: FeedLikeButtonProps) {
  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (!canLike || loading) return;

    setLoading(true);
    const res = await fetch(`/api/feed/${postId}/like`, { method: "POST" });
    setLoading(false);

    if (!res.ok) return;

    const data = await res.json();
    setLiked(data.liked);
    setCount(data.likeCount);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!canLike || loading}
      className={cn(
        "inline-flex items-center gap-2 rounded-sm px-3 py-2 text-sm font-semibold transition-colors",
        liked
          ? "bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300"
          : "text-muted hover:bg-slate-100 hover:text-ink dark:hover:bg-slate-800",
        !canLike && "cursor-default opacity-70"
      )}
    >
      <ThumbsUp className={cn("h-4 w-4", liked && "fill-current")} />
      {liked ? "Celebrated" : "Celebrate"}
      {count > 0 ? <span className="text-xs">({count})</span> : null}
    </button>
  );
}
